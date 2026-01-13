'use client';

import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

const handleDownloadPdf = async (component, setOpenPopup) => {
  const doc = pdf(component);
  const blob = await doc.toBlob();
  saveAs(blob, 'document.pdf');
  setOpenPopup(false);
};

export default handleDownloadPdf;
