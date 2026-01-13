import PropTypes from "prop-types";
import capitalizeFirstLetter from "@/common/utils/capitalize-first-letter";
import { DOCUMENT_NAME } from "@/common/utils/document-helpers/document-helpers";
import formatDate from "@/common/utils/formate-date";
import Modal from "../../modal/modal.component";

function HistoryModal({ open, moduleName, handleClose, rowData, history }) {
  return (
    <Modal show={open} onClose={handleClose} title="History">
      <div className="primary-scroll max-h-[535px] overflow-y-auto">
        <div className="text-sm font-medium not-italic leading-[21px] text-text-black">
          All History
        </div>
        <div>
          {rowData && rowData.status === "DRAFT" ? (
            <p className="mt-2 flex gap-1 border-b border-solid border-b-disabled-input text-xs font-normal not-italic leading-[18px] text-text-medium-gray">
              Status change:
              <span className="text-text-medium-gray">Draft</span>
            </p>
          ) : (
            rowData &&
            rowData.status === "OPEN" && (
              <p className="mt-2 flex gap-1 border-b border-solid border-b-disabled-input text-xs font-normal not-italic leading-[18px] text-text-black">
                Status change:
                <span className="text-text-medium-gray">Open</span>
              </p>
            )
          )}
          {history &&
            Array.isArray(history) &&
            history?.map((document) => {
              return (
                <>
                  {document &&
                  rowData &&
                  rowData?.status !== "DRAFT" &&
                  document.currentStatus !== "DRAFT" ? (
                    <div>
                      {document.previousStatus &&
                        document.createdByName &&
                        document?.createdAt && (
                          <p className="mb-1 mt-2 text-xs font-medium not-italic leading-[18px] text-text-black">
                            Status change:{" "}
                            <span className="mr-[1px] text-text-medium-gray">
                              {document.currentStatus
                                ? capitalizeFirstLetter(document.currentStatus)
                                : ""}
                            </span>{" "}
                            to{" "}
                            <span className="mr-[1px] text-text-medium-gray">
                              {document.previousStatus
                                ? capitalizeFirstLetter(document.previousStatus)
                                : ""}
                            </span>
                            <br />
                            Status change by:{" "}
                            <span className="mr-[1px] text-text-medium-gray">
                              {document.createdByName
                                ? capitalizeFirstLetter(document.createdByName)
                                : ""}
                            </span>{" "}
                            <br />
                            Status change at:{" "}
                            <span className="mr-[1px] text-text-medium-gray">
                              {formatDate(document?.updatedAt) ||
                                formatDate(document?.createdAt)}
                            </span>{" "}
                          </p>
                        )}
                      <hr />
                    </div>
                  ) : null}

                  {document?.convertedFrom && (
                    <p className="mt-2 text-xs font-medium not-italic leading-[18px] text-text-black">
                      Converted From:{" "}
                      <span className="mr-[1px] text-text-medium-gray">
                        {document.convertedFrom
                          ? document.convertedFrom.toLowerCase() ===
                            "delivery_notes"
                            ? "Delivery Notes"
                            : capitalizeFirstLetter(document.convertedFrom)
                          : ""}
                      </span>{" "}
                      <br />
                      Converted To:{" "}
                      <span className="mr-[1px] text-text-medium-gray">
                        {DOCUMENT_NAME(moduleName)}
                      </span>{" "}
                      <br />
                      {document.createdByName && (
                        <>
                          Converted by:{" "}
                          <span className="mr-[1px] text-text-medium-gray">
                            {document.createdByName
                              ? capitalizeFirstLetter(document.createdByName)
                              : ""}
                          </span>{" "}
                          <br />
                        </>
                      )}
                      {document?.updatedAt ||
                        (document?.createdAt && (
                          <div>
                            Converted at:
                            <span className="mr-[1px] text-text-medium-gray">
                              {formatDate(document?.updatedAt) ||
                                formatDate(document?.createdAt)}
                            </span>{" "}
                          </div>
                        ))}
                    </p>
                  )}
                </>
              );
            })}
        </div>
      </div>
    </Modal>
  );
}

HistoryModal.propTypes = {
  open: PropTypes.string,
  moduleName: PropTypes.string,
  handleClose: PropTypes.func,
  rowData: PropTypes.objectOf,
  history: PropTypes.arrayOf,
};

export default HistoryModal;
