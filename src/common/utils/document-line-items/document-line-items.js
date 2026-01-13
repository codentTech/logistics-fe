import { enqueueSnackbar } from 'notistack';
import striptags from 'striptags';
import { LINE_ITEM_MAIN_HEADING } from '@/common/constants/document.constants';
import calculateProductTotalPrice from '../product-calculations/calculate-product-total';
import removePercentageSign from '../product-calculations/remove-percentage-sign';

export const reModifyData = ({ data }) => {
  const orderedMergedData = data.reduce((result, item) => {
    const strippedLineItemHeader = striptags(item.lineItemHeader);
    if (strippedLineItemHeader) {
      if (strippedLineItemHeader === LINE_ITEM_MAIN_HEADING) {
        if (!result[strippedLineItemHeader]) {
          result[strippedLineItemHeader] = {
            product: []
          };
        }
        result[strippedLineItemHeader].product.push(item);
      } else {
        if (!result[strippedLineItemHeader]) {
          result[strippedLineItemHeader] = {
            product: [
              {
                action: 'action',
                productName: item.lineItemHeader,
                headingIndex: item.headingIndex
              }
            ]
          };
        }
        result[strippedLineItemHeader].product.push(item);

        // Need in handling heading more appropriately
        // result[strippedLineItemHeader].product.push({
        //   ...item,
        //   lineItemHeader:
        //     Array.isArray(result[strippedLineItemHeader].product) &&
        //     result[strippedLineItemHeader].product[0].productName
        // });
      }
    }

    return result;
  }, {});

  Object.keys(orderedMergedData).forEach((key) => {
    orderedMergedData[key].product = orderedMergedData[key].product.filter(
      (item) => Object.keys(item).length !== 0
    );
  });

  Object.keys(orderedMergedData).forEach((key) => {
    orderedMergedData[key].product = orderedMergedData[key].product.filter(
      (item) => item.action
    );
  });

  return {
    LINE_ITEM_MAIN_HEADING: orderedMergedData.LINE_ITEM_MAIN_HEADING,
    ...orderedMergedData
  };
};

export const singleDocumentrHandler = async ({ documentProducts, theDiscount, data }) => {
  const product = documentProducts?.map((document) => {
    const { id, product, lineItemHeader, note, purchasingPrice, positionNo } = document;

    return {
      ...document,
      id: product.id,
      newId: id,
      positionNo: positionNo || data.length + 1,
      notice: note,
      purchasePrice: purchasingPrice,
      lineItemHeader: lineItemHeader ?? LINE_ITEM_MAIN_HEADING
    };
  });

  const updatedData = product?.map((item, index) => {
    const { taxRate, unit, discountGroups, quantity, netPrice } = item;

    return {
      ...item,
      pp: 'pp-icon',
      action: 'action',
      discount: 'discount',
      productIndex: index,
      taxRate,
      unit,
      netPrice,
      quantity: quantity || 1,
      taxRateDropdown: 'taxRateDropdown',
      unitDropdown: 'unitDropdown',
      totalPrice: calculateProductTotalPrice({
        taxRate: taxRate || 0,
        discount: theDiscount,
        discountGroups,
        quantity: quantity || 1,
        netPrice
      })
    };
  });

  const updatedLineItemHeader = product?.map((item) => {
    return {
      action: 'action',
      productName: item.lineItemHeader
    };
  });

  const flat = [...data, updatedData].flatMap((item) => item);
  const updated = [...flat, updatedLineItemHeader]
    .flatMap((item) => item)
    .filter((lineItem) => lineItem.productName !== LINE_ITEM_MAIN_HEADING);

  return updated;
};

export const handleRemoveAllLineItemProducts = ({
  data,
  ids,
  setPositionNumber,
  setData,
  setIds,
  setLineItemHeader
}) => {
  if (data?.length === ids.length) {
    setPositionNumber(1);
    setData([]);
    setIds([]);
    setLineItemHeader('');
  }
};

export const handleRemoveLineItemProduct = ({
  row,
  data,
  ids,
  itemToBeRemoved,
  mergedData,
  setData,
  setIds,
  setLineItemHeader,
  setMergedData,
  setPositionNumber,
  setOpenDeleteConfirmation
}) => {
  if (ids.length && ids.length === 1) {
    setData(data?.filter((item) => !ids.includes(item.productIndex)));
  } else {
    const product = row || itemToBeRemoved;
    if (product.id) {
      setData(
        data.filter((item, i) => {
          return item.productIndex !== product.productIndex;
        })
      );
    } else {
      setLineItemHeader('');
      // if there is heading with products in it. delete heading and move its products to LINE_ITEM_MAIN_HEADING
      const updatedMergedData = { ...mergedData };
      const productArray =
        mergedData[product.productName]?.product.filter((p) => p.id) || [];
      if (productArray.length) {
        // for updating mergedData state
        const moveToMain = !updatedMergedData[LINE_ITEM_MAIN_HEADING]
          ? [...productArray]
          : [...mergedData[LINE_ITEM_MAIN_HEADING].product, ...productArray];
        delete updatedMergedData[product.productName];
        updatedMergedData[LINE_ITEM_MAIN_HEADING] = { product: moveToMain };

        // for updating data state
        const updateData = data?.map((item) => {
          if (item.lineItemHeader === product.productName) {
            return { ...item, lineItemHeader: LINE_ITEM_MAIN_HEADING };
          }
          return item;
        });
        setData(updateData);
      } else {
        // if there is only headings with no product in it.
        const filteredData = data.filter(
          (item) => item.headingIndex !== product.headingIndex
        );
        setData(filteredData);
      }
      setMergedData(updatedMergedData);
    }
  }
  setOpenDeleteConfirmation(false);

  enqueueSnackbar('Data delete successfully', {
    variant: 'success'
  });
};

export const lineItemProducts = ({ data, products, theDiscount }) => {
  const result = data
    ?.map((product) => {
      const idOfProduct = product.newId;
      const pid = idOfProduct && products?.length ? { id: idOfProduct } : {};

      const productData = {
        sku: product.sku || undefined,
        ean: product.ean || undefined,
        productName: product.productName || undefined,
        description: product.description || undefined,
        quantity: product.quantity ? Number(product.quantity) : 1,
        positionNo: product.positionNo ? String(product.positionNo) : undefined,
        unit: product.unit ? String(product.unit) : undefined,
        netPrice: product.netPrice ? Number(product.netPrice) : 0,
        taxRate: product.taxRate ? String(product.taxRate) : undefined
      };

      return {
        ...productData,
        productId: product.id,
        lineItemDiscount:
          theDiscount ||
          (product.discountGroups &&
            product.discountGroups?.map((discount) => {
              return (
                (discount?.ProductDiscountGroup &&
                  discount?.ProductDiscountGroup?.discount) ||
                (discount?.ProductDiscountGroup &&
                  discount?.ProductDiscountGroup?.disco) ||
                (discount?.ProductDiscountGroup && discount?.ProductDiscountGroup?.dis) ||
                discount?.ProductDiscountGro
              );
            })[0]) ||
          '0',
        note: product.notice || undefined,
        purchasingPrice: Number(product.purchasePrice) || undefined,
        lineItemHeader:
          product.lineItemHeader === LINE_ITEM_MAIN_HEADING
            ? null
            : product.lineItemHeader,
        ...pid
      };
    })
    .filter((product) => product.productId);

  return result;
};

export const duplicateLineItemProducts = ({
  row,
  data,
  mergedData,
  setData,
  setMergedData
}) => {
  const { lineItemHeader, headingIndex, productName } = row;
  const { newId, ...rest } = row;

  if (headingIndex === 0 || headingIndex) {
    const headingArray = mergedData[productName]?.product.filter((p) => p.id) || [];
  } else {
    const productArray = mergedData[lineItemHeader]?.product || [];
    const updatedMergedData = {
      ...mergedData,
      [lineItemHeader]: {
        product: [...productArray, row]
      }
    };
    setMergedData(updatedMergedData);
    const updatedData = {
      ...rest,
      productIndex: data.length
    };
    setData((data) => [...data, updatedData]);
  }
  enqueueSnackbar('Row duplicated successfully!', {
    variant: 'success'
  });
};

const isIdAdded = ({ checkId, ids }) => {
  return ids.includes(JSON.parse(checkId));
};

export const handleSingleCheckBox = ({
  e,
  ids,
  product,
  isChecked,
  setIds,
  setData,
  setIsChecked,
  setItemToBeRemoved
}) => {
  product && product.newId && isChecked ? setItemToBeRemoved(product) : null;
  setIsChecked(e.target.value);
  const checkId = JSON.parse(e.target.value);
  let stateIds = ids;
  if (isIdAdded({ checkId, ids })) {
    stateIds = stateIds.filter((stateId) => stateId !== checkId);
  } else {
    stateIds.push(checkId);
  }
  setIds([...stateIds]);

  setData((prevData) => {
    const updatedData = prevData?.map((item) => {
      if (Number(product.id) === Number(item.id)) {
        return {
          ...item,
          indexing: Number(e.target.value)
        };
      }
      return item;
    });
    return updatedData;
  });
};

export const handleAllCheckBox = ({ e, mergedData, setIds }) => {
  if (e.target.checked) {
    const index = Object.values(mergedData)?.flatMap((data, key) =>
      data?.product?.map((data, index) => Number(`${key}${index}`))
    );
    setIds([...index]);
  } else {
    setIds([]);
  }
};

export const handleAddProductToLineItem = ({
  product,
  theDiscount,
  lineItemHeader,
  data,
  setData,
  setPositionNumber,
  positionNumber
}) => {
  const { taxRate, discountGroups, quantity, netPrice, unit, positionNo } = product;
  positionNo ? null : setPositionNumber(positionNumber + 1);

  const totalPrice = calculateProductTotalPrice({
    taxRate: taxRate && taxRate.taxRate,
    discount: theDiscount,
    discountGroups,
    quantity: quantity || 1,
    netPrice
  });

  const actions = {
    pp: 'pp-icon',
    action: 'action',
    discount: 'discount',
    taxRateDropdown: 'taxRateDropdown',
    unitDropdown: 'unitDropdown',
    positionNo: positionNo || positionNumber,
    taxRate: taxRate && taxRate.taxRate,
    unit: unit && unit.unit,
    lineItemHeader: lineItemHeader || LINE_ITEM_MAIN_HEADING,
    totalPrice
  };

  const updatedData = {
    ...product,
    ...actions,
    productIndex: data.length
  };
  setData((product) => [...product, updatedData]);
};

export const handleHeadingStyling = ({ row, tag, setData }) => {
  setData((prevData) => {
    const updatedData = prevData?.map((item) => {
      if (item.lineItemHeader === row.productName) {
        return {
          ...item,
          lineItemHeader: `<${tag}>${row.productName}</${tag}>`
        };
      }
      return item;
    });
    return updatedData;
  });
};

export const handleAddPurchasingPriceAndNotes = ({ e, index, setData }) => {
  const { name, value } = e.target;
  setData((prevData) => {
    const updatedData = prevData?.map((item) => {
      if (Number(item.productIndex) === Number(index)) {
        return {
          ...item,
          [name]: value
        };
      }
      return item;
    });
    return updatedData;
  });
};

export const handleEditInputFields = ({
  name,
  value,
  row,
  data,
  setData,
  uniqueIndex,
  setSelectedField,
  setSelectedItemRow,
  setLineItemIndexing,
  setEditDescription,
  handleState
}) => {
  const copyData = [...data];
  const updatedData = copyData?.map((item) => {
    if (Number(item.id) === Number(row.id) && item.productIndex === uniqueIndex) {
      const { discountGroups, quantity, netPrice } = item;

      const productQuantity = name === 'quantity' ? value : quantity;
      const productNetPrice = name === 'netPrice' ? value : netPrice;
      const totalPrice = calculateProductTotalPrice({
        discountGroups,
        quantity: productQuantity,
        netPrice: productNetPrice
      });

      return {
        ...item,
        totalPrice,
        [name]: value
      };
    }
    return item;
  });
  setSelectedField('');
  setSelectedItemRow('');
  // setLineItemIndexing('');
  // if (handleState) {
  //   handleState(false);
  // }
  setData(updatedData);
  setEditDescription(false);
};

export const handleTaxRateAndUnitsSelection = ({
  selection,
  taxRate,
  unit,
  row,
  data,
  setData,
  uniqueIndex
}) => {
  const copyData = [...data];
  const updatedData = copyData?.map((item) => {
    if (Number(item.id) === Number(row.id) && item.productIndex === uniqueIndex) {
      return {
        ...item,
        [selection]: removePercentageSign(taxRate) || unit
      };
    }
    return item;
  });
  setData(updatedData);
};

export const calculateGrossPrice = (price = 0, tax = 0) => {
  // Gross Amount = Net Price * (1 + Tax)
  // return price * (1 + Number(tax / 100));
  return (Number(price) / 100) * Number(tax);
};

export const calculateNetPrice = (price = 0, tax = 0) => {
  // Net Price = Gross Amount / (1 + tax)
  return Number(price) / (1 + Number(tax) / 100);
};
