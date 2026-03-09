import { Redirect } from 'expo-router';
import { useAuthStore } from '@stores/auth.store';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@constants/colors';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary[900] }}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/login'} />;
}
