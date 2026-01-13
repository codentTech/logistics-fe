import { enqueueSnackbar } from 'notistack';

const handleDownloadTxt = ({ data, module }) => {
  let txtContent = '';

  // Loop through the data and generate XML elements for each module
  data?.forEach((item) => {
    // Partial Payment structs
    const partialPayments = item.partialPayments
      ?.map((expenditure, index) => {
        return `
        Partial Payment - ${index + 1}
        - Partial Payment: ${expenditure?.partialPayment}
        - Comment: ${expenditure?.comment}
        - Balance: ${expenditure?.balance}
        - Receipt Date: ${expenditure?.receiptDate}
`;
      })
      .join('\n');

    // TXT file structure
    txtContent += `
    ${module}id-${item.id}:
    ${module}data:
    - Company: ${item?.customer?.companyName}
    - First Name: ${item?.customer && item.customer.firstName}
    - Last Name: ${item?.customer && item.customer.lastName}
    - Gender: ${item?.customer && item?.customer.gender}
    - Address: ${item?.customer && item?.customer.address}
    - Country: ${item?.customer && item?.customer.country}
    - City: ${item?.customer && item?.customer.city}
    - IBAN: ${item?.customer && item?.customer.iban}
    - BIC: ${item?.customer && item?.customer.bic}
    - Account Owner: ${item?.customer && item?.customer.accountOwnerName}
    - Postal Code: ${item?.customer && item?.customer.postalCode}
    - Status: ${item && item?.status}
    - Category Name: ${item.CategoryId && item?.CategoryId.categoryName}
    - Bank Account: ${item?.bankAccount && item?.bankAccount}
    - Cash Discount: ${item?.cashDiscount && item?.cashDiscount}
    - Cash Discount Validity: ${item?.cashDiscountValidity && item?.cashDiscountValidity}
    - Description: ${item?.description && item?.description}
      
    - Partial Payments:
    ${partialPayments}
      
      ---\n\n`;
  });

  // Create a Blob from the TXT content
  const blob = new Blob([txtContent], { type: 'text/plain' });
  enqueueSnackbar('TXT file downloaded successfully!', {
    variant: 'success'
  });

  // Create a URL for the Blob
  const blobUrl = URL.createObjectURL(blob);

  // Create a link to download the Blob
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = `${module}.txt`;

  // Append the link to the document
  document.body.appendChild(downloadLink);

  // Simulate a click to trigger the download
  downloadLink.click();

  // Clean up the Blob URL
  URL.revokeObjectURL(blobUrl);
  return txtContent;
};

export default handleDownloadTxt;
