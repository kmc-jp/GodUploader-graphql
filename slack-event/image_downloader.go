package main

import (
	"context"
	"net/http"
	"strings"
)

type ImageDownloader interface {
	Download(ctx context.Context, url string) (*http.Response, error)
}

type internalImageDownloader struct {
	externalURLBase string
	internalURLBase string
}

func (d *internalImageDownloader) convertToInternalURL(externalURL string) string {
	return strings.Replace(externalURL, d.externalURLBase, d.internalURLBase, 1)
}

func (d *internalImageDownloader) Download(ctx context.Context, url string) (*http.Response, error) {
	imageDownloadURL := d.convertToInternalURL(url)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, imageDownloadURL, nil)
	if err != nil {
		return nil, err
	}
	return http.DefaultClient.Do(req)
}
