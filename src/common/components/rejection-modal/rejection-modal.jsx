import { Dialog, DialogContent } from "@mui/material/node";
import PropTypes from "prop-types";
import React from "react";
import CustomButton from "../custom-button/custom-button.component";
import TextArea from "../text-area/text-area.component";

function RejectionModal({
  refRejection,
  rejectionOpenPopup,
  setRejectionOpenPopup,
  reason,
  setReason,
  handleAddReason,
  module,
}) {
  return (
    <div>
      <Dialog
        className="scrol-bar"
        ref={refRejection}
        open={rejectionOpenPopup}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "479px",
              borderRadius: "20px",
            },
          },
        }}
      >
        <div className="max-h-full w-[909px] max-w-full ">
          <div className="flex h-14 items-center  justify-between bg-[#e3ecf4] px-5">
            <div className=" text-xl font-medium not-italic leading-[30px] text-text-dark-gray">
              Reason
            </div>
            <div
              className="hover:cursor-pointer"
              onClick={() => setRejectionOpenPopup(false)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.46582 8.01169L15.696 1.78141C16.1014 1.37615 16.1014 0.720878 15.696 0.315665C15.2907 -0.0895966 14.6355 -0.0895966 14.2303 0.315665L7.99993 6.5459L1.76984 0.315665C1.36438 -0.0895966 0.709353 -0.0895966 0.304092 0.315665C-0.101364 0.720926 -0.101364 1.37615 0.304092 1.78141L6.53413 8.01169L0.30414 14.2419C-0.101315 14.6472 -0.101315 15.3025 0.30414 15.7077C0.40027 15.8041 0.514502 15.8805 0.640272 15.9327C0.766042 15.9848 0.900871 16.0115 1.03701 16.0114C1.30233 16.0114 1.56774 15.9098 1.76988 15.7077L7.99993 9.47744L14.2303 15.7077C14.3264 15.8041 14.4406 15.8805 14.5664 15.9326C14.6922 15.9847 14.827 16.0115 14.9631 16.0114C15.2284 16.0114 15.4939 15.9098 15.696 15.7077C16.1014 15.3024 16.1014 14.6472 15.696 14.2419L9.46582 8.01169Z"
                  fill="#7E7D7D"
                />
              </svg>
            </div>
          </div>
          <DialogContent>
            <div className="w-full">
              <TextArea
                label={module ? "Rejected reason" : "Canceled reason"}
                name="reason "
                labelClassName="text-base "
                placeholder="Enter Reason"
                type="tex"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />

              <div className="mt-6 flex justify-between gap-[20px]">
                <div />
                <div className="flex justify-end gap-5">
                  <CustomButton
                    onClick={() => setRejectionOpenPopup(false)}
                    text="Close"
                    className="border border-solid border-text-ultra-light-gray px-6 py-2 text-sm font-medium leading-[17.5px] text-text-medium-gray"
                  />
                  <CustomButton
                    onClick={handleAddReason}
                    name="add"
                    text="Add"
                    className="btn-primary items-center justify-center px-4 py-[11px] text-sm font-medium not-italic leading-[17.5px]"
                    disabled={!reason}
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
}

RejectionModal.propTypes = {
  refRejection: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(React.Element) }),
  ]),
  rejectionOpenPopup: PropTypes.func,
  setRejectionOpenPopup: PropTypes.func,
  reason: PropTypes.string,
  setReason: PropTypes.func,
  handleAddReason: PropTypes.func,
  module: PropTypes.string,
};

export default RejectionModal;
