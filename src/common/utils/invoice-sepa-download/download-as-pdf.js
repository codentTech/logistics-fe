const handleDownloadPdf = async ({ canvasElement, data, module, closePopUp }) => {
  // data?.forEach(async (item) => {
  //   const capture = document.querySelector(`.${canvasElement}-${item.id}`);
  //   if (!capture) {
  //     console.error('Element for capture not found.');
  //     return; // Skip this item and move to the next one
  //   }
  //   try {
  //     // Use html2canvas to capture the specified element as a canvas
  //     const canvas = await html2canvas(capture);
  //     // Create a new jsPDF instance
  //     const doc = new jsPDF();
  //     // Convert the canvas to a data URL
  //     const imgData = canvas.toDataURL('image/png');
  //     // Add the captured image to the PDF
  //     // doc.addImage(imgData, 'PNG', 10, 10, 190, 0);
  //     doc.addImage(imgData, 'JPEG', 10, 10, 190, 0, '', 'FAST');
  //     // Save the PDF with a unique name
  //     doc.save(`${module}-${item.id}.pdf`);
  //     enqueueSnackbar('PDF file downloaded successfully!', {
  //       variant: 'success'
  //     });
  //     closePopUp(false);
  //   } catch (error) {
  //     console.error('Error capturing element:', error);
  //   }
  // });
};

export default handleDownloadPdf;
