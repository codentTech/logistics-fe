import downloadBlob from '../document-file-download/download-blob';

const handleDownloadTxt = ({ data, module }) => {
  let txtContent = '';

  // Loop through the data and generate XML elements for each module
  data?.map((item) => {
    // TXT file structure
    txtContent += `
    ${module}id-${item.id}:
    ${module}data:
    - Tax Rate: ${item?.taxRate}
    - Set as default: ${item.defaultTaxRate}
      
    --------------------------------------------------------------------------------------------------\n\n`;

    return '';
  });

  // Create a Blob from the TXT content
  const blob = new Blob([txtContent], { type: 'text/plain' });

  downloadBlob(blob, `${module}.txt`, 'TXT file');
};

export default handleDownloadTxt;
