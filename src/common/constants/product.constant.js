// Product-related constants

export const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "IN_STOCK", label: "In Stock" },
  { value: "OUT_OF_STOCK", label: "Out of Stock" },
  { value: "LOW_STOCK", label: "Low Stock" },
  { value: "DISCONTINUED", label: "Discontinued" },
];

export const PRODUCT_COLUMNS = [
  { title: "Name", key: "name", sortable: true },
  { title: "SKU", key: "sku", sortable: true },
  {
    title: "Category",
    key: "category",
    sortable: true,
    customRender: (row) => <span className="text-neutral-700">{row.category?.name || "N/A"}</span>,
  },
  { title: "Brand", key: "brand", sortable: true },
  { title: "Price", key: "price", sortable: true },
  { title: "Stock", key: "stock_quantity", sortable: true },
  { title: "Status", key: "stock_status", sortable: true },
  { title: "Condition", key: "condition", sortable: true },
];

export const PRODUCT_ACTIONS = [
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
];

export const STOCK_STATUS_OPTIONS = [
  { value: "IN_STOCK", label: "In Stock" },
  { value: "OUT_OF_STOCK", label: "Out of Stock" },
  { value: "BACKORDERED", label: "Backordered" },
  { value: "DISCONTINUED", label: "Discontinued" },
];

export const CONDITION_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "USED", label: "Used" },
  { value: "REFURBISHED", label: "Refurbished" },
  { value: "DAMAGED", label: "Damaged" },
];

export const VISIBILITY_OPTIONS = [
  { value: "CATALOG_SEARCH", label: "Catalog & Search" },
  { value: "CATALOG_ONLY", label: "Catalog Only" },
  { value: "SEARCH_ONLY", label: "Search Only" },
  { value: "HIDDEN", label: "Hidden" },
];

export const TAX_TYPE_OPTIONS = [
  { value: "INCLUSIVE", label: "Tax Inclusive" },
  { value: "EXCLUSIVE", label: "Tax Exclusive" },
];

export const CALL_FOR_PRICE_OPTIONS = [
  { value: "USE_GLOBAL", label: "Use Global Setting" },
  { value: "ENABLED", label: "Enabled" },
  { value: "DISABLED", label: "Disabled" },
];

export const WEIGHT_UNIT_OPTIONS = [
  { value: "kg", label: "Kilograms" },
  { value: "g", label: "Grams" },
  { value: "lb", label: "Pounds" },
  { value: "oz", label: "Ounces" },
];

export const DIMENSION_UNIT_OPTIONS = [
  { value: "cm", label: "Centimeters" },
  { value: "m", label: "Meters" },
  { value: "in", label: "Inches" },
  { value: "ft", label: "Feet" },
];

export const WARRANTY_UNIT_OPTIONS = [
  { value: "days", label: "Days" },
  { value: "months", label: "Months" },
  { value: "years", label: "Years" },
];

export const BOOLEAN_OPTIONS = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];
