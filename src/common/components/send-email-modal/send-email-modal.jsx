import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { Editor } from "@tinymce/tinymce-react";
import useEmailSendModal from "./use-send-email-modal";
import EmailInput from "./component/email-input";
import CircularILoader from "../circular-loader/circular-loader.component";
import { FILE_SIZE_B_TO_MB } from "@/common/utils/document-helpers/document-helpers";

export default function SendEmailModal({
  sendEmailModel,
  setSendEmailModel,
  moduleName,
  currentDocument,
  documentData,
  templateHeader,
  templateContact,
  templateFooter,
  contactInfo,
  fromContactInfo,
  documentToData,
  tableFooterOptions,
  termsAndConditionsData,
  stripHTML,
  productData,
}) {
  const {
    handleSubmit,
    errors,
    onSubmit,
    register,
    editorRef,
    handleFileChange,
    attachedFiles,
    removeAttachedFile,
    setRecipientEmails,
    setBccEmails,
    recipientEmails,
    bccEmails,
    showError,
    loading,
    handleOnCancel,
    message,
  } = useEmailSendModal({
    sendEmailModel,
    setSendEmailModel,
    moduleName,
    currentDocument,
    documentData,
    templateHeader,
    templateContact,
    templateFooter,
    contactInfo,
    fromContactInfo,
    documentToData,
    tableFooterOptions,
    termsAndConditionsData,
    stripHTML,
    productData,
  });

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          width: "600px",
          borderRadius: "20px",
          display: "flex",
        },
      }}
      open={sendEmailModel}
      onClose={handleOnCancel}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "flex-start",
            background: "#E3ECF4",
            color: "#46474F",
            fontSize: "20px",
            fontWeight: "700",
            justifyContent: "space-between",
          }}
        >
          <div>Send Email</div>
          <Box sx={{ cursor: "pointer" }} onClick={handleOnCancel}>
            <CloseIcon fontSize="medium" />
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{
            p: 0,
          }}
        >
          <EmailInput
            label="Recipients"
            bgcolor="#F2F6FD"
            name="recipient"
            register={register}
            error={Boolean(errors.recipient)}
            emails={recipientEmails}
            setEmails={setRecipientEmails}
          />
          {showError && recipientEmails.length === 0 ? (
            <Typography
              // className="ml-3 text-xs font-medium leading-normal tracking-[0.00938em]"
              sx={{
                marginLeft: "20px",
                fontSize: "12px",
                color: "red",
                marginTop: "8px",
              }}
            >
              Email is required
            </Typography>
          ) : (
            ""
          )}
          <EmailInput
            label="Cc"
            name="BCC"
            bgcolor="#fff"
            register={register}
            error={errors.BCC}
            emails={bccEmails}
            setEmails={setBccEmails}
          />

          <TextField
            {...register("subject")}
            sx={{
              p: 1,
              "& .MuiInputBase-input": {
                fontSize: "14px",
              },
              color: "#A4A8AB",
              "& .MuiInput-underline:before, & .MuiInput-underline:hover:before, & .MuiInput-underline:after":
                {
                  content: "none",
                },
            }}
            error={Boolean(errors.subject)}
            fullWidth
            size="medium"
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{
                    color: "#A4A8AB",
                    marginLeft: 0.5,
                  }}
                >
                  <span className="text-sm font-normal not-italic leading-[17.5px] text-[#A4A8AB]">
                    Subject
                  </span>
                </InputAdornment>
              ),
            }}
            variant="standard"
          />

          <hr className="mx-6" />
          {errors.subject && (
            <Typography
              sx={{
                marginLeft: "20px",
                fontSize: "12px",
                color: "red",
                marginTop: "8px",
              }}
            >
              {errors.subject.message}
            </Typography>
          )}
          <Box
            className="no-border"
            sx={{
              height: "250",
              border: "7px",
              marginLeft: "7px",
              marginRight: "5.5px",
              marginTop: "6px",
            }}
          >
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMC_API_KEY}
              init={{
                height: 260,
                menubar: false,
                placeholder: "Message here",
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "print",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "paste",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic underline strikethrough | bullist numlist outdent indent",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; }",
              }}
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={`Hi, ${message}`}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "20px",
          }}
        >
          <div className="flex flex-col gap-4">
            {attachedFiles?.map((file, index) => (
              <div className="flex w-80  items-center justify-between rounded-lg bg-[#e4e4e4] px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-[180px] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium not-italic leading-[17.5px] text-[#397DED]">
                    {file?.name}
                  </div>
                  <div className="text-sm font-medium not-italic leading-[17.5px] text-[#000]">
                    {`(${FILE_SIZE_B_TO_MB(file?.size)}M)`}
                  </div>
                </div>
                <div
                  className="hover:cursor-pointer"
                  onClick={() => removeAttachedFile(index)}
                >
                  <img
                    src="/assets/icons/cancel-icon.svg"
                    alt="cancel"
                    className="h-[10px] w-[10px]"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex w-full items-center justify-between py-4 pr-4">
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{
                  bgcolor: "#1D4ED8 !important",
                  textTransform: "inherit",
                  border: "4",
                  marginLeft: "-5px",
                }}
              >
                Send
              </Button>
              <input
                type="file"
                style={{ display: "none", marginTop: "2px" }}
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.pdf,.doc,.png"
                multiple
              />
              <Button
                onClick={() =>
                  document.querySelector('input[type="file"]').click()
                }
              >
                <AttachFileIcon />
              </Button>
            </Box>
            {loading && (
              <div>
                <CircularILoader />
              </div>
            )}
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
}

SendEmailModal.propTypes = {
  sendEmailModel: PropTypes.bool,
  setSendEmailModel: PropTypes.func.isRequired,
  moduleName: PropTypes.string.isRequired,
  documentData: PropTypes.objectOf,
  currentDocument: PropTypes.objectOf,
  templateHeader: PropTypes.objectOf,
  templateContact: PropTypes.objectOf,
  templateFooter: PropTypes.objectOf,
  contactInfo: PropTypes.objectOf,
  fromContactInfo: PropTypes.objectOf,
  documentToData: PropTypes.objectOf,
  tableFooterOptions: PropTypes.objectOf,
  termsAndConditionsData: PropTypes.objectOf,
  stripHTML: PropTypes.func,
  productData: PropTypes.objectOf,
};
