import { graphql } from "babel-plugin-relay/macro";
import React, { useEffect, Suspense } from "react";
import { PreloadedQuery, usePreloadedQuery, useQueryLoader } from "react-relay";

import { SlackChannelInputQuery } from "./__generated__/SlackChannelInputQuery.graphql";

const slackChannelInputQuery = graphql`
  query SlackChannelInputQuery {
    allSlackChannels {
      id
      name
    }
  }
`;

interface Props {
  slackChannel: string;
  setSlackChannel: (channel: string) => void;
  disabled: boolean;
}

export const SlackChannelInput: React.VFC<Props> = ({
  slackChannel,
  setSlackChannel,
  disabled,
}) => {
  const [queryRef, loadQuery] = useQueryLoader<SlackChannelInputQuery>(
    slackChannelInputQuery
  );

  useEffect(() => {
    loadQuery({});
  }, [loadQuery]);

  return (
    <>
      <label htmlFor="channel_id">投稿先のチャンネル(迷惑厳禁！)</label>
      <div className="row g-2">
        <div className="col-lg">
          <select
            id="tags"
            className="form-select"
            value={slackChannel}
            disabled={disabled}
            onChange={(e) => setSlackChannel(e.target.value)}
          >
            <Suspense fallback={null}>
              {!disabled && queryRef && (
                <ChannelSuggestion queryRef={queryRef} />
              )}
            </Suspense>
          </select>
        </div>
      </div>
    </>
  );
};

const ChannelSuggestion: React.VFC<{
  queryRef: PreloadedQuery<SlackChannelInputQuery>;
}> = ({ queryRef }) => {
  const { allSlackChannels } = usePreloadedQuery<SlackChannelInputQuery>(
    slackChannelInputQuery,
    queryRef
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
