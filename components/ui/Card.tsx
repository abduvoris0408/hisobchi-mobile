import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '@hooks/useTheme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export function Card({ children, style, padding = 16 }: Props) {
  const { colors, isDark } = useTheme();
  return (
    <View style={[
      styles.card,
      {
        backgroundColor: colors.card,
        padding,
        shadowColor: isDark ? '#000' : '#64748B',
      },
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
});
