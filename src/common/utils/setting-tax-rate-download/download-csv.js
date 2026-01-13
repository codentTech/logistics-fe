import downloadBlob from '../document-file-download/download-blob';

const handleDownloadCsv = ({ data, module }) => {
  let csvContent = 'Tax Rate,Set as default\n';

  // Iterate through each item in the 'data' array
  data?.forEach((item) => {
    csvContent += `${item?.taxRate},${item.defaultTaxRate}\n`; // Add '\n' to separate rows
  });

  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv' });

  downloadBlob(blob, `${module}.csv`, 'CSV');
};

export default handleDownloadCsv;
