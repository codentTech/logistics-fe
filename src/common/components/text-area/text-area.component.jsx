import { TextareaAutosize } from "@mui/material";
import PropTypes from "prop-types";
import FieldError from "../field-error/field-error.component";
import FieldLabel from "../field-label/field-label.component";

/**
 * TextArea component with new theme system integration
 * @param placeholder - Placeholder text for the textarea
 * @param name - Name attribute for form handling
 * @param register - React Hook Form register function
 * @param label - Label text for the textarea
 * @param className - Additional CSS classes
 * @param minRows - Minimum number of rows
 * @param maxRows - Maximum number of rows
 * @param value - Controlled value
 * @param disabled - Whether the textarea is disabled
 * @param defaultValue - Default value for uncontrolled component
 * @param onChange - Change handler function
 * @param onKeyDown - Key down handler function
 * @param errors - Form validation errors object
 * @param isRequired - Whether the field is required
 * @param inlineLabel - Whether to display label inline
 * @param labelClassName - Additional classes for label
 * @param readOnly - Whether the textarea is read-only
 * @param onBlur - Blur handler function
 * @param customRef - Custom ref for the textarea
 * @param size - Size variant (sm, md, lg)
 * @param variant - Visual variant (default, bordered, minimal)
 * @param helperText - Helper text displayed below the textarea
 * @returns TextArea component
 */

export default function TextArea({
  placeholder = "",
  name,
  register = null,
  label = null,
  className = "",
  minRows = 1,
  maxRows = 10,
  value = null,
  disabled = false,
  defaultValue = null,
  onChange = null,
  onKeyDown = null,
  errors = null,
  isRequired = false,
  inlineLabel = false,
  labelClassName = "",
  readOnly = false,
  onBlur = null,
  customRef = null,
  size = "md",
  variant = "default",
  helperText = null,
}) {
  // Get error state
  const hasError = errors && errors[name];
  const errorMessage = hasError ? errors[name].message : null;

  // Get textarea classes based on new theme system
  const getTextareaClasses = () => {
    const baseClasses = "form-textarea";

    // Size classes
    const sizeClasses = {
      sm: "text-sm py-2 px-3",
      md: "text-sm py-3 px-4", // default
      lg: "text-base py-4 px-4",
    };

    // Variant classes
    const variantClasses = {
      default: "",
      bordered: "border-2",
      minimal: "border-0 border-b-2 rounded-none bg-transparent",
    };

    // State classes
    const stateClasses = hasError ? "form-input-error" : "";
    const disabledClasses = disabled ? "opacity-60 cursor-not-allowed" : "";
    const readOnlyClasses = readOnly ? "bg-neutral-50" : "";

    return `outline-none focus:none ${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant]} ${stateClasses} ${disabledClasses} ${readOnlyClasses} ${className}`.trim();
  };

  // Container classes
  const containerClasses = inlineLabel
    ? "grid w-full grid-cols-[130px_1fr] items-start gap-4"
    : "form-group";

  return (
    <div className={containerClasses}>
      {label && (
        <FieldLabel
          label={label}
          isRequired={isRequired}
          className={`${inlineLabel ? "mt-3" : ""} ${labelClassName}`}
        />
      )}

      <div className="w-full">
        <TextareaAutosize
          {...(register &&
            register(name, {
              required: isRequired ? `${label || "This field"} is required` : false,
            }))}
          name={name}
          {...(customRef && { ref: customRef })}
          minRows={minRows}
          maxRows={maxRows}
          placeholder={placeholder}
          className={getTextareaClasses()}
          {...(defaultValue !== null && defaultValue !== undefined && { defaultValue })}
          {...(value !== null && value !== undefined && { value })}
          onChange={onChange}
          onKeyDown={onKeyDown}
          readOnly={readOnly}
          disabled={disabled}
          {...(onBlur && { onBlur })}
          style={{
            resize: variant === "minimal" ? "none" : "vertical",
          }}
        />

        {/* Helper text or error message */}
        {(helperText || errorMessage) && (
          <div className="mt-1">
            {errorMessage ? (
              <FieldError className="normal-case" error={errorMessage} />
            ) : (
              helperText && <p className="text-xs text-neutral-500">{helperText}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

TextArea.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  minRows: PropTypes.number,
  maxRows: PropTypes.number,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onBlur: PropTypes.func,
  register: PropTypes.func,
  errors: PropTypes.object,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  inlineLabel: PropTypes.bool,
  labelClassName: PropTypes.string,
  readOnly: PropTypes.bool,
  customRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  variant: PropTypes.oneOf(["default", "bordered", "minimal"]),
  helperText: PropTypes.string,
};

// Export size and variant constants for easy usage
export const TEXTAREA_SIZES = {
  SMALL: "sm",
  MEDIUM: "md",
  LARGE: "lg",
};

export const TEXTAREA_VARIANTS = {
  DEFAULT: "default",
  BORDERED: "bordered",
  MINIMAL: "minimal",
};
