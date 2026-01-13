import React, { useState } from "react";
import PropTypes from "prop-types";

export default function ReadMore({
  size = 150,
  text,
  firstStyling,
  secondStyling,
  maxLength = 190,
}) {
  const [isReadMore, setIsReadMore] = useState(true);

  return (
    <div>
      <p className={`${firstStyling || "font-dm text-xs font-normal leading-5 text-gray-600"}`}>
        {isReadMore ? text.slice(0, size) : text}{" "}
        {size < maxLength && (
          <span
            onClick={() => setIsReadMore(!isReadMore)}
            className={`cursor-pointer ${
              secondStyling || "text-primary font-dm text-xs font-medium leading-5 "
            }`}
          >
            {isReadMore ? "Read more..." : " Show less"}
          </span>
        )}
      </p>
    </div>
  );
}

ReadMore.propTypes = {
  size: PropTypes.number,
  text: PropTypes.string,
  firstStyling: PropTypes.string,
  secondStyling: PropTypes.string,
  maxLength: PropTypes.number,
};
