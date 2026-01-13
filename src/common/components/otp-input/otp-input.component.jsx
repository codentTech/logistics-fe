/* eslint-disable react/no-array-index-key */
import PropTypes from "prop-types";
import useOtpInput from "./use-otp-input.hook";
import FieldLabel from "../field-label/field-label.component";
import FieldError from "../field-error/field-error.component";

export default function OtpInput({
  maxInput = 4,
  value = null,
  placeholder = "-",
  onChange,
  disabled = false,
  label = null,
  isRequired = false,
  inlineLabel = false,
  labelClassName = "",
  error = null,
}) {
  const { valueItems, inputChangeHandler, inputKeyDownHandler } = useOtpInput(
    maxInput,
    value,
    onChange
  );

  const getInputBorderClass = (index) => {
    if (index === 0) {
      return "!rounded-r-none";
    } else if (index === maxInput - 1) {
      return "!rounded-l-none";
    } else {
      return "!rounded-none";
    }
  };

  return (
    <div
      className={`${inlineLabel ? "flex w-full flex-row items-center" : ""}`}
    >
      {label && (
        <FieldLabel
          label={label}
          isRequired={isRequired}
          className={labelClassName}
        />
      )}

      <div className="w-full">
        <div className="flex flex-row">
          {valueItems.map((val, index) => (
            <input
              key={`${val} - ${index}`}
              id={index}
              type="number"
              className={`input-field default-input flex max-w-[51px] items-center justify-center px-3 text-center hover:border-text-dark-gray
              ${getInputBorderClass(index)}`}
              placeholder={placeholder}
              defaultValue={val}
              maxLength={1}
              min={0}
              max={9}
              disabled={disabled}
              onChange={inputChangeHandler}
              onKeyDown={inputKeyDownHandler}
            />
          ))}
        </div>
        {error && <FieldError className="mt-1" error={error} />}
      </div>
    </div>
  );
}

OtpInput.propTypes = {
  maxInput: PropTypes.number,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  inlineLabel: PropTypes.bool,
  labelClassName: PropTypes.string,
  error: PropTypes.string,
};
