import PropTypes from "prop-types";
import FieldError from "../field-error/field-error.component";
import FieldLabel from "../field-label/field-label.component";

export default function CustomSwitch({
  label = null,
  defaultChecked = false,
  checked = false,
  onChange = null,
  parentDivClassName = "",
  className = "",
  size = null,
  disabled = false,
  errors = null,
  register = null,
  name = null,
  isRequired = false,
  inlineLabel = true,
  labelRight = true,
  labelClassName = "",
  readOnly = false,
  rightLabelText = null,
}) {
  return (
    <div className="">
      <div
        className={` ${
          inlineLabel
            ? "flex w-full flex-row-reverse flex-wrap items-center justify-end gap-3 text-xs font-medium not-italic leading-6 leading-[18px] text-text-dark-gray"
            : "text-xs font-medium not-italic leading-6 text-text-black"
        } ${parentDivClassName} `}
      >
        {label && !labelRight && (
          <FieldLabel
            label={label}
            isRequired={isRequired}
            className={` ${labelClassName}`}
          />
        )}

        <input
          {...(register && register(`${name}`))}
          name={name}
          type="checkbox"
          className={`custom_switch_input ${className}`}
          {...(onChange && { onChange })}
          checked={checked}
          readOnly={readOnly}
          {...(defaultChecked && { defaultChecked })}
          disabled={disabled}
        />
        {((label && labelRight) || rightLabelText) && (
          <FieldLabel
            label={rightLabelText ?? label}
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

CustomSwitch.propTypes = {
  label: PropTypes.string,
  defaultChecked: PropTypes.bool,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  parentDivClassName: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object,
  register: PropTypes.func,
  name: PropTypes.string,
  isRequired: PropTypes.bool,
  inlineLabel: PropTypes.bool,
  labelClassName: PropTypes.string,
  readOnly: PropTypes.bool,
  labelRight: PropTypes.bool,
  rightLabelText: PropTypes.string,
};
