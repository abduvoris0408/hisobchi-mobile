export const API_BASE_URL = 'https://hisobchi-backend.onrender.com/api/v1';
export const WS_URL       = 'https://hisobchi-backend.onrender.com';

export const ENDPOINTS = {
  // Auth
  SEND_OTP:    '/auth/send-otp',
  VERIFY_OTP:  '/auth/verify-otp',
  REFRESH:     '/auth/refresh',
  LOGOUT:      '/auth/logout',

  // User
  ME:          '/users/me',

  // Transactions
  TRANSACTIONS: '/transactions',

  // Categories
  CATEGORIES:  '/categories',

  // Budgets
  BUDGETS:     '/budgets',

  // Analytics
  ANALYTICS_SUMMARY:     '/analytics/summary',
  ANALYTICS_BY_CATEGORY: '/analytics/by-category',
  ANALYTICS_DAILY:       '/analytics/daily',
  ANALYTICS_TREND:       '/analytics/trend',

  // Notifications
  NOTIFICATIONS:        '/notifications',
  REGISTER_FCM_TOKEN:   '/notifications/register-token',
  NOTIFICATION_SETTINGS:'/notifications/settings',
};
