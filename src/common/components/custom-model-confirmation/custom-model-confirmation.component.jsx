import React from "react";
import PropTypes from "prop-types";
import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";

export default function ConfirmationModal({
  show,
  onClose,
  onCancel,
  onConfirm,
  message,
  cancelText,
}) {
  return (
    <Modal
      onClose={onClose}
      show={show}
      title="Confirmation"
      className="z-auto"
    >
      <div className="flex flex-col items-center gap-2">
        <h3 className="items-center">{message}</h3>
      </div>
      <div className="mt-5 flex justify-center gap-6">
        <CustomButton
          onClick={cancelText ? onCancel : onClose}
          text={cancelText ? "No" : "Cancel"}
          className="btn-cancel"
        />
        <CustomButton
          text="Yes"
          type="submit"
          className="btn-primary"
          onClick={onConfirm}
        />
      </div>
    </Modal>
  );
}

ConfirmationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  cancelText: PropTypes.string,
};
