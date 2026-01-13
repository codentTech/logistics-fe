'use client';

import { pdf } from '@react-pdf/renderer';

const handleDocumentPdfFile = async (component, fileName = 'document') => {
  // Generate PDF document
  const doc = pdf(component);

  // Convert PDF document to blob
  const blob = await doc.toBlob();

  // Create a file from the blob
  const file = new File([blob], `${fileName}.pdf`, {
    type: 'application/pdf'
  });
  return file;
};

export default handleDocumentPdfFile;
