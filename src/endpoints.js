export const ENDPOINT = {
  auth: {
    login: { method: "POST", path: "/v1/auth/login" },
  },
  shipments: {
    create: { method: "POST", path: "/v1/shipments" },
    getAll: { method: "GET", path: "/v1/shipments" },
    getById: { method: "GET", path: "/v1/shipments/:id" },
    assignDriver: { method: "POST", path: "/v1/shipments/:id/assign-driver" },
    updateStatus: { method: "POST", path: "/v1/shipments/:id/status" },
  },
  drivers: {
    getAll: { method: "GET", path: "/v1/drivers" },
    getById: { method: "GET", path: "/v1/drivers/:id" },
    updateLocation: { method: "POST", path: "/v1/drivers/:id/location" },
  },
  dashboard: {
    getSummary: { method: "GET", path: "/v1/dashboard/summary" },
  },
};
