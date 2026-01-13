const handleDownloadPdfAsZip = async ({ canvasElement, data, module }) => {
  // const zip = new JSZip(); // Create a new zip archive
  // await Promise.all(
  //   data?.map(async (item) => {
  //     const capture = document.querySelector(`.${canvasElement}-${item.id}`);
  //     if (!capture) {
  //       console.error('Element for capture not found.');
  //       return;
  //     }
  //     const canvas = await html2canvas(capture);
  //     const imgData = canvas.toDataURL('image/png');
  //     const doc = new jsPDF('p', 'mm', 'a4');
  //     const componentWidth = doc.internal.pageSize.getWidth();
  //     const componentHeight = doc.internal.pageSize.getHeight();
  //     doc.addImage(imgData, 'JPEG', 0, 0, componentWidth, componentHeight, '', 'FAST');
  //     // Convert the PDF Blob to Uint8Array for adding to the zip
  //     const pdfBytes = doc.output('arraybuffer');
  //     zip.file(`${module}-${item.id}.pdf`, pdfBytes);
  //     enqueueSnackbar('ZIP file downloaded successfully!', {
  //       variant: 'success'
  //     });
  //   })
  // );
  // // Generate the zip file and module it for download
  // zip.generateAsync({ type: 'blob' }).then((zipBlob) => {
  //   const zipBlobUrl = URL.createObjectURL(zipBlob);
  //   const downloadLink = document.createElement('a');
  //   downloadLink.href = zipBlobUrl;
  //   downloadLink.download = `${module}.zip`; // Set the zip file name
  //   downloadLink.click();
  //   URL.revokeObjectURL(zipBlobUrl);
  // });
};

export default handleDownloadPdfAsZip;
