import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '@hooks/useTheme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  prefix?: React.ReactNode;
}

export function Input({ label, error, prefix, style, ...props }: Props) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      {label && <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>}
      <View style={[
        styles.inputWrap,
        {
          backgroundColor: colors.card,
          borderColor: focused ? '#2563EB' : error ? '#EF4444' : colors.border,
        }
      ]}>
        {prefix && <View style={styles.prefix}>{prefix}</View>}
        <TextInput
          style={[styles.input, { color: colors.text }, style]}
          placeholderTextColor={colors.muted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14,
  },
  prefix: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, paddingVertical: 14 },
  error: { color: '#EF4444', fontSize: 12, marginTop: 4 },
});
