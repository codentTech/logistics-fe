import React from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CustomButton from "@/common/components/custom-button/custom-button.component";

export default function ConfirmationDialog({
  show,
  onClose,
  onConfirm,
  message,
  content,
}) {
  return (
    <Dialog
      open={show}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "474px",
          borderRadius: "20px",
          padding: "0",
        },
      }}
    >
      <div className="my-scroll max-h-full max-w-full overflow-y-auto ">
        <DialogContent sx={{ padding: "0px 0px 0px 0px" }}>
          <div className="flex flex-col items-center rounded-[20px] bg-white px-6 py-10">
            <div className="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="72"
                height="72"
                viewBox="0 0 72 72"
                fill="none"
              >
                <g clipPath="url(#clip0_8079_155896)">
                  <path
                    d="M36 0C16.1028 0 0 16.101 0 36C0 55.8969 16.101 72 36 72C55.8972 72 72 55.899 72 36C72 16.1028 55.899 0 36 0ZM34.9348 52.8495C32.8971 52.8495 31.3334 51.1436 31.3334 49.2006C31.3334 47.2103 32.9445 45.552 34.9348 45.552C36.9252 45.552 38.5834 47.2105 38.5834 49.2008C38.5834 51.1435 36.9723 52.8495 34.9348 52.8495ZM40.3367 34.416C37.7305 36.4537 37.683 37.8752 37.683 40.3393C37.683 41.2398 37.2091 42.2823 34.8872 42.2823C32.9442 42.2823 32.281 41.5714 32.281 39.1074C32.281 35.0321 34.0817 33.0892 35.4559 31.9046C37.0197 30.5776 39.6734 29.1088 39.6734 26.55C39.6734 24.37 37.7779 23.3276 35.4085 23.3276C30.5751 23.3276 31.6177 26.9765 29.0586 26.9765C27.7792 26.9765 26.2155 26.1233 26.2155 24.2754C26.2155 21.7166 29.1534 17.9255 35.5507 17.9255C41.6161 17.9255 45.6441 21.2901 45.6441 25.7444C45.6441 30.1987 41.6161 33.4209 40.3367 34.416Z"
                    fill="#EF2020"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_8079_155896">
                    <rect width="72" height="72" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h3 className=" mt-6 text-center text-base font-bold not-italic leading-6 text-text-dark-gray">
              {message}
            </h3>
            <div className="mt-3 text-center">{content}</div>
            <div className="mt-[48px] flex justify-center gap-8">
              <CustomButton
                onClick={onClose}
                text="Cancel"
                className="btn-white-cancel h-[40px] w-[75px]"
              />
              <CustomButton
                text="Yes"
                type="submit"
                className="btn-danger h-[40px] w-[75px] "
                onClick={onConfirm}
              />
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

ConfirmationDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
};
