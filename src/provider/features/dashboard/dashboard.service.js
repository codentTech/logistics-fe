import api from '@/common/utils/api';

const getSummary = async () => {
  const response = await api().get('/v1/dashboard/summary');
  return response.data;
};

const dashboardService = {
  getSummary,
};

export default dashboardService;

