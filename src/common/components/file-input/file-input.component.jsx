import PropTypes from "prop-types";
import CircularILoader from "../circular-loader/circular-loader.component";
import ConfirmationModal from "../confirmation-modal/confirmation-modal.component";
import CustomButton from "../custom-button/custom-button.component";
import useFileInput from "./use-file-input.hook";
import FileModal from "../modals/file-modal/file-modal";

function FileInput({
  module,
  moduleName,
  fileRef,
  flexible,
  attachmentsFun,
  editFiles,
  fileNameWidth,
  fileWidth,
}) {
  const {
    open,
    handleClose,
    fileInputRef,
    handleFileInputChange,
    handleUploadButtonClick,
    loading,
    singleDocument,
    alreadyExistPopup,
    handleYesConfirmation,
    handleCancel,
    isDeleteIconVisible,
    setDeleteIconVisible,
    handleDeleteIconVisibility,
    handleDeleteFile,
    handleOpenModal,
  } = useFileInput({
    module,
    moduleName,
    flexible,
    attachmentsFun,
    editFiles,
  });

  return (
    <div>
      <FileModal
        open={open}
        loading={loading}
        fileWidth="w-[471px]"
        fileNameWidth="w-[270px]"
        singleDocument={singleDocument}
        handleClose={handleClose}
        handleDeleteIconVisibility={handleDeleteIconVisibility}
        isDeleteIconVisible={isDeleteIconVisible}
        setDeleteIconVisible={setDeleteIconVisible}
        handleDeleteFile={handleDeleteFile}
      />

      <ConfirmationModal
        show={alreadyExistPopup}
        onConfirm={handleYesConfirmation}
        onCancel={handleCancel}
        message="File already exist. Want to replace?"
        messageStyling="mt-6 text-sm not-italic font-medium leading-[17.5px]"
        content=""
        img="/assets/icons/gray-question.svg"
        cancelText="No"
        confirmText="Yes"
        cancelTextStyling="y w-[94px] h-9 text-sm not-italic font-medium leading-[17.5px]rounded-md bg-[#AEAEAE] hover:bg-[#AEAEAE] justify-center items-center px-4 py-[7.5px]"
        confirmTextStyling="w-[101px] h-9 text-sm not-italic font-medium leading-[17.5px] rounded-md bg-[#1D4ED8] hover:bg-[#1D4ED8] justify-center items-center px-4 py-[7.5px]"
      />
      <input
        type="file"
        id="fileInput"
        className="hidden"
        ref={flexible ? fileRef : fileInputRef}
        // multiple
        accept=".png, .jpeg, .jpg, .pdf"
        onChange={handleFileInputChange}
      />
      {flexible ? null : (
        <div>
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-medium not-italic leading-[18px] text-text-dark-gray">
              Attachments
            </h5>
            <CustomButton
              className="items h-9 justify-center rounded-[3px] bg-[#047857] p-2 font-medium not-italic leading-[18px] text-white hover:bg-[#047857]"
              text="Upload File"
              onClick={handleUploadButtonClick}
              disabled={
                singleDocument && singleDocument?.attachments?.length >= 10
              }
            />
          </div>
          {loading ? (
            <div className="mt-8">
              <CircularILoader />
            </div>
          ) : (
            <div className="primary-scroll mt-3 max-h-[79px] overflow-y-auto">
              {singleDocument &&
                Array.isArray(singleDocument?.attachments) &&
                singleDocument?.attachments &&
                singleDocument?.attachments
                  ?.slice(0, 2)
                  ?.map(({ file }, index) => {
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
                                          : file.name.split(".").pop() ===
                                              "jpeg"
                                            ? "/assets/icons/jpeg-formate.svg"
                                            : "/assets/icons/png-formate.svg"
                                    }
                                    alt="file"
                                  />
                                </div>
                              )}
                              <div className="flex flex-col gap-1">
                                <div
                                  className={`${fileNameWidth} overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium not-italic leading-4`}
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
              {singleDocument &&
                Array.isArray(singleDocument?.attachments) &&
                singleDocument.attachments.length > 2 && (
                  <div
                    className="mt-6 text-center text-xs font-medium not-italic leading-[18px] text-secondary-green hover:cursor-pointer"
                    onClick={handleOpenModal}
                  >
                    View All
                  </div>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

FileInput.propTypes = {
  module: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  moduleName: PropTypes.string,
  fileRef: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  flexible: PropTypes.bool,
  attachmentsFun: PropTypes.func,
  editFiles: PropTypes.bool,
  fileNameWidth: PropTypes.string,
  fileWidth: PropTypes.string,
};

export default FileInput;
