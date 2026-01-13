import { enqueueSnackbar } from 'notistack';

const downloadBlob = (blob, file, message) => {
  // Create a URL for the Blob
  const blobUrl = URL.createObjectURL(blob);

  // Create a link to download the Blob
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = file;

  // Success message for download
  enqueueSnackbar(`${message} file downloaded successfully!`, {
    variant: 'success'
  });

  // Append the link to the document
  document.body.appendChild(downloadLink);

  // Simulate a click to trigger the download
  downloadLink.click();

  // Clean up the Blob URL
  URL.revokeObjectURL(blobUrl);
};

export default downloadBlob;
