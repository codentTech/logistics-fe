/* eslint-disable react/forbid-prop-types */
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import PropTypes from "prop-types";
import useMultiSelect from "./use-multi-select.hook";
import ArrowDownIcon from "@/common/icons/arrow-down.icon";
import ArrowUpIcon from "@/common/icons/arrow-up.icon";

/**
 * @param options will take array of objects that will be listed
 * @returns
 */

export default function MultiSelect({
  options,
  handleChange,
  placeholder = "Select Option(s)",
  search = true,
  isClearable = true,
  maxDisplayOptions = 4,
  defaultOptions = null,
  addClickHandler = null,
  readOnly = false,
}) {
  const {
    open,
    setOpen,
    selectedOptions,
    filteredOptions,
    ref,
    toggleDropDown,
    getPlaceholder,
    isSelectedClass,
    optionClickHandler,
    removeOptionHandler,
    clearAllClickHandler,
    handleInputChangeHandler,
    isSearching,
  } = useMultiSelect(options, handleChange, defaultOptions, search, readOnly);

  const renderOptions = (options) => {
    return options?.map((option, index) => (
      <div
        key={option?.id}
        className={`noCloseOptions w-full cursor-pointer border-[#E2E2E2] hover:bg-[#E2E2E2] hover:bg-opacity-50 ${isSelectedClass(
          option
        )} ${index !== 0 ? "border-t" : ""}`}
        onClick={() => optionClickHandler(option)}
      >
        <div className="noCloseOptions relative flex w-full items-center border-l-2 border-transparent p-2 pl-2 hover:border-[#E2E2E2]">
          <div className="noCloseOptions flex w-full items-center">
            <div className="noCloseOptions mx-2 leading-6">{option?.label}</div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex w-full">
      <div className="w-full">
        <div className="relative flex flex-col items-center">
          <div className="w-full">
            <div className="mb-2 flex min-h-[40px] rounded border border-text-ultra-light-gray bg-white pr-1 hover:border-[#7e7d7d]">
              <div className="flex flex-auto flex-wrap">
                {selectedOptions?.map((option, index) => {
                  if (index < maxDisplayOptions) {
                    return (
                      <div
                        key={option?.id}
                        className={`m-1 ${
                          index < 0 ? "mx-[16px]" : " "
                        }  my-[9px] flex items-center justify-center rounded-full border border-[#BBBBBB] border-opacity-20 bg-[#D9D9D9] px-[11px] font-medium text-[#46474F]`}
                      >
                        <div className="mr-[8px] max-w-full flex-initial text-[14px] font-normal leading-none">
                          {option?.label}
                        </div>
                        {!readOnly && (
                          <div
                            className="flex flex-auto flex-row-reverse"
                            onClick={() => removeOptionHandler(option)}
                          >
                            <ClearIcon className="-mr-1 h-5 w-5 text-[#46474F] hover:cursor-pointer hover:text-gray-700" />
                          </div>
                        )}
                      </div>
                    );
                  }
                  return "";
                })}
                {selectedOptions?.length > maxDisplayOptions && (
                  <div className="flex m-1 items-center justify-center rounded-full border border-[#E2E2E2] border-opacity-20 bg-[#E2E2E2] px-2 py-1 font-medium text-[#46474F]">
                    <div className="flex max-w-full items-center justify-center text-xs font-normal leading-none">
                      <AddIcon className="h-3 w-3" />
                      {selectedOptions.length - maxDisplayOptions} more
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    ref={ref}
                    placeholder={getPlaceholder(placeholder)}
                    className="click-text h-full w-full appearance-none bg-transparent px-[16px] py-[8px] text-[#46474F] outline-none placeholder:text-sm placeholder:font-normal placeholder:leading-[18px] placeholder:text-text-ultra-light-gray"
                    onClick={toggleDropDown}
                    onChange={handleInputChangeHandler}
                    readOnly={readOnly}
                  />
                </div>
              </div>
              <div className="flex items-center pl-2 text-gray-300">
                {!readOnly && isClearable && selectedOptions?.length > 1 && (
                  <div onClick={clearAllClickHandler}>
                    <ClearIcon className="mr-1 h-5 w-5 text-gray-400 hover:cursor-pointer hover:text-gray-700" />
                  </div>
                )}
                <div className="-mr-1 h-full border-l border-gray-200">
                  <button
                    type="button"
                    className="noCloseOptions ml-1 h-full w-6 cursor-pointer text-gray-600 outline-none focus:outline-none"
                    onClick={toggleDropDown}
                    onBlur={() => {
                      if (open) setOpen(false);
                    }}
                  >
                    {open && (
                      <ArrowUpIcon className="noCloseOptions -mr-3 h-5 w-5 text-gray-400" />
                    )}
                    {!open && (
                      <ArrowDownIcon className="noCloseOptions -mr-3 h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {open && (
            <div className=" w-full  rounded bg-[#FCFCFC] text-[#46474F] shadow">
              <div className="flex max-h-[200px] w-full flex-col overflow-y-auto">
                {addClickHandler && (
                  <div
                    className="flex max-w-full items-center bg-primary bg-opacity-10 p-2 hover:cursor-pointer"
                    onClick={addClickHandler}
                  >
                    <AddIcon className="mr-[8px] h-5 w-5 text-[#46474F]" />
                    <div className="">Create New Group</div>
                  </div>
                )}
                {filteredOptions && isSearching
                  ? renderOptions(filteredOptions)
                  : renderOptions(options)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const optionShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
});

MultiSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleChange: PropTypes.func.isRequired,
  addClickHandler: PropTypes.func,
  placeholder: PropTypes.string,
  search: PropTypes.bool,
  isClearable: PropTypes.bool,
  maxDisplayOptions: PropTypes.number,
  defaultOptions: PropTypes.arrayOf(optionShape),
  readOnly: PropTypes.bool,
};
