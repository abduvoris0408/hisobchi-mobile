import { useThemeStore } from '@stores/theme.store';
import { Colors } from '@constants/colors';

export function useTheme() {
  const { isDark, theme, setTheme } = useThemeStore();
  const c = isDark ? Colors.dark : Colors.light;

  return {
    isDark, theme, setTheme,
    colors: c,
    primary: Colors.primary,
    income: Colors.income,
    expense: Colors.expense,
    warning: Colors.warning,
    gradient: Colors.gradient,
  };
}
