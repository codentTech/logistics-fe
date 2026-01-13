import { DialogContent } from "@mui/material/node";
import React from "react";
import PropTypes from "prop-types";

function ExpenditurePdf({ viewReceipt }) {
  return (
    <div className={`expenditure-${viewReceipt.id}`}>
      <div className="my-scroll max-h-full max-w-full overflow-y-auto">
        <DialogContent sx={{ padding: "0px 0px 0px 0px" }}>
          <div className=" flex min-h-[798px]">
            <div className="w-full min-w-[495px] px-6">
              <div className="flex justify-end pt-[21px] hover:cursor-pointer"></div>
              <div className="mt-[43px] flex items-center justify-between">
                <h2 className="text-base font-bold not-italic leading-6 text-text-black">
                  Expenditure Receipt
                </h2>
              </div>
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                    Customer:
                  </p>
                  <p className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                    {`${viewReceipt?.customer && viewReceipt?.customer?.companyName} ${
                      viewReceipt?.customer?.firstName ||
                      viewReceipt?.customer?.firstName
                        ? `( ${
                            viewReceipt?.customer &&
                            viewReceipt?.customer?.firstName
                              ? viewReceipt?.customer?.firstName
                              : ""
                          } ${
                            viewReceipt?.customer &&
                            viewReceipt?.customer?.lastName
                              ? viewReceipt?.customer?.lastName
                              : ""
                          } )`
                        : ""
                    } `}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                    Cash Discount:
                  </p>
                  <p className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                    {viewReceipt?.cashDiscount ?? 0} %
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                    Cash Discount Validity Date:
                  </p>
                  <p className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                    {viewReceipt?.cashDiscountValidity}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                    Payment Amount:
                  </p>
                  <p className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                    € {viewReceipt?.paymentAmount}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                    Due Date:
                  </p>
                  <p className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                    {viewReceipt?.dueDate}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                    Receipt Date:
                  </p>
                  <p className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                    {viewReceipt?.receiptDate}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex w-full flex-col gap-2 rounded-xl bg-[#FBFBFB] px-4 pb-[17px] pt-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium not-italic leading-[18px] text-text-dark-gray">
                    Customer:
                  </p>
                  <p className="text-xs font-medium not-italic leading-[18px] text-text-dark-gray">
                    {`${viewReceipt?.customer && viewReceipt?.customer?.companyName} ${
                      viewReceipt?.customer?.firstName ||
                      viewReceipt?.customer?.firstName
                        ? `( ${
                            viewReceipt?.customer &&
                            viewReceipt?.customer?.firstName
                              ? viewReceipt?.customer?.firstName
                              : ""
                          } ${
                            viewReceipt?.customer &&
                            viewReceipt?.customer?.lastName
                              ? viewReceipt?.customer?.lastName
                              : ""
                          } )`
                        : ""
                    } `}{" "}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium not-italic leading-[18px] text-text-dark-gray">
                    Full Payment
                  </p>
                  <p className="text-xs font-medium not-italic leading-[18px] text-text-dark-gray">
                    € {viewReceipt?.paymentAmount}
                  </p>
                </div>
                <div className="my-2 min-h-[1px] w-full bg-[#CFCFCF]"></div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium not-italic leading-[18px] text-text-black">
                    Balance
                  </p>
                  <p className="text-xs font-medium not-italic leading-[18px] text-text-black">
                    €
                    {Number(viewReceipt?.paymentAmount) -
                      Number(viewReceipt?.paymentAmount) *
                        (Number(viewReceipt?.cashDiscount) / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </div>
    </div>
  );
}

export default ExpenditurePdf;

ExpenditurePdf.propTypes = {
  viewReceipt: PropTypes.func,
};
