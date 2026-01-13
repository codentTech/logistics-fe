import PropTypes from "prop-types";
import DOCUMENT_TABS from "@/common/constants/document-tabs.constant";
import {
  DOCUMENT_IDENTIFIER,
  DOCUMENT_MODULE,
  DOCUMENT_NAME_IN_LOWER_CASE,
} from "@/common/utils/document-helpers/document-helpers";
import formatAmount from "@/common/utils/fomate-amount";
import {
  invoiceAmountWithOutVAT,
  invoiceAmountWithVAT,
  lineItemNetAmount,
  plusVat,
} from "@/common/utils/product-calculations/amount-calculations";
import BookModal from "../../book-modal/book-modal.component";
import CustomChooseDropdown from "../../custom-choose-dropdown/custom-choose-dropdown";
import Loadar from "../../loadar/loadar.component";
import StepperFooter from "../../stepper-footer/stepper-footer.component";

function DocumentPreview({
  document,
  ref,
  setOpenPopup,
  module,
  business,
  data,
  openPopup,
  handleBook,
  handleSave,
  handleOpenPopup,
  tableData,
  templateHeader,
  templateContact,
  templateFooter,
  CONTACT_INFO,
  FROM_CONTACT_INFO,
  isLoading,
  orderToData,
  tableFooterOptions,
  termsAndConditionsData,
  stripHTML,
  mapColumnNameToProductKey,
  openChooseTemplate,
  setOpenChooseTemplate,
  getListOfSimpleTemplates,
  getListOfStandardTemplates,
  handleCreateTemplate,
  handleEditTemplate,
  handleSearchTemplate,
  search,
  handleSelectedBodytemplate,
  selectedTemplate,
  handleTabClick,
  setActiveTab,
  isLoadingButtonBook,
  isLoadingButtonSaveAsDraft,
}) {
  const getLogoJSX = () => {
    return (
      <div className="flex w-[185px] items-center justify-center px-0 pb-[11.997px] pt-[11px]">
        <div className="flex flex-col items-center gap-[6px]">
          <img
            alt="null"
            src="/assets/images/logo.png"
            className="h-[55.14px] w-[170px]"
          />
        </div>
      </div>
    );
  };

  const getOrderNoJSX = () => {
    return (
      <div className=" pt-6 text-base font-medium not-italic leading-6 text-text-dark-gray">
        <div className="text-xl font-bold not-italic leading-[30px] text-text-dark-gray">
          Preview
        </div>
        <div className="mt-[28.57px] flex gap-[14px]">
          <span className="text-[#7E7D7D] ">
            {DOCUMENT_IDENTIFIER({
              id: module?.id,
              displayId: module?.displayId,
            })}
          </span>
          <img
            src="/assets/icons/info.svg"
            alt="info"
            width="12px"
            height="12px"
          />
        </div>
      </div>
    );
  };

  const getContactInfo = (section) => {
    return (
      <div className="flex min-h-[222px] flex-col gap-[16px]">
        <h3 className="text-sm font-medium not-italic leading-[17.5px] text-text-black">
          {section.sectionName === "offerTo" ? (
            ""
          ) : (
            <div className="flex items-center justify-between">
              <div
                className="text-primary-blue underline hover:cursor-pointer"
                onClick={() => setActiveTab(DOCUMENT_TABS.CUSTOMER_DETAILS)}
              >
                Edit
              </div>
            </div>
          )}
        </h3>
        {section.attributes &&
          section.attributes.map((attr) => {
            if (attr.attributeName !== "sectionPosition") {
              const attributeName = CONTACT_INFO[attr.attributeName];
              const fromAttribute = FROM_CONTACT_INFO[attr.attributeName];

              // if (section.sectionName !== 'offerTo' && !fromAttribute) {
              //   return null;
              // }

              let attributeValue;
              section.sectionName === "offerTo"
                ? (attributeValue = orderToData[attr.attributeName])
                : (attributeValue = business[attr.attributeName]);

              return (
                // eslint-disable-next-line react/jsx-no-useless-fragment
                <>
                  {attributeValue && (
                    <p className="text-xs font-normal not-italic leading-[18px] text-text-light-gray">
                      <span className="text-xs font-normal not-italic leading-[18px] text-text-dark-gray">
                        {section.sectionName === "offerTo" && attributeName}
                      </span>
                      {section.sectionName === "offerTo" && ":"}
                      <span
                        className={`${
                          section.sectionName === "offerTo" &&
                          "ml-2 text-xs font-normal not-italic leading-[18px] text-text-light-gray"
                        } `}
                      >
                        {attributeValue && attributeValue.length >= 20
                          ? `${attributeValue.slice(0, 20)}...`
                          : attributeValue}
                      </span>
                    </p>
                  )}
                </>
              );
            }
            return null;
          })}
      </div>
    );
  };

  return (
    <div>
      {openPopup && (
        <BookModal
          bookingModule={DOCUMENT_NAME_IN_LOWER_CASE(document)}
          ref={ref}
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          handleBook={handleBook}
          handleSave={handleSave}
          isLoadingButtonBook={isLoadingButtonBook}
          isLoadingButtonSaveAsDraft={isLoadingButtonSaveAsDraft}
        />
      )}
      <form onSubmit={handleOpenPopup}>
        <div className="flex flex-col gap-6 pr-5">
          <div className="flex justify-between">
            <CustomChooseDropdown
              dropdownWidth="[339px]"
              dropdownHeight="9"
              labelName="templateName"
              documentType={document}
              openChooseDropdown={openChooseTemplate}
              setOpenChooseDropdown={setOpenChooseTemplate}
              selectedItem={selectedTemplate}
              search={search}
              handleSearchItem={handleSearchTemplate}
              listOfItems={getListOfSimpleTemplates}
              listOfItemsTwo={getListOfStandardTemplates}
              handleSelectedItem={handleSelectedBodytemplate}
              handleEditItem={handleEditTemplate}
              createItem={true}
              showTemplateStuff={true}
              handleCreateItem={handleCreateTemplate}
              documentTemplate={
                module[`${DOCUMENT_MODULE(document)}Template`] &&
                module[`${DOCUMENT_MODULE(document)}Template`]?.templateName
              }
            />

            {/* <DownloadDropdownBtn text="Download Pdf" dropdownoptions={dropdownoptions} /> */}
          </div>
        </div>
        <div>
          {isLoading ? (
            <div className="flex justify-center pt-3">
              <Loadar />
            </div>
          ) : (
            <div className="flex gap-6">
              <div className="w-full">
                <div className="bg-white pb-[25.003px] pt-5">
                  <div className="flex justify-between">
                    {templateHeader?.length &&
                      templateHeader?.map((section) => {
                        if (section.sectionName === "offerId") {
                          return getOrderNoJSX();
                        } else if (section.sectionName === "offerLogo") {
                          return getLogoJSX();
                        }
                        return "";
                      })}
                  </div>
                  <div className="mt-[36.57px] flex items-center justify-between">
                    {templateContact?.length &&
                      templateContact.map((section) => {
                        return getContactInfo(section);
                      })}
                  </div>
                  <div className="flex items-center justify-between ">
                    <p className="my-6 flex items-center text-sm font-medium not-italic leading-[17.5px] text-text-black hover:cursor-pointer">
                      <span
                        className="flex"
                        dangerouslySetInnerHTML={{
                          __html:
                            module[`${DOCUMENT_MODULE(document)}Body`] &&
                            module[`${DOCUMENT_MODULE(document)}Body`]
                              .bodyDescription,
                        }}
                      />
                    </p>
                    <div
                      className="text-primary-blue underline hover:cursor-pointer"
                      onClick={() => setActiveTab(DOCUMENT_TABS.LINE_ITEMS)}
                    >
                      Edit
                    </div>
                  </div>
                  {/* end module header */}
                  <section className="bg-[#FFFFFF  w-full gap-4 rounded-[20px] border border-solid border-[#E2E2E2] p-6">
                    <div>
                      <table className="w-full border-collapse rounded-[20px_0px_0px_0px]">
                        <thead>
                          <tr>
                            {tableData?.map((column) => {
                              return (
                                // eslint-disable-next-line react/jsx-no-useless-fragment
                                <>
                                  {column.name === "Total" ||
                                  column.name === "Price" ? (
                                    // eslint-disable-next-line jsx-a11y/control-has-associated-label
                                    <th
                                      key={column.name}
                                      className="rounded-t-lg border-b border-solid border-b-[#E7EAEE] bg-[#FAFAFA] px-2 py-4 text-left text-sm font-normal not-italic leading-[18px] text-text-black"
                                      style={{
                                        backgroundColor: column.backgroundColor,
                                      }}
                                    >
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: `${column.name} €`,
                                        }}
                                      />
                                    </th>
                                  ) : (
                                    column.name !== "Description" && (
                                      // eslint-disable-next-line jsx-a11y/control-has-associated-label
                                      <th
                                        key={column.name}
                                        className={`rounded-t-lg border-b border-solid border-b-[#E7EAEE] ${
                                          column.name === "Product" && "w-[40%]"
                                        } px-2 py-4 text-left text-sm font-normal not-italic leading-[18px] text-text-black`}
                                        style={{
                                          backgroundColor:
                                            column.backgroundColor,
                                        }}
                                      >
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: column.name,
                                          }}
                                        />
                                      </th>
                                    )
                                  )}
                                </>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {Object?.keys(data)?.map((key) => {
                            return data[key]?.product?.map((product) => {
                              return (
                                <tr key={product.product && product.product.id}>
                                  {tableData?.map((column) => {
                                    const strippedColumnName = stripHTML(
                                      column.name
                                    );
                                    const mappedProductKey =
                                      mapColumnNameToProductKey(
                                        strippedColumnName
                                      );
                                    let valueToDisplay = "";
                                    if (mappedProductKey) {
                                      if (
                                        mappedProductKey === "lineItemDiscount"
                                      ) {
                                        valueToDisplay =
                                          product[mappedProductKey];
                                      } else if (mappedProductKey === "Total") {
                                        const netAmmount =
                                          Number(
                                            (product && product?.quantity) ||
                                              (product.product &&
                                                product.product?.taxRate
                                                  ?.quantity)
                                          ) *
                                          Number(
                                            (product && product?.netPrice) ||
                                              (product.product &&
                                                product.product?.taxRate
                                                  ?.netPrice)
                                          );
                                        const total =
                                          Number(netAmmount) -
                                            (Number(netAmmount) *
                                              Number(
                                                product &&
                                                  product?.lineItemDiscount
                                              )) /
                                              100 || 0;
                                        valueToDisplay =
                                          total && product.id
                                            ? formatAmount(total)
                                            : "";
                                      } else if (mappedProductKey === "unit") {
                                        valueToDisplay =
                                          product?.unit ||
                                          (product.product &&
                                            product.product?.unit?.unit[
                                              mappedProductKey
                                            ]);
                                      } else if (
                                        mappedProductKey === "taxRate"
                                      ) {
                                        valueToDisplay =
                                          product?.taxRate ||
                                          (product.product &&
                                            product.product?.taxRate?.taxRate[
                                              mappedProductKey
                                            ]);
                                      } else if (
                                        mappedProductKey === "netPrice"
                                      ) {
                                        const price =
                                          product?.netPrice ||
                                          (product.product &&
                                            product.product?.netPrice[
                                              mappedProductKey
                                            ]);
                                        valueToDisplay =
                                          product &&
                                          product.id &&
                                          formatAmount(price);
                                      } else {
                                        valueToDisplay =
                                          product[mappedProductKey] ||
                                          (product.product &&
                                            product.product[mappedProductKey]);
                                      }
                                    }
                                    return (
                                      // eslint-disable-next-line react/jsx-no-useless-fragment
                                      <>
                                        {product && product.id ? (
                                          <td
                                            key={column.id}
                                            className=" border-b border-solid border-b-[#E7EAEE] px-2 py-4  text-left text-xs font-normal leading-[18px] text-[#646464]"
                                          >
                                            {column.name === "Product" ? (
                                              <div className="flex flex-col gap-2 text-left">
                                                <div className="text-sm font-medium not-italic leading-[17.5px] text-text-dark-gray">
                                                  {valueToDisplay}
                                                </div>
                                                <div>{product.description}</div>
                                              </div>
                                            ) : (
                                              valueToDisplay
                                            )}
                                          </td>
                                        ) : (
                                          // eslint-disable-next-line jsx-a11y/control-has-associated-label
                                          <td
                                            key={column.id}
                                            dangerouslySetInnerHTML={{
                                              __html: valueToDisplay,
                                            }}
                                            className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap border-b border-solid border-b-[#E7EAEE] px-2 py-4  text-start text-xs font-normal leading-[18px] text-[#646464]"
                                          />
                                        )}
                                      </>
                                    );
                                  })}
                                </tr>
                              );
                            });
                          })}
                        </tbody>
                      </table>
                    </div>
                    {tableFooterOptions.netAmount ||
                    tableFooterOptions.plusVAT ||
                    tableFooterOptions.invoiceAmount ? (
                      <div className=" mt-[15px] flex flex-row items-start justify-between rounded-[20px] bg-[#fafafa] px-6 py-4">
                        <div className="flex flex-col justify-between gap-4">
                          {tableFooterOptions.netAmount && (
                            <div className="text-base font-medium leading-[19px] text-[#646464]">
                              Net Amount
                            </div>
                          )}
                          {tableFooterOptions.plusVAT && module.isVat && (
                            <div className="text-base font-medium leading-[19px] text-[#646464]">
                              Plus VAT
                            </div>
                          )}
                          {tableFooterOptions.invoiceAmount && (
                            <div className="text-base font-medium leading-[19px] text-[#646464]">
                              Invoice Amount
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-between gap-4 text-right">
                          {tableFooterOptions.netAmount && (
                            <div className="text-base font-medium leading-[19px] text-[#646464]">
                              {formatAmount(
                                lineItemNetAmount(
                                  module &&
                                    module[
                                      `${DOCUMENT_MODULE(document)}Products`
                                    ]
                                )
                              )}
                            </div>
                          )}
                          {tableFooterOptions.plusVAT && module?.isVat && (
                            <div className="text-base font-medium leading-[19px] text-[#646464]">
                              {formatAmount(
                                plusVat(
                                  module &&
                                    module[
                                      `${DOCUMENT_MODULE(document)}Products`
                                    ]
                                )
                              )}
                            </div>
                          )}
                          {tableFooterOptions.invoiceAmount &&
                            module?.isVat && (
                              <div className="text-base font-semibold leading-[19px] text-text-black">
                                {" "}
                                {module && module.isVat
                                  ? formatAmount(
                                      invoiceAmountWithVAT(
                                        module &&
                                          module[
                                            `${DOCUMENT_MODULE(document)}Products`
                                          ]
                                      )
                                    )
                                  : formatAmount(
                                      invoiceAmountWithOutVAT(
                                        module &&
                                          module[
                                            `${DOCUMENT_MODULE(document)}Products`
                                          ]
                                      )
                                    )}
                              </div>
                            )}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </section>
                  {/* end table */}
                  <div className="mb-6 mt-6 hover:cursor-pointer">
                    {templateFooter?.disclaimer && (
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="font-normal text-base leading-6 text-black">
                            <div className="text-base font-medium not-italic leading-6 text-text-black">
                              Disclaimer
                            </div>
                          </div>
                          <div
                            className="text-primary-blue underline hover:cursor-pointer"
                            onClick={() =>
                              setActiveTab(DOCUMENT_TABS.PAGE_STRUCTURE)
                            }
                          >
                            Edit
                          </div>
                        </div>

                        <div>
                          {module[`${DOCUMENT_MODULE(document)}Disclaimer`]
                            ?.disclaimerDescription &&
                          module[
                            `${DOCUMENT_MODULE(document)}Disclaimer`
                          ]?.disclaimerDescription.includes(
                            "invoice expiry date"
                          ) ? (
                            <div className="py-[13px] text-base font-normal leading-6">
                              <div className="text-sm font-medium leading-[17.5px]">
                                {`Payable without deduction by ${new Date(
                                  module.expiryDate
                                ).toLocaleDateString("en-GB")}`}
                                .
                              </div>
                              <div className="text-sm font-normal leading-[17.5px]">
                                Thank you for your trust and we look forward to
                                continued good cooperation.
                              </div>
                            </div>
                          ) : (
                            <div
                              className="mt-2 rounded-[6px] text-base font-normal leading-6"
                              dangerouslySetInnerHTML={{
                                __html:
                                  module[
                                    `${DOCUMENT_MODULE(document)}Disclaimer`
                                  ]?.disclaimerDescription,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {templateFooter &&
                    ((templateFooter?.paymentTerms &&
                      termsAndConditionsData["Payment terms"]) ||
                      (templateFooter?.delivery &&
                        termsAndConditionsData.Delivery) ||
                      (templateFooter?.warranty &&
                        termsAndConditionsData.Warranty)) ? (
                      <div className="flex flex-col gap-2">
                        <h3 className="mt-4 text-base font-medium not-italic leading-6 text-text-black">
                          Terms & Condition
                        </h3>

                        {templateFooter?.paymentTerms &&
                          termsAndConditionsData["Payment terms"] && (
                            <div>
                              <p className="flex min-w-[218px] gap-2 text-xs font-normal not-italic leading-[18px] text-text-medium-gray">
                                <div className="text-xs font-medium not-italic leading-[18px] text-text-black">
                                  Payment terms :
                                </div>

                                <div
                                  className="text-xs font-normal not-italic leading-[18px] text-text-medium-gray"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      termsAndConditionsData["Payment terms"],
                                  }}
                                />
                              </p>
                            </div>
                          )}
                        {templateFooter?.delivery &&
                          termsAndConditionsData.Delivery && (
                            <p className="flex min-w-[218px] items-center gap-2 text-xs font-normal not-italic leading-[18px] text-text-medium-gray">
                              <div className="text-xs font-medium not-italic leading-[18px]  text-text-black">
                                Delivery :
                              </div>

                              <div
                                className="text-xs font-normal not-italic leading-[18px] text-text-medium-gray"
                                dangerouslySetInnerHTML={{
                                  __html: termsAndConditionsData.Delivery,
                                }}
                              />
                            </p>
                          )}
                        {templateFooter?.warranty &&
                          termsAndConditionsData.Warranty && (
                            <p className="flex min-w-[218px] items-center gap-2 text-xs font-normal not-italic leading-[18px] text-text-medium-gray">
                              <div className="text-xs font-medium not-italic leading-[18px]  text-text-black">
                                Warranty :
                              </div>
                              <div
                                className="text-xs font-normal not-italic leading-[18px] text-text-medium-gray"
                                dangerouslySetInnerHTML={{
                                  __html: termsAndConditionsData.Warranty,
                                }}
                              />
                            </p>
                          )}
                      </div>
                    ) : (
                      <>
                        <h3 className="mt-4 text-base font-medium not-italic leading-6 text-text-black">
                          Terms & Condition
                        </h3>
                        {module?.termsAndConditions && (
                          <div
                            className="text-xs font-normal not-italic leading-[18px] text-text-medium-gray"
                            dangerouslySetInnerHTML={{
                              __html: module?.termsAndConditions,
                            }}
                          />
                        )}
                      </>
                    )}

                    {templateFooter?.copyright && module?.copyRight && (
                      <div className="mt-4">
                        <div className="font-normal text-base leading-6 text-black">
                          <div className="text-base font-medium not-italic leading-6 text-text-black">
                            Copyright
                          </div>
                        </div>
                        <div
                          className="text-xs font-normal not-italic leading-[18px] text-text-medium-gray"
                          dangerouslySetInnerHTML={{
                            __html: module?.copyRight,
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div />
                </div>
              </div>
            </div>
          )}
        </div>
        <StepperFooter
          submitText="Save"
          handleTabClick={handleTabClick}
          back={DOCUMENT_TABS.PAGE_STRUCTURE}
          isLoading={isLoadingButtonBook || isLoadingButtonSaveAsDraft}
        />
      </form>
    </div>
  );
}

DocumentPreview.propTypes = {
  document: PropTypes.objectOf,
  ref: PropTypes.objectOf,
  setOpenPopup: PropTypes.objectOf,
  module: PropTypes.objectOf,
  business: PropTypes.objectOf,
  data: PropTypes.objectOf,
  openPopup: PropTypes.objectOf,
  handleBook: PropTypes.objectOf,
  handleSave: PropTypes.objectOf,
  handleOpenPopup: PropTypes.objectOf,
  tableData: PropTypes.objectOf,
  templateHeader: PropTypes.objectOf,
  templateContact: PropTypes.objectOf,
  templateFooter: PropTypes.objectOf,
  CONTACT_INFO: PropTypes.objectOf,
  FROM_CONTACT_INFO: PropTypes.objectOf,
  isLoading: PropTypes.objectOf,
  orderToData: PropTypes.objectOf,
  tableFooterOptions: PropTypes.objectOf,
  termsAndConditionsData: PropTypes.objectOf,
  stripHTML: PropTypes.objectOf,
  mapColumnNameToProductKey: PropTypes.objectOf,
  openChooseTemplate: PropTypes.objectOf,
  setOpenChooseTemplate: PropTypes.objectOf,
  getListOfSimpleTemplates: PropTypes.objectOf,
  getListOfStandardTemplates: PropTypes.objectOf,
  handleCreateTemplate: PropTypes.objectOf,
  handleEditTemplate: PropTypes.objectOf,
  handleSearchTemplate: PropTypes.objectOf,
  search: PropTypes.objectOf,
  handleSelectedBodytemplate: PropTypes.objectOf,
  selectedTemplate: PropTypes.objectOf,
  handleTabClick: PropTypes.objectOf,
  setActiveTab: PropTypes.func,
  isLoadingButtonBook: PropTypes.bool,
  isLoadingButtonSaveAsDraft: PropTypes.bool,
};

export default DocumentPreview;
