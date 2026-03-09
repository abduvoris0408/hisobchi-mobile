import { create } from 'zustand';
import { Transaction } from '@/types';

interface TransactionState {
  transactions: Transaction[];
  setTransactions: (txs: Transaction[]) => void;
  addTransaction: (tx: Transaction) => void;
  removeTransaction: (id: string) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (tx) => set((s) => ({ transactions: [tx, ...s.transactions] })),
  removeTransaction: (id) => set((s) => ({ transactions: s.transactions.filter(t => t.id !== id) })),
}));
