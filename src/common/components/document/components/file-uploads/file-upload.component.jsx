import PropTypes from "prop-types";
import FileInput from "@/common/components/file-input/file-input.component";
import { DOCUMENT_STATUS } from "@/common/constants/document-status.constant";
import { DOCUMENT_LOWER_CASE_STATUS } from "@/common/utils/document-helpers/document-helpers";

function FileUpload({ rowData, moduleName }) {
  return (
    <div
      className={`border-r border-solid border-r-disabled-input p-2 ${
        DOCUMENT_LOWER_CASE_STATUS(rowData.status) ===
        DOCUMENT_LOWER_CASE_STATUS(DOCUMENT_STATUS.REJECTED)
          ? ""
          : "min-w-0 "
      }`}
    >
      <FileInput
        module={rowData}
        moduleName={moduleName}
        fileWidth={
          DOCUMENT_LOWER_CASE_STATUS(rowData.status) ===
          DOCUMENT_LOWER_CASE_STATUS(DOCUMENT_STATUS.REJECTED)
            ? "w-[270px]"
            : "w-[363px]"
        }
        fileNameWidth={
          DOCUMENT_LOWER_CASE_STATUS(rowData.status) ===
          DOCUMENT_LOWER_CASE_STATUS(DOCUMENT_STATUS.REJECTED)
            ? "max-w-[155px]"
            : "max-w-[220px]"
        }
      />
    </div>
  );
}

FileUpload.propTypes = {
  rowData: PropTypes.objectOf,
  moduleName: PropTypes.string,
};

export default FileUpload;
