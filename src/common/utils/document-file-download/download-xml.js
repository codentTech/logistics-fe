import { enqueueSnackbar } from "notistack";
import striptags from "striptags";
import {
  invoiceAmountWithOutVAT,
  invoiceAmountWithVAT,
  lineItemNetAmount,
  plusVat,
} from "../product-calculations/amount-calculations";
import calculateProductTotalPrice from "../product-calculations/calculate-product-total";

const handleDownloadXml = ({ data, module }) => {
  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<${module}>`; // Initialize the XML content with a root <$> element.

  data?.forEach((item, index) => {
    if (index !== 0) {
      // Add a separator before each module except the first one
      xmlContent +=
        "\n<separator>\n\n--------------------------------------------------------------------------------------------------\n\n</separator>\n\n";
    }

    // Remove html tags from texts
    const cleanedBody = striptags(
      (item[`${module}Body`] && item[`${module}Body`].bodyDescription) ||
        (item.body && item.body.description)
    );
    const cleanedDisclaimer = striptags(
      (item[`${module}Disclaimer`] &&
        item[`${module}Disclaimer`]?.disclaimerDescription.replace(/&nbsp;/g, "")) ||
        (item.disclaimer && item.disclaimer.description.replace(/&nbsp;/g, ""))
    );
    const cleanedTermsAndCondition = striptags(
      (item?.termsAndConditions && item?.termsAndConditions.replace(/&nbsp;/g, "")) ||
        (item.disclaimer && item.disclaimer.replace(/&nbsp;/g, ""))
    );
    const cleanedCopyright = striptags(item?.copyRight && item?.copyRight.replace(/&nbsp;/g, ""));

    // VAT calculation
    const vat = plusVat(item[`${module}Products`]);

    // netAmount calculation
    const netAmount = lineItemNetAmount(item[`${module}Products`]).toFixed(2);

    // Invoice amount calculation
    const invoiceAmount = item.isVat
      ? invoiceAmountWithVAT(item[`${module}Products`]).toFixed(2)
      : invoiceAmountWithOutVAT(item[`${module}Products`]).toFixed(2);

    xmlContent += `
        <${module}id-${item.id}>
        <${module}data>
            <company>${item?.customer && item?.customer.companyName}</company>
            <firstName>${item?.customer && item.customer.firstName}</firstName>
            <lastName>${item?.customer && item.customer.lastName}</lastName>
            <customerId>${item?.customer && item?.customer.id}</customerId>
            <gender>${item?.customer && item?.customer.gender}</gender>
            <designation>${item?.customer && item?.customer.designation}</designation>
            <address>${item?.customer && item?.customer.address}</address>
            <fax>${item?.customer && item?.customer.companyFax}</fax>
            <mendateReferance>${
              item?.customer && item?.customer.mendateReferance
            }</mendateReferance>
            <mandateGenerateDate>${
              item?.customer && item?.customer.mandateGenerateDate?.split("T")[0]
            }</mandateGenerateDate>
            <country>${
              (item.customerContactPerson && item.customerContactPerson.country) ||
              (item?.customer && item?.customer.country)
            }</country>
            <city>${
              (item.customerContactPerson && item.customerContactPerson.city) ||
              (item?.customer && item?.customer.city)
            }</city>
            <iban>${item?.customer && item?.customer.iban}</iban>
            <bic>${item?.customer && item?.customer.bic}</bic>
            <tin>${item?.customer && item?.customer.tin}</tin>
            <vat>${item?.customer && item?.customer.vat}</vat>
            <addressSupplement>${
              item?.customer && item?.customer.addressSupplement
            }</addressSupplement>
            <addressSupplement>${item?.customer && item?.customer.streetNo}</addressSupplement>
            <accountOwnerName>${
              item?.customer && item?.customer.accountOwnerName
            }</accountOwnerName>
            <postalCode>${item?.customer && item?.customer.postalCode}</postalCode>
            <status>${item && item?.status}</status>
            <contactPersonName>${
              item.customerContactPerson &&
              `${item.customerContactPerson.firstName ?? ""} ${
                item.customerContactPerson.lastName ?? ""
              }`
            }</contactPersonName>
            <mobile>${item?.customer && item?.customer.companyMobile}</mobile>
            <email>${item?.customer && item?.customer.companyEmail}</email>
            <addressLabel>${
              (item?.customerCompanyAddress && item?.customerCompanyAddress.addressLabel) ||
              (item?.customer && item?.customer.address)
            }</addressLabel>
            <streatNo>${
              (item?.customerCompanyAddress && item?.customerCompanyAddress.streetNo) ||
              (item?.customer && item?.customer.streetNo)
            }</streatNo>
            <deliveryDate>${item && item?.deliveryDate}</deliveryDate>
            <expiryDate>${item && item?.expiryDate}</expiryDate>
            <netAmount>${netAmount}</netAmount>
            <plusVat>${vat}</plusVat>
            <invoiceAmount>${invoiceAmount}</invoiceAmount>
           <headerBody>
           <bodyTitle>${
             (item[`${module}Body`] && item[`${module}Body`].bodyTitle) ||
             (item.body && item.body.title)
           }</bodyTitle>
           <bodyDescription>${cleanedBody}</bodyDescription>
           </headerBody>
            <footer>
              <disclaimerTitle>
              ${
                (item[`${module}Disclaimer`] && item[`${module}Disclaimer`].disclaimerTitle) ||
                (item.disclaimer && item.disclaimer.title)
              }
              </disclaimerTitle>
              <disclaimerDescription>
              ${cleanedDisclaimer}
              </disclaimerDescription>
              <termsAndCondition>${cleanedTermsAndCondition}</termsAndCondition>
              <copyright>${cleanedCopyright}</copyright>
            </footer>
          <Products>
          ${item[`${module}Products`]?.map((product, index) => {
            return `<Product-${index + 1}>
            <productName>${
              product?.productName || (product?.product && product?.product?.productName) || 0
            }</productName>
            <description>${
              product?.description || (product?.product && product?.product?.description) || 0
            }</description>
            <quantity>${
              product?.quantity || (product?.product && product?.product?.quantity) || 0
            }</quantity>
            <positionNo>${
              product?.positionNo || (product?.product && product?.product?.positionNo) || 0
            }</positionNo>
            <unit>${product?.unit || (product?.product && product?.product?.unit) || 0}</unit>
            <price>${
              product?.netPrice || (product?.product && product?.product?.netPrice) || 0
            }</price>
            <tax>${
              product?.taxRate?.taxRate ||
              (product.product && product.product?.taxRate?.taxRate) ||
              0
            }</tax>
            <discount>${
              (product && product?.lineItemDiscount) ||
              (product?.discountGroups &&
                product?.discountGroups[0]?.ProductDiscountGroup.discount) ||
              (product?.discountGroups && product?.discountGroups[0]?.ProductDiscountGroup.disco) ||
              (product?.discountGroups && product?.discountGroups[0]?.ProductDiscountGroup.dis) ||
              0
            }</discount>
            <total>${calculateProductTotalPrice({
              discount: product.lineItemDiscount,
              discountGroups: product.discountGroups,
              quantity: product.quantity || 0,
              netPrice: product.netPrice || 0,
            })}</total>
            </Product-${index + 1}>`;
          })}
        </Products>
        
        </${module}data>
        </${module}id-${item.id}>
      `;
  });

  xmlContent += `
</${module}>`; // Close the root <offers> element

  // Create a Blob from the XML content
  const blob = new Blob([xmlContent], { type: "application/xml" });
  enqueueSnackbar("XML file downloaded successfully!", {
    variant: "success",
  });

  // Create a URL for the Blob
  const blobUrl = URL.createObjectURL(blob);

  // Create a link to download the Blob
  const downloadLink = document.createElement("a");
  downloadLink.href = blobUrl;
  downloadLink.download = `${module}.xml`;

  // Append the link to the document
  document.body.appendChild(downloadLink);

  // Simulate a click to trigger the download
  downloadLink.click();

  // Clean up the Blob URL
  URL.revokeObjectURL(blobUrl);
};

export default handleDownloadXml;
