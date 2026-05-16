import React, { useEffect, Suspense } from "react";
import { Button, Form } from "react-bootstrap";
import { graphql } from "react-relay";
import { PreloadedQuery, usePreloadedQuery, useQueryLoader } from "react-relay";

import { useUploadArtworkContext } from "../../hooks/useUploadArtworkContext";
import { SlackChannelInputQuery } from "./__generated__/SlackChannelInputQuery.graphql";

const slackChannelInputQuery = graphql`
  query SlackChannelInputQuery {
    allSlackChannels {
      id
      name
    }
  }
`;

export const SlackChannelInput: React.FC = () => {
  const { slackChannels, notifySlack, setSlackChannels } =
    useUploadArtworkContext();
  const [queryRef, loadQuery] = useQueryLoader<SlackChannelInputQuery>(
    slackChannelInputQuery,
  );

  useEffect(() => {
    loadQuery({}, { fetchPolicy: "store-and-network" });
  }, [loadQuery]);

  const handleChannelChange = (index: number, value: string) => {
    const updated = slackChannels.slice();
    updated[index] = value;
    setSlackChannels(updated);
  };

  const handleAddChannel = (firstUnselectedId: string) => {
    setSlackChannels([...slackChannels, firstUnselectedId]);
  };

  const handleRemoveChannel = (index: number) => {
    setSlackChannels(slackChannels.filter((_, i) => i !== index));
  };

  return (
    <>
      <Form.Label>投稿先のチャンネル(迷惑厳禁！)</Form.Label>
      <Suspense fallback={null}>
        {notifySlack && queryRef && (
          <ChannelRows
            queryRef={queryRef}
            slackChannels={slackChannels}
            notifySlack={notifySlack}
            onChannelChange={handleChannelChange}
            onRemove={handleRemoveChannel}
            onAdd={handleAddChannel}
          />
        )}
        {!notifySlack && <ChannelRowsDisabled />}
      </Suspense>
    </>
  );
};

const ChannelRowsDisabled: React.FC = () => (
  <div className="row g-2 mb-2">
    <div className="col-lg">
      <Form.Select disabled>
        <option />
      </Form.Select>
    </div>
  </div>
);

const ChannelRows: React.FC<{
  queryRef: PreloadedQuery<SlackChannelInputQuery>;
  slackChannels: string[];
  notifySlack: boolean;
  onChannelChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  onAdd: (firstUnselectedId: string) => void;
}> = ({ queryRef, slackChannels, onChannelChange, onRemove, onAdd }) => {
  const { allSlackChannels } = usePreloadedQuery<SlackChannelInputQuery>(
    slackChannelInputQuery,
    queryRef,
  );

  const sortedChannels = allSlackChannels
    .slice()
    .sort((a, b) => a?.name.localeCompare(b?.name || "") || 0);

  const selectedSet = new Set(slackChannels);
  const firstUnselected = sortedChannels.find(
    (ch) => ch && !selectedSet.has(ch.id),
  );

  return (
    <>
      {slackChannels.map((channelId, index) => {
        const otherSelected = new Set(
          slackChannels.filter((_, i) => i !== index),
        );
        return (
          <div key={index} className="row g-2 mb-2">
            <div className="col-lg">
              <Form.Select
                id={index === 0 ? "channel_id" : undefined}
                value={channelId}
                onChange={(e) => onChannelChange(index, e.target.value)}
              >
                {sortedChannels.map((channel, i) => {
                  if (!channel) return null;
                  if (otherSelected.has(channel.id)) return null;
                  return (
                    <option key={i} value={channel.id}>
                      {channel.name}
                    </option>
                  );
                })}
              </Form.Select>
            </div>
            {slackChannels.length > 1 && (
              <div className="col-auto">
                <Button
                  variant="outline-secondary"
                  onClick={() => onRemove(index)}
                  aria-label="チャンネルを削除"
                >
                  &times;
                </Button>
              </div>
            )}
          </div>
        );
      })}
      <Button
        variant="outline-primary"
        size="sm"
        disabled={!firstUnselected}
        onClick={() => firstUnselected && onAdd(firstUnselected.id)}
      >
        チャンネルを追加
      </Button>
    </>
  );
};
