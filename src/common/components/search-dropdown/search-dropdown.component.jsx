import React from "react";
import PropTypes from "prop-types";
import useSearchableDropdown from "./use-search-dropdown.hook";
import SearchIcon from "@/common/icons/search-icon";
import CustomInput from "../custom-input/custom-input.component";

function SearchableDropDown({
  columns,
  setSearchText,
  selectedColumn,
  setSelectedColumn,
}) {
  const { ref, open, setOpen, handleSearch, handleSearchFilter } =
    useSearchableDropdown({
      setSearchText,
      setSelectedColumn,
    });

  const allColumnOption = { headerName: "All", field: "all" };
  let columnsWithAllOption = [];

  if (columns?.length > 0) {
    columnsWithAllOption = [allColumnOption, ...columns];
  } else {
    columnsWithAllOption = [allColumnOption];
  }

  return (
    <div className="relative h-fit w-full  bg-white">
      <CustomInput
        placeholder="Search"
        type="text"
        onChange={handleSearch}
        className="relative"
        startIcon={<SearchIcon />}
      />
      {/* <div
        className=" absolute bottom-[0.6rem] right-[5.6px] flex cursor-pointer  items-center gap-[6px]"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2 ">
          <div className="text-[#BBBBBB]">| </div>
          <div className="text-[10px] font-normal leading-[15px]">
            {selectedColumn || 'All'}
          </div>
        </div>
        <div>
          <img src="/assets/icons/arrow-drop.svg" alt="" height="4.81" width="8.01px" />
        </div>
      </div> */}

      {open && (
        <div
          ref={ref}
          className="width-[257px] absolute right-[0px] top-[48px] z-[100] flex flex-col gap-[11px] bg-white p-2.5 shadow-2xl"
        >
          {columnsWithAllOption &&
            columnsWithAllOption
              .filter((col) => col.field !== "actions")
              .map((col) => (
                <div key={col.field} className="flex gap-2">
                  <input
                    id={col.headerName}
                    type="checkbox"
                    className="unchecked:bg-[url('/assets/images/unchecked.svg')] h-4 w-4 appearance-none rounded-sm border border-gray-300 bg-cover checked:bg-[url('/assets/images/checked.svg')]"
                    onChange={(e) => handleSearchFilter(e, col.field)}
                    checked={selectedColumn === col.field}
                  />
                  <label
                    className="font-dm text-xs font-medium not-italic leading-[18px] text-[#2C2E3E]"
                    htmlFor={col.headerName}
                  >
                    {col.headerName}
                  </label>
                </div>
              ))}
        </div>
      )}
    </div>
  );
}
SearchableDropDown.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string,
      headerName: PropTypes.string,
    })
  ),
  setSearchText: PropTypes.func,
  selectedColumn: PropTypes.string,
  setSelectedColumn: PropTypes.func,
};
export default SearchableDropDown;
