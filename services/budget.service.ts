import api from './api';
import { ENDPOINTS } from '@constants/api';
import { Budget } from '@/types';

export const budgetService = {
  async getAll(): Promise<Budget[]> {
    const { data } = await api.get(ENDPOINTS.BUDGETS);
    return data.data;
  },
  async create(payload: { amount: number; categoryId?: string; month: number; year: number }): Promise<Budget> {
    const { data } = await api.post(ENDPOINTS.BUDGETS, payload);
    return data.data;
  },
};
