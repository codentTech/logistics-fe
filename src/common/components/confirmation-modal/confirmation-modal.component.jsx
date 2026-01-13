import CustomButton from "@/common/components/custom-button/custom-button.component";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import useModal from "../modal/use-modal.hook";

export default function ConfirmationModal({
  show,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  size = "sm",
}) {
  const { getModalSizeClasses, getModalHeightClasses, getHeaderClasses, handleBackdropClick } =
    useModal({
      size,
      height: "auto",
      variant,
      onClose,
      closeOnBackdropClick: true,
    });

  // Get modal container classes
  const getModalClasses = () => {
    const baseClasses = "modal";
    const sizeClasses = getModalSizeClasses();
    const heightClasses = getModalHeightClasses();
    return `${baseClasses} ${sizeClasses} ${heightClasses}`.trim();
  };

  return (
    <Dialog
      open={show}
      onClose={onClose}
      onClick={handleBackdropClick}
      className={`custom-modal ${variant}`}
      PaperProps={{
        className: getModalClasses(),
        sx: {
          borderRadius: "1.25rem",
          boxShadow: "0px 10px 50px rgba(0, 0, 0, 0.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
        },
      }}
    >
      {/* Header */}
      <div className={getHeaderClasses() + " flex items-center justify-between px-4 py-[14px]"}>
        <DialogTitle className="px-0 py-0 font-dm text-xl font-bold leading-8 text-white">
          {title || "Are you sure?"}
        </DialogTitle>
        {onClose && (
          <div className="hover:cursor-pointer" onClick={onClose}>
            <X className="text-white" />
          </div>
        )}
      </div>
      {/* Content */}
      <DialogContent
        className="modal-content"
        sx={{
          position: "relative",
          overflowY: "auto",
          flex: 1,
          minHeight: 0,
        }}
      >
        <div className="modal-body flex flex-col items-center justify-center gap-6">
          {description && <div className="text-center text-gray-700 text-sm">{description}</div>}
          <div className="w-full flex justify-end gap-4 pt-4 border-t">
            <CustomButton onClick={onClose} text={cancelText} className="btn-cancel" />
            <CustomButton text={confirmText} type="submit" variant={variant} onClick={onConfirm} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

ConfirmationModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  variant: PropTypes.oneOf(["default", "danger", "success", "warning"]),
  size: PropTypes.oneOf(["sm", "md", "lg", "xl", "full"]),
};
