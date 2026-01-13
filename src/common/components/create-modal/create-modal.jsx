import { Dialog, DialogContent } from "@mui/material/node";
import PropTypes from "prop-types";
import React from "react";
import CustomButton from "../custom-button/custom-button.component";
import CustomInput from "../custom-input/custom-input.component";
import CustomSwitch from "../custom-switch/custom-switch.component";

function CreateModal({
  modalStyling,
  ref,
  addLabel,
  editLabel,
  addButtonText,
  editButtonText,
  inputLabel,
  inputPlaceholderText,
  closeText,
  toggleSwitch,
  openPopup,
  inputLabelValue,
  handleChangeInputLabelValue,
  handleClose,
  handleSubmitClick,
  edit = false,
  handleDefaulTaxRateSwitch,
  type,
  toggleSwitchValue,
}) {
  return (
    <Dialog
      className="scrol-bar"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "20px",
          display: "flex",
        },
      }}
      ref={ref}
      open={openPopup}
    >
      <div className={modalStyling}>
        <div className="flex h-14 items-center  justify-between bg-[#e3ecf4] px-5">
          <div className=" text-xl font-medium not-italic leading-[30px] text-text-dark-gray">
            {edit ? editLabel : addLabel}
          </div>
          <div className="hover:cursor-pointer" onClick={handleClose}>
            <img src="/assets/icons/cancel-icon.svg" alt="cancel" />
          </div>
        </div>
        <DialogContent>
          <div className="w-full">
            <CustomInput
              label={inputLabel}
              placeholder={inputPlaceholderText}
              type={type}
              className="text-xs font-normal not-italic leading-[18px]"
              value={inputLabelValue}
              onChange={(e) => handleChangeInputLabelValue(e.target.value)}
            />

            {toggleSwitch && (
              <div className="mt-4 flex flex-col gap-4">
                <div className="text-sm font-medium not-italic leading-[17.5px] text-text-black">
                  Set as Default
                </div>
                <CustomSwitch
                  type="switch"
                  className="h-5 w-10 flex-col-reverse"
                  name="isVat"
                  defaultChecked={toggleSwitchValue}
                  onChange={(e) => handleDefaulTaxRateSwitch(e)}
                />
              </div>
            )}

            <div className="mt-[35px] flex justify-end gap-[20px]">
              <div className="flex justify-end gap-5">
                <CustomButton
                  onClick={handleClose}
                  text={closeText}
                  className="border border-solid border-text-ultra-light-gray px-6 py-2 text-sm font-medium leading-[17.5px] text-text-medium-gray"
                />
                <CustomButton
                  onClick={handleSubmitClick}
                  text={edit ? editButtonText : addButtonText}
                  className="btn-primary px-6 py-2 text-sm font-semibold leading-[16.94px]"
                  disabled={!inputLabelValue}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

CreateModal.propTypes = {
  modalStyling: PropTypes.string,
  ref: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(React.Element) }),
  ]),
  openPopup: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmitClick: PropTypes.func.isRequired,
  addLabel: PropTypes.string,
  editLabel: PropTypes.string,
  inputLabel: PropTypes.string,
  inputPlaceholderText: PropTypes.string,
  addButtonText: PropTypes.string,
  editButtonText: PropTypes.string,
  closeText: PropTypes.string,
  toggleSwitch: PropTypes.bool,
  inputLabelValue: PropTypes.string,
  handleChangeInputLabelValue: PropTypes.string,
  edit: PropTypes.bool,
  handleDefaulTaxRateSwitch: PropTypes.func,
  type: PropTypes.string,
  toggleSwitchValue: PropTypes.bool,
};

export default CreateModal;
