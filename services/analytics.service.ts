import api from './api';
import { ENDPOINTS } from '@constants/api';

export const analyticsService = {
  async getSummary(month?: number, year?: number) {
    const { data } = await api.get(ENDPOINTS.ANALYTICS_SUMMARY, { params: { month, year } });
    return data.data;
  },
  async getByCategory(month?: number, year?: number) {
    const { data } = await api.get(ENDPOINTS.ANALYTICS_BY_CATEGORY, { params: { month, year } });
    return data.data;
  },
  async getDaily(month?: number, year?: number) {
    const { data } = await api.get(ENDPOINTS.ANALYTICS_DAILY, { params: { month, year } });
    return data.data;
  },
  async getTrend(months?: number) {
    const { data } = await api.get(ENDPOINTS.ANALYTICS_TREND, { params: { months } });
    return data.data;
  },
};
