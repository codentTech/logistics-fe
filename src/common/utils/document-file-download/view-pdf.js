'use client';

import { pdf } from '@react-pdf/renderer';

const handleViewPdf = async (component, setOpenPopup) => {
  const doc = pdf(component);
  const blob = await doc.toBlob();

  // Create a data URL from the blob
  const dataUrl = URL.createObjectURL(blob);

  // Open a new tab and set its content to the PDF
  const newTab = window.open();
  newTab.document.write(`<iframe width="100%" height="100%" src="${dataUrl}"></iframe>`);
  setOpenPopup(false);
};

export default handleViewPdf;
