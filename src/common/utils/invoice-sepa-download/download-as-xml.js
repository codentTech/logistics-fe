import { enqueueSnackbar } from 'notistack';
import { netAmount, taxRate } from '../product-calculations/amount-calculations';

const handleDownloadXml = ({ data, module, closePopUp }) => {
  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<${module}>`; // Initialize the XML content with a root <$> element

  data?.forEach((item, index) => {
    if (index !== 0) {
      // Add a separator before each module except the first one
      xmlContent +=
        '\n<separator>\n\n--------------------------------------------------------------------------------------------------\n\n</separator>\n\n';
    }

    xmlContent += `
        <${module}data>
            <CompanyName>${item?.customer && item?.customer.companyName}</CompanyName>
            <FirstName>${item?.customer && item.customer.firstName}</FirstName>
            <LastName>${item?.customer && item.customer.lastName}</LastName>
            <InvoiceNumber>${item?.id}</InvoiceNumber>
            <TotalAmount>${
              netAmount(item && item?.invoiceProducts) +
              netAmount(item && item?.invoiceProducts) *
                taxRate(item && item?.invoiceProducts)
            }</TotalAmount>
        
        </${module}data>
      `;

    xmlContent += `
</${module}>`; // Close the root <offers> element

    // Create a Blob from the XML content
    const blob = new Blob([xmlContent], { type: 'application/xml' });

    // Create a URL for the Blob
    const blobUrl = URL.createObjectURL(blob);

    // Create a link to download the Blob
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = `${module}-${item.id}.xml`;
    enqueueSnackbar('XML file downloaded successfully!', {
      variant: 'success'
    });
    closePopUp(false);
    // Append the link to the document
    document.body.appendChild(downloadLink);

    // Simulate a click to trigger the download
    downloadLink.click();

    // Clean up the Blob URL
    URL.revokeObjectURL(blobUrl);
  });
};

export default handleDownloadXml;
