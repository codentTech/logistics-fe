'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { documentSendAsEmail } from '@/provider/features/document-conversion/document-conversion.slice';
import { HANDLE_FILE_SIZE_CHECK } from '@/common/utils/document-helpers/document-helpers';
import handleDocumentPdfFile from '@/common/utils/document-file-download/document-pdf-file';
import DocumentPdf from '../document/document-pdf/document-pdf';

export default function useEmailSendModal({
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
  productData
}) {
  const dispatch = useDispatch();
  const editorRef = useRef(null);
  const [recipientEmails, setRecipientEmails] = useState([]);
  const [bccEmails, setBccEmails] = useState([]);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [attachedDocument, setAttachedDocument] = useState([]);

  const schema = yup.object().shape({
    recipient: yup
      .array()
      .of(yup.string().email('Invalid email format'))
      .required('Required'),
    BCC: yup
      .array()
      .of(yup.string().email('Invalid email format'))
      .required('BCC Required'),
    subject: yup.string().required('Subject is equired')
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange'
  });

  useEffect(() => {
    documentPdf();
    setValue('subject', currentDocument && currentDocument.displayId);
    setMessage(
      (currentDocument && currentDocument.company) ||
        `${currentDocument && currentDocument.firstName} ${
          currentDocument && currentDocument.lastName
        }`
    );
  }, [sendEmailModel]);

  useEffect(() => {
    setValue('recipient', recipientEmails);
    setValue('BCC', bccEmails);
  }, [recipientEmails, bccEmails, setValue]);

  const handleOnCancel = () => {
    setValue('recipient', '');
    setValue('BCC', '');
    setValue('subject', '');
    setBccEmails([]);
    setAttachedFiles([]);
    setShowError(false);
    setSendEmailModel(false);
    setRecipientEmails([]);
  };

  const documentPdf = async () => {
    const pdfAsFile = await handleDocumentPdfFile(
      // eslint-disable-next-line react/jsx-filename-extension
      <DocumentPdf
        module={moduleName}
        document={documentData}
        stripHTML={stripHTML}
        productData={productData}
        documentToData={documentToData}
        from={fromContactInfo}
        contact={contactInfo}
        templateHeader={templateHeader}
        templateContact={templateContact}
        templateFooter={templateFooter}
        tableFooterOptions={tableFooterOptions}
        termsAndConditionsData={termsAndConditionsData}
      />,
      (currentDocument && currentDocument.displayId) || 'document'
    );

    setAttachedDocument(pdfAsFile);
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);

    const formDataArray = []; // Create an array to store FormData for each image
    const filteredFiles = HANDLE_FILE_SIZE_CHECK({ files, setLoading });

    // for (let i = 0; i < filteredFiles.length; i++) {
    //   const formData = new FormData();
    //   formData.append('file', filteredFiles[i]);
    //   formData.append('module', moduleName);

    //   formDataArray.push(formData); // Add FormData to the array
    // }

    // setLoading(true);
    // const uploadPromises = formDataArray.map((formData) =>
    //   dispatch(uploadSingleFile({ payload: formData }))
    // );
    // const responses = await Promise.all(uploadPromises);

    // const attachments = responses?.map((file) => {
    //   return file.payload.url;
    // });

    // const copy = attachedFiles;

    // attachments.forEach((file) => {
    //   copy?.push(file);
    // });

    setAttachedFiles([...attachedFiles, ...filteredFiles]);
    setLoading(false);

    // Reset the input element value
    event.target.value = '';
  };

  const removeAttachedFile = (index) => {
    setAttachedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setShowError(true);
    const message = editorRef.current.getContent();
    if (recipientEmails.length) {
      const payload = {
        toAddresses: data?.recipient || undefined,
        ccAddresses: data?.BCC || undefined,
        subject: data?.subject || undefined,
        body: message || undefined,
        attachments: attachedFiles || undefined,
        document: [attachedDocument] || undefined
      };
      const response = await dispatch(documentSendAsEmail({ payload }));
      if (response.meta.requestStatus === 'fulfilled') {
        handleOnCancel();
        setSendEmailModel(false);
      }
    }
  };

  return {
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
    message
  };
}
