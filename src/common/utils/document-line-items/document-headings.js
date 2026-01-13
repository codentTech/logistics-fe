import striptags from 'striptags';
import { LINE_ITEM_MAIN_HEADING } from '@/common/constants/document.constants';
import { DOCUMENT_PRODUCTS } from '../document-helpers/document-helpers';

const documentHeading = ({ document, module }) => {
  const response =
    document &&
    document[`${DOCUMENT_PRODUCTS(module)}Products`]?.map((product) => {
      const { lineItemHeader } = product;

      return {
        ...product,
        lineItemHeader: lineItemHeader || LINE_ITEM_MAIN_HEADING
      };
    });

  const orderedMergedData =
    response &&
    response?.reduce((result, item) => {
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
                  productName: item.lineItemHeader
                }
              ]
            };
          }
          result[strippedLineItemHeader].product.push(item);
        }
      }

      return result;
    }, {});

  return {
    LINE_ITEM_MAIN_HEADING: orderedMergedData && orderedMergedData.LINE_ITEM_MAIN_HEADING,
    ...orderedMergedData
  };
};

export default documentHeading;
