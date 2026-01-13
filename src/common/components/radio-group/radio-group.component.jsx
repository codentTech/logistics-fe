"use client";

import { FormControl, FormLabel, Radio, RadioGroup } from "@mui/material";
import PropTypes from "prop-types";

/**
 * CustomRadioGroup renders a styled radio button group with support for inline layout, form registration, and change handling.
 */
export default function CustomRadioGroup({
  radioOptions,
  name,
  register = null,
  label = null,
  defaultValue = null,
  inlineRadioButtons = false,
  onChange,
}) {
  return (
    <FormControl className="w-full">
      {label && (
        <FormLabel className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </FormLabel>
      )}
      <div
        className={`flex gap-4 ${inlineRadioButtons ? "flex-row" : "flex-col"}`}
      >
        {radioOptions?.map((option) => (
          <label
            key={option.value}
            className="flex items-center text-xs gap-1 cursor-pointer"
          >
            <input
              type="radio"
              value={defaultValue || option.value}
              {...(register && register(name))}
              className="w-4 h-4 accent-blue-600"
              name={name}
              onChange={(e) => onChange?.(e.target.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </FormControl>
  );
}

CustomRadioGroup.propTypes = {
  radioOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  label: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  name: PropTypes.string,
  register: PropTypes.func,
  inlineRadioButtons: PropTypes.bool,
  onChange: PropTypes.func,
};
