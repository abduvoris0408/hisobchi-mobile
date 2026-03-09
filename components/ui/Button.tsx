import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@constants/colors';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  style?: ViewStyle;
  disabled?: boolean;
}

export function Button({ title, onPress, loading, variant = 'primary', style, disabled }: Props) {
  if (variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} disabled={loading || disabled} style={style}>
        <LinearGradient
          colors={[Colors.primary[700], Colors.primary[500]]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.primary}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.primaryText}>{title}</Text>
          }
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantStyles = {
    outline: { borderWidth: 1.5, borderColor: Colors.primary[600], backgroundColor: 'transparent' },
    ghost:   { backgroundColor: 'transparent' },
    danger:  { backgroundColor: 'rgba(239,68,68,0.1)' },
  };
  const textColors = {
    outline: Colors.primary[600],
    ghost:   Colors.primary[600],
    danger:  Colors.expense,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      style={[styles.base, variantStyles[variant], style]}
    >
      {loading
        ? <ActivityIndicator color={textColors[variant]} />
        : <Text style={[styles.baseText, { color: textColors[variant] }]}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primary: { borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  base: { borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  baseText: { fontSize: 15, fontWeight: '700' },
});
