import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material/node";
import React from "react";
import PropTypes from "prop-types";
import FieldError from "../field-error/field-error.component";

function CustomRadioGroup({
  value,
  name,
  errors,
  register,
  onChange,
  options,
}) {
  return (
    <FormControl>
      <RadioGroup
        {...(register && register(`${name}`))}
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={onChange}
        className="text-xs font-normal not-italic leading-[18px] text-text-medium-gray"
      >
        {options?.map((op) => (
          <FormControlLabel
            value={op.value}
            control={<Radio />}
            label={op.label}
          />
        ))}
      </RadioGroup>
      {errors && errors[name] && (
        <FieldError className="mt-1 normal-case" error={errors[name].message} />
      )}
    </FormControl>
  );
}

CustomRadioGroup.propTypes = {
  value: PropTypes.string,
  name: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object,
  onChange: PropTypes.func,
  register: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
      ]),
      defaultChecked: PropTypes.bool,
    })
  ),
};

export default CustomRadioGroup;
