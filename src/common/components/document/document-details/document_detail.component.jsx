import Link from "next/link";
import PropTypes from "prop-types";
import { DOCUMENT_STATUS } from "@/common/constants/document-status.constant";
import capitalizeFirstLetter from "@/common/utils/capitalize-first-letter";
import {
  DOCUMENT_IDENTIFIER,
  DOCUMENT_LOWER_CASE_STATUS,
  DOCUMENT_NAME,
  DOCUMENT_ROUTE,
  DOCUMENT_STATUS_CLASSES,
} from "@/common/utils/document-helpers/document-helpers";
import formatAmount from "@/common/utils/fomate-amount";
import {
  invoiceAmountWithOutVAT,
  invoiceAmountWithVAT,
  lineItemNetAmount,
  plusVat,
} from "@/common/utils/product-calculations/amount-calculations";
import calculateProductTotalPrice from "@/common/utils/product-calculations/calculate-product-total";
import FileInput from "../../file-input/file-input.component";
import Comments from "../components/comments/comments.component";
import History from "../components/history/history.component";

function DocumentDetails({
  document,
  module,
  data,
  comments,
  history,
  open,
  handleOpenModal,
  handleCloseModal,
  handleComment,
  openPopup,
  comment,
  handleAddComment,
  setComment,
  handleClose,
  commentAction,
  commentActionId,
  commentActionRef,
  setCommentAction,
  setCommentActionId,
  handleEditComment,
  commentId,
  handleDeleteComment,
  openHistoryModal,
  handleOpenHistoryModal,
  handleCloseHistoryModal,
}) {
  return (
    <div className="min-h-[100vh] w-full bg-[#FBFBFB] px-[23px] ">
      <div className="flex items-center justify-between py-[24px]">
        <div className="flex items-center gap-[16px]">
          <Link href={`/${DOCUMENT_ROUTE(document)}/view`}>
            <img src="/assets/images/back-icon.svg" alt="img" />
          </Link>
          <h1 className="admin-top-heading">
            {" "}
            {DOCUMENT_NAME(document)} Details
          </h1>
          <p className="admin-top-p">
            {DOCUMENT_NAME(document)} #{" "}
            {DOCUMENT_IDENTIFIER({ id: data?.id, displayId: data?.displayId })}
          </p>
        </div>
      </div>
      <div className="2bars flex gap-[24px] xs:flex-col-reverse xs:flex-wrap lg:flex-row lg:flex-nowrap">
        <div className="main-content w-full pb-5">
          <div className="form-box w-full ">
            <h3 className="form-box-heading">Customer Details</h3>

            <div className="flex gap-[150px]">
              <div className="mt-4 flex gap-[90px]">
                <div className="flex flex-col gap-4">
                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    Gender:
                  </div>
                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    First Name:
                  </div>
                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    Company Name:
                  </div>
                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    Country:
                  </div>
                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    Postal Code:
                  </div>
                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    Contact Person:
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    {(data.customer && data?.customer?.gender) || "---"}
                  </div>

                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    {(data?.customer && data?.customer?.firstName) || "---"}
                  </div>

                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    {(data?.customer && data?.customer?.companyName) || "---"}
                  </div>

                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    {(data?.customer && data?.customer?.country) || "---"}
                  </div>

                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    {(data?.customer && data?.customer?.postalCode) || "---"}
                  </div>

                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    {(data?.customerContactPerson &&
                      ` ${
                        data?.customerContactPerson &&
                        data?.customerContactPerson.firstName
                      } ${
                        data?.customerContactPerson &&
                        data?.customerContactPerson.lastName
                      } `) ||
                      "---"}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-[90px]">
                <div className="flex flex-col gap-4">
                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    Designation:
                  </div>
                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    Last Name:
                  </div>
                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    Address Supplement:
                  </div>
                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    City:
                  </div>
                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    Address:
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    {(data.customer && data?.customer?.designation) || "---"}
                  </div>

                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    {(data?.customer && data?.customer?.lastName) || "---"}
                  </div>

                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    {(data?.customerCompanyAddress &&
                      data?.customerCompanyAddress?.addressSupplement) ||
                      "---"}
                  </div>

                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    {(data?.customer && data?.customer?.city) || "---"}
                  </div>

                  <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                    {(data?.customer && data?.customer?.address) || "---"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-box mt-4 w-full  ">
            <h3 className="form-box-heading ">Line Items</h3>

            <div className="table-box mt-4">
              <table className="... w-full border-collapse rounded-[20px_0px_0px_0px] ">
                <thead>
                  <tr className="bg-[#E7EAEE] p-5">
                    <th className="rounded-[10px_0_0_0] px-2 py-5 text-start text-sm font-normal not-italic leading-[18px] text-text-black">
                      Pos
                    </th>
                    <th className="px-2 py-5 text-start text-sm font-normal not-italic leading-[18px] text-text-black">
                      Product
                    </th>
                    <th className=" px-2 py-5 text-start text-sm font-normal not-italic leading-[18px] text-text-black">
                      Pcs
                    </th>
                    <th className=" px-2 py-5 text-start text-sm font-normal not-italic leading-[18px] text-text-black">
                      Unit
                    </th>
                    <th className=" px-2 py-5 text-start text-sm font-normal not-italic leading-[18px] text-text-black">
                      <span className="flex items-center gap-2">Price €</span>
                    </th>
                    <th className="border-b border-solid border-b-[#E7EAEE] px-2 py-4 text-start text-xs font-normal not-italic leading-[18px] text-text-black">
                      Tax
                    </th>
                    <th className="border-b border-solid border-b-[#E7EAEE] px-2 py-4 text-start text-xs font-normal not-italic leading-[18px] text-text-black">
                      Discount
                    </th>
                    <th className="rounded-[0_10px_0_0] border-b border-solid border-b-[#E7EAEE] px-2 py-4 text-start text-xs font-normal not-italic leading-[18px] text-text-black">
                      <span className="flex items-center gap-2"> Total € </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data[`${module}Products`]?.map((product) => {
                    return (
                      <tr>
                        <td className="border-b border-solid border-b-[#E7EAEE] px-2 py-4 text-start text-xs font-normal leading-[18px] text-[#646464]">
                          {(product && product.positionNo) || "---"}
                        </td>
                        <td className="border-b border-solid border-b-[#E7EAEE] px-2 py-4 text-start text-xs font-normal leading-[18px] text-[#646464]">
                          <div className="flex flex-col gap-1">
                            <div>
                              {(product && product.productName) || "---"}
                            </div>
                            <div>
                              {(product && product.desciption) || "---"}
                            </div>
                          </div>
                        </td>
                        <td className="border-b border-solid border-b-[#E7EAEE] px-2 py-4 text-start text-xs font-normal leading-[18px] text-[#646464]">
                          {(product && product.quantity) || "---"}
                        </td>
                        <td className="border-b border-solid border-b-[#E7EAEE] px-2 py-4 text-start text-xs font-normal leading-[18px] text-[#646464]">
                          {(product && product.unit) || "---"}
                        </td>
                        <td className="border-b border-solid border-b-[#E7EAEE] px-2 py-4 text-start text-xs font-normal leading-[18px] text-[#646464]">
                          {formatAmount(product && product.netPrice) || "---"}
                        </td>
                        <td className="border-b border-solid border-b-[#E7EAEE] px-2 py-4 text-start text-xs font-normal leading-[18px] text-[#646464]">
                          {(product && product.taxRate) || 0}
                        </td>
                        <td className="border-b border-solid border-b-[#E7EAEE] px-2 py-4 text-start text-xs font-normal leading-[18px] text-[#646464]">
                          {product?.lineItemDiscount || 0}%
                        </td>
                        <td className="border-b border-solid border-b-[#E7EAEE] px-2 py-4 text-start text-xs font-normal leading-[18px] text-[#646464]">
                          {formatAmount(
                            calculateProductTotalPrice({
                              discount: product && product.lineItemDiscount,
                              discountGroups: product.discountGroups,
                              quantity: (product && product.quantity) || 0,
                              netPrice: (product && product.netPrice) || 0,
                            })
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex  flex-row items-start justify-between rounded-[0_0_20px_20px]  bg-[#fafafa] px-6 py-4">
                <div className="flex flex-col justify-between gap-4">
                  <div className="text-base font-medium leading-[19px] text-[#646464]">
                    Net Amount
                  </div>
                  {data.isVat && (
                    <>
                      <div className="text-base font-medium leading-[19px] text-[#646464]">
                        Plus VAT
                      </div>
                      <div className="text-base font-semibold leading-[19px] text-text-black">
                        Invoice Amount
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col justify-between gap-4 text-right">
                  <div className="text-base font-medium leading-[19px] text-[#646464]">
                    {formatAmount(
                      lineItemNetAmount(data && data[`${module}Products`])
                    )}
                  </div>
                  {data.isVat && (
                    <>
                      <div className="text-base font-medium leading-[19px] text-[#646464]">
                        {formatAmount(
                          plusVat(data && data[`${module}Products`])
                        )}
                      </div>
                      <div className="text-base font-semibold leading-[19px] text-text-black">
                        {data && data.isVat
                          ? formatAmount(
                              invoiceAmountWithVAT(
                                data && data[`${module}Products`]
                              )
                            )
                          : formatAmount(
                              invoiceAmountWithOutVAT(
                                data && data[`${module}Products`]
                              )
                            )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="form-box mt-4 w-full ">
            <div className="text-base font-medium not-italic leading-6 text-text-black">
              Page Structure
            </div>
            <div className="mt-4 text-sm font-medium not-italic leading-[17.5px] text-text-dark-gray">
              Header & Body
            </div>

            <div className="mt-4 flex gap-[90px]">
              <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                Delivery Date:
              </div>

              <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                {data.deliveryDate || "---"}
              </div>
              <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                Expiry Date:
              </div>
              <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                {data.expiryDate || "---"}
              </div>
            </div>

            <div className="mt-4 flex gap-[110px]">
              <div className="text-xs font-normal not-italic leading-6 text-text-dark-gray">
                Body Text:
              </div>

              <div
                className="text-xs font-normal not-italic leading-6 text-text-dark-gray"
                dangerouslySetInnerHTML={{
                  __html:
                    data[`${module}Body`] &&
                    data[`${module}Body`]?.bodyDescription,
                }}
              />
            </div>

            <div className="mt-4 text-sm font-medium not-italic leading-[17.5px] text-text-dark-gray">
              Footer
            </div>
            <div className="mt-4 flex gap-[80px]">
              <div className="flex flex-col gap-4">
                <div className="inline whitespace-nowrap text-xs font-normal not-italic leading-6 text-text-dark-gray">
                  Disclaimer Text:
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div
                  className="text-xs font-normal not-italic leading-6 text-text-dark-gray"
                  dangerouslySetInnerHTML={{
                    __html:
                      data[`${module}Disclaimer`]?.disclaimerDescription ||
                      "---",
                  }}
                />
              </div>
            </div>

            <div className="mt-4 flex gap-[61px]">
              <div className="flex flex-col gap-4">
                <div className="inline whitespace-nowrap text-xs font-normal not-italic leading-6 text-text-dark-gray">
                  Terms & Condition:
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div
                  className="text-xs font-normal not-italic leading-6 text-text-dark-gray"
                  dangerouslySetInnerHTML={{
                    __html: data?.termsAndConditions || "---",
                  }}
                />
              </div>
            </div>

            <div className="mt-4 flex gap-[110px]">
              <div className="flex flex-col gap-4">
                <div className="inline whitespace-nowrap text-xs font-normal not-italic leading-6 text-text-dark-gray">
                  Copyright:
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div
                  className="text-xs font-normal not-italic leading-6 text-text-dark-gray"
                  dangerouslySetInnerHTML={{
                    __html: data?.copyRight || "---",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="right-side h-fit lg:sticky lg:top-4">
          <div className="form-box flex h-[77px] w-[336px] items-center justify-between ">
            <h3 className="form-box-heading ">Status</h3>
            <div
              className={`${DOCUMENT_STATUS_CLASSES(
                data.status
              )} flex items-center  justify-center rounded-[5px] px-2 py-1 text-sm font-normal not-italic leading-[17.5px]`}
            >
              {data.status}
            </div>
          </div>
          {DOCUMENT_LOWER_CASE_STATUS(data.status) ===
            DOCUMENT_LOWER_CASE_STATUS(DOCUMENT_STATUS.REJECTED) && (
            <div className="form-box mt-[16px] flex  w-[336px] flex-col gap-[16px]  ">
              <h3 className="form-box-heading ">Reason</h3>
              <div className="text-sm font-normal not-italic leading-[17.5px] text-text-light-gray">
                {" "}
                {data?.rejectionReason}{" "}
              </div>
            </div>
          )}

          <div className="form-box mt-[16px] flex  w-[336px] flex-col gap-[16px]  ">
            <Comments
              id={data.id}
              open={open}
              comments={comments}
              handleClose={handleClose}
              handleCloseModal={handleCloseModal}
              commentAction={commentAction}
              commentActionId={commentActionId}
              commentActionRef={commentActionRef}
              setCommentAction={setCommentAction}
              setCommentActionId={setCommentActionId}
              handleEditComment={handleEditComment}
              handleDeleteComment={handleDeleteComment}
              openPopup={openPopup}
              comment={comment}
              setComment={setComment}
              commentId={commentId}
              handleAddComment={handleAddComment}
              rowData={data}
              handleComment={handleComment}
              handleOpenModal={handleOpenModal}
            />
          </div>

          <div className="form-box mt-[16px] w-[336px]">
            {" "}
            <FileInput
              module={data}
              moduleName={document}
              fileNameWidth="w-[150px]"
              fileWidth="w-[290px]"
            />{" "}
          </div>

          <div className="form-box mt-[16px] flex w-[336px] flex-col gap-[16px]">
            <div className="text-base font-medium not-italic leading-6 text-text-black">
              History
            </div>
            <History
              open={openHistoryModal}
              rowData={data}
              history={history}
              moduleName={capitalizeFirstLetter(document)}
              handleClose={handleCloseHistoryModal}
              handleOpenModal={handleOpenHistoryModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

DocumentDetails.propTypes = {
  document: PropTypes.objectOf,
  module: PropTypes.string,
  data: PropTypes.arrayOf,
  comments: PropTypes.arrayOf,
  history: PropTypes.arrayOf,
  open: PropTypes.bool,
  handleOpenModal: PropTypes.func,
  handleCloseModal: PropTypes.func,
  handleComment: PropTypes.func,
  openPopup: PropTypes.bool,
  comment: PropTypes.arrayOf,
  handleAddComment: PropTypes.func,
  setComment: PropTypes.func,
  handleClose: PropTypes.func,
  commentAction: PropTypes.bool,
  commentActionId: PropTypes.string,
  commentActionRef: PropTypes.func,
  setCommentAction: PropTypes.func,
  setCommentActionId: PropTypes.func,
  handleEditComment: PropTypes.func,
  commentId: PropTypes.func,
  handleDeleteComment: PropTypes.func,
  openHistoryModal: PropTypes.bool,
  handleOpenHistoryModal: PropTypes.func,
  handleCloseHistoryModal: PropTypes.func,
};

export default DocumentDetails;
