import { enqueueSnackbar } from 'notistack';

const handleDownloadCsv = ({ data, module }) => {
  let csvContent =
    'CompanyName,Name,Address,PostalCode,Country,City,IBAN,BIC,AccountOwner,PostalCode,Status,CategoryName,BankAccount,CashDiscount,CashDiscountValidity,Description,PartialPayment,Comment,Balance,ReceiptDate\n';

  data?.forEach((item) => {
    if (item?.partialPayments) {
      if (item?.partialPayments.length > 0) {
        let isFirstPartialPayment = true;

        // Loop through partial payments within the offer
        item.partialPayments.forEach((expenditure) => {
          if (isFirstPartialPayment) {
            csvContent += `"${item?.customer?.companyName}",${
              item?.customer?.firstName
            } ${item?.customer?.lastName},"${item?.customer?.address}",${
              item?.customer?.postalCode
            },${item?.customer?.country},${item?.customer?.city},"${
              item?.customer && item?.customer.iban
            }","${item?.customer && item?.customer.bic}","${
              item?.customer && item?.customer.accountOwnerName
            }",${item?.customer && item?.customer.postalCode},${
              item?.status && item?.status
            },"${item.CategoryId && item?.CategoryId.categoryName}","${
              item?.bankAccount && item?.bankAccount
            }","${item?.cashDiscount && item?.cashDiscount}","${
              item?.cashDiscountValidity && item?.cashDiscountValidity
            }","${item?.description && item?.description}",`;
            isFirstPartialPayment = false;
          } else {
            csvContent += ',,,,,,,,,,,,,,,,';
          }

          csvContent += `"${expenditure?.partialPayment}","${expenditure?.comment}",${expenditure?.balance},"${expenditure?.receiptDate}"\n`;
        });
      } else {
        csvContent += `"${item?.customer?.companyName}",${item?.customer?.firstName} ${
          item?.customer?.lastName
        },"${item?.customer?.address}",${item?.customer?.postalCode},${
          item?.customer?.country
        },${item?.customer?.city},"${item?.customer && item?.customer.iban}","${
          item?.customer && item?.customer.bic
        }","${item?.customer && item?.customer.accountOwnerName}",${
          item?.customer && item?.customer.postalCode
        },${item?.status && item?.status},"${
          item.CategoryId && item?.CategoryId.categoryName
        }","${item?.bankAccount && item?.bankAccount}","${
          item?.cashDiscount && item?.cashDiscount
        }","${item?.cashDiscountValidity && item?.cashDiscountValidity}","${
          item?.description && item?.description
        }",,,,,,,,,,,""\n`;
      }
    }
  });

  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv' });
  enqueueSnackbar('CSV file downloaded successfully!', {
    variant: 'success'
  });

  // Create a URL for the Blob
  const blobUrl = URL.createObjectURL(blob);

  // Create a link to download the Blob
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = `${module}.csv`;

  // Append the link to the document
  document.body.appendChild(downloadLink);

  // Simulate a click to trigger the download
  downloadLink.click();

  // Clean up the Blob URL
  URL.revokeObjectURL(blobUrl);
};

export default handleDownloadCsv;
