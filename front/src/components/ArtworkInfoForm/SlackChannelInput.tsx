import React, { useEffect, Suspense } from "react";
import { Form } from "react-bootstrap";
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

  return (
    <>
      <Form.Label htmlFor="channel_ids">
        投稿先のチャンネル(迷惑厳禁！、複数選択可)
      </Form.Label>
      <div className="row g-2">
        <div className="col-lg">
          <Form.Select
            id="channel_ids"
            multiple
            value={slackChannels}
            disabled={!notifySlack}
            onChange={(e) => {
              const selected = Array.from(
                e.target.selectedOptions,
                (opt) => opt.value,
              );
              setSlackChannels(selected);
            }}
          >
            <Suspense fallback={null}>
              {notifySlack && queryRef && (
                <ChannelSuggestion queryRef={queryRef} />
              )}
            </Suspense>
          </Form.Select>
        </div>
      </div>
    </>
  );
};

const ChannelSuggestion: React.FC<{
  queryRef: PreloadedQuery<SlackChannelInputQuery>;
}> = ({ queryRef }) => {
  const { allSlackChannels } = usePreloadedQuery<SlackChannelInputQuery>(
    slackChannelInputQuery,
    queryRef,
  );

  const sortedChannels = allSlackChannels
    .slice()
    .sort((a, b) => a?.name.localeCompare(b?.name || "") || 0);

  return (
    <>
      {sortedChannels.map((channel, i) => {
        if (!channel) {
          return null;
        }
        return (
          <option key={i} value={channel.id}>
            {channel.name}
          </option>
        );
      })}
    </>
  );
};
