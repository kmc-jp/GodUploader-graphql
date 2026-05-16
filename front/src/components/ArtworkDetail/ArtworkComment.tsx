import React, { useCallback, useState } from "react";
import { Button, Form, ListGroup, Spinner } from "react-bootstrap";
import { graphql } from "react-relay";
import { useFragment, useRelayEnvironment } from "react-relay";

import { commitCreateCommentMutation } from "../../mutation/CreateComment";
import { ArtworkComment_comments$key } from "./__generated__/ArtworkComment_comments.graphql";

interface Props {
  artwork: ArtworkComment_comments$key;
}

export const ArtworkComment: React.FC<Props> = ({ artwork }) => {
  const { artworkId, comments } = useFragment<ArtworkComment_comments$key>(
    graphql`
      fragment ArtworkComment_comments on Artwork {
        artworkId: id
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
    artwork,
  );
  if (!comments?.edges) {
    return null;
  }

  const edges = Array.from(comments.edges);
  edges.reverse();

  return (
    <div className="mt-2">
      <ListGroup>
        {edges.map((edge, i) => {
          if (!edge) {
            return null;
          }

          const { node } = edge;
          if (!node) {
            return null;
          }

          return (
            <ListGroup.Item key={i} className="d-flex align-items-start">
              <div className="ms2 me-auto">
                <div className="fw-bold">{node.account?.kmcid}</div>
                {node.text}
              </div>
              {node.createdAt}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
      <div className="mt-2">
        <CommentForm artworkId={artworkId} connectionId={comments.__id} />
      </div>
    </div>
  );
};

const CommentForm: React.FC<{ artworkId: string; connectionId: string }> = ({
  artworkId,
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
          input: { artworkId, text },
          connections: [connectionId],
        },
        onCompleted: () => {
          setIsPosting(false);
        },
      });
      setText("");
    },
    [artworkId, connectionId, environment, text],
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-sm-9">
          <Form.Control
            type="text"
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <div className="col-sm-3">
          <Button type="submit" variant="primary" className="w-100">
            コメントする
          </Button>
        </div>
        {isPosting && (
          <div className="col-sm-1 text-center">
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Uploading...</span>
            </Spinner>
          </div>
        )}
      </div>
    </form>
  );
};
