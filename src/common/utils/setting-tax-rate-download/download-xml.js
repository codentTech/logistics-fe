import downloadBlob from '../document-file-download/download-blob';

const handleDownloadXml = ({ data, module }) => {
  // Initialize the XML content with a root <$> element.
  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<${module}>`;

  data?.forEach((item, index) => {
    if (index !== 0) {
      // Add a separator before each module except the first one
      xmlContent +=
        '\n<separator>\n\n--------------------------------------------------------------------------------------------------\n\n</separator>\n\n';
    }

    xmlContent += `
        <${module}id-${item.id}>
        <${module}data>
            <TaxRate>${item?.taxRate}</TaxRate>
            <SetAsDefault >${item?.defaultTaxRate}</SetAsDefault>
        </${module}data>
        </${module}id-${item.id}>
      `;
  });

  // Close the root <offers> element
  xmlContent += `</${module}>`;

  // Create a Blob from the XML content
  const blob = new Blob([xmlContent], { type: 'application/xml' });

  downloadBlob(blob, `${module}.xml`, 'XML');
};

export default handleDownloadXml;
