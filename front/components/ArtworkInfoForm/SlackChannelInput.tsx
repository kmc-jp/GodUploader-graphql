import React, { useEffect, Suspense } from "react";
import { PreloadedQuery, usePreloadedQuery, useQueryLoader } from "react-relay";
import { graphql } from "react-relay";

import { useClientSideRendering } from "../../lib/hooks/useClientSideRendering";
import { useUploadArtworkContext } from "../../lib/hooks/useUploadArtworkContext";
import { SlackChannelInputQuery } from "./__generated__/SlackChannelInputQuery.graphql";

const slackChannelInputQuery = graphql`
  query SlackChannelInputQuery {
    allSlackChannels {
      id
      name
    }
  }
`;

export const SlackChannelInput: React.VFC = () => {
  const isCSR = useClientSideRendering();
  return isCSR ? (
    <Suspense fallback={null}>
      <SlackChannelInputInner />
    </Suspense>
  ) : null;
};

const SlackChannelInputInner: React.VFC = () => {
  const { slackChannel, notifySlack, setSlackChannel } =
    useUploadArtworkContext();
  const [queryRef, loadQuery] = useQueryLoader<SlackChannelInputQuery>(
    slackChannelInputQuery
  );

  useEffect(() => {
    loadQuery({}, { fetchPolicy: "store-and-network" });
  }, [loadQuery]);

  return (
    <>
      <label htmlFor="channel_id">投稿先のチャンネル(迷惑厳禁！)</label>
      <div className="row g-2">
        <div className="col-lg">
          <select
            id="channel_id"
            className="form-select"
            value={slackChannel}
            disabled={!notifySlack}
            onChange={(e) => setSlackChannel(e.target.value)}
          >
            {notifySlack && queryRef && (
              <ChannelSuggestion queryRef={queryRef} />
            )}
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
