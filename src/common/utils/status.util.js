/**
 * Format shipment status from backend format (e.g., "IN_TRANSIT") to user-friendly format (e.g., "In Transit")
 * @param {string} status - Status in backend format (CREATED, ASSIGNED, IN_TRANSIT, DELIVERED, CANCEL_BY_CUSTOMER, CANCEL_BY_DRIVER)
 * @returns {string} - User-friendly status format
 */
export const formatShipmentStatus = (status) => {
  if (!status) return "";
  
  // Convert SNAKE_CASE to Title Case
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Get status color classes for badges
 */
export const STATUS_COLORS = {
  CREATED: "bg-gray-100 text-gray-800",
  ASSIGNED: "bg-blue-100 text-blue-800",
  IN_TRANSIT: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCEL_BY_CUSTOMER: "bg-red-100 text-red-800",
  CANCEL_BY_DRIVER: "bg-orange-100 text-orange-800",
};

