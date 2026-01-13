/* eslint-disable react/forbid-prop-types */
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import FieldError from "../field-error/field-error.component";
import FieldLabel from "../field-label/field-label.component";

export default function CustomDateField({
  register,
  name,
  control,
  errors,
  onChange,
  label,
  disablePast,
  defaultValue,
  maxDate,
  minDate,
  disabled,
}) {
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoItem label={<FieldLabel label={label} />}>
          <DatePicker
            // defaultValue={defaultValue ?? undefined}
            {...(defaultValue && { value: defaultValue })}
            name={name}
            register={register}
            disablePast={disablePast ?? false}
            control={control}
            maxDate={maxDate ?? undefined}
            minDate={minDate ?? undefined}
            disabled={disabled ?? false}
            onChange={(value) => {
              const formattedDate = value
                ? dayjs(value).format("MM/DD/YYYY")
                : null;
              onChange(formattedDate);
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "40px",
              },
            }}
          />
        </DemoItem>
      </LocalizationProvider>
      {errors && errors[name] && (
        <FieldError className="mt-1 normal-case" error={errors[name].message} />
      )}
    </div>
  );
}
CustomDateField.propTypes = {
  register: PropTypes.func,
  name: PropTypes.string,
  control: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  errors: PropTypes.objectOf(
    PropTypes.shape({
      type: PropTypes.string,
      message: PropTypes.string,
      ref: PropTypes.object,
    })
  ),
  onChange: PropTypes.func,
  label: PropTypes.string,
  disablePast: PropTypes.bool,
  defaultValue: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  disabled: PropTypes.bool,
};
