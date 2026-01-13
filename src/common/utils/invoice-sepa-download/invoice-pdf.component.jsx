import PropTypes from "prop-types";
import {
  netAmount,
  taxRate,
} from "../product-calculations/amount-calculations";

function InvoicePdf({ invoice, products }) {
  return (
    <div
      className={` w-[400px] bg-[#FBFBFB] px-10 pb-8 pt-3 invoice-sepa-pdf-${invoice.id}`}
    >
      <div className="mt-6 flex flex w-full flex-col justify-center gap-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-normal not-italic leading-[30px] text-text-dark-gray">
            Company:
          </p>
          <p className="ml-4 text-xs font-normal not-italic leading-[30px] text-text-dark-gray">
            {invoice?.company}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-normal not-italic leading-[30px] text-text-dark-gray">
            First Name:
          </p>
          <p className="text-xs font-normal not-italic leading-[30px] text-text-dark-gray">
            {invoice?.firstName}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-normal not-italic leading-[30px] text-text-dark-gray">
            Last Name:
          </p>
          <p className="text-xs font-normal not-italic leading-[30px] text-text-dark-gray">
            {invoice?.lastName}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-normal not-italic leading-[30px] text-text-dark-gray">
            Invoice Number:
          </p>
          <p className="text-xs font-normal not-italic leading-[30px] text-text-dark-gray">
            {invoice?.id}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-normal not-italic leading-[30px] text-text-dark-gray">
            Total Amount:
          </p>
          <p className="text-xs font-normal not-italic leading-[30px] text-text-dark-gray">
            {netAmount(products && products.products) +
              netAmount(products && products.products) *
                taxRate(products && products.products)}
          </p>
        </div>
      </div>
    </div>
  );
}

InvoicePdf.propTypes = {
  invoice: PropTypes.string,
  products: PropTypes.string,
};

export default InvoicePdf;
