import { enqueueSnackbar } from 'notistack';
import striptags from 'striptags';
import * as XLSX from 'xlsx';
import {
  invoiceAmountWithOutVAT,
  invoiceAmountWithVAT,
  lineItemNetAmount,
  plusVat
} from '../product-calculations/amount-calculations';
import calculateProductTotalPrice from '../product-calculations/calculate-product-total';

const handleDownloadXls = ({ data, module }) => {
  // Create an array to store the worksheet data
  const worksheetData = [
    [
      'Company Name',
      'First Name',
      'Last Name',
      'Address',
      'Customer Id',
      'Gender',
      'Designation',
      'Fax',
      'Website Url',
      'Mendate Referance',
      'Mandate GenerateDate',
      'Account OwnerName',
      'Contact PersonName',
      'Mobile',
      'Email',
      'Address Label',
      'Streat No',
      'Delivery Date',
      'Expiry Date',
      'Postal Code',
      'Country',
      'City',
      'IBAN',
      'BIC',
      'TIN',
      'VAT',
      'Net Amount',
      'Plus Vat',
      'Invoice Amount',
      'Body',
      'Disclaimer',
      'Terms and Condition',
      'Copyright',
      'Product Name',
      'Description',
      'Quantity',
      'Position No',
      'Unit',
      'Price',
      'Tax',
      'Discount',
      'Total'
    ]
  ];

  data?.forEach((item) => {
    // Remove html tags from texts
    const cleanedBody = striptags(
      (item[`${module}Body`] && item[`${module}Body`].bodyDescription) ||
        (item.body && item.body.description)
    );
    const cleanedDisclaimer = striptags(
      (item[`${module}Disclaimer`] &&
        item[`${module}Disclaimer`]?.disclaimerDescription.replace(/&nbsp;/g, '')) ||
        (item.disclaimer && item.disclaimer.description.replace(/&nbsp;/g, ''))
    );
    const cleanedTermsAndCondition = striptags(
      (item?.termsAndConditions && item?.termsAndConditions.replace(/&nbsp;/g, '')) ||
        (item.disclaimer && item.disclaimer.replace(/&nbsp;/g, ''))
    );
    const cleanedCopyright = striptags(
      item?.copyRight && item?.copyRight.replace(/&nbsp;/g, '')
    );

    // VAT calculation
    const vat = plusVat(item[`${module}Products`]);

    // netAmount calculation
    const netAmount = lineItemNetAmount(item[`${module}Products`]).toFixed(2);

    // Invoice amount calculation
    const invoiceAmount = item.isVat
      ? invoiceAmountWithVAT(item[`${module}Products`]).toFixed(2)
      : invoiceAmountWithOutVAT(item[`${module}Products`]).toFixed(2);

    const products = item[`${module}Products`];
    const rowDataHeader = [
      item?.customer?.companyName,
      item?.customer?.firstName,
      item?.customer?.lastName,
      item?.customer?.address,
      item?.customer && item?.customer.id,
      item?.customer && item?.customer.gender,
      item?.customer && item?.customer.designation,
      item?.customer && item?.customer.companyFax,
      item?.customer && item?.customer.companyUrl,
      item?.customer && item?.customer.mendateReferance,
      item?.customer && item?.customer.mandateGenerateDate?.split('T')[0],
      item?.customer && item?.customer.accountOwnerName,
      `${item?.customerContactPerson?.firstName} ${item?.customerContactPerson?.lastName}`,
      item?.customer && item?.customer.companyMobile,
      item?.customer && item?.customer.companyEmail,
      (item?.customerCompanyAddress && item?.customerCompanyAddress.addressLabel) ||
        (item?.customer && item?.customer.address),
      (item?.customerCompanyAddress && item?.customerCompanyAddress.streatNo) ||
        (item?.customer && item?.customer.streatNo),
      item && item?.deliveryDate,
      item && item?.expiryDate,
      item?.customer?.postalCode,
      (item.customerContactPerson && item.customerContactPerson.country) ||
        (item?.customer && item?.customer.country),
      (item.customerContactPerson && item.customerContactPerson.city) ||
        (item?.customer && item?.customer.city),
      item?.customer && item?.customer.iban,
      item?.customer && item?.customer.bic,
      item?.customer && item?.customer.tin,
      item?.customer && item?.customer.vat,
      netAmount,
      vat,
      invoiceAmount,
      cleanedBody,
      cleanedDisclaimer,
      cleanedTermsAndCondition,
      cleanedCopyright
    ];

    // If products exist, process each
    if (products?.length > 0) {
      products.forEach((product) => {
        const total = calculateProductTotalPrice({
          discount: product.lineItemDiscount,
          discountGroups: product.discountGroups,
          quantity: product.quantity || 0,
          netPrice: product.netPrice || 0
        });

        const rowData = [
          ...rowDataHeader,
          product?.productName || (product?.product && product?.product?.productName),
          product?.description || (product?.product && product?.product?.description),
          product?.quantity || (product?.product && product?.product?.quantity),
          product?.positionNo || (product?.product && product?.product?.positionNo),
          (product?.unit && product?.unit.unit) ||
            (product?.product && product?.product?.unit && product?.product?.unit.unit),
          (product?.product && product?.product?.netPrice) || product?.netPrice,
          (product?.product && product?.taxRate?.taxRate) ||
            (product.product && product.product?.taxRate?.taxRate) ||
            0,
          (product && product?.lineItemDiscount) ||
            (product?.discountGroups &&
              product?.discountGroups[0]?.ProductDiscountGroup.discount) ||
            (product?.discountGroups &&
              product?.discountGroups[0]?.ProductDiscountGroup.disco) ||
            (product?.discountGroups &&
              product?.discountGroups[0]?.ProductDiscountGroup.dis) ||
            0,
          total
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
