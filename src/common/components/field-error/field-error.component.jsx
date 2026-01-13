import PropTypes from "prop-types";
import FieldErrorIcon from "@/common/icons/field-error.icon";

export default function FieldError({ className = "", error = "" }) {
  return (
    <p
      className={`flex flex-row font-dm text-xs font-normal leading-[15px] text-danger ${className} items-center justify-start align-middle`}
    >
      <FieldErrorIcon className="mr-[4px]" width={12} height={12} /> {error}
    </p>
  );
}

FieldError.propTypes = {
  className: PropTypes.string,
  error: PropTypes.string,
};
