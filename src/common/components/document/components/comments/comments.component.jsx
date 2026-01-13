import { Dialog, DialogContent } from "@mui/material/node";
import PropTypes from "prop-types";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import ReadMore from "@/common/components/readmore/readmore.component";
import TextArea from "@/common/components/text-area/text-area.component";
import CloseIcon from "@/common/icons/Close.icon";
import DeleteIcon from "@/common/icons/delete.icon";
import PencilIcon from "@/common/icons/pencil.icon";
import ThreeDotsIcon from "@/common/icons/three-dots.icon";
import formatDate from "@/common/utils/formate-date";
import CommentModal from "@/common/components/modals/comment-modal/comment-modal";

function Comments({
  open,
  id,
  ref,
  openPopup,
  comment,
  setComment,
  commentId,
  handleAddComment,
  handleClose,
  commentActionRef,
  rowData,
  handleComment,
  comments = [],
  commentAction,
  commentActionId,
  setCommentAction,
  setCommentActionId,
  handleEditComment,
  handleDeleteComment,
  handleOpenModal,
  handleCloseModal,
}) {
  return (
    <div
      className={`border-r border-solid border-r-disabled-input p-2 ${
        rowData && rowData?.status?.toLowerCase() === "rejected"
          ? ""
          : "min-w-0 "
      }`}
    >
      <CommentModal
        open={open}
        comments={comments}
        handleClose={handleCloseModal}
        commentAction={commentAction}
        commentActionId={commentActionId}
        commentActionRef={commentActionRef}
        setCommentAction={setCommentAction}
        setCommentActionId={setCommentActionId}
        handleEditComment={handleEditComment}
        handleDeleteComment={handleDeleteComment}
      />

      <Dialog
        className="scrol-bar"
        ref={ref}
        open={openPopup}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "479px",
              borderRadius: "20px",
            },
          },
          zIndex: 13000,
        }}
      >
        <div className="h-full w-full">
          <div className="flex h-14 items-center  justify-between bg-[#e3ecf4] px-5">
            <div className=" text-xl font-medium not-italic leading-[30px] text-text-black">
              Comments
            </div>
            <div className="hover:cursor-pointer" onClick={handleClose}>
              <CloseIcon />
            </div>
          </div>
          <DialogContent>
            <div className="w-full">
              <TextArea
                label={commentId ? "Update Comment" : "Add Comment"}
                name="comment "
                placeholder="Enter Comment"
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <div className="mt-6 flex justify-end gap-[20px]">
                <div className="flex justify-end gap-5">
                  <CustomButton
                    onClick={handleClose}
                    text="Close"
                    className="border border-solid border-text-ultra-light-gray px-6 py-2 text-sm font-medium leading-[17.5px] text-text-medium-gray"
                  />
                  <CustomButton
                    onClick={() => handleAddComment(id)}
                    name="save"
                    text={commentId ? "Update" : "Save"}
                    className="btn-primary  items-center justify-center px-4 py-[11px] text-sm font-medium not-italic leading-[17.5px]"
                    disabled={!comment}
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </div>
      </Dialog>
      <div>
        <div className="flex justify-between">
          <h5 className=" text-xs font-medium not-italic leading-[18px] text-text-dark-gray">
            Comments
          </h5>
          <CustomButton
            id="comment"
            text="Add Comment"
            name="addComment"
            onClick={() => handleComment(rowData)}
            className="items h-9 justify-center rounded-[3px] bg-[#047857] p-2 font-medium not-italic leading-[18px] hover:bg-[#047857]"
          />
        </div>
        <div className="primary-scroll mt-3 max-h-[79px] overflow-y-auto">
          {comments &&
            comments.length !== 0 &&
            Array.isArray(comments) &&
            (comments?.slice(0, 2) || [])?.map((document) => {
              return (
                <div
                  className={`relative mt-3 ${
                    rowData &&
                    rowData?.status &&
                    rowData?.status.toLowerCase() === "rejected"
                      ? "w-[276px]"
                      : "w-[335px]"
                  }rounded-md border border-solid border-disabled-input p-2`}
                >
                  <p className="text-xs font-normal not-italic leading-[18px] text-text-medium-gray">
                    <span className="text-xs font-medium not-italic leading-[18px] text-text-black">
                      {" "}
                      Comment:{" "}
                    </span>{" "}
                    <ReadMore
                      size={150}
                      maxLength={
                        document.comment && document.comment.comment.length
                      }
                      text={document.comment && document.comment.comment}
                      firstStyling="text-xs font-normal not-italic leading-[18px] text-text-medium-gray"
                      secondStyling="text-xs font-medium not-italic leading-[18px] text-secondary-green"
                    />
                  </p>
                  <div
                    onClick={() => {
                      setCommentAction(!commentAction);
                      setCommentActionId(document?.id);
                    }}
                    className="absolute right-2 top-1 p-1 hover:cursor-pointer"
                  >
                    <ThreeDotsIcon />
                  </div>
                  {commentAction && document?.id === commentActionId && (
                    <div
                      ref={commentActionRef}
                      className="absolute right-5 top-5 inline-flex h-[68px]  max-w-[92px] flex-col items-start gap-2 rounded-md border border-solid border-[#CECECE] bg-white p-3"
                    >
                      <div
                        onClick={() => handleEditComment(document)}
                        className="flex items-center gap-2 hover:cursor-pointer"
                      >
                        <PencilIcon />{" "}
                        <p className="text-sm font-medium not-italic leading-[17.5px] text-text-black">
                          Edit
                        </p>
                      </div>
                      <div
                        onClick={() => handleDeleteComment(document)}
                        className="flex items-center gap-2 hover:cursor-pointer"
                      >
                        <DeleteIcon />{" "}
                        <p className="text-sm font-medium not-italic leading-[17.5px] text-text-black">
                          Delete
                        </p>
                      </div>
                    </div>
                  )}
                  <p className="text-xs font-normal not-italic leading-[18px] text-text-medium-gray">
                    <span className="text-xs font-medium not-italic leading-[18px] text-text-black">
                      {" "}
                      By:{" "}
                    </span>{" "}
                    {document.comment && document.comment.createdByName}
                  </p>
                  <p className="text-xs font-normal not-italic leading-[18px] text-text-medium-gray">
                    <span className="text-xs font-medium not-italic leading-[18px] text-text-black">
                      {" "}
                      At:{" "}
                    </span>{" "}
                    {formatDate(
                      document.comment && document.comment.updatedAt
                    ) ||
                      formatDate(
                        document.comment && document.comment.createdAt
                      )}
                  </p>
                </div>
              );
            })}
          {comments && comments.length > 2 && (
            <div
              className="mt-6 text-center text-xs font-medium not-italic leading-[18px] text-secondary-green hover:cursor-pointer"
              onClick={handleOpenModal}
            >
              View All
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Comments.propTypes = {
  id: PropTypes.string,
  open: PropTypes.bool,
  ref: PropTypes.string,
  openPopup: PropTypes.bool,
  comment: PropTypes.string,
  setComment: PropTypes.func,
  commentId: PropTypes.string,
  handleAddComment: PropTypes.func,
  handleClose: PropTypes.func,
  commentActionRef: PropTypes.string,
  rowData: PropTypes.objectOf,
  handleComment: PropTypes.func,
  comments: PropTypes.string,
  commentAction: PropTypes.bool,
  commentActionId: PropTypes.string,
  setCommentAction: PropTypes.func,
  setCommentActionId: PropTypes.func,
  handleEditComment: PropTypes.func,
  handleDeleteComment: PropTypes.func,
  handleOpenModal: PropTypes.func,
  handleCloseModal: PropTypes.func,
};

export default Comments;
