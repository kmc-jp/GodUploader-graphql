import React, { useState, useCallback } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { graphql } from "react-relay";
import { useFragment, useRelayEnvironment } from "react-relay";

import { commitUpdateAccountMutation } from "../../mutation/UpdateAccount";
import { UpdateInfoForm_account$key } from "./__generated__/UpdateInfoForm_account.graphql";

interface Props {
  account: UpdateInfoForm_account$key;
}

export const UpdateAccountModal: React.FC<Props> = ({ account: _account }) => {
  const environment = useRelayEnvironment();
  const account = useFragment(
    graphql`
      fragment UpdateInfoForm_account on Account {
        kmcid
        name
      }
    `,
    _account,
  );
  const [show, setShow] = useState(false);
  const [name, setName] = useState(account.name || "");

  const resetStates = useCallback(() => {
    // explicitly reset values
    setName(account.name || "");
  }, [account.name]);

  const handleHide = useCallback(() => {
    setShow(false);
    resetStates();
  }, [resetStates]);

  const handleUpdate = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      commitUpdateAccountMutation(environment, {
        variables: {
          input: {
            name,
          },
        },
        onCompleted: () => {
          setShow(false);
        },
      });
    },
    [environment, name],
  );

  return (
    <>
      <div className="d-flex justify-content-center mb-2">
        <Button variant="primary" onClick={() => setShow(true)}>
          情報の編集
        </Button>
      </div>
      <Modal show={show} onHide={handleHide}>
        <form onSubmit={handleUpdate}>
          <Modal.Header closeButton>
            <Modal.Title>絵師情報の編集</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <Form.Label htmlFor="kmcid">KMC-ID</Form.Label>
              <Form.Control
                type="text"
                id="kmcid"
                value={account.kmcid}
                disabled
              />
            </div>
            <div className="mb-3">
              <Form.Label htmlFor="title">
                表示名 <span className="text-danger">(必須)</span>
              </Form.Label>
              <Form.Control
                type="text"
                id="title"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
