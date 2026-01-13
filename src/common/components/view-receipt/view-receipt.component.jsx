import { Dialog, DialogContent } from "@mui/material/node";
import React from "react";
import PropTypes from "prop-types";
import CustomButton from "../custom-button/custom-button.component";

function ViewReceipt({
  bookingModule,
  ref,
  openPopup,
  setOpenPopup,
  handleBook,
  handleSave,
}) {
  return (
    <Dialog
      className="scrol-bar"
      ref={ref}
      open={true}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "300px",
            // padding: '40px 24px'
          },
        },
        zIndex: 13000,
      }}
    >
      <div className="inline-flex flex-col pb-[33.595px] pt-6">
        <div className="flex items-center justify-between">
          <div className="text-xl font-medium not-italic leading-[30px] text-text-dark-gray" />
          {/* <div
            className=" hover:cursor-pointer"
            onClick={() => setOpenPopup(false)}
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
          </div> */}
        </div>
        <DialogContent>
          <div className="flex flex-col items-center justify-center gap-2">
            <div>
              <img
                alt="null"
                src="/assets/images/logo.png"
                className="h-[36.40px] w-[112.25px]"
              />
            </div>
            <div className="text-[10px] font-normal not-italic leading-[15px] text-text-dark-gray">
              Quicksteps | Riser Ring 14 | 59075 Hamm
            </div>
          </div>
          <div className="mt-[25px] flex flex-col gap-4">
            <div className="flex flex-col items-start gap-2">
              <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                Glasses
              </span>
              <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                John David
              </span>
              <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                10002
              </span>
              <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                26.01.2023
              </span>
              <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                Germany
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between ">
                <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                  Offer #
                </span>
                <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                  2021-100031
                </span>
              </div>
              <div className="flex justify-between ">
                <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                  Contact Person
                </span>
                <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                  MR. Nasir Joiya
                </span>
              </div>
              <div className="flex justify-between ">
                <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                  Customer number
                </span>
                <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                  10002
                </span>
              </div>
              <div className="flex justify-between ">
                <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                  Date
                </span>
                <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                  26.01.2023
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium not-italic leading-[17.5px] text-text-black">
                Offer
              </div>
              <div className="flex justify-between ">
                <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                  Glasses
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                    € 0,01
                  </span>
                  <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                    € 1 x 0,01
                  </span>
                </div>
              </div>
              <div className="flex justify-between ">
                <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                  Glasses
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                    € 0,01
                  </span>
                  <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                    € 1 x 0,01
                  </span>
                </div>
              </div>
              <div className="flex justify-between ">
                <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                  Glasses
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                    € 0,01
                  </span>
                  <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                    € 1 x 0,01
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="py-6">
            <hr />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                Net Amount
              </span>
              <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                € 6555.0
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                Plus VAT
              </span>
              <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                € 12.40
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs font-medium not-italic leading-[18px] text-text-dark-gray">
                Invoice Amount
              </span>
              <span className="text-xs font-medium not-italic leading-[18px] text-text-dark-gray">
                € 7919.56
              </span>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

ViewReceipt.propTypes = {
  bookingModule: PropTypes.string,
  ref: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(React.Element) }),
  ]),
  openPopup: PropTypes.bool.isRequired,
  setOpenPopup: PropTypes.func.isRequired,

  handleBook: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default ViewReceipt;
