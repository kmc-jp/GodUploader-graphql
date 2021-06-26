import { graphql } from "babel-plugin-relay/macro";
import { Modal } from "bootstrap";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFragment, useRelayEnvironment } from "react-relay";
import { useHistory } from "react-router-dom";
import { PayloadError } from "relay-runtime";

import { commitUpdateTagMutation } from "../../mutation/UpdateTag";
import { UpdateTagModal_tag$key } from "./__generated__/UpdateTagModal_tag.graphql";

interface UpdateTagModalProps {
  tagKey: UpdateTagModal_tag$key;
}

export const UpdateTagModal: React.VFC<UpdateTagModalProps> = ({ tagKey }) => {
  const tag = useFragment(
    graphql`
      fragment UpdateTagModal_tag on Tag {
        id
        name
        canonicalName
      }
    `,
    tagKey
  );
  const [name, setName] = useState(tag.name);

  const resetStates = useCallback(() => {
    setName(tag.name);
  }, [tag.name]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    el.addEventListener("hidden.bs.modal", resetStates);
    return () => {
      el.removeEventListener("hidden.bs.modal", resetStates);
    };
  }, [resetStates]);

  const [errors, setErrors] = useState<PayloadError[] | null | undefined>(null);
  const environment = useRelayEnvironment();
  const history = useHistory();
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
          if (!ref.current) {
            return;
          }

          if (errors) {
            setErrors(errors.slice());
            return;
          }

          const modal = Modal.getInstance(ref.current);
          modal?.hide();
          history.replace(`/tagged_artworks/${response.updateTag?.tag?.name}`);
        },
      });
    },
    [environment, history, name, tag.id]
  );

  return (
    <div
      className="modal fade"
      id="updateTagModal"
      aria-hidden="true"
      ref={ref}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleUpdate}>
            <div className="modal-header">
              <h5 className="modal-title">タグの情報編集</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="閉じる"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              {errors &&
                errors.map((error, i) => (
                  <div key={i} className="alert alert-danger" role="alert">
                    {error.message}
                  </div>
                ))}
              <label htmlFor="name" className="form-label">
                タグ名 <span className="text-danger">(必須)</span>
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                required
                value={name}
                onChange={(e) => setName(e.target.value.trim())}
              />
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary form-control">
                保存する
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
