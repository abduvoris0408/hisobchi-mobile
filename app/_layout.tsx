import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@stores/auth.store';
import { useThemeStore } from '@stores/theme.store';
import { Appearance } from 'react-native';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

export default function RootLayout() {
  const { loadUser } = useAuthStore();
  const { setTheme, isDark } = useThemeStore();

  useEffect(() => {
    loadUser();
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme('auto');
    });
    return () => sub.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <Toast />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
