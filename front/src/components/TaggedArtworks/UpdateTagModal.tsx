import React, { useCallback, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { graphql } from "react-relay";
import { useFragment, useRelayEnvironment } from "react-relay";
import { useNavigate } from "react-router";
import { PayloadError } from "relay-runtime";

import { commitUpdateTagMutation } from "../../mutation/UpdateTag";
import { UpdateTagModal_tag$key } from "./__generated__/UpdateTagModal_tag.graphql";

interface UpdateTagModalProps {
  tagKey: UpdateTagModal_tag$key;
}

export const UpdateTagModal: React.FC<UpdateTagModalProps> = ({ tagKey }) => {
  const tag = useFragment(
    graphql`
      fragment UpdateTagModal_tag on Tag {
        id
        name
        canonicalName
      }
    `,
    tagKey,
  );
  const [show, setShow] = useState(false);
  const [name, setName] = useState(tag.name);

  const resetStates = useCallback(() => {
    setName(tag.name);
  }, [tag.name]);

  const handleHide = useCallback(() => {
    setShow(false);
    resetStates();
  }, [resetStates]);

  const [errors, setErrors] = useState<PayloadError[] | null | undefined>(null);
  const environment = useRelayEnvironment();
  const navigate = useNavigate();
  const handleUpdate: React.FormEventHandler = useCallback(
    (e) => {
      e.preventDefault();
      commitUpdateTagMutation(environment, {
        variables: {
          input: {
            id: tag.id,
            name,
          },
        },
        onCompleted: (response, errors) => {
          if (errors) {
            setErrors(errors.slice());
            return;
          }

          setShow(false);
          navigate(
            `/tagged_artworks/${encodeURIComponent(
              response.updateTag?.tag?.name ?? "",
            )}`,
            { replace: true },
          );
        },
      });
    },
    [environment, navigate, name, tag.id],
  );

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        情報の編集
      </Button>
      <Modal show={show} onHide={handleHide}>
        <form onSubmit={handleUpdate}>
          <Modal.Header closeButton>
            <Modal.Title>タグの情報編集</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {errors &&
              errors.map((error, i) => (
                <Alert key={i} variant="danger">
                  {error.message}
                </Alert>
              ))}
            <Form.Label htmlFor="name">
              タグ名 <span className="text-danger">(必須)</span>
            </Form.Label>
            <Form.Control
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value.trim())}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="primary" className="w-100">
              保存する
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
