const handleDownloadPdf = ({ canvasElement, data, module }) => {
  // data?.map((item) => {
  //   const capture = document.querySelector(`.${canvasElement}-${item.id}`);
  //   if (!capture) {
  //     console.error('Element for capture not found.');
  //     return;
  //   }
  //   return html2canvas(capture).then((canvas) => {
  //     const imgData = canvas.toDataURL('img/png');
  //     const doc = new jsPDF('p', 'mm', 'a4');
  //     const componentWidth = doc.internal.pageSize.getWidth();
  //     const componentHeight = doc.internal.pageSize.getHeight();
  //     doc.addImage(imgData, 'JPEG', 0, 0, componentWidth, componentHeight, '', 'FAST');
  //     doc.save(`${module}-${item.id}.pdf`);
  //     enqueueSnackbar('PDF file downloaded successfully!', {
  //       variant: 'success'
  //     });
  //   });
  // });
};

export default handleDownloadPdf;
