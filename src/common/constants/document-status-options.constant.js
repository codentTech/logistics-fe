import capitalizeFirstLetter from '../utils/capitalize-first-letter';
import {
  DELIVERY_NOTES_STATUS,
  CREDIT_NOTE_STATUS,
  INVOICE_STATUS,
  OFFER_STATUS,
  ORDER_STATUS
} from './document-status.constant';

export const OFFER_STATUS_OPTIONS = [
  { value: OFFER_STATUS.OPEN, label: capitalizeFirstLetter(OFFER_STATUS.OPEN) },
  { value: OFFER_STATUS.ACCEPTED, label: capitalizeFirstLetter(OFFER_STATUS.ACCEPTED) },
  { value: OFFER_STATUS.REJECTED, label: capitalizeFirstLetter(OFFER_STATUS.REJECTED) },
  { value: OFFER_STATUS.INVOICED, label: capitalizeFirstLetter(OFFER_STATUS.INVOICED) }
];

export const CREDIT_NOTE_STATUS_OPTIONS = [
  {
    value: CREDIT_NOTE_STATUS.OPEN,
    label: capitalizeFirstLetter(CREDIT_NOTE_STATUS.OPEN)
  },
  {
    value: CREDIT_NOTE_STATUS.PAID,
    label: capitalizeFirstLetter(CREDIT_NOTE_STATUS.PAID)
  },
  {
    value: CREDIT_NOTE_STATUS.REJECTED,
    label: capitalizeFirstLetter(CREDIT_NOTE_STATUS.REJECTED)
  }
];

export const ORDER_STATUS_OPTIONS = [
  { value: ORDER_STATUS.OPEN, label: capitalizeFirstLetter(ORDER_STATUS.OPEN) },
  { value: ORDER_STATUS.SENT, label: capitalizeFirstLetter(ORDER_STATUS.SENT) },
  { value: ORDER_STATUS.EXECUTED, label: capitalizeFirstLetter(ORDER_STATUS.EXECUTED) },
  { value: ORDER_STATUS.INVOICED, label: capitalizeFirstLetter(ORDER_STATUS.INVOICED) },
  { value: ORDER_STATUS.REJECTED, label: capitalizeFirstLetter(ORDER_STATUS.REJECTED) }
];

export const INVOICE_STATUS_OPTIONS = [
  { value: INVOICE_STATUS.OPEN, label: capitalizeFirstLetter(INVOICE_STATUS.OPEN) },
  {
    value: INVOICE_STATUS.CANCELLED,
    label: capitalizeFirstLetter(INVOICE_STATUS.CANCELLED)
  },
  { value: INVOICE_STATUS.PAID, label: capitalizeFirstLetter(INVOICE_STATUS.PAID) }
];

export const DELIVERY_NOTES_STATUS_OPTIONS = [
  {
    value: DELIVERY_NOTES_STATUS.OPEN,
    label: capitalizeFirstLetter(DELIVERY_NOTES_STATUS.OPEN)
  },
  {
    value: DELIVERY_NOTES_STATUS.RETURNED,
    label: capitalizeFirstLetter(DELIVERY_NOTES_STATUS.RETURNED)
  },
  {
    value: DELIVERY_NOTES_STATUS.REJECTED,
    label: capitalizeFirstLetter(DELIVERY_NOTES_STATUS.REJECTED)
  }
];
