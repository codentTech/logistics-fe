import { Dialog, DialogContent } from "@mui/material/node";
import PropTypes from "prop-types";
import React from "react";
import EuroIcon from "@/common/icons/euro.icon";
import useTaxRate from "@/components/setting/general-setting/view/tax-rate/use-tax-rate.hook";
import useUnits from "@/components/setting/general-setting/view/units/use-units.hook";
import CreateModal from "../create-modal/create-modal";
import CustomButton from "../custom-button/custom-button.component";
import CustomInput from "../custom-input/custom-input.component";
import ConfirmationModal from "../custom-model-confirmation/custom-model-confirmation.component";
import FieldError from "../field-error/field-error.component";
import Select from "../select/select.component";
import SelectWithModel from "../selectwithmodel/select-with-model.component";
import TextArea from "../text-area/text-area.component";
import useCreateProduct from "./use-create-product.hook";

function CreateProduct({
  ref,
  module,
  openPopup,
  setOpenPopup,
  data,
  setData,
  lineItemHeader,
  theDiscount,
  positionNumber,
}) {
  const {
    errors,
    register,
    onSubmit,
    handleSubmit,
    productNumber,
    productName,
    grossPrice,
    netPrice,
    handleUnit,
    handleTaxRate,
    handleNetPriceChange,
    handleGrossPriceChange,
    discountGroupOptions,
    handleChangDiscountGroup,
    confirmationPopUp,
    setConfirmationPopUp,
    onClickNO,
    onClickYes,
    handleCancel,
    netPriceErrorMessage,
    grossPriceErrorMessage,
    selectedTaxRate,
    openCreateModal,
    setOpenCreateModal,
    handleClose,
    unitsOptions,
    taxRateOptions,
    defaultTaxRate,
    openCreateUnitModal,
    setOpenCreateUnitModal,
    setSelectedTaxRate,
    handleCheckProductNumber,
    handleCheckSkuNumber,
    handleCheckGtinNumber,
  } = useCreateProduct({
    openPopup,
    setOpenPopup,
    setData,
    data,
    lineItemHeader,
    theDiscount,
    module,
    positionNumber,
  });

  const {
    taxRate,
    handleSubmitTaxRateClick,
    handleChangeTaxRate,
    handleDefaulTaxRateSwitch,
    toggleSwitchValue,
  } = useTaxRate(setOpenCreateModal, setSelectedTaxRate);

  const { unit, handleChangeUnit, handleSubmitUnitClick } = useUnits(
    setOpenCreateUnitModal
  );

  return (
    <Dialog
      className="!rounded-[20px]"
      ref={ref}
      open={openPopup}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "909px",
          },
        },
        zIndex: 1300,
      }}
    >
      <div className="my-scroll max-h-full w-[909px] max-w-full overflow-y-auto ">
        {openCreateModal || openCreateUnitModal ? (
          <CreateModal
            modalStyling="max-h-full w-[479px] max-w-full "
            openPopup={openCreateUnitModal || openCreateModal}
            setOpenPopup={false}
            addLabel={openCreateUnitModal ? "Add New Unit" : "Add New Tax Rate"}
            inputLabel={openCreateUnitModal ? "Unit" : "Tax Rate"}
            inputPlaceholderText={
              openCreateUnitModal ? "Enter Unit" : "Enter Tax Rate"
            }
            addButtonText="Save"
            closeText="Close"
            toggleSwitch={!openCreateUnitModal}
            type={openCreateUnitModal ? "text" : "number"}
            inputLabelValue={openCreateUnitModal ? unit : taxRate}
            toggleSwitchValue={!openCreateUnitModal && toggleSwitchValue}
            handleChangeInputLabelValue={
              openCreateUnitModal ? handleChangeUnit : handleChangeTaxRate
            }
            handleClose={handleClose}
            handleSubmitClick={
              openCreateUnitModal
                ? handleSubmitUnitClick
                : handleSubmitTaxRateClick
            }
            handleDefaulTaxRateSwitch={
              !openCreateUnitModal && handleDefaulTaxRateSwitch
            }
          />
        ) : null}

        <div className="flex h-14 items-center justify-between bg-[#e3ecf4] p-5">
          <div className="text-xl font-medium not-italic leading-[30px] text-text-dark-gray">
            Create New Product
          </div>
          <div className="hover:cursor-pointer" onClick={handleCancel}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.46582 8.01169L15.696 1.78141C16.1014 1.37615 16.1014 0.720878 15.696 0.315665C15.2907 -0.0895966 14.6355 -0.0895966 14.2303 0.315665L7.99993 6.5459L1.76984 0.315665C1.36438 -0.0895966 0.709353 -0.0895966 0.304092 0.315665C-0.101364 0.720926 -0.101364 1.37615 0.304092 1.78141L6.53413 8.01169L0.30414 14.2419C-0.101315 14.6472 -0.101315 15.3025 0.30414 15.7077C0.40027 15.8041 0.514502 15.8805 0.640272 15.9327C0.766042 15.9848 0.900871 16.0115 1.03701 16.0114C1.30233 16.0114 1.56774 15.9098 1.76988 15.7077L7.99993 9.47744L14.2303 15.7077C14.3264 15.8041 14.4406 15.8805 14.5664 15.9326C14.6922 15.9847 14.827 16.0115 14.9631 16.0114C15.2284 16.0114 15.4939 15.9098 15.696 15.7077C16.1014 15.3024 16.1014 14.6472 15.696 14.2419L9.46582 8.01169Z"
                fill="#7E7D7D"
              />
            </svg>
          </div>
        </div>
        <DialogContent>
          <div className="w-full" id="createProduct">
            <CustomInput
              label="Product Name"
              name="productName"
              register={register}
              errors={errors}
              placeholder="Enter Product Name"
              type="tex"
              isRequired={true}
            />
            <div className="mt-4">
              <TextArea
                label="Description"
                name="description"
                register={register}
                errors={errors}
                placeholder="Enter Description"
                type="text"
              />
            </div>
            <div className="model-box-grid-4col">
              <div className="flex flex-col">
                <CustomInput
                  label="Net price"
                  name="netPrice"
                  placeholder="Enter net price "
                  type="text"
                  endIcon={<EuroIcon />}
                  isRequired={true}
                  value={netPrice}
                  onChange={(e) => handleNetPriceChange(e.target.value)}
                />
                {netPriceErrorMessage && (
                  <FieldError
                    className="mt-1 normal-case"
                    error={netPriceErrorMessage}
                  />
                )}
              </div>
              <div className="flex flex-col">
                <CustomInput
                  label="Gross price"
                  name="grossPrice"
                  placeholder="Enter Gross price "
                  type="text"
                  endIcon={<EuroIcon />}
                  isRequired={true}
                  value={grossPrice}
                  onChange={(e) => handleGrossPriceChange(e.target.value)}
                />
                {grossPriceErrorMessage && (
                  <FieldError
                    className="mt-1 normal-case"
                    error={grossPriceErrorMessage}
                  />
                )}
              </div>
              <SelectWithModel
                label="Tax Rate"
                name="taxRate"
                register={register}
                errors={errors}
                placeholder="Enter tax rate"
                popup={true}
                options={[
                  {
                    label: "Add Tax Rate",
                    openPopup: setOpenCreateModal,
                  },
                  ...(taxRateOptions?.map((item) => ({
                    label: item.label,
                    value: item.value,
                  })) || []),
                ]}
                value={
                  selectedTaxRate || {
                    value: defaultTaxRate && defaultTaxRate.id,
                    label: `${
                      (defaultTaxRate &&
                        defaultTaxRate.taxRate !== "null" &&
                        defaultTaxRate.taxRate) ||
                      0
                    } %`,
                  }
                }
                onChange={(e, value) => handleTaxRate(value)}
              />

              <CustomInput
                label="Purchase price "
                name="purchasePrice"
                placeholder="Enter Purchase price "
                type="number"
                register={register}
                errors={errors}
                endIcon={<EuroIcon />}
              />
              <SelectWithModel
                label="Units"
                name="unit"
                register={register}
                errors={errors}
                placeholder="Units "
                className="normal-case"
                popup={true}
                options={[
                  {
                    label: "Add Units",
                    openUnitPopup: setOpenCreateUnitModal,
                  },
                  ...(unitsOptions?.map((item) => ({
                    label: item.label,
                    value: item.value,
                  })) || []),
                ]}
                onChange={(e, value) => handleUnit(value)}
              />

              <CustomInput
                label="Quantity"
                name="quantity"
                register={register}
                errors={errors}
                placeholder="Enter quantity"
                type="number"
              />
              <CustomInput
                label="Position Number"
                name="positionNo"
                errors={errors}
                register={register}
                placeholder="Enter position number"
                type="number"
              />
              <CustomInput
                label="SKU"
                name="sku"
                errors={errors}
                register={register}
                placeholder="Enter SKU"
                type="text"
                onChange={(event) => handleCheckSkuNumber(event)}
              />
              <CustomInput
                label="Product Number"
                name="productNumber"
                errors={errors}
                register={register}
                placeholder="Enter product number"
                type="text"
                isRequired={true}
                onChange={(event) => handleCheckProductNumber(event)}
              />
              <CustomInput
                label="GTIN/EAN"
                name="tginEan"
                errors={errors}
                register={register}
                placeholder="Enter GTIN/EAN"
                type="number"
                onChange={(event) => handleCheckGtinNumber(event)}
              />
              <Select
                label="Discount Group"
                name="discountGroup"
                placeholder="Discount Group "
                options={discountGroupOptions}
                onChange={(e, value) => handleChangDiscountGroup(value)}
              />
              <CustomInput
                label="Discount %"
                name="discount"
                register={register}
                errors={errors}
                placeholder="Enter discount"
                type="text"
              />
            </div>

            <div className="mt-4">
              <TextArea
                label="Notice"
                name="notice"
                register={register}
                errors={errors}
                placeholder="Enter Notice"
                type="text"
              />
            </div>

            <div className="mt-10 flex justify-end gap-[20px]">
              <CustomButton
                onClick={handleCancel}
                text="cancel"
                className="btn-cancel"
              />
              <CustomButton
                text="Create Product"
                type="submit"
                className="btn-primary"
                onClick={handleSubmit(onSubmit)}
                disabled={
                  !productNumber || !productName || !grossPrice || !netPrice
                }
              />
            </div>
          </div>
        </DialogContent>
      </div>

      <ConfirmationModal
        show={confirmationPopUp}
        onCancel={onClickNO}
        onConfirm={onClickYes}
        message="Do you want to add this product into product module"
        cancelText="No"
        onClose={() => setConfirmationPopUp(false)}
      />
    </Dialog>
  );
}

CreateProduct.propTypes = {
  ref: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(React.Element) }),
  ]),
  module: PropTypes.string.isRequired,
  openPopup: PropTypes.bool.isRequired,
  setOpenPopup: PropTypes.func.isRequired,
  data: PropTypes.string,
  setData: PropTypes.func.isRequired,
  lineItemHeader: PropTypes.string,
  theDiscount: PropTypes.string,
  positionNumber: PropTypes.number,
};

export default CreateProduct;
