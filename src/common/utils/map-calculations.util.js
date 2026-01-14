/**
 * Map calculation utilities for distance, ETA, bearing, speed, etc.
 */

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in meters
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Calculate bearing (direction) from point A to point B
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Bearing in degrees (0-360)
 */
export function calculateBearing(lat1, lng1, lat2, lng2) {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  const bearing = ((θ * 180) / Math.PI + 360) % 360;

  return bearing;
}

/**
 * Calculate speed from two location points and time difference
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @param {number} timeDiffMs - Time difference in milliseconds
 * @returns {number} Speed in km/h
 */
export function calculateSpeed(lat1, lng1, lat2, lng2, timeDiffMs) {
  if (!timeDiffMs || timeDiffMs === 0) return 0;

  const distance = calculateDistance(lat1, lng1, lat2, lng2); // meters
  const timeHours = timeDiffMs / (1000 * 60 * 60); // Convert ms to hours
  const speedKmh = distance / 1000 / timeHours; // Convert meters to km and calculate km/h

  return Math.max(0, speedKmh); // Ensure non-negative
}

/**
 * Calculate ETA (Estimated Time of Arrival)
 * @param {number} distanceMeters - Distance in meters
 * @param {number} speedKmh - Current speed in km/h
 * @returns {number} ETA in minutes
 */
export function calculateETA(distanceMeters, speedKmh) {
  if (!speedKmh || speedKmh === 0) return null;

  const distanceKm = distanceMeters / 1000;
  const timeHours = distanceKm / speedKmh;
  const timeMinutes = timeHours * 60;

  return Math.ceil(timeMinutes); // Round up to nearest minute
}

/**
 * Format distance for display
 * @param {number} distanceMeters - Distance in meters
 * @returns {string} Formatted distance string
 */
export function formatDistance(distanceMeters) {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)}m`;
  }
  return `${(distanceMeters / 1000).toFixed(1)}km`;
}

/**
 * Format speed for display
 * @param {number} speedKmh - Speed in km/h
 * @returns {string} Formatted speed string
 */
export function formatSpeed(speedKmh) {
  return `${Math.round(speedKmh)} km/h`;
}

/**
 * Format ETA for display
 * @param {number} etaMinutes - ETA in minutes
 * @returns {string} Formatted ETA string
 */
export function formatETA(etaMinutes) {
  if (!etaMinutes) return "Calculating...";
  if (etaMinutes < 60) {
    return `${etaMinutes} min`;
  }
  const hours = Math.floor(etaMinutes / 60);
  const minutes = etaMinutes % 60;
  return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
}

/**
 * Calculate total distance along a route (array of points)
 * @param {Array<{lat: number, lng: number}>} routePoints - Array of route points
 * @returns {number} Total distance in meters
 */
export function calculateRouteDistance(routePoints) {
  if (!routePoints || routePoints.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 0; i < routePoints.length - 1; i++) {
    const point1 = routePoints[i];
    const point2 = routePoints[i + 1];
    totalDistance += calculateDistance(
      point1.lat,
      point1.lng,
      point2.lat,
      point2.lng
    );
  }
  return totalDistance;
}

/**
 * Calculate remaining distance along route from current position
 * @param {number} currentLat - Current latitude
 * @param {number} currentLng - Current longitude
 * @param {Array<{lat: number, lng: number}>} routePoints - Array of route points
 * @param {number} currentStep - Current step index in route
 * @returns {number} Remaining distance in meters
 */
export function calculateRemainingDistance(
  currentLat,
  currentLng,
  routePoints,
  currentStep
) {
  if (!routePoints || routePoints.length === 0) return 0;
  if (currentStep >= routePoints.length - 1) return 0;

  // Distance from current position to next point
  const distanceToNext = calculateDistance(
    currentLat,
    currentLng,
    routePoints[currentStep + 1].lat,
    routePoints[currentStep + 1].lng
  );

  // Distance from next point to destination
  let remainingRouteDistance = 0;
  for (let i = currentStep + 1; i < routePoints.length - 1; i++) {
    remainingRouteDistance += calculateDistance(
      routePoints[i].lat,
      routePoints[i].lng,
      routePoints[i + 1].lat,
      routePoints[i + 1].lng
    );
  }

  return distanceToNext + remainingRouteDistance;
}

