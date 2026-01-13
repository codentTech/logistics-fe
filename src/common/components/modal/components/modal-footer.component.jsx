import { DialogActions } from "@mui/material/node";
import PropTypes from "prop-types";
import CustomButton from "../../custom-button/custom-button.component";

export default function ModalFooter({
  cancelButtonText = "Cancel",
  submitButtonText,
  onClose,
  submitOnclick,
}) {
  return (
    <DialogActions className="gap-4 pt-4">
      <CustomButton
        className="btn-cancel "
        onClick={onClose}
        text={cancelButtonText}
      />
      {submitButtonText && (
        <CustomButton
          type="submit"
          onClick={submitOnclick}
          className="btn-primary !h-fit rounded-md bg-primary px-4 py-[10px] font-dm text-sm font-semibold leading-4 text-white opacity-100"
          text={submitButtonText}
        />
      )}
    </DialogActions>
  );
}

ModalFooter.propTypes = {
  cancelButtonText: PropTypes.string,
  submitButtonText: PropTypes.string,
  onClose: PropTypes.func,
  submitOnclick: PropTypes.func,
};
