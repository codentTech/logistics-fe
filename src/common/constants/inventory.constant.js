export const INVENTORY_STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "IN_STOCK", label: "In Stock" },
  { value: "OUT_OF_STOCK", label: "Out of Stock" },
  { value: "LOW_STOCK", label: "Low Stock" },
  { value: "DISCONTINUED", label: "Discontinued" },
];

export const INVENTORY_BOOLEAN_OPTIONS = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

export const INVENTORY_COLUMNS = [
  {
    title: "Product",
    key: "product_name",
    sortable: true,

    customRender: (row) => <span className="text-neutral-700">{row.product?.name || "N/A"}</span>,
  },
  { title: "Variant", key: "variant_name", sortable: true },
  {
    title: "Vendor",
    key: "vendor_name",
    sortable: true,

    customRender: (row) => <span className="text-neutral-700">{row.vendor?.name || "N/A"}</span>,
  },
  {
    title: "Category",
    key: "category_name",
    sortable: true,

    customRender: (row) => <span className="text-neutral-700">{row.category?.name || "N/A"}</span>,
  },
  {
    title: "Subcategory",
    key: "subcategory_name",
    sortable: true,

    customRender: (row) => (
      <span className="text-neutral-700">{row.subcategory?.name || "N/A"}</span>
    ),
  },
  { title: "SKU", key: "supplier_sku", sortable: true },
  { title: "Quantity", key: "quantity", sortable: true },
  { title: "Reserved", key: "reserved_quantity", sortable: true },
  { title: "Low Stock Threshold", key: "low_stock_threshold", sortable: true },
  { title: "Cost Price", key: "cost_price", sortable: true },
  { title: "Status", key: "status", sortable: true },
  { title: "Last Restocked", key: "last_restocked", sortable: true },
];
