import creditNoteConfig from '@/provider/features/credit-note/credit-note.config';

export const unitsColumns = [
  { id: '1', name: 'unit', title: 'Units', selected: true, sort: true },
  { id: '2', name: 'action', title: 'Action', selected: true, sort: false }
];

export const taxRateColumns = [
  { id: '1', name: 'taxRate', title: 'Tax Rate', selected: true, sort: true },
  { id: '2', name: 'setDefault', title: 'Set as Default', selected: true, sort: false },
  { id: '3', name: 'action', title: 'Action', selected: true, sort: false }
];

export const offerColumns = [
  { id: '1', name: 'displayId', title: 'Offer #', selected: true, sort: true },
  { id: '2', name: 'firstName', title: 'First Name', selected: true, sort: true },
  { id: '3', name: 'lastName', title: 'Last Name', selected: true, sort: true },
  { id: '4', name: 'company', title: 'Company Name', selected: true, sort: true },
  { id: '5', name: 'address', title: 'Company Address', selected: true, sort: true },
  { id: '6', name: 'country', title: 'Country', selected: true, sort: true },
  { id: '7', name: 'created', title: 'Created At', selected: false, sort: true },
  { id: '8', name: 'status', title: 'Status', selected: true, sort: true }
];

export const offerDraftColumns = [
  { id: '2', name: 'firstName', title: 'First Name', selected: true, sort: true },
  { id: '3', name: 'lastName', title: 'Last Name', selected: true, sort: true },
  { id: '4', name: 'company', title: 'Company Name', selected: true, sort: true },
  { id: '5', name: 'address', title: 'Company Address', selected: true, sort: true },
  { id: '6', name: 'country', title: 'Country', selected: true, sort: true },
  { id: '7', name: 'created', title: 'Created At', selected: false, sort: true },
  { id: '8', name: 'status', title: 'Status', selected: true, sort: true }
];

export const creditNoteColumns = [
  {
    id: '1',
    name: 'displayId',
    title: `${creditNoteConfig.label} #`,
    selected: true,
    sort: true
  },
  { id: '2', name: 'firstName', title: 'First Name', selected: true, sort: true },
  { id: '3', name: 'lastName', title: 'Last Name', selected: true, sort: true },
  { id: '4', name: 'company', title: 'Company Name', selected: true, sort: true },
  { id: '5', name: 'address', title: 'Company Address', selected: true, sort: true },
  { id: '6', name: 'country', title: 'Country', selected: true, sort: true },
  { id: '7', name: 'created', title: 'Created At', selected: false, sort: true },
  { id: '8', name: 'status', title: 'Status', selected: true, sort: true }
];

export const creditNoteDraftColumns = [
  { id: '2', name: 'firstName', title: 'First Name', selected: true, sort: true },
  { id: '3', name: 'lastName', title: 'Last Name', selected: true, sort: true },
  { id: '4', name: 'company', title: 'Company Name', selected: true, sort: true },
  { id: '5', name: 'address', title: 'Company Address', selected: true, sort: true },
  { id: '6', name: 'country', title: 'Country', selected: true, sort: true },
  { id: '7', name: 'created', title: 'Created At', selected: false, sort: true },
  { id: '8', name: 'status', title: 'Status', selected: true, sort: true }
];

export const orderColumns = [
  { id: '1', name: 'displayId', title: 'Order #', selected: true, sort: true },
  { id: '2', name: 'firstName', title: 'First Name', selected: true, sort: true },
  { id: '3', name: 'lastName', title: 'Last Name', selected: true, sort: true },
  { id: '4', name: 'company', title: 'Company Name', selected: true, sort: true },
  { id: '5', name: 'address', title: 'Company Address', selected: true, sort: true },
  { id: '6', name: 'country', title: 'Country', selected: true, sort: true },
  { id: '7', name: 'created', title: 'Created At', selected: false, sort: true },
  { id: '8', name: 'status', title: 'Status', selected: true, sort: true }
];

export const orderDraftColumns = [
  { id: '2', name: 'firstName', title: 'First Name', selected: true, sort: true },
  { id: '3', name: 'lastName', title: 'Last Name', selected: true, sort: true },
  { id: '4', name: 'company', title: 'Company Name', selected: true, sort: true },
  { id: '5', name: 'address', title: 'Company Address', selected: true, sort: true },
  { id: '6', name: 'country', title: 'Country', selected: true, sort: true },
  { id: '7', name: 'created', title: 'Created At', selected: false, sort: true },
  { id: '8', name: 'status', title: 'Status', selected: true, sort: true }
];

export const invoiceColumns = [
  { id: '1', name: 'displayId', title: 'Invoices #', selected: true, sort: true },
  { id: '4', name: 'company', title: 'Company', selected: true, sort: true },
  { id: '2', name: 'firstName', title: 'First Name', selected: true, sort: true },
  { id: '3', name: 'lastName', title: 'Last Name', selected: true, sort: true },
  { id: '5', name: 'address', title: 'Address', selected: true, sort: true },
  { id: '6', name: 'country', title: 'Country', selected: true, sort: true },
  { id: '7', name: 'createdAt', title: 'Created At', selected: true, sort: true },
  { id: '8', name: 'status', title: 'Status', selected: true, sort: true }
];

export const invoiceDraftColumns = [
  { id: '4', name: 'company', title: 'Company', selected: true, sort: true },
  { id: '2', name: 'firstName', title: 'First Name', selected: true, sort: true },
  { id: '3', name: 'lastName', title: 'Last Name', selected: true, sort: true },
  { id: '5', name: 'address', title: 'Address', selected: true, sort: true },
  { id: '6', name: 'country', title: 'Country', selected: true, sort: true },
  { id: '7', name: 'createdAt', title: 'Created At', selected: true, sort: true },
  { id: '8', name: 'status', title: 'Status', selected: true, sort: true }
];

export const deliveryNotesColumns = [
  { id: '1', name: 'displayId', title: 'Delivery Notes #', selected: true, sort: true },
  { id: '2', name: 'firstName', title: 'First Name', selected: true, sort: true },
  { id: '3', name: 'lastName', title: 'Last Name', selected: true, sort: true },
  { id: '4', name: 'company', title: 'Company Name', selected: true, sort: true },
  { id: '5', name: 'address', title: 'Company Address', selected: true, sort: true },
  { id: '6', name: 'country', title: 'Country', selected: true, sort: true },
  { id: '7', name: 'created', title: 'Created At', selected: false, sort: true },
  { id: '8', name: 'status', title: 'Status', selected: true, sort: true }
];

export const deliveryNotesDraftColumns = [
  { id: '2', name: 'firstName', title: 'First Name', selected: true, sort: true },
  { id: '3', name: 'lastName', title: 'Last Name', selected: true, sort: true },
  { id: '4', name: 'company', title: 'Company Name', selected: true, sort: true },
  { id: '5', name: 'address', title: 'Company Address', selected: true, sort: true },
  { id: '6', name: 'country', title: 'Country', selected: true, sort: true },
  { id: '7', name: 'created', title: 'Created At', selected: false, sort: true },
  { id: '8', name: 'status', title: 'Status', selected: true, sort: true }
];

export const expenditureColumns = [
  { id: '1', name: 'firstName', title: 'First Name', selected: true },
  { id: '2', name: 'lastName', title: 'Last Name', selected: true },
  { id: '3', name: 'companyName', title: 'Company Name', selected: true },
  { id: '4', name: 'description', title: 'Description', selected: false },
  { id: '5', name: 'amount', title: 'Amount', selected: true },
  { id: '6', name: 'dueDate', title: 'Due Date', selected: true },
  { id: '7', name: 'dateOfReceipt', title: 'Date of Receipt', selected: true },
  { id: '8', name: 'status', title: 'Status', selected: true }
];
