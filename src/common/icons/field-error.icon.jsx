import PropTypes from 'prop-types';

/**
 * @param fillColor will accept the color code in hex that fill the color inside icon
 * @param className will accept the css classes
 * @param width will accept the width of the icon
 * @param height will accept the height of the icon
 * @returns functional component of SVG icon
 */
export default function FieldErrorIcon({
  fillColor = '#EF2020',
  className = '',
  width = 10,
  height = 10
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 10 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}`}
    >
      <path
        d="M5 0.5C2.2365 0.5 0 2.73625 0 5.5C0 8.26346 2.23625 10.5 5 10.5C7.7635 10.5 10 8.26375 10 5.5C10 2.73654 7.76375 0.5 5 0.5ZM5.51346 7.48479C5.51346 7.64275 5.28311 7.80068 5.0001 7.80068C4.70393 7.80068 4.49334 7.64275 4.49334 7.48479V4.97723C4.49334 4.79295 4.70395 4.66787 5.0001 4.66787C5.28311 4.66787 5.51346 4.79295 5.51346 4.97723V7.48479ZM5.00012 4.06242C4.69736 4.06242 4.46045 3.83865 4.46045 3.58854C4.46045 3.33844 4.69738 3.12125 5.00012 3.12125C5.29629 3.12125 5.53324 3.33844 5.53324 3.58854C5.53324 3.83865 5.29627 4.06242 5.00012 4.06242Z"
        fill={fillColor}
      />
    </svg>
  );
}

FieldErrorIcon.propTypes = {
  fillColor: PropTypes.string,
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
};
