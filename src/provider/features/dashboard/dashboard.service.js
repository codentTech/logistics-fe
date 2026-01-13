import api from '@/common/utils/api';

// Get dashboard summary
const getSummary = async () => {
  const response = await api().get('/v1/dashboard/summary');
  return response.data;
};

const dashboardService = {
  getSummary,
};

export default dashboardService;

