import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@constants/colors';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function GradientHeader({ children, style }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={Colors.gradient}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[{ paddingTop: insets.top + 12 }, style]}
    >
      {children}
    </LinearGradient>
  );
}
