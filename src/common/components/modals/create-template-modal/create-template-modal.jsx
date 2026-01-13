import PropTypes from "prop-types";
import CustomButton from "../../custom-button/custom-button.component";
import CustomInput from "../../custom-input/custom-input.component";
import Modal from "../../modal/modal.component";
import useCreateTemplate from "./use-create-template.hook";

function CreateTemplateModal({ open, modalCloseHandler, documentType }) {
  const { templateName, handleSaveTemplate, handleCreateTemplate } =
    useCreateTemplate({
      documentType,
      modalCloseHandler,
    });
  return (
    <Modal show={open} onClose={modalCloseHandler} title="Add Template Name">
      <div>
        <CustomInput
          type="text"
          name="templateName"
          className="form-control"
          placeholder="Enter template name"
          isRequired
          value={templateName}
          onChange={handleSaveTemplate}
        />
        <div className="mt-5 flex justify-end gap-6">
          <CustomButton
            onClick={modalCloseHandler}
            text="Cancel"
            className="btn-cancel"
          />
          <CustomButton
            text="Next"
            type="submit"
            className="btn-primary"
            disabled={!templateName || templateName.length <= 3}
            onClick={handleCreateTemplate}
          />
        </div>
      </div>
    </Modal>
  );
}

CreateTemplateModal.propTypes = {
  open: PropTypes.bool,
  modalCloseHandler: PropTypes.func,
  documentType: PropTypes.string,
};

export default CreateTemplateModal;
