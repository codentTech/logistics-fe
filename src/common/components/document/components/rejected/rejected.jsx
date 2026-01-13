import { Dialog, DialogContent } from "@mui/material/node";
import PropTypes from "prop-types";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import TextArea from "@/common/components/text-area/text-area.component";
import ReasonIcon from "@/common/icons/reason.icon";

function Rejected({
  rowData,
  refRejection,
  rejectionOpenPopup,
  setRejectionOpenPopup,
  reason,
  setReason,
  handleAddReason,
}) {
  return (
    <div>
      <Dialog
        className="scrol-bar"
        ref={refRejection}
        open={rejectionOpenPopup}
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
              <ReasonIcon />
            </div>
          </div>
          <DialogContent>
            <div className="w-full">
              <TextArea
                label="Rejected reason"
                name="reason "
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
      <div className="overflow-y-hidden p-2">
        <h5 className="text-xs font-medium not-italic leading-[18px] text-text-dark-gray">
          Reason
        </h5>
        <p className="mt-3 text-xs font-normal not-italic leading-[18px] text-text-medium-gray">
          {rowData?.rejectionReason && rowData?.rejectionReason}
        </p>
      </div>
    </div>
  );
}

Rejected.propTypes = {
  rowData: PropTypes.objectOf,
  refRejection: PropTypes.string,
  rejectionOpenPopup: PropTypes.bool,
  setRejectionOpenPopup: PropTypes.func,
  reason: PropTypes.string,
  setReason: PropTypes.func,
  handleAddReason: PropTypes.func,
};

export default Rejected;
