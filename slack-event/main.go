package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strings"

	"github.com/hasura/go-graphql-client"
	"github.com/nna774/gyazo"
	"github.com/slack-go/slack"
	"github.com/slack-go/slack/slackevents"
)

var bindAddress string
var targetDomain string
var slackSiginingSecret string
var slackVerificationToken string
var externalURLBase string
var internalURLBase string
var slackClient *slack.Client
var graphqlClient *graphql.Client
var gyazoClient *gyazo.Oauth2Client
var artworkPathPattern regexp.Regexp
var artworkPathTemplate = "$artworkID"

func prepareConfig() {
	bindAddress = os.Getenv("BIND_ADDRESS")
	if bindAddress == "" {
		log.Fatal("BIND_ADDRESS not set")
	}

	targetDomain = os.Getenv("TARGET_DOMAIN")
	if targetDomain == "" {
		log.Fatal("TARGET_DOMAIN not set")
	}

	slackSiginingSecret = os.Getenv("SLACK_SIGNING_SECRET")
	if slackSiginingSecret == "" {
		log.Fatal("SLACK_SIGNING_SECRET not set")
	}

	slackVerificationToken = os.Getenv("SLACK_VERIFICATION_TOKEN")
	if slackVerificationToken == "" {
		log.Fatal("SLACK_VERIFICATION_TOKEN not set")
	}

	slackToken := os.Getenv("SLACK_TOKEN")
	if slackToken == "" {
		log.Fatal("SLACK_TOKEN not set")
	}
	slackClient = slack.New(slackToken)

	gyazoToken := os.Getenv("GYAZO_ACCESS_TOKEN")
	if gyazoToken == "" {
		log.Fatal("GYAZO_ACCESS_TOKEN not set")
	}
	gyazoClient = gyazo.NewOauth2Client(gyazoToken)

	graphqlAPIEndpoint := os.Getenv("GRAPHQL_API_ENDPOINT")
	if graphqlAPIEndpoint == "" {
		log.Fatal("GRAPHQL_API_ENDPOINT not set")
	}
	graphqlClient = graphql.NewClient(graphqlAPIEndpoint, nil)

	artworkPathPattern = *regexp.MustCompile(`(?m)/artwork/(?P<artworkID>[0-9a-zA-Z=]+)`)

	externalURLBase = os.Getenv("EXTERNAL_URL_BASE")
	internalURLBase = os.Getenv("INTERNAL_URL_BASE")
}

func convertToInternalURL(externalURL string) string {
	return strings.Replace(externalURL, externalURLBase, internalURLBase, 1)
}

func extractArtworkIDFromPath(rawURL string) (string, error) {
	parsedURL, err := url.Parse(rawURL)
	if err != nil {
		return "", err
	}

	submatches := artworkPathPattern.FindStringSubmatchIndex(parsedURL.Path)
	if len(submatches) == 0 {
		return "", fmt.Errorf("no submatches for %s (raw URL: %s)", parsedURL.Path, rawURL)
	}

	var artworkIDbyte []byte
	artworkIDbyte = artworkPathPattern.ExpandString(artworkIDbyte, artworkPathTemplate, parsedURL.Path, submatches)

	return string(artworkIDbyte), nil
}

type DtoArtwork struct {
	Title        string
	Caption      string
	Nsfw         bool
	ThumbnailUrl string
}

func fetchArtworkInfo(artworkID string) (*DtoArtwork, error) {
	var artworkInfoQuery struct {
		Node struct {
			Artwork struct {
				Title     graphql.String
				Caption   graphql.String
				Nsfw      graphql.Boolean
				TopIllust struct {
					ThumbnailUrl graphql.String
				}
			} `graphql:"... on Artwork"`
		} `graphql:"node(id: $id)"`
	}

	err := graphqlClient.Query(context.Background(), &artworkInfoQuery, map[string]interface{}{
		"id": graphql.ID(artworkID),
	})
	if err != nil {
		return nil, err
	}

	return &DtoArtwork{
		Title:        string(artworkInfoQuery.Node.Artwork.Title),
		Caption:      string(artworkInfoQuery.Node.Artwork.Title),
		Nsfw:         bool(artworkInfoQuery.Node.Artwork.Nsfw),
		ThumbnailUrl: string(artworkInfoQuery.Node.Artwork.TopIllust.ThumbnailUrl),
	}, nil
}

// urlは https://(APP_HOST)/artwork/(ARTWORK_ID) という形式になっていることを前提とする
func unfurlURL(rawURL, channelID, timestamp string) {
	artworkID, err := extractArtworkIDFromPath(rawURL)
	if err != nil {
		log.Print(err)
		return
	}

	artwork, err := fetchArtworkInfo(artworkID)
	if err != nil {
		log.Print(err)
		return
	}

	imageDownloadURL := convertToInternalURL(artwork.ThumbnailUrl)
	resp, err := http.Get(imageDownloadURL)
	if err != nil {
		log.Print(err)
		return
	}

	defer resp.Body.Close()
	var imageURL string
	if !bool(artwork.Nsfw) {
		gyazoResp, err := gyazoClient.Upload(resp.Body, &gyazo.UploadMetadata{
			Title: artwork.Title,
			Desc:  artwork.Caption,
		})
		if err != nil {
			log.Print(err)
			return
		}
		imageURL = gyazoResp.URL
	}

	unfurls := make(map[string]slack.Attachment)
	unfurls[rawURL] = slack.Attachment{
		Title:    artwork.Title,
		Text:     artwork.Caption,
		ImageURL: imageURL,
	}
	_, _, _, err = slackClient.UnfurlMessage(channelID, timestamp, unfurls)
	if err != nil {
		log.Print(err)
		return
	}
}

// GET /api/ping
func handleApiPing(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"ok":true}`))
}

func respondStatusBadRequest(w http.ResponseWriter, err error) {
	log.Println(err)
	w.WriteHeader(http.StatusBadRequest)
	w.Header().Add("Content-Type", "application/json")
	w.Write([]byte(`{"status":"Bad Request"}`))
}

func respondToURLVerificationEvent(w http.ResponseWriter, challenge string) {
	w.WriteHeader(http.StatusOK)
	w.Header().Add("Content-Type", "text/plain")
	w.Write([]byte(challenge))
}

func respondToLinkSharedEvent(w http.ResponseWriter, urls []string, channelID, timestamp string) {
	w.WriteHeader(http.StatusOK)

	for _, url := range urls {
		go unfurlURL(url, channelID, timestamp)
	}
}

func collectURLs(ev *slackevents.LinkSharedEvent) []string {
	var urls []string

	for _, link := range ev.Links {
		if link.Domain != targetDomain {
			continue
		}
		rawURL := link.URL
		url, err := url.Parse(rawURL)
		if err != nil {
			log.Print(err)
			continue
		}
		if !strings.HasPrefix(url.Path, "/artwork/") {
			continue
		}
		urls = append(urls, link.URL)
	}

	return urls
}

// POST /api/event
func handleApiEvent(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte(`{"status":"Method Not Allowed"}`))
		return
	}

	verifier, err := slack.NewSecretsVerifier(r.Header, slackSiginingSecret)
	if err != nil {
		respondStatusBadRequest(w, err)
		return
	}

	defer r.Body.Close()
	bodyReader := io.TeeReader(r.Body, &verifier)
	rawReqBody, err := io.ReadAll(bodyReader)
	if err != nil {
		respondStatusBadRequest(w, err)
		return
	}

	if err := verifier.Ensure(); err != nil {
		log.Print(err)
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"status":"Unauthorized"}`))
		return
	}

	rawJSON := json.RawMessage(rawReqBody)
	opts := slackevents.OptionVerifyToken(
		slackevents.TokenComparator{
			VerificationToken: slackVerificationToken,
		},
	)
	event, err := slackevents.ParseEvent(rawJSON, opts)
	if err != nil {
		respondStatusBadRequest(w, err)
		return
	}

	switch ev := event.Data.(type) {
	case *slackevents.EventsAPIURLVerificationEvent:
		respondToURLVerificationEvent(w, ev.Challenge)
	case *slackevents.EventsAPICallbackEvent:
		switch innerEv := event.InnerEvent.Data.(type) {
		case *slackevents.LinkSharedEvent:
			urls := collectURLs(innerEv)
			respondToLinkSharedEvent(w, urls, innerEv.Channel, innerEv.MessageTimeStamp)
		default:
			log.Printf("Unknown inner event: %v", innerEv)
			w.WriteHeader(http.StatusBadRequest)
		}
	case *slackevents.EventsAPIAppRateLimited:
		log.Printf("Rate limited: minute_rate_limited=%d", ev.MinuteRateLimited)
		w.WriteHeader(http.StatusTooManyRequests)
	default:
		log.Printf("Unknown event: %s", event.Type)
	}
}

func NewServeMux() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/api/ping", handleApiPing)
	mux.HandleFunc("/api/event", handleApiEvent)

	return mux
}

func main() {
	prepareConfig()

	mux := NewServeMux()

	log.Fatal(http.ListenAndServe(bindAddress, mux))
}
