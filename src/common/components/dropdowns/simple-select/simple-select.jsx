import PropTypes from "prop-types";
import { forwardRef } from "react";
import useSimpleSelect from "./use-simple-select";
import CustomInput from "../../custom-input/custom-input.component";
import FieldLabel from "../../field-label/field-label.component";
import FieldError from "../../field-error/field-error.component";

/**
 * Dropdown Icon Component
 */
function DropdownIcon({ isOpen, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${className}`}
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SimpleSelect = forwardRef(function SimpleSelect(
  {
    label,
    placeholder = "Select an option...",
    options = [],
    isMulti = false,
    isSearchable = false,
    onChange,
    defaultValue,
    value,
    className = "",
    disabled = false,
    isRequired = false,
    errors = null,
    name,
    size = "md",
    variant = "default",
    helperText = null,
    inlineLabel = false,
    labelClassName = "",
    maxHeight = "15rem", // 240px
    clearable = false,
    loading = false,
    noOptionsMessage = "No options found",
  },
  ref
) {
  const {
    inputRef,
    handleInputClick,
    getDisplay,
    showMenu,
    onSearch,
    searchValue,
    searchRef,
    getOptions,
    onItemClick,
    isSelected,
    clearSelection,
  } = useSimpleSelect({
    placeholder,
    options,
    isMulti,
    isSearchable,
    onChange,
    defaultValue,
    value,
    disabled,
  });

  // Get error state
  const hasError = errors && name && errors[name];
  const errorMessage = hasError ? errors[name].message : null;

  // Get select classes based on new theme system
  const getSelectClasses = () => {
    const baseClasses = "form-select";

    // Size classes
    const sizeClasses = {
      sm: "text-sm py-2 px-3 h-9",
      md: "text-sm py-3 px-4 h-11", // default
      lg: "text-base py-4 px-4 h-12",
    };

    // Variant classes
    const variantClasses = {
      default: "",
      bordered: "border-2",
      minimal: "border-0 border-b-2 rounded-none bg-transparent",
    };

    // State classes
    const stateClasses = hasError ? "form-input-error" : "";
    const disabledClasses = disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer";
    const focusClasses = showMenu
      ? "ring-2 ring-primary-500 ring-opacity-20 border-primary-500"
      : "";

    return `${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant]} ${stateClasses} ${disabledClasses} ${focusClasses} ${className}`.trim();
  };

  // Container classes
  const containerClasses = inlineLabel
    ? "grid w-full grid-cols-[130px_1fr] items-start gap-4"
    : "form-group";

  // Get dropdown position classes
  const getDropdownClasses = () => {
    const baseClasses =
      "absolute w-full bg-white border border-neutral-200 rounded-sm shadow-2xl overflow-hidden";
    const positionClasses = "top-full mt-1";

    return `${baseClasses} ${positionClasses}`;
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleInputClick();
    } else if (e.key === "Escape" && showMenu) {
      // Close menu on escape
      handleInputClick();
    }
  };

  // Check if we should show placeholder
  const displayValue = getDisplay();
  const isPlaceholder = displayValue === placeholder || displayValue === "Select an option...";

  return (
    <div className={containerClasses}>
      {label && (
        <FieldLabel
          label={label}
          isRequired={isRequired}
          className={`${inlineLabel ? "mt-2" : ""} ${labelClassName}`}
        />
      )}

      <div className="relative w-full z-10">
        {/* Main Select Input */}
        <div
          ref={inputRef}
          onClick={disabled ? undefined : handleInputClick}
          onKeyDown={handleKeyDown}
          className={getSelectClasses()}
          role="combobox"
          aria-expanded={showMenu}
          aria-haspopup="listbox"
          aria-required={isRequired}
          aria-invalid={hasError}
          tabIndex={disabled ? -1 : 0}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex-1 truncate pr-2">
              {loading ? (
                <span className="flex items-center text-neutral-500">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
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
                  Loading...
                </span>
              ) : (
                <span className={isPlaceholder ? "text-neutral-400" : "text-neutral-800"}>
                  {displayValue}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1">
              {/* Clear Button */}
              {clearable && !isPlaceholder && !disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelection();
                  }}
                  className="p-1 hover:bg-neutral-100 rounded text-neutral-400 hover:text-neutral-600 transition-colors"
                  aria-label="Clear selection"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}

              {/* Dropdown Arrow */}
              {/* <DropdownIcon
                isOpen={showMenu}
                className={`w-4 h-4 ${disabled ? "text-neutral-300" : "text-neutral-500"}`}
              /> */}
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        {showMenu && !disabled && (
          <div className={getDropdownClasses()}>
            {/* Search Input */}
            {isSearchable && (
              <div className="p-3 border-b border-neutral-100 bg-neutral-50">
                <CustomInput
                  ref={searchRef}
                  name="search"
                  onChange={onSearch}
                  value={searchValue}
                  placeholder="Search options..."
                  size="sm"
                  className="border-neutral-300"
                />
              </div>
            )}

            {/* Options List */}
            <div
              className="overflow-auto"
              style={{ maxHeight }}
              role="listbox"
              aria-multiselectable={isMulti}
            >
              {getOptions()?.length > 0 ? (
                getOptions().map((option, index) => (
                  <div
                    key={`${option.value}-${index}`}
                    onClick={() => onItemClick(option)}
                    className={`cursor-pointer px-4 py-3 text-sm transition-colors hover:bg-primary-50 ${
                      isSelected(option)
                        ? "bg-primary-100 text-primary-700 font-medium"
                        : "text-neutral-700"
                    }`}
                    role="option"
                    aria-selected={isSelected(option)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{option.label}</span>
                      {isMulti && isSelected(option) && (
                        <svg
                          className="w-4 h-4 text-primary-600 ml-2 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-sm text-neutral-500 text-center">
                  {isSearchable && searchValue
                    ? `No results for "${searchValue}"`
                    : noOptionsMessage}
                </div>
              )}
            </div>
          </div>
        )}

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
});

SimpleSelect.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  isMulti: PropTypes.bool,
  isSearchable: PropTypes.bool,
  onChange: PropTypes.func,
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  ]),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  ]),
  disabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  errors: PropTypes.object,
  name: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  variant: PropTypes.oneOf(["default", "bordered", "minimal"]),
  helperText: PropTypes.string,
  inlineLabel: PropTypes.bool,
  labelClassName: PropTypes.string,
  maxHeight: PropTypes.string,
  clearable: PropTypes.bool,
  loading: PropTypes.bool,
  noOptionsMessage: PropTypes.string,
};

// Export size and variant constants for easy usage
export const SELECT_SIZES = {
  SMALL: "sm",
  MEDIUM: "md",
  LARGE: "lg",
};

export const SELECT_VARIANTS = {
  DEFAULT: "default",
  BORDERED: "bordered",
  MINIMAL: "minimal",
};

export default SimpleSelect;
