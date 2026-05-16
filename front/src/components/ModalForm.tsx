import React from "react";
import { Button, Modal, Spinner } from "react-bootstrap";

interface ModalFormProps {
  show: boolean;
  onHide: () => void;
  onSubmit: React.FormEventHandler;
  title: string;
  submitLabel?: string;
  submittingLabel?: string;
  size?: "sm" | "lg" | "xl";
  isSubmitting?: boolean;
  children: React.ReactNode;
}

export const ModalForm: React.FC<ModalFormProps> = ({
  show,
  onHide,
  onSubmit,
  title,
  submitLabel = "保存する",
  submittingLabel,
  size,
  isSubmitting = false,
  children,
}) => {
  const activeLabel = submittingLabel ?? submitLabel;

  return (
    <Modal show={show} onHide={onHide} size={size}>
      <form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            variant="primary"
            className="w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="d-flex align-items-center justify-content-center">
                <Spinner size="sm" className="me-2" />
                {activeLabel}
              </div>
            ) : (
              submitLabel
            )}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
