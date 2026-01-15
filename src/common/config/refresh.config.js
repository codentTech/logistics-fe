/**
 * Refresh interval configuration
 * These values can be overridden via environment variables (NEXT_PUBLIC_*)
 * All values are in milliseconds
 */

export const refreshConfig = {
  // Dashboard summary refresh interval
  dashboardSummaryInterval: parseInt(
    process.env.NEXT_PUBLIC_DASHBOARD_SUMMARY_INTERVAL_MS || "3000",
    10
  ),

  // Driver location share interval (how often driver sends location)
  driverLocationShareInterval: parseInt(
    process.env.NEXT_PUBLIC_DRIVER_LOCATION_SHARE_INTERVAL_MS || "3000",
    10
  ),

  // Route refresh delay after status change
  routeRefreshDelay: parseInt(
    process.env.NEXT_PUBLIC_ROUTE_REFRESH_DELAY_MS || "1000",
    10
  ),

  // Location update throttle delay
  locationUpdateThrottle: parseInt(
    process.env.NEXT_PUBLIC_LOCATION_UPDATE_THROTTLE_MS || "5000",
    10
  ),

  // Dashboard summary refresh throttle
  dashboardSummaryThrottle: parseInt(
    process.env.NEXT_PUBLIC_DASHBOARD_SUMMARY_THROTTLE_MS || "2000",
    10
  ),
};
