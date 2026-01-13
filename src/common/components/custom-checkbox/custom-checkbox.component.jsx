import PropTypes from "prop-types";
import FieldError from "../field-error/field-error.component";
import FieldLabel from "../field-label/field-label.component";
import { useEffect } from "react";

export default function CustomCheckboxGroup({
  label = null,
  options = [],
  values = [],
  onChange = null,
  name = null,
  register = null,
  errors = null,
  setValue = null,
  watch = null,
  isRequired = false,
  inlineLabel = false,
  labelClassName = "",
}) {
  const selectedValues = watch ? watch(name) || [] : values;

  const handleCheckboxChange = (value) => {
    const currentSelection = [...(selectedValues || [])];
    const updatedSelection = currentSelection.includes(value)
      ? currentSelection.filter((v) => v !== value)
      : [...currentSelection, value];

    if (setValue) {
      setValue(name, updatedSelection);
    }

    if (onChange) {
      onChange(updatedSelection);
    }
  };

  // Ensure controlled state is updated
  useEffect(() => {
    if (setValue && !selectedValues) {
      setValue(name, []);
    }
  }, [setValue, name, selectedValues]);

  return (
    <div className="flex flex-col gap-2">
      {label && <FieldLabel label={label} isRequired={isRequired} className={labelClassName} />}

      <div className={`flex flex-wrap gap-3 flex-row ${inlineLabel ? "flex-row" : "flex-col"}`}>
        {options.map((option) => (
          <label key={option.value} className="flex items-center text-xs gap-2">
            <input
              type="checkbox"
              value={option.value}
              checked={selectedValues?.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              className="h-3.5 w-3.5 accent-primary cursor-pointer"
              {...(register && register(name))}
            />
            {option.label}
          </label>
        ))}
      </div>

      {errors && errors[name] && <FieldError className="mt-1" error={errors[name].message} />}
    </div>
  );
}

CustomCheckboxGroup.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  values: PropTypes.array,
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  register: PropTypes.func,
  errors: PropTypes.object,
  setValue: PropTypes.func,
  watch: PropTypes.func,
  isRequired: PropTypes.bool,
  inlineLabel: PropTypes.bool,
  labelClassName: PropTypes.string,
};
