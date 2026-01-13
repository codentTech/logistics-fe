import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import DOCUMENT from '@/common/constants/document.constants';
import { HANDLE_FILE_SIZE_CHECK } from '@/common/utils/document-helpers/document-helpers';
import {
  getSingleCustomer,
  uploadCustomerFiles
} from '@/provider/features/customer/customer.slice';
import {
  getSingleDeliveryNotes,
  uploadDeliveryNotesFiles
} from '@/provider/features/delivery-notes/delivery-notes.slice';
import {
  getSingleInvoice,
  uploadInvoiceFiles
} from '@/provider/features/invoice/invoice.slice';
import { getSingleOffer, uploadOfferFiles } from '@/provider/features/offer/offer.slice';
import { getSingleOrder, uploadOrderFiles } from '@/provider/features/order/order.slice';
import { uploadSingleFile } from '@/provider/features/upload-file/upload-file.slice';

function useFileInput({ module, moduleName, attachmentsFun, editFiles }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [alreadyExistPopup, setAlreadyExistPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [singleDocument, setSingleDocument] = useState([]);
  const [alreadyExistFileHandle, setAlreadyExistFileHandle] = useState([]); // Track already Exist files
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDeleteIconVisible, setDeleteIconVisible] = useState(0);

  useEffect(() => {
    module && getDocumentData();
  }, [module, status, alreadyExistPopup]);

  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  const documentAttachments = singleDocument?.attachments
    ? singleDocument?.attachments?.map(({ file }) => {
        return {
          name: file.name,
          key: file.key,
          url: file.url,
          id: file.id
        };
      })
    : [];

  // Function to check the already exist files
  const alreadyExist = (files) => {
    const response =
      files.length &&
      files.filter((document) => {
        return documentAttachments.some((file) => document.name === file.name);
      });
    return response;
  };

  const getDocumentData = async () => {
    const payload = module.id;
    const getAllData =
      moduleName === DOCUMENT.OFFER
        ? await dispatch(getSingleOffer({ payload }))
        : moduleName === DOCUMENT.ORDER
        ? await dispatch(getSingleOrder({ payload }))
        : moduleName === DOCUMENT.INVOICE
        ? await dispatch(getSingleInvoice({ payload }))
        : moduleName === DOCUMENT.DELIVERY_NOTES
        ? await dispatch(getSingleDeliveryNotes({ payload }))
        : moduleName === DOCUMENT.CUSTOMER
        ? await dispatch(getSingleCustomer({ payload }))
        : moduleName === DOCUMENT.EXPENDITURE
        ? { payload: module }
        : null;
    setSingleDocument(getAllData.payload);
  };

  const handleAPIForModules = async (attachments) => {
    const payload = { attachments, id: module && module.id };
    switch (moduleName) {
      case DOCUMENT.OFFER:
        return dispatch(uploadOfferFiles({ payload }));
      case DOCUMENT.ORDER:
        return dispatch(uploadOrderFiles({ payload }));
      case DOCUMENT.INVOICE:
        return dispatch(uploadInvoiceFiles({ payload }));
      case DOCUMENT.DELIVERY_NOTES:
        return dispatch(uploadDeliveryNotesFiles({ payload }));
      case DOCUMENT.CUSTOMER:
        return dispatch(uploadCustomerFiles({ payload }));
      case DOCUMENT.EXPENDITURE:
        return editFiles ? attachments : null;
      default:
        // Handle other cases if needed
        break;
    }
  };

  const handleUploadFileAPI = async (files) => {
    const formDataArray = []; // Create an array to store FormData for each image

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      formData.append('module', moduleName);

      formDataArray.push(formData); // Add FormData to the array
    }

    const uploadPromises = formDataArray.map((formData) =>
      dispatch(uploadSingleFile({ payload: formData }))
    );
    const responses = await Promise.all(uploadPromises);

    const attachments = responses
      .filter((response) => response?.meta?.requestStatus === 'fulfilled')
      .map((response) => ({
        name: response.payload.name,
        key: response.payload.key,
        url: response.payload.url
      }));

    if (!editFiles) {
      moduleName === DOCUMENT.EXPENDITURE && attachmentsFun(attachments);
    }
    if (editFiles) {
      const finalArray = module.attachments.map((item) => {
        return {
          id: item.file.id,
          name: item.file.name,
          key: item.file.key,
          url: item.file.url
        };
      });
      const filesAttachment = finalArray.concat(attachments);
      moduleName === DOCUMENT.EXPENDITURE && attachmentsFun(filesAttachment);
    }
    return attachments;
  };

  const handleFileInputChange = async (event) => {
    setLoading(true);
    const { files } = event.target;
    const filteredFiles = HANDLE_FILE_SIZE_CHECK({
      files,
      setLoading
    });

    if (filteredFiles && filteredFiles.length === 0) {
      event.target.value = '';
      return;
    }
    const isAlreadyExist = alreadyExist(filteredFiles);

    if (isAlreadyExist.length) {
      setAlreadyExistFileHandle(isAlreadyExist);
      setUploadedFiles(filteredFiles);
      setAlreadyExistPopUp(true);

      // Reset the input element value
      event.target.value = '';
    } else {
      const response = await handleUploadFileAPI(filteredFiles);
      const combinedAttachments = documentAttachments.concat(response);
      const result = await handleAPIForModules(combinedAttachments);
      setStatus(result);
      setLoading(false);

      // Reset the input element value
      event.target.value = '';
    }
  };

  const handleYesConfirmation = async () => {
    // Remove existing files from documents attachments array
    const removeExistingFile = documentAttachments
      .map((attachment) => {
        const matchingFile = alreadyExistFileHandle.find(
          (file) => file.name === attachment.name
        );

        if (matchingFile) {
          return null;
        }
        return attachment;
      })
      .filter((attachment) => attachment !== null);

    const response = await handleUploadFileAPI(uploadedFiles);
    const newAttachments = removeExistingFile.concat(response);
    const result = await handleAPIForModules(newAttachments);
    result && setLoading(false);
    setAlreadyExistFileHandle([]); // Clear the alreadyExistFileHandle state
    setUploadedFiles([]); // Clear the uploadedFiles state
    setStatus(result);
    setAlreadyExistPopUp(false); // Close the confirmation dialog
  };

  const handleCancel = async () => {
    // Remove existing files from uploaded files array
    const removeExistingFile = uploadedFiles
      .map((file) => {
        const matchingFile = documentAttachments.find(
          (attachment) => attachment.name === file.name
        );

        if (matchingFile) {
          return null;
        }
        return file;
      })
      .filter((file) => file !== null);

    if (removeExistingFile.length) {
      const response = await handleUploadFileAPI(removeExistingFile);
      const newAttachments = documentAttachments.concat(response);
      const result = await handleAPIForModules(newAttachments);
      setStatus(result);
    }
    setLoading(false);

    setAlreadyExistFileHandle([]); // Clear the alreadyExistFileHandle state
    setUploadedFiles([]); // Clear the uploadedFiles state
    setAlreadyExistPopUp(false); // Close the confirmation dialog
  };

  const handleDeleteIconVisibility = (index) => {
    setDeleteIconVisible(index + 1);
  };

  const handleDeleteFile = (filesToBeDeleted) => {
    const files = documentAttachments?.filter((file) => file.id !== filesToBeDeleted.id);
    handleAPIForModules(files);
    getDocumentData();
  };

  const handleOpenModal = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return {
    open,
    handleClose,
    fileInputRef,
    handleUploadButtonClick,
    handleFileInputChange,
    loading,
    singleDocument,
    alreadyExistPopup,
    handleYesConfirmation,
    handleCancel,
    isDeleteIconVisible,
    setDeleteIconVisible,
    handleDeleteIconVisibility,
    handleDeleteFile,
    handleOpenModal
  };
}

export default useFileInput;
