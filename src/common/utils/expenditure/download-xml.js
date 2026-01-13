import { enqueueSnackbar } from 'notistack';

const handleDownloadXml = ({ data, module }) => {
  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<${module}>`; // Initialize the XML content with a root <$> element

  data?.forEach((item, index) => {
    if (index !== 0) {
      // Add a separator before each module except the first one
      xmlContent +=
        '\n<separator>\n\n--------------------------------------------------------------------------------------------------\n\n</separator>\n\n';
    }

    xmlContent += `
        <${module}id-${item.id}>
        <${module}data>
            <company>${item?.customer && item?.customer.companyName}</company>
            <firstname>${item?.customer && item.customer.firstName}</firstname>
            <lastname>${item?.customer && item.customer.lastName}</lastname>
            <gender>${item?.customer && item?.customer.gender}</gender>
            <address>${item?.customer && item?.customer.address}</address>
            <country>${item?.customer && item?.customer.country}</country>
            <city>${item?.customer && item?.customer.city}</city>
            <iban>${item?.customer && item?.customer.iban}</iban>
            <bic>${item?.customer && item?.customer.bic}</bic>
            <accountowner>${
              item?.customer && item?.customer.accountOwnerName
            }</accountowner>
            <postalcode>${item?.customer && item?.customer.postalCode}</postalcode>
            <status>${item?.status && item?.status}</status>
            <categoryname
            >${item.CategoryId && item?.CategoryId.categoryName}</categoryname>
            <bankaccount
            >${item?.bankAccount && item?.bankAccount}</bankaccount
            >
            <cashdiscount>${item?.cashDiscount && item?.cashDiscount}</cashdiscount>
           <cashdiscountvalidity>${
             item?.cashDiscountValidity && item?.cashDiscountValidity
           }</cashdiscountvalidity>
           <description>${item?.description && item?.description}</description>

           <PartialPayments>
           ${item.partialPayments?.map((expenditure, index) => {
             return `<expenditure-${index + 1}>
             <partialpayment>${expenditure?.partialPayment || 0}</partialpayment>
             <comment>${expenditure?.comment}</comment>
             <balance>${expenditure?.balance}</balance>
             <receiptdate>
              ${expenditure?.receiptDate}</receiptdate>
    
             </expenditure-${index + 1}>`;
           })}
         </PartialPayments>

        
        </${module}data>
        </${module}id-${item.id}>
      `;
  });

  xmlContent += `
</${module}>`; // Close the root <offers> element

  // Create a Blob from the XML content
  const blob = new Blob([xmlContent], { type: 'application/xml' });

  // Create a URL for the Blob
  const blobUrl = URL.createObjectURL(blob);

  // Create a link to download the Blob
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = `${module}.xml`;
  enqueueSnackbar('XML file downloaded successfully!', {
    variant: 'success'
  });

  // Append the link to the document
  document.body.appendChild(downloadLink);

  // Simulate a click to trigger the download
  downloadLink.click();

  // Clean up the Blob URL
  URL.revokeObjectURL(blobUrl);
};

export default handleDownloadXml;
