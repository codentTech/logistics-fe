/* eslint-disable react/forbid-prop-types */
import PropTypes from "prop-types";
import CircularILoader from "../../circular-loader/circular-loader.component";
import Modal from "../../modal/modal.component";

function FileModal({
  open,
  loading,
  fileWidth,
  fileNameWidth,
  singleDocument,
  handleClose,
  handleDeleteIconVisibility,
  isDeleteIconVisible,
  setDeleteIconVisible,
  handleDeleteFile,
}) {
  return (
    <Modal show={open} onClose={handleClose} title="Attachments">
      {loading ? (
        <div className="mt-8">
          <CircularILoader />
        </div>
      ) : (
        <div className="primary-scroll my-3 max-h-[535px] overflow-y-auto">
          <div className="text-sm font-medium not-italic leading-[21px] text-text-black">
            All Attachment
          </div>
          {singleDocument &&
            singleDocument?.attachments &&
            singleDocument?.attachments?.map(({ file }, index) => {
              return (
                <div className="mt-2 flex items-center gap-4">
                  <div
                    className="flex flex-col gap-3"
                    onMouseEnter={() => handleDeleteIconVisibility(index)}
                    onMouseLeave={() => setDeleteIconVisible(0)}
                  >
                    <div
                      className={`flex px-[10px] ${fileWidth}   items-center justify-between p-1 ${
                        isDeleteIconVisible === index + 1 &&
                        "rounded-[5px] bg-[gainsboro]"
                      }`}
                    >
                      <div
                        className="flex items-center gap-1 rounded-md border border-solid border-disabled-input hover:cursor-pointer"
                        onClick={() => window.open(file.url, "_blank")}
                      >
                        {file && file.name && (
                          <div>
                            <img
                              className="h-7 w-7"
                              src={
                                file.name.split(".").pop() === "pdf"
                                  ? "/assets/icons/pdf-formate.svg"
                                  : file.name.split(".").pop() === "jpg"
                                    ? "/assets/icons/jpg-formate.svg"
                                    : file.name.split(".").pop() === "jpeg"
                                      ? "/assets/icons/jpeg-formate.svg"
                                      : "/assets/icons/png-formate.svg"
                              }
                              alt="file"
                            />
                          </div>
                        )}
                        <div className="flex flex-col gap-1">
                          <div
                            className={` ${fileNameWidth}   overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium not-italic leading-4`}
                          >
                            {file && file.name}
                          </div>
                        </div>
                      </div>
                      {isDeleteIconVisible === index + 1 && (
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                        <img
                          src="/assets/icons/delete-gray.svg"
                          className="hover:cursor-pointer"
                          alt="delete"
                          onClick={() => handleDeleteFile(file)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </Modal>
  );
}

FileModal.propTypes = {
  open: PropTypes.bool,
  loading: PropTypes.bool,
  fileWidth: PropTypes.string,
  fileNameWidth: PropTypes.string,
  singleDocument: PropTypes.object,
  handleClose: PropTypes.func,
  handleDeleteIconVisibility: PropTypes.func,
  isDeleteIconVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  setDeleteIconVisible: PropTypes.func,
  handleDeleteFile: PropTypes.func,
};

export default FileModal;
