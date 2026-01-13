"use client";

import React from "react";
import PropTypes from "prop-types";

export default function TableFilterTabs({ filteropions, action }) {
  return (
    <div className="mx-5 flex items-center gap-6 border-b-2 border-solid border-disabled-input">
      {filteropions.map((item) => {
        return (
          <div key={item.id}>
            <input
              className="table_filter_radio hidden"
              type="radio"
              name={item.name}
              id={item.label}
              value={item.label}
              onClick={action(item)}
            />
            <label
              className="inline-block translate-y-[2px] border-green-600 border-b-[1] p-2 font-dm text-sm font-normal leading-5 text-text-medium-gray hover:cursor-pointer hover:text-green-600"
              for={item.label}
            >
              {item.label}
            </label>
          </div>
        );
      })}
    </div>
  );
}
TableFilterTabs.propTypes = {
  filteropions: PropTypes.arrayOf(),
  action: PropTypes.func,
};
