/* eslint-disable react/forbid-prop-types */

"use client";

import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import PropTypes from "prop-types";
import useModal from "./use-modal.hook";

/**
 * Modal component with new theme system integration
 * @param show - Whether the modal is visible
 * @param title - Title text for the modal header
 * @param children - Modal content
 * @param onClose - Function to call when modal should close
 * @param size - Size variant (sm, md, lg, xl, full)
 * @param height - Height variant (auto, full, custom)
 * @param customHeight - Custom height value
 * @param variant - Visual variant (default, danger, success, warning)
 * @param className - Additional CSS classes
 * @param hideCloseButton - Whether to hide the close button
 * @param closeOnBackdropClick - Whether clicking backdrop closes modal
 * @param showDivider - Whether to show divider between header and content
 * @returns Modal component
 */

export default function Modal({
  show = false,
  title,
  children,
  onClose,
  size = "md",
  height = "auto",
  customHeight = null,
  variant = "default",
  className = "",
  closeOnBackdropClick = true,
  showDivider = true,
}) {
  const { getModalSizeClasses, getModalHeightClasses, getHeaderClasses, handleBackdropClick } =
    useModal({
      size,
      height,
      customHeight,
      variant,
      onClose,
      closeOnBackdropClick,
    });

  // Get modal container classes
  const getModalClasses = () => {
    const baseClasses = "modal";
    const sizeClasses = getModalSizeClasses();
    const heightClasses = getModalHeightClasses();

    return `${baseClasses} ${sizeClasses} ${heightClasses} ${className}`.trim();
  };

  return (
    <Dialog
      open={show}
      onClose={closeOnBackdropClick ? onClose : undefined}
      onClick={handleBackdropClick}
      className={`custom-modal ${variant}`}
      PaperProps={{
        className: getModalClasses(),
        sx: {
          borderRadius: "1.25rem", // rounded-card
          boxShadow: "0px 10px 50px rgba(0, 0, 0, 0.15)", // modal shadow
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
      <div className="flex items-center justify-between bg-primary-600 px-4 py-[14px]">
        <DialogTitle className="px-0 py-0 font-dm text-xl font-bold leading-8 text-white">
          {title}
        </DialogTitle>
        {onClose && (
          <div className="hover:cursor-pointer" onClick={onClose}>
            <X className="text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <DialogContent
        dividers={showDivider && !!title}
        className="modal-content"
        sx={{
          position: "relative",
          overflowY: "auto",
          flex: 1,
          padding: "1.5rem",
          minHeight: 0,
          "&.MuiDialogContent-dividers": {
            borderTop: `1px solid var(--color-primary-200)`,
            borderBottom: "none",
          },
        }}
      >
        <div className="modal-body">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

Modal.propTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl", "full"]),
  height: PropTypes.oneOf(["auto", "full", "custom"]),
  customHeight: PropTypes.string,
  variant: PropTypes.oneOf(["default", "danger", "success", "warning"]),
  className: PropTypes.string,
  hideCloseButton: PropTypes.bool,
  closeOnBackdropClick: PropTypes.bool,
  showDivider: PropTypes.bool,
};

// Export size and variant constants for easy usage
export const MODAL_SIZES = {
  SMALL: "sm",
  MEDIUM: "md",
  LARGE: "lg",
  EXTRA_LARGE: "xl",
  FULL: "full",
};

export const MODAL_HEIGHTS = {
  AUTO: "auto",
  FULL: "full",
  CUSTOM: "custom",
};

export const MODAL_VARIANTS = {
  DEFAULT: "default",
  DANGER: "danger",
  SUCCESS: "success",
  WARNING: "warning",
};
