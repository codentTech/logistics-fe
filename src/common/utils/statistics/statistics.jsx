import { DOCUMENT_STATUS } from '@/common/constants/document-status.constant';
import {
  DOCUMENT_LOWER_CASE_STATUS,
  DOCUMENT_PRODUCTS
} from '../document-helpers/document-helpers';
import { lineItemNetAmount } from '../product-calculations/amount-calculations';
import calculateProductTotalPrice from '../product-calculations/calculate-product-total';

const statistics = ({ items, status, module = '' }) => {
  const moduleName = DOCUMENT_PRODUCTS(module);
  const response = items
    ?.filter((item) => item.status === status)
    ?.map((product) =>
      product[`${moduleName}Products`]?.map((product) => {
        const total = calculateProductTotalPrice({
          discount:
            product.lineItemDiscount ||
            (product?.product &&
              product?.product?.discountGroups &&
              product?.product?.discountGroups?.[0]?.ProductDiscountGroup &&
              product?.product?.discountGroups?.[0]?.ProductDiscountGroup?.disco) ||
            (product?.product &&
              product?.product?.discountGroups &&
              product?.product?.discountGroups?.[0]?.ProductDiscountGroup &&
              product?.product?.discountGroups?.[0]?.ProductDiscountGroup?.discount) ||
            (product?.product &&
              product?.product?.discountGroups &&
              product?.product?.discountGroups?.[0]?.ProductDiscountGroup &&
              product?.product?.discountGroups?.[0]?.ProductDiscountGroup?.dis),
          netPrice: product.netPrice || (product.product && product.product.netPrice),
          quantity: product.quantity || (product.product && product.product.quantity),
          taxRate: product.taxRate || (product.product && product.product.taxRate)
        });
        return total;
      })
    )
    .flat()
    .reduce((initial, sum) => {
      return initial + Number(sum);
    }, 0);

  return response;
};

export const revenue = ({ items, module }) => {
  const moduleName = DOCUMENT_PRODUCTS(module);
  const response = items
    ?.filter((status) => status.status !== DOCUMENT_STATUS.DRAFT)
    ?.map((product) =>
      product[`${moduleName}Products`]?.map((product) =>
        Number(product.netPrice || (product.product && product.product.netPrice))
      )
    )
    .flat()
    .reduce((initial, sum) => {
      return initial + Number(sum);
    }, 0);

  return response;
};

export const cost = ({ items, module }) => {
  const moduleName = DOCUMENT_PRODUCTS(module);
  const response = items
    ?.filter(
      (status) =>
        DOCUMENT_LOWER_CASE_STATUS(status.status) !==
          DOCUMENT_LOWER_CASE_STATUS(DOCUMENT_STATUS.DRAFT) &&
        DOCUMENT_LOWER_CASE_STATUS(status.status) !==
          DOCUMENT_LOWER_CASE_STATUS(DOCUMENT_STATUS.REJECTED)
    )
    ?.map((product) =>
      product[`${moduleName}Products`]?.map((product) =>
        Number(
          product.purchasePrice || (product.product && product.product.purchasePrice)
        )
      )
    )
    .flat()
    .reduce((initial, sum) => {
      return initial + Number(sum);
    }, 0);
  return response;
};

export const documentProfit = ({ items, module }) => {
  const moduleName = DOCUMENT_PRODUCTS(module);
  const response = items
    ?.filter(
      (status) =>
        DOCUMENT_LOWER_CASE_STATUS(status.status) !==
          DOCUMENT_LOWER_CASE_STATUS(DOCUMENT_STATUS.DRAFT) &&
        DOCUMENT_LOWER_CASE_STATUS(status.status) !==
          DOCUMENT_LOWER_CASE_STATUS(DOCUMENT_STATUS.REJECTED)
    )
    ?.map((product) => ({
      ...product,
      [`${moduleName}Products`]: product[`${moduleName}Products`]?.filter(
        (item) => Number(item.purchasingPrice) !== 0
      )
    }))
    .filter((item) => item[`${moduleName}Products`].length)
    .flat()
    ?.map((prof) => {
      return lineItemNetAmount(prof[`${moduleName}Products`]);
    })
    .reduce((initial, sum) => {
      return initial + Number(sum);
    }, 0);

  return response;
};

export default statistics;
