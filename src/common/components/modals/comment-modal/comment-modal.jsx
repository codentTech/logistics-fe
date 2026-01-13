import PropTypes from "prop-types";
import DeleteIcon from "@/common/icons/delete.icon";
import PencilIcon from "@/common/icons/pencil.icon";
import ThreeDotsIcon from "@/common/icons/three-dots.icon";
import formatDate from "@/common/utils/formate-date";
import Modal from "../../modal/modal.component";
import ReadMore from "../../readmore/readmore.component";

function CommentModal({
  open,
  comments,
  handleClose,
  commentAction,
  commentActionId,
  commentActionRef,
  setCommentAction,
  setCommentActionId,
  handleEditComment,
  handleDeleteComment,
}) {
  return (
    <Modal show={open} onClose={handleClose} title="Comments">
      <div className="primary-scroll max-h-[535px] overflow-y-auto">
        <div className="text-sm font-medium not-italic leading-[21px] text-text-black">
          All Comment
        </div>
        {Array.isArray(comments) &&
          comments?.map((document) => {
            return (
              <div className="relative mt-2 rounded-md border border-solid border-disabled-input p-2">
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
                  {formatDate(document.comment && document.comment.updatedAt) ||
                    formatDate(document.comment && document.comment.createdAt)}
                </p>
              </div>
            );
          })}
      </div>
    </Modal>
  );
}

CommentModal.propTypes = {
  open: PropTypes.string,
  comments: PropTypes.string,
  handleClose: PropTypes.func,
  commentAction: PropTypes.bool,
  commentActionId: PropTypes.string,
  commentActionRef: PropTypes.string,
  setCommentAction: PropTypes.func,
  setCommentActionId: PropTypes.func,
  handleEditComment: PropTypes.func,
  handleDeleteComment: PropTypes.func,
};

export default CommentModal;
