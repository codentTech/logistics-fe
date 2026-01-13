import PropTypes from "prop-types";

export default function FieldLabel({ label, isRequired = false, className = "" }) {
  return (
    <label
      className={`mr-1 flex min-w-fit flex-row text-xs font-medium leading-[17.5px] text-gray-600 ${className}`}
    >
      {label} {isRequired ? <span className="ml-1 text-red-600">*</span> : null}
    </label>
  );
}

FieldLabel.propTypes = {
  label: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  className: PropTypes.string,
};
