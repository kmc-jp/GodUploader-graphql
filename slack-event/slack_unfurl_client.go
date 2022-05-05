package main

import (
	"context"

	"github.com/slack-go/slack"
)

type SlackUnfurlClient interface {
	UnfurlMessage(ctx context.Context, channelID string, timestamp string, unfurls map[string]slack.Attachment) error
}

type realSlackUnfurlClient struct {
	client *slack.Client
}

func (c *realSlackUnfurlClient) UnfurlMessage(ctx context.Context, channelID string, timestamp string, unfurls map[string]slack.Attachment) error {
	_, _, _, err := c.client.UnfurlMessageContext(ctx, channelID, timestamp, unfurls)
	return err
}
