import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '@/types';
import { useTheme } from '@hooks/useTheme';
import { useFormat } from '@hooks/useFormat';

interface Props {
  transaction: Transaction;
  onPress?: () => void;
}

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Oziq-ovqat': 'fast-food-outline',
  'Transport':  'car-outline',
  'Xarid':      'bag-outline',
  'Maosh':      'briefcase-outline',
  'default':    'cash-outline',
};

export function TransactionItem({ transaction, onPress }: Props) {
  const { colors, income, expense } = useTheme();
  const { formatMoney, formatDate } = useFormat();
  const isExpense = transaction.type === 'EXPENSE';
  const iconName = CATEGORY_ICONS[transaction.category?.name ?? 'default'] ?? 'cash-outline';

  return (
    <TouchableOpacity onPress={onPress} style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.bg + '80' }]}>
        <Ionicons name={iconName} size={20} color={isExpense ? expense : income} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>
          {transaction.category?.name ?? transaction.note ?? 'Noma\'lum'}
        </Text>
        <Text style={[styles.date, { color: colors.muted }]}>
          {formatDate(transaction.date)}
        </Text>
      </View>
      <Text style={[styles.amount, { color: isExpense ? expense : income }]}>
        {isExpense ? '-' : '+'}{formatMoney(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '600' },
  date: { fontSize: 11, marginTop: 2 },
  amount: { fontSize: 14, fontWeight: '700' },
});
