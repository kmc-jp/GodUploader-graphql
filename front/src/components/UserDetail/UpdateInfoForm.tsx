import { Modal } from "bootstrap";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { graphql } from "react-relay";
import { useFragment, useRelayEnvironment } from "react-relay";

import { commitUpdateAccountMutation } from "../../mutation/UpdateAccount";
import { UpdateInfoForm_account$key } from "./__generated__/UpdateInfoForm_account.graphql";

interface Props {
  account: UpdateInfoForm_account$key;
}

export const UpdateAccountModal: React.VFC<Props> = ({ account: _account }) => {
  const environment = useRelayEnvironment();
  const account = useFragment(
    graphql`
      fragment UpdateInfoForm_account on Account {
        kmcid
        name
      }
    `,
    _account
  );
  const [name, setName] = useState(account.name || "");
  const ref = useRef<HTMLDivElement>(null);

  const resetStates = useCallback(() => {
    // explicitly reset values
    setName(account.name || "");
  }, [account.name]);

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
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const modal = Modal.getInstance(ref.current!);
          modal?.hide();
        },
      });
    },
    [environment, name]
  );

  return (
    <>
      <div
        className="modal fade"
        id="updateAccountModal"
        aria-hidden="true"
        ref={ref}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleUpdate}>
              <div className="modal-header">
                <h5 className="modal-title">絵師情報の編集</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="閉じる"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="kmcid" className="form-label">
                    KMC-ID
                  </label>
                  <input
                    type="text"
                    id="kmcid"
                    className="form-control"
                    value={account.kmcid}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    表示名 <span className="text-danger">(必須)</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
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
      <div className="d-flex justify-content-center mb-2">
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#updateAccountModal"
        >
          情報の編集
        </button>
      </div>
    </>
  );
};
