import api from "@/common/utils/api";
import { getIdempotencyHeaders } from "@/common/utils/idempotency.util";

// Create shipment
const createShipment = async (shipmentData) => {
  const response = await api(getIdempotencyHeaders()).post(
    "/v1/shipments",
    shipmentData
  );
  return response.data;
};

// Get all shipments
const getAllShipments = async (params = {}) => {
  const response = await api().get("/v1/shipments", { params });
  return response.data;
};

// Get shipment by ID
const getShipmentById = async (shipmentId) => {
  const response = await api().get(`/v1/shipments/${shipmentId}`);
  return response.data;
};

// Assign driver to shipment
const assignDriver = async (shipmentId, driverId) => {
  const response = await api(getIdempotencyHeaders()).post(
    `/v1/shipments/${shipmentId}/assign-driver`,
    { driverId }
  );
  return response.data;
};

// Update shipment status
const updateStatus = async (shipmentId, status) => {
  const response = await api(getIdempotencyHeaders()).post(
    `/v1/shipments/${shipmentId}/status`,
    { status }
  );
  return response.data;
};

// Cancel shipment by customer
const cancelByCustomer = async (shipmentId) => {
  const response = await api(getIdempotencyHeaders()).post(
    `/v1/shipments/${shipmentId}/cancel-by-customer`
  );
  return response.data;
};

// Cancel shipment by driver
const cancelByDriver = async (shipmentId) => {
  const response = await api(getIdempotencyHeaders()).post(
    `/v1/shipments/${shipmentId}/cancel-by-driver`
  );
  return response.data;
};

// Get shipment route data
const getShipmentRoute = async (shipmentId) => {
  const response = await api().get(`/v1/shipments/${shipmentId}/route`);
  return response.data;
};

const shipmentsService = {
  createShipment,
  getAllShipments,
  getShipmentById,
  assignDriver,
  updateStatus,
  cancelByCustomer,
  cancelByDriver,
  getShipmentRoute,
};

export default shipmentsService;
