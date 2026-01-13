import calculateProductTotalPrice from './calculate-product-total';

export const netAmount = (data) => {
  if (!Array.isArray(data)) {
    return 0;
  }

  const response = data?.reduce((sum, product) => {
    const result = product.netPrice;

    if (result) {
      return sum + result;
    }
    return sum;
  }, 0);

  return response || 0;
};

export const taxRate = (data) => {
  if (!Array.isArray(data)) {
    return 0;
  }

  const response = data?.reduce((sum, product) => {
    const result = product.taxRate;
    if (result) {
      const tax =
        result && String(result).includes('%')
          ? Number(result.split('%')[0])
          : Number(result);
      return sum + tax / 100;
    }
    return sum;
  }, 0);

  return response || 0;
};

export const quantity = (data) => {
  if (!Array.isArray(data)) {
    return 0;
  }

  const response = data?.reduce((sum, product) => {
    const result = product.quantity;

    if (result) {
      return sum + result;
    }
    return sum;
  }, 0);

  return response || 0;
};

export const lineItemNetAmount = (data) => {
  if (!Array.isArray(data)) {
    return 0;
  }

  const response = data?.reduce((sum, product) => {
    const result = calculateProductTotalPrice({
      discount: product.lineItemDiscount,
      discountGroups: product.discountGroups,
      quantity: product.quantity || 0,
      netPrice: product.netPrice || 0
    });

    if (result) {
      return sum + Number(result);
    }
    return sum;
  }, 0);

  return Number(response) || 0;
};

export const plusVat = (data) => {
  if (!Array.isArray(data)) {
    return 0;
  }

  const response = data?.reduce((sum, product) => {
    const { lineItemDiscount, netPrice, quantity, taxRate, discountGroups } = product;
    const tax = taxRate || (taxRate && taxRate.taxRate);

    // const result = taxRate * quantity;

    const total = calculateProductTotalPrice({
      discount: lineItemDiscount,
      discountGroups: product.discountGroups,
      quantity,
      netPrice
    });

    const value = total / 100;
    const result = value * Number(tax);

    if (result) {
      return sum + Number(result);
    }
    return sum;
  }, 0);

  return (response && Number(response)) || 0;
};

export const invoiceAmountWithOutVAT = (data) => {
  return Number(lineItemNetAmount(data));
};

export const invoiceAmountWithVAT = (data) => {
  return Number(lineItemNetAmount(data)) + Number(plusVat(data));
};
