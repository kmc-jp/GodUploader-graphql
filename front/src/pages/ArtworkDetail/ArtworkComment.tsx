import React, { useCallback, useRef, useState } from "react";
import { useFragment, useRelayEnvironment } from "react-relay";
import { graphql } from "babel-plugin-relay/macro";
import { commitCreateCommentMutation } from "../../mutation/CreateComment";
import { ArtworkComment_comments$key } from "./__generated__/ArtworkComment_comments.graphql";
import { ArtworkDetailQueryResponse } from "../__generated__/ArtworkDetailQuery.graphql";

interface Props {
  artwork: NonNullable<ArtworkDetailQueryResponse["node"]>;
}

export const ArtworkComment: React.VFC<Props> = ({ artwork }) => {
  const { comments } = useFragment<ArtworkComment_comments$key>(
    graphql`
      fragment ArtworkComment_comments on Artwork {
        comments(last: 1000000) @connection(key: "ArtworkComment_comments") {
          __id
          edges {
            node {
              text
              createdAt
              account {
                kmcid
              }
            }
          }
        }
      }
    `,
    artwork
  );
  if (!comments?.edges) {
    return null;
  }

  const edges = Array.from(comments.edges);
  edges.reverse();

  return (
    <div className="mt-2">
      <ul className="list-group">
        {edges.map((edge, i) => {
          if (!edge) {
            return null;
          }

          const { node } = edge;
          if (!node) {
            return null;
          }

          return (
            <li key={i} className="list-group-item d-flex align-items-start">
              <div className="ms2 me-auto">
                <div className="fw-bold">{node.account?.kmcid}</div>
                {node.text}
              </div>
              {node.createdAt}
            </li>
          );
        })}
      </ul>
      <div className="mt-2">
        <CommentForm artwork={artwork} connectionId={comments.__id} />
      </div>
    </div>
  );
};

const CommentForm: React.VFC<Props & { connectionId: string }> = ({
  artwork,
  connectionId,
}) => {
  const environment = useRelayEnvironment();

  const [text, setText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!text) {
        return;
      }

      setIsPosting(true);
      commitCreateCommentMutation(environment, {
        variables: {
          input: { artworkId: artwork.id!, text },
          connections: [connectionId],
        },
        onCompleted: () => {
          setIsPosting(false);
        },
      });
      setText("");
    },
    [artwork.id, connectionId, environment, text]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-2">
        <div className="col-sm-9">
          <input
            type="text"
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="col-sm-2">
          <input
            type="submit"
            value="コメントする"
            className="btn btn-primary form-control"
          />
        </div>
        {isPosting && (
          <div className="col-sm text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Uploading...</span>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
