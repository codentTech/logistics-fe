import PropTypes from "prop-types";
import HistoryModal from "@/common/components/modals/history-modal/history-modal.component";
import { DOCUMENT_STATUS } from "@/common/constants/document-status.constant";
import capitalizeFirstLetter from "@/common/utils/capitalize-first-letter";
import { DOCUMENT_NAME } from "@/common/utils/document-helpers/document-helpers";
import formatDate from "@/common/utils/formate-date";

function History({
  open,
  rowData,
  history,
  moduleName,
  handleClose,
  handleOpenModal,
}) {
  return (
    <div>
      <HistoryModal
        open={open}
        moduleName={moduleName}
        handleClose={handleClose}
        rowData={rowData}
        history={history}
      />
      {rowData && rowData.status === DOCUMENT_STATUS.DRAFT ? (
        <p className="mt-2 flex gap-1 border-b border-solid border-b-disabled-input text-xs font-normal not-italic leading-[18px] text-text-medium-gray">
          Status change:
          <span className="text-text-medium-gray">Draft</span>
        </p>
      ) : (
        rowData &&
        rowData.status === DOCUMENT_STATUS.OPEN && (
          <p className="mt-2 flex gap-1 border-b border-solid border-b-disabled-input text-xs font-normal not-italic leading-[18px] text-text-black">
            Status change:
            <span className="text-text-medium-gray">Open</span>
          </p>
        )
      )}
      {history &&
        Array.isArray(history) &&
        history?.slice(0, 5)?.map((document) => {
          return (
            <>
              {document &&
              rowData &&
              rowData?.status !== DOCUMENT_STATUS.DRAFT &&
              document.currentStatus !== DOCUMENT_STATUS.DRAFT ? (
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
                    {DOCUMENT_NAME(document.convertedFrom)}
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

      {history &&
      history.length > 2 &&
      rowData &&
      rowData.status !== DOCUMENT_STATUS.DRAFT ? (
        <div
          className="mt-6 text-center text-xs font-medium not-italic leading-[18px] text-secondary-green hover:cursor-pointer"
          onClick={handleOpenModal}
        >
          View All
        </div>
      ) : null}
    </div>
  );
}

History.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleOpenModal: PropTypes.func,
  rowData: PropTypes.objectOf,
  history: PropTypes.arrayOf,
  moduleName: PropTypes.string,
};

export default History;
