import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Budget } from '@/types';
import { useTheme } from '@hooks/useTheme';
import { useFormat } from '@hooks/useFormat';

interface Props { budget: Budget; }

export function BudgetBar({ budget }: Props) {
  const { colors, income, expense, warning } = useTheme();
  const { formatMoney } = useFormat();
  const pct = Math.min(Math.round((budget.spent / budget.amount) * 100), 100);
  const color = pct >= 90 ? expense : pct >= 70 ? warning : income;

  return (
    <View style={[styles.wrap, { backgroundColor: colors.card }]}>
      <View style={styles.top}>
        <Text style={[styles.name, { color: colors.text }]}>
          {budget.category?.icon ?? '💼'} {budget.category?.name ?? 'Umumiy'}
        </Text>
        <Text style={[styles.pct, { color }]}>{pct}%</Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <View style={[styles.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={[styles.sub, { color: colors.muted }]}>
        {formatMoney(budget.spent)} / {formatMoney(budget.amount)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 14, padding: 14, marginBottom: 8 },
  top: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  name: { fontSize: 13, fontWeight: '600' },
  pct: { fontSize: 12, fontWeight: '700' },
  track: { height: 4, borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
  fill: { height: '100%', borderRadius: 2 },
  sub: { fontSize: 11 },
});
