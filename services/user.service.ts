import api from './api';
import { ENDPOINTS } from '@constants/api';
import { User } from '@/types';

export const userService = {
  async getMe(): Promise<User> {
    const { data } = await api.get(ENDPOINTS.ME);
    return data.data;
  },
  async updateMe(payload: Partial<User>): Promise<User> {
    const { data } = await api.put(ENDPOINTS.ME, payload);
    return data.data;
  },
  async deleteMe(): Promise<void> {
    await api.delete(ENDPOINTS.ME);
  },
};
