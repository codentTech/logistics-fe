import JSZip from 'jszip';
import { pdf } from '@react-pdf/renderer';

const handleDownloadPdfAsZip = async (component, setOpenPopup) => {
  const zip = new JSZip(); // Create a new zip archive
  const doc = pdf(component);
  const blob = await doc.toBlob();
  zip.file('document.pdf', blob);

  // Generate the ZIP file
  const zipBlob = await zip.generateAsync({ type: 'blob' });

  // Create a download link for the ZIP file
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(zipBlob);
  downloadLink.download = 'document.zip'; // Set the ZIP file name

  // Set the content type to 'application/zip'
  downloadLink.type = 'application/zip';

  // Trigger the download
  downloadLink.click();

  // Revoke the object URL to free up resources
  URL.revokeObjectURL(downloadLink.href);
  setOpenPopup(false);
};

export default handleDownloadPdfAsZip;
