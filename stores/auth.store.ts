import { create } from 'zustand';
import { User } from '@/types';
import { authService } from '@services/auth.service';
import { userService } from '@services/user.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, code: string) => Promise<void>;
  loadUser: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  sendOtp: async (phone) => {
    await authService.sendOtp(phone);
  },

  verifyOtp: async (phone, code) => {
    const { user } = await authService.verifyOtp(phone, code);
    set({ user, isAuthenticated: true });
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      const tokens = await authService.getStoredTokens();
      if (!tokens) { set({ isLoading: false, isAuthenticated: false }); return; }
      const user = await userService.getMe();
      set({ user, isAuthenticated: true });
    } catch {
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (updates) => set((s) => ({ user: s.user ? { ...s.user, ...updates } : null })),
}));
