import api from './api';
import * as SecureStore from 'expo-secure-store';
import { ENDPOINTS } from '@constants/api';
import { AuthTokens, User } from '@/types';

export const authService = {
  async sendOtp(phone: string) {
    const { data } = await api.post(ENDPOINTS.SEND_OTP, { phone });
    return data;
  },

  async verifyOtp(phone: string, code: string): Promise<{ tokens: AuthTokens; user: User }> {
    const { data } = await api.post(ENDPOINTS.VERIFY_OTP, { phone, code });
    const { accessToken, refreshToken, user } = data.data;
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    return { tokens: { accessToken, refreshToken }, user };
  },

  async logout() {
    try { await api.post(ENDPOINTS.LOGOUT); } catch {}
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  },

  async getStoredTokens(): Promise<AuthTokens | null> {
    const accessToken  = await SecureStore.getItemAsync('accessToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (!accessToken || !refreshToken) return null;
    return { accessToken, refreshToken };
  },
};
