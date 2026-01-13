/* eslint-disable react/forbid-prop-types */

"use client";

import FieldError from "@/common/components/field-error/field-error.component";
import { Input, InputAdornment } from "@mui/material";
import PropTypes from "prop-types";
import FieldLabel from "../field-label/field-label.component";
import useCustomInput from "./use-custom-input.hook";

/**
 * CustomInput component with new theme system integration
 * @param type - The type of input (text, email, password, number, date, etc.)
 * @param placeholder - The placeholder text
 * @param onChange - The function to call when the input changes
 * @param name - The name of input to get value in onSubmit
 * @param defaultValue - The value that will be displayed on input field on first time
 * @param value - The value of the input
 * @param className - Additional CSS classes
 * @param endIcon - The icon to display at the end of the input
 * @param startIcon - The icon to display at the start of the input
 * @param disabled - Whether the input is disabled
 * @param errors - Form validation errors object
 * @param register - React Hook Form register function
 * @param label - Label text for the input
 * @param isRequired - Whether the field is required
 * @param inlineLabel - Whether to display label inline
 * @param labelClassName - Additional classes for label
 * @param readOnly - Whether the input is read-only
 * @param onClick - Click handler function
 * @param onKeyPress - Key press handler function
 * @param onKeyDown - Key down handler function
 * @param customRef - Custom ref for the input
 * @param onBlur - Blur handler function
 * @param onFocus - Focus handler function
 * @param size - Size variant (sm, md, lg)
 * @param variant - Visual variant (default, bordered, minimal)
 * @param helperText - Helper text displayed below the input
 * @returns A custom input component
 */

export default function CustomInput({
  type = "text",
  placeholder = "",
  name,
  onChange = null,
  defaultValue = null,
  value = null,
  className = "",
  endIcon = null,
  startIcon = null,
  disabled = false,
  errors = null,
  register = null,
  label = null,
  isRequired = false,
  inlineLabel = false,
  labelClassName = "",
  readOnly = false,
  onClick = null,
  onKeyPress = null,
  onKeyDown = null,
  customRef = null,
  onBlur = null,
  onFocus = null,
  size = "md",
  variant = "default",
  helperText = null,
}) {
  const {
    inputChangeHandler,
    showPassword,
    getInputEndAdornment,
    borderErrorStyle,
    borderSuccessStyle,
  } = useCustomInput(onChange, type, endIcon);

  // Get error state
  const hasError = errors && errors[name];
  const errorMessage = hasError ? errors[name].message : null;

  // Get input classes based on new theme system
  const getInputClasses = () => {
    // Base border and styling (no padding here - padding goes on Input component)
    const baseClasses =
      "w-full border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-0 focus:ring-offset-0 focus:outline-none transition-colors duration-200";

    // Size classes (only height and text size, no padding)
    const sizeClasses = {
      sm: "text-sm h-9",
      md: "text-sm h-11", // default
      lg: "text-base h-12",
    };

    // Variant classes
    const variantClasses = {
      default: "",
      bordered: "border-2",
      minimal: "border-0 border-b-2 rounded-none bg-transparent",
    };

    // State classes
    const stateClasses = hasError ? "border-red-500 focus:border-red-500" : "";
    const disabledClasses = disabled
      ? "opacity-60 cursor-not-allowed bg-gray-50"
      : "";
    const readOnlyClasses = readOnly ? "bg-gray-50" : "";

    // Special type classes
    const typeClasses = type === "number" ? "numArrowNotShow" : "";

    return `${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant]} ${stateClasses} ${disabledClasses} ${readOnlyClasses} ${typeClasses} ${className}`.trim();
  };

  // Container classes
  const containerClasses = inlineLabel
    ? "grid w-full grid-cols-[130px_1fr] items-center gap-4"
    : "form-group";

  // Get padding based on icons and size
  const getPaddingClasses = () => {
    const sizeMap = {
      sm: { start: "pl-2.5", end: "pr-2.5", both: "px-2.5" },
      md: { start: "pl-3", end: "pr-3", both: "px-3" },
      lg: { start: "pl-3", end: "pr-3", both: "px-3" },
    };

    const sizePadding = sizeMap[size] || sizeMap.md;
    const hasEndAdornment = endIcon || getInputEndAdornment();

    if (startIcon && hasEndAdornment) return sizePadding.both;
    if (startIcon) return `${sizePadding.start} pr-8`;
    if (hasEndAdornment) {
      // Add extra right padding for password icon to prevent text overlap
      if (type === "password") {
        return `${sizePadding.start} pr-1`;
      }
      return `${sizePadding.start} pr-8`;
    }
    return sizePadding.both;
  };

  return (
    <div className={containerClasses}>
      {label && (
        <div className="w-full flex justify-between items-center">
          <FieldLabel
            label={label}
            isRequired={isRequired}
            className={`${inlineLabel ? "mt-0" : ""} ${labelClassName}`}
          />

          {/* Helper text */}
          {helperText && (
            <p className="min-w-24 text-[8px] text-gray-600 font-normal leading-[15px] whitespace-nowrap truncate">
              {helperText}
            </p>
          )}
        </div>
      )}

      <div className={`relative w-full flex items-center ${getInputClasses()}`}>
        <Input
          {...(register &&
            register(name, {
              required: isRequired
                ? `${label || "This field"} is required`
                : false,
            }))}
          {...(onClick && { onClick })}
          {...(onKeyPress && { onKeyPress })}
          {...(onKeyDown && { onKeyDown })}
          name={name}
          onFocus={onFocus}
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          className={`${getPaddingClasses()} border-0`}
          {...(defaultValue !== null &&
            defaultValue !== undefined && { defaultValue })}
          {...(value !== null && value !== undefined && { value })}
          {...(customRef && { inputRef: customRef })}
          disabled={disabled}
          variant="standard"
          disableUnderline={true}
          startAdornment={
            startIcon ? (
              <InputAdornment position="start" className="ml-1">
                {startIcon}
              </InputAdornment>
            ) : null
          }
          endAdornment={
            getInputEndAdornment() ? (
              <InputAdornment position="end">
                {getInputEndAdornment()}
              </InputAdornment>
            ) : endIcon ? (
              <InputAdornment position="end">{endIcon}</InputAdornment>
            ) : null
          }
          {...(onChange && { onChange: inputChangeHandler })}
          readOnly={readOnly}
          {...(onBlur && { onBlur })}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            border: "none !important",
            boxShadow: "none !important",
            "& .MuiInputBase-input": {
              padding: 0,
              flex: 1,
              border: "none",
              outline: "none",
              "&::placeholder": {
                opacity: 0.6,
              },
              "&:focus": {
                outline: "none",
                boxShadow: "none",
                border: "none",
              },
            },
            "& .MuiInputAdornment-root": {
              flexShrink: 0,
              "&.MuiInputAdornment-positionEnd": {
                marginRight: "8px",
                marginLeft: "0px",
                order: 2,
              },
              "&.MuiInputAdornment-positionStart": {
                order: 0,
              },
              "& .MuiIconButton-root": {
                padding: "4px",
                margin: 0,
                "&:hover": {
                  backgroundColor: "transparent",
                },
              },
            },
            "&:focus-within": {
              outline: "none",
              boxShadow: "none",
              border: "none",
              "& .MuiInputBase-input": {
                outline: "none",
                boxShadow: "none",
                border: "none",
              },
            },
            "&:before": {
              display: "none",
            },
            "&:after": {
              display: "none",
            },
          }}
        />
      </div>
      {/* Error message */}
      {errorMessage && (
        <div className="mt-1">
          <FieldError className="normal-case" error={errorMessage} />
        </div>
      )}
    </div>
  );
}

CustomInput.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onKeyPress: PropTypes.func,
  onKeyDown: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  endIcon: PropTypes.element,
  startIcon: PropTypes.element,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  register: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  errors: PropTypes.object,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  inlineLabel: PropTypes.bool,
  labelClassName: PropTypes.string,
  readOnly: PropTypes.bool,
  customRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  variant: PropTypes.oneOf(["default", "bordered", "minimal"]),
  helperText: PropTypes.string,
};

// Export size and variant constants for easy usage
export const INPUT_SIZES = {
  SMALL: "sm",
  MEDIUM: "md",
  LARGE: "lg",
};

export const INPUT_VARIANTS = {
  DEFAULT: "default",
  BORDERED: "bordered",
  MINIMAL: "minimal",
};

export const INPUT_TYPES = {
  TEXT: "text",
  EMAIL: "email",
  PASSWORD: "password",
  NUMBER: "number",
  DATE: "date",
  TIME: "time",
  DATETIME_LOCAL: "datetime-local",
  TEL: "tel",
  URL: "url",
  SEARCH: "search",
};
