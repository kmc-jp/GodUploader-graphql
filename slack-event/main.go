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

	"github.com/nna774/gyazo"
	"github.com/slack-go/slack"
	"github.com/slack-go/slack/slackevents"
)

var bindAddress string
var targetDomain string
var slackSiginingSecret string
var slackVerificationToken string
var imageDownloader ImageDownloader
var slackClient *slack.Client
var artworkInfoFetcher ArtworkInfoFetcher
var gyazoClient gyazo.Uploader
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
	artworkInfoFetcher = newGraphQLFetcher(graphqlAPIEndpoint)

	artworkPathPattern = *regexp.MustCompile(`(?m)/artwork/(?P<artworkID>[0-9a-zA-Z=]+)`)

	externalURLBase := os.Getenv("EXTERNAL_URL_BASE")
	internalURLBase := os.Getenv("INTERNAL_URL_BASE")
	imageDownloader = &internalImageDownloader{
		externalURLBase: externalURLBase,
		internalURLBase: internalURLBase,
	}
}

func unfurlURLs(ctx context.Context, rawURLs []string, channelID, timestamp string) {
	artworks, err := artworkInfoFetcher.fetchArtworkInfoByURLs(ctx, rawURLs)
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

			resp, err := imageDownloader.Download(ctx, artwork.ThumbnailUrl)
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
	_, _, _, err = slackClient.UnfurlMessageContext(ctx, channelID, timestamp, unfurls)
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

func respondToURLVerificationEvent(ctx context.Context, w http.ResponseWriter, challenge string) {
	w.WriteHeader(http.StatusOK)
	w.Header().Add("Content-Type", "text/plain")
	w.Write([]byte(challenge))
}

func respondToLinkSharedEvent(ctx context.Context, w http.ResponseWriter, urls []string, channelID, timestamp string) {
	w.WriteHeader(http.StatusOK)

	go unfurlURLs(ctx, urls, channelID, timestamp)
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

	ctx := context.Background()

	switch ev := event.Data.(type) {
	case *slackevents.EventsAPIURLVerificationEvent:
		respondToURLVerificationEvent(ctx, w, ev.Challenge)
	case *slackevents.EventsAPICallbackEvent:
		switch innerEv := event.InnerEvent.Data.(type) {
		case *slackevents.LinkSharedEvent:
			urls := collectURLs(innerEv)
			respondToLinkSharedEvent(ctx, w, urls, innerEv.Channel, innerEv.MessageTimeStamp)
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
