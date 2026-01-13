import PropTypes from "prop-types";
import { Button } from "@mui/material";

/**
 * Create custom button using mui button with new theme system
 * @param text to be displayed on button
 * @param onClick function to be called on click
 * @param className is used to add custom styles classes to button
 * @param type type of button
 * @param variant variant of button (primary, secondary, outline, danger, ghost, cancel)
 * @param size size of button (sm, md, lg)
 * @param disabled to button disabled
 * @param href to be used as link
 * @param endIcon icon to be displayed at end of button
 * @param startIcon icon to be displayed at start of button
 * @param loading loading state for button
 * @returns component
 */

export default function CustomButton({
  id = null,
  text,
  onClick = null,
  className = "",
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  href = null,
  endIcon = null,
  startIcon = null,
  loading = false,
}) {
  const getButtonClasses = () => {
    const baseClasses = "btn font-dm normal-case";

    const variantClasses = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      outline: "btn-outline",
      danger: "btn-danger",
      ghost: "btn-ghost",
      cancel: "btn-cancel",
    };

    const sizeClasses = {
      sm: "btn-sm",
      md: "",
      lg: "btn-lg",
    };

    return `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || ""} ${className}`;
  };

  const buttonText = loading ? (
    <span className="flex items-center">
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text}
    </span>
  ) : (
    text
  );

  return (
    <Button
      id={id}
      type={type}
      onClick={onClick}
      variant="text"
      href={href}
      disabled={disabled || loading}
      endIcon={!loading ? endIcon : null}
      startIcon={!loading ? startIcon : null}
      className={getButtonClasses()}
      disableRipple
      disableElevation
      sx={{
        "&:focus": {
          outline: "none",
          border: "none",
          boxShadow: "none",
        },
        "&:focus-visible": {
          outline: "none",
          border: "none",
          boxShadow: "none",
        },
        "&:active": {
          outline: "none",
          border: "none",
          boxShadow: "none",
        },
        "&:hover": {
          outline: "none",
          border: "none",
        },
        "&.Mui-disabled": {
          opacity: 1,
          color: "inherit",
        },
      }}
    >
      {buttonText}
    </Button>
  );
}

CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "outline",
    "danger",
    "ghost",
    "cancel",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  disabled: PropTypes.bool,
  href: PropTypes.string,
  endIcon: PropTypes.element,
  startIcon: PropTypes.element,
  id: PropTypes.string,
  loading: PropTypes.bool,
};

export const BUTTON_VARIANTS = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  OUTLINE: "outline",
  DANGER: "danger",
  GHOST: "ghost",
  CANCEL: "cancel",
};

export const BUTTON_SIZES = {
  SMALL: "sm",
  MEDIUM: "md",
  LARGE: "lg",
};
