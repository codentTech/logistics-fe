import PropTypes from 'prop-types';

/**
 * @param className will accept the css classes
 * @returns functional component of SVG icon
 */

export default function ArrowUpIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={`${className}`}
    >
      <path
        className="noCloseOptions"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 15.75l7.5-7.5 7.5 7.5"
      />
    </svg>
  );
}

ArrowUpIcon.propTypes = {
  className: PropTypes.string
};
