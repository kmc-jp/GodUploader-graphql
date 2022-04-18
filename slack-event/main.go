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
	"sync"

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
	ArtworkURL   string
	Title        string
	Caption      string
	Nsfw         bool
	ThumbnailUrl string
}

func fetchBatchArtworkInfo(artworkURLs []string) ([]*DtoArtwork, error) {
	var validArtworkURLs []string
	var artworkIDs []string
	for _, url := range artworkURLs {
		id, err := extractArtworkIDFromPath(url)
		if err != nil {
			log.Print(err)
			continue
		}
		artworkIDs = append(artworkIDs, id)
		validArtworkURLs = append(validArtworkURLs, url)
	}

	if len(artworkIDs) == 0 {
		log.Println("No artworks to unfurl")
		return nil, nil
	}
	var artworkInfoQuery struct {
		Nodes []*struct {
			Artwork *struct {
				ID        interface{}
				Title     graphql.String
				Caption   graphql.String
				Nsfw      graphql.Boolean
				TopIllust struct {
					ThumbnailUrl graphql.String
				}
			} `graphql:"... on Artwork"`
		} `graphql:"nodes(ids: $ids)"`
	}

	var artworkGraphQLIDs []graphql.ID
	for _, id := range artworkIDs {
		artworkGraphQLIDs = append(artworkGraphQLIDs, graphql.ID(id))
	}

	err := graphqlClient.Query(context.Background(), &artworkInfoQuery, map[string]interface{}{
		"ids": artworkGraphQLIDs,
	})
	if err != nil {
		return nil, err
	}

	var dtoArtworks []*DtoArtwork
	for i, node := range artworkInfoQuery.Nodes {
		if node == nil || node.Artwork == nil {
			continue
		}
		artworkURL := validArtworkURLs[i]

		dtoArtworks = append(dtoArtworks, &DtoArtwork{
			ArtworkURL:   artworkURL,
			Title:        string(node.Artwork.Title),
			Caption:      string(node.Artwork.Caption),
			Nsfw:         bool(node.Artwork.Nsfw),
			ThumbnailUrl: string(node.Artwork.TopIllust.ThumbnailUrl),
		})
	}

	return dtoArtworks, nil
}

func downloadImage(url string) (*http.Response, error) {
	imageDownloadURL := convertToInternalURL(url)

	return http.Get(imageDownloadURL)
}

func unfurlURLs(rawURLs []string, channelID, timestamp string) {
	var artworkIDs []string
	for _, url := range rawURLs {
		id, err := extractArtworkIDFromPath(url)
		if err != nil {
			log.Print(err)
			continue
		}
		artworkIDs = append(artworkIDs, id)
	}

	if len(artworkIDs) == 0 {
		log.Println("No artworks to unfurl")
		return
	}

	artworks, err := fetchBatchArtworkInfo(artworkIDs)
	if err != nil {
		log.Print(err)
		return
	}

	var sMapArtworkURLToGyazoURL sync.Map
	wg := &sync.WaitGroup{}
	for _, artwork := range artworks {
		wg.Add(1)
		go func(artwork *DtoArtwork) {
			defer wg.Done()

			resp, err := downloadImage(artwork.ThumbnailUrl)
			if err != nil {
				log.Print(err)
				return
			}
			defer resp.Body.Close()

			var imageURL string
			if !artwork.Nsfw {
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
			sMapArtworkURLToGyazoURL.Store(artwork.ArtworkURL, imageURL)
		}(artwork)
	}
	wg.Wait()

	unfurls := make(map[string]slack.Attachment)
	for _, artwork := range artworks {
		imageURL, ok := sMapArtworkURLToGyazoURL.Load(artwork.ArtworkURL)
		if !ok {
			continue
		}
		unfurls[artwork.ArtworkURL] = slack.Attachment{
			Title:    artwork.Title,
			Text:     artwork.Caption,
			ImageURL: imageURL.(string),
		}
	}
	_, _, _, err = slackClient.UnfurlMessage(channelID, timestamp, unfurls)
	if err != nil {
		log.Print(err)
		return
	}
}

func toStatusJSON(status int) []byte {
	statusMessage := http.StatusText(status)
	return []byte(fmt.Sprintf(`{"status":"%s"}`, statusMessage))
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
	w.Write(toStatusJSON(http.StatusBadRequest))
}

func respondToURLVerificationEvent(w http.ResponseWriter, challenge string) {
	w.WriteHeader(http.StatusOK)
	w.Header().Add("Content-Type", "text/plain")
	w.Write([]byte(challenge))
}

func respondToLinkSharedEvent(w http.ResponseWriter, urls []string, channelID, timestamp string) {
	w.WriteHeader(http.StatusOK)

	go unfurlURLs(urls, channelID, timestamp)
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

func parseEvent(body []byte) (slackevents.EventsAPIEvent, error) {
	rawJSON := json.RawMessage(body)
	opts := slackevents.OptionVerifyToken(
		slackevents.TokenComparator{
			VerificationToken: slackVerificationToken,
		},
	)

	return slackevents.ParseEvent(rawJSON, opts)
}

// POST /api/event
func handleApiEvent(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write(toStatusJSON(http.StatusMethodNotAllowed))
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
		w.Write(toStatusJSON(http.StatusUnauthorized))
		return
	}

	event, err := parseEvent(rawReqBody)
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
