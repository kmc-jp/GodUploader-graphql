package main

import (
	"context"
	"fmt"
	"log"
	"net/url"

	"github.com/hasura/go-graphql-client"
)

type DtoArtwork struct {
	ArtworkURL   string
	Title        string
	Caption      string
	Nsfw         bool
	ThumbnailUrl string
}

type ArtworkInfoFetcher interface {
	fetchArtworkInfoByURLs(ctx context.Context, artworkURLs []string) ([]*DtoArtwork, error)
}

type graphqlArtworkInfoFetcher struct {
	client *graphql.Client
}

func newGraphQLFetcher(endpoint string) *graphqlArtworkInfoFetcher {
	return &graphqlArtworkInfoFetcher{client: graphql.NewClient(endpoint, nil)}
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

func (fetcher *graphqlArtworkInfoFetcher) fetchArtworkInfoByURLs(ctx context.Context, artworkURLs []string) ([]*DtoArtwork, error) {
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
			Artwork struct {
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

	err := fetcher.client.Query(ctx, &artworkInfoQuery, map[string]interface{}{
		"ids": artworkGraphQLIDs,
	})
	if err != nil {
		return nil, err
	}

	var dtoArtworks []*DtoArtwork
	for i, node := range artworkInfoQuery.Nodes {
		if node == nil {
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
