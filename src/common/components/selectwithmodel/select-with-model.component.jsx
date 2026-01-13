/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/prop-types */

import AddIcon from "@mui/icons-material/Add";
import { Autocomplete, TextField } from "@mui/material";
import Link from "next/link";
import PropTypes from "prop-types";
import SelectModealEditIcon from "@/common/icons/select-modal-edit.icon";
import SelectModalDeleteIcon from "@/common/icons/select-modal-delete.icon";
import FieldError from "@/common/components/field-error/field-error.component";
import FieldLabel from "../field-label/field-label.component";

export default function SelectWithModel({
  options,
  placeholder,
  name = null,
  onChange = null,
  defaultValue = null,
  value = null,
  className = "",
  disabled = false,
  errors = null,
  register = null,
  label = null,
  isRequired = false,
  inlineLabel = false,
  labelClassName = "",
  readOnly = false,
  popup = false,
}) {
  const renderOption = (props, option) => {
    if (option?.isModel) {
      return (
        <li
          {...props}
          key={option}
          className="flex  items-center justify-between rounded-[8px_8px_0px_0px] bg-[#1d4ed826] px-4 py-2 hover:cursor-pointer"
          onClick={() => option?.handleClick()}
        >
          <p className="text-sm font-normal not-italic leading-[17.5px] text-text-medium-gray">
            {" "}
            {option?.label}{" "}
          </p>
          <div>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_7665_164613)">
                <path
                  d="M9 0C4.0371 0 0 4.0371 0 9C0 13.9629 4.0371 18 9 18C13.9629 18 18 13.9622 18 9C18 4.0378 13.9629 0 9 0ZM9 16.6057C4.80674 16.6057 1.39426 13.194 1.39426 9C1.39426 4.80604 4.80674 1.39426 9 1.39426C13.1933 1.39426 16.6057 4.80604 16.6057 9C16.6057 13.194 13.194 16.6057 9 16.6057Z"
                  fill="#46474F"
                />
                <path
                  d="M12.4888 8.24013H9.70028V5.4516C9.70028 5.06678 9.38866 4.75446 9.00313 4.75446C8.61761 4.75446 8.30598 5.06678 8.30598 5.4516V8.24013H5.51746C5.13194 8.24013 4.82031 8.55245 4.82031 8.93728C4.82031 9.3221 5.13194 9.63442 5.51746 9.63442H8.30598V12.4229C8.30598 12.8078 8.61761 13.1201 9.00313 13.1201C9.38866 13.1201 9.70028 12.8078 9.70028 12.4229V9.63442H12.4888C12.8743 9.63442 13.186 9.3221 13.186 8.93728C13.186 8.55245 12.8743 8.24013 12.4888 8.24013Z"
                  fill="#46474F"
                />
              </g>
              <defs>
                <clipPath id="clip0_7665_164613">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </li>
      );
    }
    if (option?.isLink) {
      return (
        <li
          {...props}
          key={option}
          className="flex  items-center justify-between rounded-[8px_8px_0px_0px] bg-[#1d4ed826] px-4 py-2 hover:cursor-pointer"
          onClick={() => option?.handleClick()}
        >
          <p className="text-sm font-medium not-italic leading-[17.5px] text-text-black">
            {" "}
            {option?.label}{" "}
          </p>
          <div className="text-sm font-normal not-italic leading-[17.5px] text-primary underline">
            <div onClick={() => window.open(option?.isLink)}>Setting</div>
          </div>
        </li>
      );
    }

    if (option?.openPopup) {
      return (
        <li
          {...props}
          key={option}
          onClick={() => {}}
          className="flex  items-center justify-between  bg-primary bg-opacity-10 p-2 hover:cursor-pointer"
        >
          <div className="text-sm font-normal not-italic leading-[17.5px] ">
            {popup ? (
              <div className="flex justify-between">
                <div
                  className="flex max-w-full items-center hover:cursor-pointer"
                  onClick={() => option?.openPopup(true)}
                >
                  <AddIcon className="mr-[8px] h-5 w-5 text-dark-gray" />
                  <div className="text-dark-gray">{option?.label}</div>
                </div>
                <div className="ml-5 text-sm font-normal not-italic leading-[17.5px] text-primary underline">
                  <div
                    onClick={() => {
                      window.open("/setting/general-setting", "_blank");
                      option?.openPopup(false);
                    }}
                  >
                    Setting
                  </div>
                </div>
              </div>
            ) : (
              "Setting"
            )}
          </div>
        </li>
      );
    }

    if (option?.openUnitPopup) {
      return (
        <li
          {...props}
          key={option}
          onClick={() => {}}
          className="flex  items-center justify-between  bg-primary bg-opacity-10 p-2 hover:cursor-pointer"
        >
          {!popup && (
            <p className="text-sm font-medium not-italic leading-[17.5px] text-text-black">
              {" "}
              {option?.label}{" "}
            </p>
          )}
          <div className="text-sm font-normal not-italic leading-[17.5px] ">
            {popup ? (
              <div className="flex justify-between">
                <div
                  className="flex max-w-full items-center hover:cursor-pointer"
                  onClick={() => option?.openUnitPopup(true)}
                >
                  <AddIcon className="mr-[8px] h-5 w-5 text-dark-gray" />
                  <div className="text-dark-gray">{option?.label}</div>
                </div>
                <div className="ml-[45px] text-sm font-normal not-italic leading-[17.5px] text-primary underline">
                  <div
                    onClick={() => {
                      window.open("/setting/general-setting", "_blank");
                      option?.openUnitPopup(false);
                    }}
                  >
                    Setting
                  </div>
                </div>
              </div>
            ) : (
              "Setting"
            )}
          </div>
        </li>
      );
    }

    return (
      <li {...props} key={option?.label}>
        <div className="flex w-full items-center justify-between">
          <p>{option?.label}</p>
          <div className="flex items-center gap-2">
            {option?.editClick && (
              <div onClick={() => option?.editClick()}>
                <SelectModealEditIcon />
              </div>
            )}
            {option?.deleteClick && (
              <div onClick={() => option?.deleteClick()}>
                <SelectModalDeleteIcon />
              </div>
            )}
          </div>
        </div>
      </li>
    );
  };
  return (
    <div
      className={`${
        inlineLabel
          ? " grid w-full grid-cols-[130px_1fr] items-center"
          : "flex w-full flex-col gap-2 text-xs font-medium capitalize not-italic leading-6 text-text-black"
      }`}
    >
      {label && (
        <FieldLabel
          label={label}
          isRequired={isRequired}
          className={labelClassName}
        />
      )}

      <div className={`w-full ${disabled ? "bg-[#BBBBBB26]" : ""}`}>
        <Autocomplete
          {...(register && register(`${name}`))}
          name={name}
          disablePortal
          sx={{
            "& .MuiOutlinedInput-root": {
              paddingLeft: "0px!important",
            },
          }}
          // disableClearable
          options={options ?? []}
          getOptionLabel={(option) => option.label.toString()}
          renderOption={renderOption}
          className={`select !p-0 ${className}    `}
          disabled={disabled}
          readOnly={readOnly}
          {...(value && { value })}
          {...(onChange && { onChange })}
          defaultValue={defaultValue}
          isOptionEqualToValue={(option, valuee) =>
            option && option.label === valuee && valuee.label
          }
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                style: {
                  fontSize: 14,
                  borderColor: errors && errors[name] ? "red" : "",
                },
              }}
              {...(register && register(name))}
              className={`default-input input-field !p-0 !text-[14px]  ${
                disabled ? "disabled-input " : ""
              }`}
              placeholder={placeholder}
            />
          )}
        />

        {errors && errors[name] && (
          <FieldError className="mt-1" error={errors[name].message} />
        )}
      </div>
    </div>
  );
}

SelectWithModel.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired, // label should be unique because by default mui use label as key
      value: PropTypes.any,
      //   Besides label we can send anything in the object, onChange value will give us the whole object
    })
  ).isRequired,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  defaultValue: PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  value: PropTypes.any,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  register: PropTypes.func,

  errors: PropTypes.object,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  inlineLabel: PropTypes.bool,
  labelClassName: PropTypes.string,
  readOnly: PropTypes.bool,
};
