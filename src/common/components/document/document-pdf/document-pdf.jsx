/* eslint-disable no-unsafe-optional-chaining */

"use client";

/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */

import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import PropTypes from "prop-types";
import striptags from "striptags";
import { DOCUMENT_STATUS } from "@/common/constants/document-status.constant";
import {
  DOCUMENT_IDENTIFIER,
  DOCUMENT_LOWER_CASE_STATUS,
  DOCUMENT_MODULE,
  DOCUMENT_NAME,
  DOCUMENT_PRODUCTS,
} from "@/common/utils/document-helpers/document-helpers";
import formatAmount from "@/common/utils/fomate-amount";
import {
  invoiceAmountWithOutVAT,
  invoiceAmountWithVAT,
  lineItemNetAmount,
  plusVat,
} from "@/common/utils/product-calculations/amount-calculations";
import calculateProductTotalPrice from "@/common/utils/product-calculations/calculate-product-total";
import cancelledStamp from "./assets/cancelled-stamp.png";
import draftStamp from "./assets/draft-stamp.png";
import logo from "./assets/logo.png";

Font.register({
  family: "DM Sans",
  fonts: [
    { src: "fonts/DMSans-Regular.ttf", fontWeight: "Normal" },
    { src: "fonts/DMSans-Medium.ttf", fontWeight: "Medium" },
    { src: "fonts/DMSans-Bold.ttf", fontWeight: "Bold" },
  ],
});

const styles = StyleSheet.create({
  page: { backgroundColor: "#FFF", position: "relative" },
  logoContainer: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
  },
  flexSpaceBetween: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  textStyle_12_500_18: {
    color: "#2C2E3E",
    fontSize: "10px",
    fontStyle: "normal",
    fontWeight: "Medium",
  },
  textStyle_12_700_18: {
    color: "#2C2E3E",
    fontSize: "10px",
    fontStyle: "normal",
    fontWeight: "Bold",
  },
  textStyle_12_400_18_light: {
    color: "#46474F",
    fontSize: "8px",
    fontStyle: "normal",
    fontWeight: "Normal",
  },
  textStyle_12_400_18: {
    color: "#2C2E3E",
    fontSize: "8px",
    fontStyle: "normal",
    fontWeight: "Normal",
  },
  textStyle_16_500_24: {
    color: "#2C2E3E",
    fontSize: "10px",
    fontStyle: "normal",
    fontWeight: "Medium",
  },
  documentStyle: {
    display: "flex",
    width: "120px",
    flexDirection: "row",
    gap: "7px",
  },
});
export default function DocumentPdf({
  module,
  document,
  blank,
  documentToData,
  from,
  contact,
  templateHeader,
  templateFooter,
  tableFooterOptions,
  termsAndConditionsData,
  stripHTML,
  business,
  productData,
  isInvoice,
}) {
  return (
    <Document>
      <Page style={styles.page}>
        <View
          style={{
            position: "absolute",
            top: "-110px",
            left: "-100px",
            backgroundColor: "blue",
            minHeight: "150px",
            width: "150px",
            transform: "rotate(50deg)",
          }}
        ></View>
        <View style={{ padding: "16px" }}>
          <View style={styles.logoContainer}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: " 20px ",
                gap: "4px",
                alignItems: "center",
              }}
            >
              {DOCUMENT_LOWER_CASE_STATUS(document.status) !==
                DOCUMENT_LOWER_CASE_STATUS(DOCUMENT_STATUS.DRAFT) && (
                <Text style={styles.textStyle_12_500_18}>
                  {DOCUMENT_NAME(module)} #
                </Text>
              )}

              {DOCUMENT_LOWER_CASE_STATUS(document.status) !==
                DOCUMENT_LOWER_CASE_STATUS(DOCUMENT_STATUS.DRAFT) &&
              DOCUMENT_LOWER_CASE_STATUS(document.status) !==
                DOCUMENT_LOWER_CASE_STATUS(DOCUMENT_STATUS.CANCELLED) &&
              !isInvoice ? (
                <Text style={styles.textStyle_12_400_18_light}>
                  {document &&
                    DOCUMENT_IDENTIFIER({
                      id: document.id,
                      displayId: document.displayId,
                    })}
                </Text>
              ) : (
                ""
              )}

              {DOCUMENT_LOWER_CASE_STATUS(document.status) ===
                DOCUMENT_LOWER_CASE_STATUS(DOCUMENT_STATUS.CANCELLED) ||
              isInvoice ? (
                <Text style={styles.textStyle_12_400_18_light}>
                  {document && document.cancellationId}
                </Text>
              ) : (
                ""
              )}
            </View>
            {!blank && (
              <View
                style={{ width: "100px", height: "32px", marginRight: "10px" }}
              >
                <Image
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    resizeMode: "contain",
                  }}
                  source={logo.src}
                  quality={1}
                  dpi={300}
                  alt="logo"
                />
              </View>
            )}
          </View>
          {/* <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginTop: '8px'
            }}
          >
            {/* <Text style={styles.textStyle_16_500_24}>Offer From</Text> */}
          {/* <View style={{ width: '200px' }}>
              <Text style={styles.textStyle_16_500_24}>Offer To</Text>
            </View> */}
          {/* </View>  */}

          <View style={[styles.flexSpaceBetween, { marginTop: "8px" }]}>
            <View style={styles.documentStyle}>
              {/* <Text style={[styles.textStyle_12_400_18_light, { minWidth: '100px' }]}>
                Company Name:
              </Text> */}
              <Text style={styles.textStyle_12_700_18}>
                {" "}
                {/* {document?.customer && document?.customer?.companyName && ( */}
                <Text style={styles.textStyle_12_700_18}>
                  {(document?.customer && document?.customer?.companyName) ||
                    "---"}
                </Text>
                {/* )} */}
              </Text>
            </View>
            <View style={styles.documentStyle}>
              {/* <Text style={[styles.textStyle_12_400_18_light, { minWidth: '100px' }]}>
                Company Name:
              </Text> */}
              <Text style={styles.textStyle_12_700_18}>
                {business?.businessName || "---"}
              </Text>
            </View>
          </View>

          <View style={[styles.flexSpaceBetween, { marginTop: "2px" }]}>
            <View style={styles.documentStyle}>
              {/* <Text style={[styles.textStyle_12_400_18_light, { minWidth: '100px' }]}>
                Email:
              </Text> */}
              {/* {document?.customer && document?.customer?.companyEmail && ( */}
              <Text style={styles.textStyle_12_400_18_light}>
                {(document?.customerContactPerson &&
                  document.customerContactPerson?.firstName) ||
                  (document?.customer && document?.customer?.firstName) ||
                  "---"}{" "}
                {(document?.customerContactPerson &&
                  document.customerContactPerson?.lastName) ||
                  (document?.customer && document?.customer?.lastName) ||
                  "---"}
              </Text>
              {/* )} */}
            </View>
          </View>
          <View style={[styles.flexSpaceBetween, { marginTop: "2px" }]}>
            <View style={styles.documentStyle}>
              {/* <Text style={[styles.textStyle_12_400_18_light, { minWidth: '100px' }]}>
                Email:
              </Text> */}
              {/* {document?.customer && document?.customer?.companyEmail && ( */}
              <Text style={styles.textStyle_12_400_18_light}>
                {document?.customer?.companyEmail || "---"}
              </Text>
              {/* )} */}
            </View>
            <View style={styles.documentStyle}>
              {/* <Text style={[styles.textStyle_12_400_18_light, { minWidth: '100px' }]}>
                Name:
              </Text> */}
              {business?.businessEmail && (
                <Text style={styles.textStyle_12_400_18_light}>
                  {business?.businessEmail || "---"}
                </Text>
              )}
            </View>
          </View>
          <View style={[styles.flexSpaceBetween, { marginTop: "2px" }]}>
            <View style={styles.documentStyle}>
              {/* <Text style={[styles.textStyle_12_400_18_light, { minWidth: '100px' }]}>
                Address:
              </Text> */}
              {/* {document?.customer && document?.customer?.companyMobile && ( */}
              <Text
                style={[
                  styles.textStyle_12_400_18_light,
                  { maxWidth: "95px", TextWrap: "wrap" },
                ]}
              >
                {(document?.customer && document?.customer?.companyMobile) ||
                  "---"}
              </Text>
              {/* )} */}
            </View>
            {/* <View style={styles.documentStyle}> */}
            {/* <Text style={[styles.textStyle_12_400_18_light, { minWidth: '100px' }]}>
                Address:
              </Text> */}
            {/* <Text
                style={[
                  styles.textStyle_12_400_18_light,
                  { maxWidth: '95px', TextWrap: 'wrap' }
                ]}
              >
                {'business'}
              </Text>
            </View> */}
          </View>
          <View style={[styles.flexSpaceBetween, { marginTop: "2px" }]}>
            <View style={styles.documentStyle}>
              {/* <Text style={[styles.textStyle_12_400_18_light, { minWidth: '100px' }]}>
                Postal Code:
              </Text> */}
              {/* {document?.customer && document?.customer?.address && ( */}
              <Text
                style={[
                  styles.textStyle_12_400_18_light,
                  { maxWidth: "110px", TextWrap: "nowrap" },
                ]}
              >
                {(document?.customerCompanyAddress &&
                  document.customerCompanyAddress?.streetNo) ||
                  (document?.customer && document?.customer?.streetNo) ||
                  "---"}{" "}
                {(document?.customerCompanyAddress &&
                  document.customerCompanyAddress?.address) ||
                  (document?.customer && document?.customer?.address) ||
                  "---"}
              </Text>
            </View>
            <View style={styles.documentStyle}>
              {/* <Text style={[styles.textStyle_12_400_18_light, { minWidth: '100px' }]}>
                Postal Code:
              </Text> */}
              <Text
                style={[
                  styles.textStyle_12_400_18_light,
                  { maxWidth: "110px", TextWrap: "nowrap" },
                ]}
              >
                {(business && business?.streetNo) || "---"}{" "}
                {(business && business?.address) || "---"}
              </Text>
            </View>
          </View>
          <View style={[styles.flexSpaceBetween, { marginTop: "2px" }]}>
            <View style={styles.documentStyle}>
              {/* <Text style={[styles.textStyle_12_400_18_light, { minWidth: '100px' }]}>
                Country:
              </Text> */}
              {/* {document?.customer && document?.customer?.city && ( */}
              <Text
                style={[
                  styles.textStyle_12_400_18_light,
                  { maxWidth: "110px", TextWrap: "nowrap" },
                ]}
              >
                {(document?.customerCompanyAddress &&
                  document.customerCompanyAddress?.city) ||
                  (document?.customer && document?.customer?.city) ||
                  "---"}{" "}
                {(document?.customerCompanyAddress &&
                  document.customerCompanyAddress?.country) ||
                  (document?.customer && document?.customer?.country) ||
                  "---"}
              </Text>
              {/* )} */}
            </View>
            <View style={styles.documentStyle}>
              {/* <Text style={[styles.textStyle_12_400_18_light, { minWidth: '100px' }]}>
                Country:
              </Text> */}
              <Text
                style={[
                  styles.textStyle_12_400_18_light,
                  { maxWidth: "110px", TextWrap: "nowrap" },
                ]}
              >
                {(business && business?.postalCode) || "---"}
              </Text>
            </View>
          </View>
          <View style={[styles.flexSpaceBetween, { marginTop: "2px" }]}>
            <View style={styles.documentStyle}>
              {/* <Text style={[styles.textStyle_12_400_18_light, { minWidth: '100px' }]}>
                City:
              </Text> */}
            </View>
            {documentToData?.city && (
              <View style={styles.documentStyle}>
                {/* <Text style={[styles.textStyle_12_400_18_light, { minWidth: '100px' }]}>
                  City:
                </Text> */}
                <Text
                  style={[
                    styles.textStyle_12_400_18_light,
                    { maxWidth: "110px", TextWrap: "nowrap" },
                  ]}
                >
                  {documentToData?.city}
                </Text>
              </View>
            )}
          </View>
          <View style={{ marginTop: "8px" }}>
            {/* <Text style={styles.textStyle_16_500_24}>Body Text</Text> */}
            <Text
              style={[styles.textStyle_12_400_18_light, { marginTop: "8px" }]}
            >
              {stripHTML(
                document[`${DOCUMENT_PRODUCTS(module)}Body`] &&
                  document[`${DOCUMENT_PRODUCTS(module)}Body`].bodyDescription
              )}
            </Text>
          </View>

          <View
            style={{
              gap: "16px",
              borderRadius: "10px",
              border: "1px solid #E2E2E2",
              background: "#FFF",
              marginTop: "8px",
            }}
          >
            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                maxHeight: "59px",
                padding: " 8px",
                gap: "4px",
                backgroundColor: "#1d4ed80f",
                borderBottom: "1px solid #E2E2E2",
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "5px",
              }}
            >
              <Text
                style={[
                  styles.textStyle_12_400_18,
                  { maxWidth: "16px", minWidth: "16px" },
                ]}
              >
                Pos
              </Text>

              <Text
                style={[
                  styles.textStyle_12_400_18,
                  { maxWidth: "220px", minWidth: "220px" },
                ]}
              >
                Products{" "}
              </Text>

              <Text
                style={[
                  styles.textStyle_12_400_18,
                  { maxWidth: "16px", minWidth: "16px" },
                ]}
              >
                Pcs{" "}
              </Text>

              <Text
                style={[
                  styles.textStyle_12_400_18,
                  { maxWidth: "16px", minWidth: "16px" },
                ]}
              >
                Unit{" "}
              </Text>

              <Text
                style={[
                  styles.textStyle_12_400_18,
                  { maxWidth: "40px", minWidth: "40px" },
                ]}
              >
                Price €{" "}
              </Text>

              <Text
                style={[
                  styles.textStyle_12_400_18,
                  { maxWidth: "20px", minWidth: "20px" },
                ]}
              >
                Tax{" "}
              </Text>

              <Text
                style={[
                  styles.textStyle_12_400_18,
                  { maxWidth: "20px", minWidth: "20px" },
                ]}
              >
                %{" "}
              </Text>

              <Text
                style={[
                  styles.textStyle_12_400_18,
                  { maxWidth: "50px", minWidth: "50px" },
                ]}
              >
                Total €{" "}
              </Text>
            </View>

            {Object?.keys(productData)?.map((key) => {
              return productData[key]?.product?.map((item, ind) => {
                return (
                  <View
                    key={item.id}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      maxHeight: "46px",
                      padding: "0px 8px 12px",
                      gap: "8px",
                      borderBottom:
                        ind === productData[key]?.product?.length - 1
                          ? ""
                          : "1px solid #E2E2E2",
                      borderBottomLeftRadius:
                        ind === productData[key]?.product?.length - 1
                          ? "5px"
                          : "",
                      borderBottomRightRadius:
                        ind === productData[key]?.product?.length - 1
                          ? "5px"
                          : "",
                      // backgroundColor: '#FFFF',
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {/* <View> */}
                    {item && item.id && (
                      <Text
                        style={[
                          styles.textStyle_12_400_18_light,
                          { maxWidth: "16px", minWidth: "16px" },
                        ]}
                      >
                        {item.positionNo || "---"}
                      </Text>
                    )}

                    <View
                      style={{
                        gap: "4px",
                        display: "flex",
                        maxWidth: "220px",
                        minWidth: "220px",
                        flexDirection: "column",
                      }}
                    >
                      <Text
                        style={
                          item.productName && item.productName.includes("<u>")
                            ? {
                                fontSize: "8px",
                                fontStyle: "normal",
                                textDecoration: "underline",
                              }
                            : item.productName &&
                                item.productName.includes("<b>")
                              ? {
                                  fontSize: "8px",
                                  fontStyle: "normal",
                                  fontWeight: "Bold",
                                  textDecoration: "underline",
                                }
                              : {
                                  fontSize: "8px",
                                  fontStyle: "normal",
                                }
                        }
                      >
                        {item.id
                          ? item.productName
                          : striptags(item.productName) || "---"}
                      </Text>
                      <Text style={[styles.textStyle_12_400_18_light]}>
                        {item.description}
                      </Text>
                    </View>

                    {item && item.id && (
                      <Text
                        style={[
                          styles.textStyle_12_400_18_light,
                          { maxWidth: "16px", minWidth: "16px" },
                        ]}
                      >
                        {item.quantity || "---"}
                      </Text>
                    )}

                    {item && item.id && (
                      <Text
                        style={[
                          styles.textStyle_12_400_18_light,
                          { maxWidth: "16px", minWidth: "16px" },
                        ]}
                      >
                        {item.unit || (item.unit && item.unit.unit) || "---"}
                      </Text>
                    )}

                    {item && item.id && (
                      <Text
                        style={[
                          styles.textStyle_12_400_18_light,
                          { maxWidth: "36px", minWidth: "36px" },
                        ]}
                      >
                        {formatAmount(item.netPrice) || "---"}
                      </Text>
                    )}

                    {item && item.id && (
                      <Text
                        style={[
                          styles.textStyle_12_400_18_light,
                          { maxWidth: "20px", minWidth: "20px" },
                        ]}
                      >
                        {item.taxRate ||
                          item.taxRate ||
                          (item.taxRate && item.taxRate.taxRate) ||
                          "---"}
                      </Text>
                    )}

                    {item && item.id && (
                      <Text
                        style={[
                          styles.textStyle_12_400_18_light,
                          { maxWidth: "20px", minWidth: "20px" },
                        ]}
                      >
                        {item.lineItemDiscount || "---"}
                      </Text>
                    )}

                    {item && item.id && (
                      <Text
                        style={[
                          styles.textStyle_12_400_18_light,
                          { maxWidth: "50px", minWidth: "50px" },
                        ]}
                      >
                        {formatAmount(
                          calculateProductTotalPrice({
                            discount: item && item.lineItemDiscount,
                            discountGroups: item.discountGroups,
                            quantity: (item && item.quantity) || 0,
                            netPrice: (item && item.netPrice) || 0,
                          })
                        )}
                      </Text>
                    )}
                    {/* </View> */}
                  </View>
                );
              });
            })}
          </View>

          <View
            style={{
              // height: '104px',
              padding: "8px 20px",
              marginTop: "8px",
              display: "flex",
              borderRadius: "10px",
              backgroundColor: "#FAFAFA",
              gap: "8px",
            }}
          >
            <View style={styles.flexSpaceBetween}>
              <Text style={styles.textStyle_12_400_18_light}>Net Amount</Text>
              <Text style={styles.textStyle_12_400_18_light}>
                {formatAmount(
                  lineItemNetAmount(
                    document && document[`${DOCUMENT_PRODUCTS(module)}Products`]
                  )
                )}
              </Text>
            </View>
            {document && document?.isVat && (
              <View style={styles.flexSpaceBetween}>
                <Text style={styles.textStyle_12_400_18_light}>Plus VAT</Text>
                <Text style={styles.textStyle_12_400_18_light}>
                  {" "}
                  {formatAmount(
                    plusVat(
                      document &&
                        document[`${DOCUMENT_PRODUCTS(module)}Products`]
                    )
                  )}
                </Text>
              </View>
            )}

            {document && document?.isVat && (
              <View style={styles.flexSpaceBetween}>
                <Text style={styles.textStyle_12_400_18}>Invoice Amount</Text>
                <Text style={styles.textStyle_12_400_18}>
                  {document && document?.isVat
                    ? formatAmount(
                        invoiceAmountWithVAT(
                          document &&
                            document[`${DOCUMENT_PRODUCTS(module)}Products`]
                        )
                      )
                    : formatAmount(
                        invoiceAmountWithOutVAT(
                          document &&
                            document[`${DOCUMENT_PRODUCTS(module)}Products`]
                        )
                      )}
                </Text>
              </View>
            )}
          </View>

          <View style={{ marginTop: "8px" }}>
            <Text style={styles.textStyle_16_500_24}>Disclaimer</Text>

            <View>
              {document[`${DOCUMENT_MODULE(module)}Disclaimer`]
                ?.disclaimerDescription &&
              document[
                `${DOCUMENT_MODULE(module)}Disclaimer`
              ]?.disclaimerDescription.includes("invoice expiry date") ? (
                <View
                  style={[
                    styles.textStyle_12_400_18_light,
                    { marginTop: "8px" },
                  ]}
                  // className="py-[13px] text-base font-normal leading-6"
                >
                  <Text style={[styles.textStyle_12_400_18_light]}>
                    {`Payable without deduction by ${new Date(
                      document.expiryDate
                    ).toLocaleDateString("en-GB")}`}
                    .
                  </Text>
                  <Text style={[styles.textStyle_12_400_18_light]}>
                    Thank you for your trust and we look forward to continued
                    good cooperation.
                  </Text>
                </View>
              ) : (
                <Text
                  style={[
                    styles.textStyle_12_400_18_light,
                    { marginTop: "8px" },
                  ]}
                >
                  {stripHTML(
                    document[`${DOCUMENT_PRODUCTS(module)}Disclaimer`] &&
                      document[`${DOCUMENT_PRODUCTS(module)}Disclaimer`]
                        .disclaimerDescription
                  ) || "---"}
                </Text>
              )}
            </View>
          </View>

          {DOCUMENT_LOWER_CASE_STATUS(document.status) ===
            DOCUMENT_LOWER_CASE_STATUS(DOCUMENT_STATUS.DRAFT) &&
          DOCUMENT_LOWER_CASE_STATUS(document.status) !==
            DOCUMENT_LOWER_CASE_STATUS(DOCUMENT_STATUS.CANCELLED) &&
          !isInvoice ? (
            <View
              style={{
                width: "150px",
                height: "60px",
                marginRight: "10px",
                position: "absolute",
                right: "50px",
                bottom: "90px",
              }}
            >
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  resizeMode: "contain",
                }}
                source={draftStamp.src}
                quality={1}
                dpi={300}
                alt="logo"
              />
            </View>
          ) : null}

          {DOCUMENT_LOWER_CASE_STATUS(document.status) ===
            DOCUMENT_LOWER_CASE_STATUS(DOCUMENT_STATUS.CANCELLED) ||
          isInvoice ? (
            <View
              style={{
                width: "100px",
                height: "34px",
                marginRight: "10px",
                position: "absolute",
                right: "60px",
                bottom: "140px",
              }}
            >
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  resizeMode: "contain",
                }}
                source={cancelledStamp.src}
                quality={1}
                dpi={300}
                alt="logo"
              />
            </View>
          ) : (
            ""
          )}

          <View style={{ marginTop: "8px" }}>
            <Text style={styles.textStyle_16_500_24}>Terms & Condition</Text>
            <Text
              style={[styles.textStyle_12_400_18_light, { marginTop: "8px" }]}
            >
              {termsAndConditionsData?.["Payment terms"] && (
                <Text style={styles.textStyle_12_400_18}> Payment terms:</Text>
              )}
              {termsAndConditionsData?.["Payment terms"]}
            </Text>
            <Text
              style={[styles.textStyle_12_400_18_light, { marginTop: "8px" }]}
            >
              {termsAndConditionsData?.Delivery && (
                <Text style={styles.textStyle_12_400_18}> Delivery: </Text>
              )}
              {termsAndConditionsData?.Delivery}
            </Text>
            <Text
              style={[styles.textStyle_12_400_18_light, { marginTop: "8px" }]}
            >
              {termsAndConditionsData?.Warranty && (
                <Text style={styles.textStyle_12_400_18}> Warranty:</Text>
              )}
              {termsAndConditionsData?.Warranty}
            </Text>
          </View>

          <View style={{ marginTop: "8px" }}>
            <Text style={styles.textStyle_16_500_24}>Copyright</Text>
            <Text
              style={[styles.textStyle_12_400_18_light, { marginTop: "8px" }]}
            >
              {stripHTML(document?.copyRight) || "---"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

DocumentPdf.propTypes = {
  module: PropTypes.objectOf,
  document: PropTypes.objectOf,
  blank: PropTypes.bool,
  documentToData: PropTypes.objectOf,
  from: PropTypes.objectOf,
  contact: PropTypes.objectOf,
  templateHeader: PropTypes.objectOf,
  templateFooter: PropTypes.objectOf,
  tableFooterOptions: PropTypes.objectOf,
  termsAndConditionsData: PropTypes.objectOf,
  stripHTML: PropTypes.func,
  business: PropTypes.objectOf,
  productData: PropTypes.objectOf,
  isInvoice: PropTypes.bool,
};
