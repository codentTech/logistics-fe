/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import PropTypes from "prop-types";
import { LINE_ITEM_MAIN_HEADING } from "@/common/constants/document.constants";
import formatAmount from "@/common/utils/fomate-amount";
import {
  invoiceAmountWithOutVAT,
  invoiceAmountWithVAT,
  lineItemNetAmount,
  plusVat,
} from "@/common/utils/product-calculations/amount-calculations";
import removePercentageSign from "@/common/utils/product-calculations/remove-percentage-sign";
import CustomInput from "../custom-input/custom-input.component";
import SimpleSelect from "../dropdowns/simple-select/simple-select";
import TextArea from "../text-area/text-area.component";
import useLineItemTable from "./use-line-item-table.hook";

function LineItemTable({
  data,
  mergedData,
  allCheckboxHandler,
  columns,
  isIdAdded,
  checkBoxHandler,
  handleEditableFeilds,
  ids,
  handleActionClick,
  handleDuplicate,
  handleRemove,
  selectedTaxRate,
  defaultTaxRate,
  unitsOptions,
  taxRateOptions,
  handleTaxRate,
  handleUnits,
  theDiscount,
  handleSelectedDiscountGroup,
  headingIndex,
  style,
  selectedItemRow,
  lineItemIndexing,
  selectedField,
  handleEditableFeildsInput,
  handleShowStyling,
  showStyle,
  handleStyling,
  selectedRow,
  openPP,
  ppToggle,
  handlePurchasePriceInput,
  handleNoticeInput,
  showHeadingInput,
  inputRef,
  handleAddNewHeadingInput,
  errorMessage,
  toggleSwitch,
  setEditDescription,
  setLineItemIndexing,
}) {
  const {
    inputFocus1,
    setinputFocus1,
    setinputFocus2,
    inputRef1,
    inputRef2,
    inputFocus3,
    setinputFocus3,
    inputRef3,
    inputRef4,
    setinputFocus4,
    showEditableFields,
    setinputFocus5,
    inputRef5,
  } = useLineItemTable(setLineItemIndexing);

  return (
    <div className="w-full overflow-x-auto px-4">
      <div className="rounder-[10px] border border-solid border-disabled-input">
        <table className="... mt-[-2px] w-full min-w-[800px] border-collapse rounded-[20px_0px_0px_0px] ">
          <thead>
            <tr>
              <th className="rounded-t-lg border-b border-solid border-b-[#E7EAEE] bg-[#E7EAEE] px-2 py-4 text-start text-sm font-normal not-italic leading-[18px] text-text-black">
                <input
                  id="test"
                  type="checkbox"
                  checked={data?.length > 0 && data?.length === ids.length}
                  onChange={allCheckboxHandler}
                  className={` h-4 w-4 appearance-none rounded-sm border border-solid border-[#909090] bg-center bg-no-repeat ${
                    data.length === ids.length && data?.length > 0
                      ? "bg-primary checked:bg-tick"
                      : null
                  }`}
                />
                <label htmlFor="test" />
              </th>
              {columns?.map((col) => {
                return (
                  <th
                    className={`... w-[${col.width}] rounded-t-lg  border-b border-solid border-b-[#E7EAEE] bg-[#E7EAEE] px-2 py-4 text-left text-sm font-normal not-italic leading-[17.5px] text-text-black`}
                    key={col.field}
                    style={{ width: col.width }}
                  >
                    <div className="flex w-fit items-center gap-2 whitespace-nowrap">
                      {col.headerName}
                      {col.field === "pp" ? (
                        <img src="/assets/icons/Frame.svg" alt="" id="add-pp" />
                      ) : col.field === "netPrice" ||
                        col.field === "totalPrice" ? (
                        <svg
                          width="
                  10.33px"
                          height="11.19px"
                          viewBox="0 0 15 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.3427 12.9998C12.3976 13.994 11.1875 14.5416 9.93536 14.5416C7.8831 14.5416 6.10613 13.1004 5.26983 11.0171H10.9704C11.4647 11.0171 11.8654 10.6163 11.8654 10.122C11.8654 9.62769 11.4647 9.22691 10.9704 9.22691H4.81496C4.77896 8.92989 4.76079 8.63098 4.76054 8.33179C4.76054 7.98891 4.78468 7.6528 4.82972 7.32479H10.9704C11.4647 7.32479 11.8654 6.92402 11.8654 6.42971C11.8654 5.93539 11.4647 5.53458 10.9704 5.53458H5.31745C6.17168 3.5123 7.92026 2.12202 9.93536 2.12202C11.1875 2.12202 12.3976 2.66964 13.3427 3.66367C13.6829 4.02174 14.2492 4.03645 14.608 3.6959C14.9664 3.35521 14.9806 2.78866 14.6404 2.4304C13.3541 1.07723 11.6832 0.332031 9.93559 0.332031C6.95152 0.332031 4.40073 2.49931 3.41089 5.53484H1.01227C0.517961 5.53484 0.117188 5.93562 0.117188 6.42993C0.117188 6.92424 0.517961 7.32501 1.01227 7.32501H3.02734C2.99107 7.65532 2.97033 7.99076 2.97033 8.33201C2.97033 8.63488 2.98616 8.93299 3.01511 9.22713H1.01227C0.517961 9.22713 0.117188 9.62791 0.117188 10.1222C0.117188 10.6165 0.517961 11.0173 1.01227 11.0173H3.37536C4.33821 14.1115 6.91477 16.332 9.93536 16.332C11.6832 16.332 13.3536 15.5866 14.6399 14.2337C14.9803 13.8753 14.9664 13.3088 14.6078 12.9682C14.2496 12.6275 13.6829 12.6417 13.3427 12.9998Z"
                            fill="#7E7D7D"
                          />
                        </svg>
                      ) : null}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          {Object?.keys(mergedData)?.map((key, ind) => {
            return mergedData[key]?.product?.map((row, pIndex) => {
              const uniqueIndex = Number(`${ind}${pIndex}`);
              const data_id = isIdAdded(uniqueIndex);
              return (
                <>
                  {row.productName !== LINE_ITEM_MAIN_HEADING && (
                    <tr key={uniqueIndex} className="align-top ">
                      <td className="border-b border-solid border-b-[#E7EAEE] px-2 py-4 text-start">
                        <input
                          id="test"
                          type="checkbox"
                          checked={data_id}
                          value={uniqueIndex}
                          onChange={(e) => checkBoxHandler(e, row)}
                          className={` ${
                            lineItemIndexing === uniqueIndex &&
                            showEditableFields
                              ? "mt-[10px]"
                              : ""
                          } h-4 w-4 appearance-none rounded-sm border border-solid border-[1px_solid_lightgray] bg-center bg-no-repeat ${
                            data.length > 0 && ids.includes(uniqueIndex)
                              ? "bg-primary checked:bg-tick"
                              : null
                          }`}
                        />
                        <label htmlFor="test" />
                      </td>
                      {columns?.map((column) => {
                        return (
                          <td
                            className={`border-b border-solid border-b-[#E7EAEE] px-2 py-4 text-start text-xs font-normal leading-[18px] w-[${column.width}]`}
                            key={column.field}
                            style={{ width: column.width }}
                          >
                            {row[column.field] === "pp-icon" ? (
                              <div
                                className={` ${
                                  lineItemIndexing === uniqueIndex &&
                                  showEditableFields
                                    ? "mt-[10px]"
                                    : ""
                                } mt-[10px] flex w-fit justify-center text-start hover:cursor-pointer`}
                              >
                                <img
                                  src={
                                    ppToggle &&
                                    selectedRow &&
                                    selectedRow.id === row.id &&
                                    openPP === uniqueIndex
                                      ? "/assets/icons/add-pp.blue.svg"
                                      : "/assets/icons/add-pp-gray.svg"
                                  }
                                  alt=""
                                  width="16px"
                                  height="16px"
                                  onClick={() =>
                                    handleActionClick(row, uniqueIndex)
                                  }
                                />
                              </div>
                            ) : row[column.field] === "action" ? (
                              <div
                                className={` ${
                                  lineItemIndexing === uniqueIndex &&
                                  showEditableFields
                                    ? "mt-[10px]"
                                    : ""
                                } mt-[10px] flex gap-[27px] text-start`}
                              >
                                <img
                                  onClick={() => handleDuplicate(row)}
                                  src="/assets/icons/delete.red.svg"
                                  alt=""
                                  width="13.47px"
                                  height="16px"
                                  className="hover:cursor-pointer"
                                />
                                <img
                                  onClick={() => handleRemove(row, ind)}
                                  src="/assets/icons/copy.svg"
                                  alt=""
                                  width="14.06px"
                                  height="16px"
                                  className="hover:cursor-pointer"
                                />
                              </div>
                            ) : row[column.field] === "taxRateDropdown" ? (
                              <SimpleSelect
                                isSearchable
                                className="!mt-2"
                                placeHolder={`${
                                  row.taxRate ||
                                  (selectedTaxRate &&
                                    removePercentageSign(
                                      selectedTaxRate.label
                                    )) ||
                                  (defaultTaxRate && defaultTaxRate.taxRate)
                                } %`}
                                options={taxRateOptions}
                                onChange={(value) =>
                                  handleTaxRate({ row, value, uniqueIndex })
                                }
                              />
                            ) : row[column.field] === "unitDropdown" ? (
                              <SimpleSelect
                                isSearchable
                                placeHolder={row.unit || "Select"}
                                options={unitsOptions}
                                className="!mt-2"
                                onChange={(value) =>
                                  handleUnits({ row, value, uniqueIndex })
                                }
                              />
                            ) : row[column.field] === "discount" ? (
                              <SimpleSelect
                                isSearchable
                                placeHolder="Select"
                                className=" !mt-2"
                                options={row?.discountGroups?.map((group) => ({
                                  value:
                                    (group.ProductDiscountGroup &&
                                      group.ProductDiscountGroup.discount) ||
                                    (group.ProductDiscountGroup &&
                                      group.ProductDiscountGroup.disco) ||
                                    (group.ProductDiscountGroup &&
                                      group.ProductDiscountGroup.dis) ||
                                    group.ProductDiscount,
                                  label:
                                    (group.ProductDiscountGroup &&
                                      group.ProductDiscountGroup.discount) ||
                                    (group.ProductDiscountGroup &&
                                      group.ProductDiscountGroup.disco) ||
                                    (group.ProductDiscountGroup &&
                                      group.ProductDiscountGroup.dis) ||
                                    group.ProductDiscount,
                                }))}
                                defaultValue={
                                  theDiscount ||
                                  (row?.discountGroups &&
                                    row?.discountGroups[0]?.ProductDiscountGroup
                                      ?.discount) ||
                                  (row?.discountGroups &&
                                    row?.discountGroups[0]?.ProductDiscountGroup
                                      ?.disco) ||
                                  (row?.discountGroups &&
                                    row?.discountGroups[0]?.ProductDiscountGroup
                                      ?.dis) ||
                                  (row?.discountGroups &&
                                    row?.discountGroups[0]
                                      ?.ProductDiscountGro) ||
                                  "0"
                                }
                                onChange={(e, value) =>
                                  handleSelectedDiscountGroup(e, value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault(); // Prevent form submission
                                  }
                                }}
                              />
                            ) : row.id ? (
                              column.field === "totalPrice" ? (
                                <div className="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-colorPrimary MuiInputBase-adornedStart MuiInputBase-adornedEnd input-field  default-input null true css-q0jhri-MuiInputBase-root-MuiInput-root !m-0     whitespace-nowrap !border-none !p-0 px-[16px] !pr-2 text-sm font-normal not-italic leading-[18px]  text-text-ultra-light-gray  hover:border-text-dark-gray">
                                  {formatAmount(row[column.field])}
                                </div>
                              ) : (
                                <div className="inline-block w-full">
                                  {column.field === "productName" ? (
                                    <div className="flex flex-col gap-2  text-left">
                                      <div className="text-sm font-medium not-italic leading-[17.5px] text-text-dark-gray">
                                        {lineItemIndexing === uniqueIndex &&
                                        showEditableFields ? (
                                          <CustomInput
                                            type={column.type}
                                            name={column.field}
                                            customRef={inputRef1}
                                            defaultValue={row[column.field]}
                                            placeholder={column.headerName}
                                            onClick={() =>
                                              handleEditableFeilds(
                                                row,
                                                column.field,
                                                uniqueIndex
                                              )
                                            }
                                            onChange={(event) =>
                                              handleEditableFeildsInput({
                                                event,
                                                row,
                                                uniqueIndex,
                                              })
                                            }
                                          />
                                        ) : (
                                          <div
                                            id="productName"
                                            onClick={() =>
                                              handleEditableFeilds(
                                                row,
                                                column.field,
                                                uniqueIndex,
                                                setinputFocus1
                                              )
                                            }
                                            className="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-colorPrimary MuiInputBase-adornedStart MuiInputBase-adornedEnd  input-field default-input null true css-q0jhri-MuiInputBase-root-MuiInput-root     !m-0 !border-none !p-0 px-[16px] !pr-2 text-sm font-normal not-italic leading-[18px]  text-text-ultra-light-gray  hover:border-text-dark-gray"
                                          >
                                            {row.productName || "---"}
                                          </div>
                                        )}
                                      </div>

                                      {lineItemIndexing === uniqueIndex &&
                                      showEditableFields ? (
                                        <div>
                                          <TextArea
                                            type={column.type}
                                            name="description"
                                            customRef={inputRef4}
                                            defaultValue={row.description}
                                            placeholder="Description"
                                            onClick={() =>
                                              handleEditableFeilds(
                                                row,
                                                column.field,
                                                uniqueIndex
                                              )
                                            }
                                            onChange={(event) =>
                                              handleEditableFeildsInput({
                                                event,
                                                row,
                                                uniqueIndex,
                                              })
                                            }
                                          />
                                        </div>
                                      ) : (
                                        <div
                                          id="description"
                                          className="w-full whitespace-pre-line pl-2 text-xs font-normal not-italic leading-[18px] text-text-medium-gray"
                                          onClick={() => {
                                            setEditDescription(true);
                                            column.edit &&
                                              handleEditableFeilds(
                                                row,
                                                "description",
                                                uniqueIndex,
                                                setinputFocus4
                                              );
                                          }}
                                        >
                                          {row.description || "---"}
                                        </div>
                                      )}
                                    </div>
                                  ) : column.field === "netPrice" ? (
                                    <div>
                                      {lineItemIndexing === uniqueIndex &&
                                      showEditableFields ? (
                                        <CustomInput
                                          type={column.type}
                                          name={column.field}
                                          customRef={inputRef2}
                                          defaultValue={row[column.field]}
                                          placeholder={column.headerName}
                                          // endIcon={<EuroIcon />}
                                          onClick={() =>
                                            handleEditableFeilds(
                                              row,
                                              column.field,
                                              uniqueIndex
                                            )
                                          }
                                          onChange={(event) =>
                                            handleEditableFeildsInput({
                                              event,
                                              row,
                                              uniqueIndex,
                                            })
                                          }
                                        />
                                      ) : (
                                        <div
                                          id={column.field}
                                          key={column.field}
                                          onClick={() => {
                                            handleEditableFeilds(
                                              row,
                                              column.field,
                                              uniqueIndex,
                                              setinputFocus2
                                            );
                                          }}
                                          className="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-colorPrimary MuiInputBase-adornedStart MuiInputBase-adornedEnd input-field  default-input null true css-q0jhri-MuiInputBase-root-MuiInput-root !m-0     whitespace-nowrap !border-none !p-0 px-[16px] !pr-2 text-sm font-normal not-italic leading-[18px]  text-text-ultra-light-gray  hover:border-text-dark-gray"
                                        >
                                          {formatAmount(row[column.field]) ||
                                            "---"}
                                        </div>
                                      )}
                                    </div>
                                  ) : column.field === "quantity" ? (
                                    <div>
                                      {lineItemIndexing === uniqueIndex &&
                                      showEditableFields ? (
                                        <CustomInput
                                          type={column.type}
                                          name={column.field}
                                          customRef={inputRef3}
                                          defaultValue={row[column.field]}
                                          placeholder={column.headerName}
                                          onClick={() =>
                                            handleEditableFeilds(
                                              row,
                                              column.field,
                                              uniqueIndex
                                            )
                                          }
                                          onChange={(event) =>
                                            handleEditableFeildsInput({
                                              event,
                                              row,
                                              uniqueIndex,
                                            })
                                          }
                                        />
                                      ) : (
                                        <div
                                          id={column.field}
                                          className="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-colorPrimary MuiInputBase-adornedStart MuiInputBase-adornedEnd input-field  default-input null true css-q0jhri-MuiInputBase-root-MuiInput-root !m-0     whitespace-nowrap !border-none !p-0 px-[16px] !pr-2 text-sm font-normal not-italic leading-[18px]  text-text-ultra-light-gray  hover:border-text-dark-gray"
                                          onClick={(e) => {
                                            column.edit &&
                                              handleEditableFeilds(
                                                row,
                                                column.field,
                                                uniqueIndex,
                                                setinputFocus3
                                              );
                                          }}
                                        >
                                          {row[column.field] || "---"}
                                        </div>
                                      )}
                                    </div>
                                  ) : column.field === "positionNo" ? (
                                    <div>
                                      {lineItemIndexing === uniqueIndex &&
                                      showEditableFields ? (
                                        <CustomInput
                                          type={column.type}
                                          name={column.field}
                                          customRef={inputRef5}
                                          defaultValue={row[column.field]}
                                          placeholder={column.headerName}
                                          onClick={() =>
                                            handleEditableFeilds(
                                              row,
                                              column.field,
                                              uniqueIndex
                                            )
                                          }
                                          onChange={(event) =>
                                            handleEditableFeildsInput({
                                              event,
                                              row,
                                              uniqueIndex,
                                            })
                                          }
                                        />
                                      ) : (
                                        <div
                                          id={column.field}
                                          className="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-colorPrimary MuiInputBase-adornedStart MuiInputBase-adornedEnd input-field  default-input null true css-q0jhri-MuiInputBase-root-MuiInput-root !m-0     whitespace-nowrap !border-none !p-0 px-[16px] !pr-2 text-sm font-normal not-italic leading-[18px]  text-text-ultra-light-gray  hover:border-text-dark-gray"
                                          onClick={(e) => {
                                            column.edit &&
                                              handleEditableFeilds(
                                                row,
                                                column.field,
                                                uniqueIndex,
                                                setinputFocus5
                                              );
                                          }}
                                        >
                                          {row[column.field] || "---"}
                                        </div>
                                      )}
                                    </div>
                                  ) : null}
                                </div>
                              )
                            ) : (
                              <div
                                className={`relative text-ellipsis whitespace-nowrap text-xs font-medium leading-[17.5px] ${
                                  headingIndex === uniqueIndex ? style : null
                                }`}
                                onClick={() => handleShowStyling(uniqueIndex)}
                              >
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: row[column.field],
                                  }}
                                />
                                {row[column.field] &&
                                showStyle &&
                                headingIndex === uniqueIndex &&
                                row.productName ? (
                                  <div className="absolute bottom-[23px] flex  justify-between gap-3 rounded-[10px] bg-white px-4 py-1 text-black">
                                    <div
                                      className="rounded-[10px] px-2 font-[bold] hover:bg-[#E7EAEE]"
                                      onClick={() => handleStyling("b", row)}
                                    >
                                      B
                                    </div>
                                    <div
                                      className="rounded-[10px] px-2 italic hover:bg-[#E7EAEE]"
                                      onClick={() => handleStyling("i", row)}
                                    >
                                      i
                                    </div>
                                    <div
                                      className="rounded-[10px] px-2 underline hover:bg-[#E7EAEE]"
                                      onClick={() => handleStyling("u", row)}
                                    >
                                      U
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  )}
                  {selectedRow &&
                    selectedRow.id === row.id &&
                    openPP === uniqueIndex && (
                      <tr className="h-[88px] w-full  bg-[#FBFBFB]">
                        <td colSpan={columns.length + 1}>
                          <div className="grid grid-cols-[316px_1fr] items-center gap-[24px] ">
                            <div className="flex flex-col border-r border-solid border-r-[#E7EAEE] px-2 py-4">
                              <CustomInput
                                id="purchasePrice-input"
                                type="number"
                                name="purchasePrice"
                                label="Purchase Price"
                                placeholder="Enter Purchasing Price"
                                defaultValue={row.purchasePrice}
                                onChange={(e) =>
                                  handlePurchasePriceInput(e, row.productIndex)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault(); // Prevent form submission
                                  }
                                }}
                              />
                            </div>
                            <div className="px-2 py-4">
                              <CustomInput
                                id="notice-input"
                                label="Notice"
                                type="text"
                                name="notice"
                                placeholder="Enter Notes"
                                defaultValue={row.notice}
                                onChange={(e) =>
                                  handleNoticeInput(e, row.productIndex)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault(); // Prevent form submission
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                </>
              );
            });
          })}
        </table>

        {showHeadingInput && (
          <div className="mt-2 px-2 ">
            <CustomInput
              customRef={inputRef}
              type="text"
              name={style}
              placeholder="Add Heading"
              onKeyDown={(e) => handleAddNewHeadingInput(e, headingIndex)}
              className="rounded-[6px] border border-solid border-disabled-input bg-[rgba(126,125,125,0.06)] px-4 py-2 text-sm font-normal leading-[17.5px]  hover:cursor-pointer "
            />
          </div>
        )}

        {errorMessage && (
          <div className="mt-2 px-2">
            <div className="w-full rounded-[6px] text-sm font-normal leading-[17.5px] text-[red] ">
              {errorMessage}
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-col justify-between gap-3 rounded-[0_0_20px_20px] bg-[#FBFBFB] px-5 py-4">
          <div className="flex justify-between">
            <div className="text-sm font-normal leading-[17.5px]">
              Net Amount
            </div>
            <div className="text-start text-sm font-normal leading-[17.5px]">
              {formatAmount(lineItemNetAmount(data))}
            </div>
          </div>
          {toggleSwitch && (
            <>
              <div className="flex justify-between">
                <div className="text-sm font-normal leading-[17.5px]">
                  Plus VAT
                </div>
                <div className="text-start text-sm font-normal leading-[17.5px]">
                  {formatAmount(plusVat(data))}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm font-normal leading-[17.5px]">
                  Invoice Amount
                </div>
                <div className="text-start text-sm font-normal leading-[17.5px]">
                  {" "}
                  {toggleSwitch
                    ? formatAmount(invoiceAmountWithVAT(data))
                    : formatAmount(invoiceAmountWithOutVAT(data))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

LineItemTable.propTypes = {
  data: PropTypes.string,
  mergedData: PropTypes.string,
  allCheckboxHandler: PropTypes.string,
  columns: PropTypes.string,
  isIdAdded: PropTypes.string,
  checkBoxHandler: PropTypes.string,
  handleEditableFeilds: PropTypes.string,
  ids: PropTypes.string,
  handleActionClick: PropTypes.string,
  handleDuplicate: PropTypes.string,
  handleRemove: PropTypes.string,
  selectedTaxRate: PropTypes.string,
  defaultTaxRate: PropTypes.string,
  unitsOptions: PropTypes.string,
  taxRateOptions: PropTypes.string,
  handleTaxRate: PropTypes.string,
  handleUnits: PropTypes.string,
  theDiscount: PropTypes.string,
  handleSelectedDiscountGroup: PropTypes.string,
  headingIndex: PropTypes.string,
  style: PropTypes.string,
  selectedItemRow: PropTypes.string,
  lineItemIndexing: PropTypes.string,
  selectedField: PropTypes.string,
  handleEditableFeildsInput: PropTypes.string,
  handleShowStyling: PropTypes.string,
  showStyle: PropTypes.string,
  handleStyling: PropTypes.string,
  selectedRow: PropTypes.string,
  openPP: PropTypes.string,
  ppToggle: PropTypes.string,
  handlePurchasePriceInput: PropTypes.string,
  handleNoticeInput: PropTypes.string,
  showHeadingInput: PropTypes.string,
  inputRef: PropTypes.string,
  handleAddNewHeadingInput: PropTypes.string,
  errorMessage: PropTypes.string,
  toggleSwitch: PropTypes.string,
  setEditDescription: PropTypes.func,
  setLineItemIndexing: PropTypes.func,
};

export default LineItemTable;
