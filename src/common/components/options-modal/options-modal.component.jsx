import { Dialog } from "@mui/material/node";
import PropTypes from "prop-types";
import CustomButton from "../custom-button/custom-button.component";

function OptionsModal({
  ref,
  openPopup = false,
  closePopup,
  messageLable = "",
  firstOptionLabel = "",
  secondOptionLabel = "",
  handleFirstOption,
  handleSecondOption,
}) {
  return (
    <div>
      <Dialog
        className="scrol-bar"
        ref={ref}
        open={openPopup}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "471px",
              padding: "40px 24px",
            },
          },
          zIndex: 13000,
        }}
      >
        <div className="max-h-full w-[471px] max-w-full px-6 ">
          <div className="flex items-center justify-between">
            <div className="text-xl font-medium not-italic leading-[30px] text-text-dark-gray" />
            <div
              className="hover:cursor-pointer"
              onClick={() => closePopup(false)}
            >
              <img
                src="/assets/icons/gray-cross-img.svg"
                className="h-4 w-4"
                alt="cancel"
              />
            </div>
          </div>
          <div>
            {" "}
            <div className="flex flex-col items-center gap-6">
              <div>
                <img
                  src="/assets/icons/gray-question.svg"
                  className="h-[72px] w-[73px]"
                  alt="img"
                />
              </div>
              <div className="mt-2">{messageLable}</div>
              <div className="mt-[14px] flex gap-[32px]">
                <CustomButton
                  className="flex h-[40px] items-center justify-center rounded-md border-[1.5px] border-solid border-primary  text-sm font-medium not-italic leading-[26px] text-primary"
                  text={firstOptionLabel}
                  onClick={handleFirstOption}
                />
                <CustomButton
                  className="btn-primary h-[40px]  items-center px-[30px] py-[7px] text-sm font-medium not-italic leading-[normal]"
                  text={secondOptionLabel}
                  onClick={handleSecondOption}
                />
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

OptionsModal.propTypes = {
  ref: PropTypes.string,
  openPopup: PropTypes.bool,
  closePopup: PropTypes.bool,
  messageLable: PropTypes.string,
  firstOptionLabel: PropTypes.string,
  secondOptionLabel: PropTypes.string,
  handleFirstOption: PropTypes.func,
  handleSecondOption: PropTypes.func,
};

export default OptionsModal;
