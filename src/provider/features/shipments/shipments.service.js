import api from '@/common/utils/api';
import { v4 as uuidv4 } from 'uuid';

// Create shipment
const createShipment = async (shipmentData) => {
  const idempotencyKey = uuidv4();
  const response = await api({
    'Idempotency-Key': idempotencyKey,
  }).post('/v1/shipments', shipmentData);
  return response.data;
};

// Get all shipments
const getAllShipments = async (params = {}) => {
  const response = await api().get('/v1/shipments', { params });
  return response.data;
};

// Get shipment by ID
const getShipmentById = async (shipmentId) => {
  const response = await api().get(`/v1/shipments/${shipmentId}`);
  return response.data;
};

// Assign driver to shipment
const assignDriver = async (shipmentId, driverId) => {
  const idempotencyKey = uuidv4();
  const response = await api({
    'Idempotency-Key': idempotencyKey,
  }).post(`/v1/shipments/${shipmentId}/assign-driver`, { driverId });
  return response.data;
};

// Update shipment status
const updateStatus = async (shipmentId, status) => {
  const idempotencyKey = uuidv4();
  const response = await api({
    'Idempotency-Key': idempotencyKey,
  }).post(`/v1/shipments/${shipmentId}/status`, { status });
  return response.data;
};

const shipmentsService = {
  createShipment,
  getAllShipments,
  getShipmentById,
  assignDriver,
  updateStatus,
};

export default shipmentsService;

