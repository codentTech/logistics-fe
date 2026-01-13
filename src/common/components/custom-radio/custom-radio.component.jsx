import { Radio } from "@mui/material";
import PropTypes from "prop-types";
import FieldError from "../field-error/field-error.component";
import FieldLabel from "../field-label/field-label.component";

export default function CustomRadio({
  label = null,
  defaultChecked = null,
  value,
  name,
  className = "",
  size = null,
  disabled = false,
  errors = null,
  register = null,
  isRequired = false,
  inlineLabel = true,
  labelClassName = "",
  readOnly = false,
  onChange,
}) {
  return (
    <div className="">
      <div
        className={`${inlineLabel ? "flex w-full flex-row items-center" : ""}`}
      >
        <Radio
          name={name}
          className={`${className}`}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          onChange={onChange}
        />
        {label && (
          <FieldLabel
            label={label}
            isRequired={isRequired}
            className={labelClassName}
          />
        )}
      </div>
      {errors && errors[name] && (
        <FieldError className="mt-1" error={errors[name].message} />
      )}
    </div>
  );
}

CustomRadio.propTypes = {
  label: PropTypes.string,
  defaultChecked: PropTypes.bool,
  value: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object,
  register: PropTypes.func,
  isRequired: PropTypes.bool,
  inlineLabel: PropTypes.bool,
  labelClassName: PropTypes.string,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
};
