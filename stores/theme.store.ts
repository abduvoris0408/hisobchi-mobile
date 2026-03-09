import { create } from 'zustand';
import { Appearance } from 'react-native';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'auto',
  isDark: Appearance.getColorScheme() === 'dark',

  setTheme: (theme) => {
    const isDark = theme === 'auto'
      ? Appearance.getColorScheme() === 'dark'
      : theme === 'dark';
    set({ theme, isDark });
  },
}));
