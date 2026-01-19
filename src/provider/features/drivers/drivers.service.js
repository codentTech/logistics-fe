import api from '@/common/utils/api';

const getAllDrivers = async (params = {}) => {
  const response = await api().get('/v1/drivers', { params });
  return response.data;
};

// Get driver by ID
const getDriverById = async (driverId) => {
  const response = await api().get(`/v1/drivers/${driverId}`);
  return response.data;
};

// Update driver location
const updateLocation = async (driverId, locationData) => {
  const response = await api().post(`/v1/drivers/${driverId}/location`, locationData);
  return response.data;
};

const driversService = {
  getAllDrivers,
  getDriverById,
  updateLocation,
};

export default driversService;

