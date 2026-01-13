import { enqueueSnackbar } from 'notistack';
import * as XLSX from 'xlsx';

const handleDownloadXls = ({ data, module }) => {
  // Create an array to store the worksheet data
  const worksheetData = [
    [
      'CompanyName',
      'Name',
      'Address',
      'PostalCode',
      'Country',
      'City',
      'IBAN',
      'BIC',
      'AccountOwner',
      'PostalCode',
      'Status',
      'CategoryName',
      'BankAccount',
      'CashDiscount',
      'CashDiscountValidity',
      'Description',
      'PartialPayment',
      'Comment',
      'Balance',
      'ReceiptDate'
    ]
  ];

  data?.forEach((item) => {
    const rowDataHeader = [
      item?.customer?.companyName,
      `${item?.customer?.firstName} ${item?.customer?.lastName}`,
      item?.customer?.address,
      item?.customer?.postalCode,
      item?.customer?.country,
      item?.customer?.city,
      item?.customer && item?.customer.iban,
      item?.customer && item?.customer.bic,
      item?.customer && item?.customer.accountOwnerName,
      item?.customer && item?.customer.postalCode,
      item?.status && item?.status,
      item.CategoryId && item?.CategoryId.categoryName,
      item?.bankAccount && item?.bankAccount,
      item?.cashDiscount && item?.cashDiscount,
      item?.cashDiscountValidity && item?.cashDiscountValidity,
      item?.description && item?.description
    ];

    // If partialPayments exist, process each
    if (item?.partialPayments?.length > 0) {
      item.partialPayments.forEach((expenditure) => {
        const rowData = [
          ...rowDataHeader,
          expenditure?.partialPayment,
          expenditure?.comment,
          expenditure?.balance,
          expenditure?.receiptDate
        ];

        worksheetData.push(rowData);
      });
    } else {
      // Include an empty row for offers with no partial payments
      const emptyRow = [...rowDataHeader, '', '', '', ''];
      worksheetData.push(emptyRow);
    }
  });

  const ws = XLSX.utils.json_to_sheet(worksheetData, { skipHeader: true });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }

  // Create a Blob from the Excel data
  const blob = new Blob([s2ab(XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }))], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  // Create a URL for the Blob
  const blobUrl = URL.createObjectURL(blob);

  // Create a link to download the Blob
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = `${module}.xlsx`;
  enqueueSnackbar('XLS file downloaded successfully!', {
    variant: 'success'
  });

  // Append the link to the document
  document.body.appendChild(downloadLink);

  // Simulate a click to trigger the download
  downloadLink.click();

  // Clean up the Blob URL
  URL.revokeObjectURL(blobUrl);
};

export default handleDownloadXls;
