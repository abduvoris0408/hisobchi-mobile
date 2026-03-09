import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@hooks/useTheme';
import { Colors } from '@constants/colors';

function TabIcon({ name, focused }: { name: keyof typeof Ionicons.glyphMap; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Ionicons name={focused ? name : `${name}-outline` as any} size={24} color={focused ? Colors.primary[600] : '#94A3B8'} />
      {focused && <View style={styles.dot} />}
    </View>
  );
}

export default function TabsLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        height: 80,
        paddingBottom: 16,
        paddingTop: 8,
      },
      tabBarShowLabel: false,
    }}>
      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} /> }}
      />
      <Tabs.Screen
        name="analytics"
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="bar-chart" focused={focused} /> }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: () => (
            <View style={styles.fab}>
              <Ionicons name="add" size={28} color="#fff" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="wallet" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="person" focused={focused} /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary[600], marginTop: 3 },
  fab: {
    width: 52, height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primary[600],
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary[600],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 12,
  },
});
