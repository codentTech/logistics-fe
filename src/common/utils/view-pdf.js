const handleViewPdf = async ({ canvasElement }) => {
  // const capture = document.querySelector(`.${canvasElement}`);
  // if (!capture) {
  //   console.error('Element for capture not found.');
  //   return;
  // }
  // html2canvas(capture).then((canvas) => {
  //   const imgData = canvas.toDataURL('img/png');
  //   const doc = new jsPDF('p', 'mm', 'a4');
  //   const componentWidth = doc.internal.pageSize.getWidth();
  //   const componentHeight = doc.internal.pageSize.getHeight();
  //   // doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
  //   doc.addImage(imgData, 'JPEG', 0, 0, componentWidth, componentHeight, '', 'FAST');
  //   // Convert the PDF to a Blob
  //   const pdfBlob = doc.output('blob');
  //   // Create a Blob URL
  //   const pdfBlobUrl = URL.createObjectURL(pdfBlob);
  //   // Open the PDF in a new tab
  //   const newTab = window.open(pdfBlobUrl, '_blank');
  //   if (!newTab) {
  //     console.error('Failed to open new tab.');
  //   }
  //   // Clean up the Blob URL
  //   URL.revokeObjectURL(pdfBlobUrl);
  // });
};

export default handleViewPdf;
