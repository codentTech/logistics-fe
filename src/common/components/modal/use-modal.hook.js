/**
 * Custom hook for Modal component functionality
 * @param size - Modal size variant
 * @param height - Modal height variant
 * @param customHeight - Custom height value
 * @param variant - Modal visual variant
 * @param onClose - Close handler function
 * @param closeOnBackdropClick - Whether backdrop click closes modal
 * @returns Modal utility functions and state
 */

export default function useModal({
  size,
  height,
  customHeight,
  variant,
  onClose,
  closeOnBackdropClick,
}) {
  // Get modal size classes
  const getModalSizeClasses = () => {
    const sizeClasses = {
      sm: "max-w-sm w-full", // 384px
      md: "max-w-md w-full", // 448px
      lg: "max-w-2xl w-full", // 672px
      xl: "max-w-4xl w-full", // 896px
      full: "max-w-7xl w-full mx-4", // Almost full screen with margin
    };

    return sizeClasses[size] || sizeClasses.md;
  };

  // Get modal height classes
  const getModalHeightClasses = () => {
    const heightClasses = {
      auto: "max-h-[90vh]",
      full: "h-[90vh]",
      custom: customHeight ? `h-[${customHeight}]` : "max-h-[90vh]",
    };

    return heightClasses[height] || heightClasses.auto;
  };

  // Get header classes based on variant
  const getHeaderClasses = () => {
    const baseClasses = "modal-header";

    const variantClasses = {
      default: "bg-primary-500 text-white",
      danger: "bg-danger-500 text-white",
      success: "bg-success-500 text-white",
      warning: "bg-warning-500 text-white",
    };

    return `${baseClasses} ${variantClasses[variant] || variantClasses.default}`;
  };

  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (!closeOnBackdropClick || !onClose) return;

    // Only close if clicking the backdrop, not the modal content
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Handle escape key press
  const handleKeyDown = (event) => {
    if (event.key === "Escape" && onClose) {
      onClose();
    }
  };

  return {
    getModalSizeClasses,
    getModalHeightClasses,
    getHeaderClasses,
    handleBackdropClick,
    handleKeyDown,
  };
}
