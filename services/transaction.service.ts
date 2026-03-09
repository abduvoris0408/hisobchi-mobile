import api from './api';
import { ENDPOINTS } from '@constants/api';
import { Transaction, TransactionType } from '@/types';

interface GetTransactionsParams {
  page?: number;
  limit?: number;
  type?: TransactionType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

export const transactionService = {
  async getAll(params?: GetTransactionsParams) {
    const { data } = await api.get(ENDPOINTS.TRANSACTIONS, { params });
    return data.data;
  },

  async create(payload: {
    type: TransactionType;
    amount: number;
    categoryId?: string;
    note?: string;
    date?: string;
  }): Promise<Transaction> {
    const { data } = await api.post(ENDPOINTS.TRANSACTIONS, payload);
    return data.data;
  },

  async update(id: string, payload: Partial<Transaction>): Promise<Transaction> {
    const { data } = await api.patch(`${ENDPOINTS.TRANSACTIONS}/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${ENDPOINTS.TRANSACTIONS}/${id}`);
  },
};
