export interface User {
  id: string;
  phone: string;
  name?: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
  telegramId?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'EXPENSE' | 'INCOME';
  amount: number;
  note?: string;
  date: string;
  categoryId?: string;
  category?: Category;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'EXPENSE' | 'INCOME' | 'BOTH';
  isDefault: boolean;
}

export interface Budget {
  id: string;
  amount: number;
  spent: number;
  month: number;
  year: number;
  categoryId?: string;
  category?: Category;
}

export interface AnalyticsSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  month: number;
  year: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type TransactionType = 'EXPENSE' | 'INCOME';
