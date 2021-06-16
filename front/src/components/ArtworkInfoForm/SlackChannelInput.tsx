import { graphql } from "babel-plugin-relay/macro";
import React, { Suspense } from "react";
import { useLazyLoadQuery } from "react-relay";
import { SlackChannelListQuery } from "./__generated__/SlackChannelListQuery.graphql";

const slackChannelListQuery = graphql`
  query SlackChannelListQuery {
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
              <ChannelSuggestion />
            </Suspense>
          </select>
        </div>
      </div>
    </>
  );
};

const ChannelSuggestion: React.VFC = () => {
  const { allSlackChannels } = useLazyLoadQuery<SlackChannelListQuery>(
    slackChannelListQuery,
    {}
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
