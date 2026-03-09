import api from './api';
import { ENDPOINTS } from '@constants/api';
import { Category } from '@/types';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data } = await api.get(ENDPOINTS.CATEGORIES);
    return data.data;
  },
  async create(payload: { name: string; icon: string; color: string; type: string }): Promise<Category> {
    const { data } = await api.post(ENDPOINTS.CATEGORIES, payload);
    return data.data;
  },
};
