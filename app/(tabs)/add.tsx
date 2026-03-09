import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, TextInput
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '@services/transaction.service';
import { categoryService } from '@services/category.service';
import { useTheme } from '@hooks/useTheme';
import { Button } from '@components/ui/Button';
import { Colors } from '@constants/colors';
import { TransactionType } from '@/types';
import Toast from 'react-native-toast-message';

const QUICK_AMOUNTS = [10000, 25000, 50000, 100000, 200000, 500000];

export default function AddScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const qc = useQueryClient();

  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  const { mutate: createTx, isPending } = useMutation({
    mutationFn: () => transactionService.create({
      type,
      amount: Number(amount),
      categoryId: selectedCategory ?? undefined,
      note: note || undefined,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions-recent'] });
      qc.invalidateQueries({ queryKey: ['analytics-summary'] });
      Toast.show({ type: 'success', text1: 'Saqlandi! ✅' });
      setAmount(''); setNote(''); setSelectedCategory(null);
      router.replace('/(tabs)');
    },
    onError: () => {
      Toast.show({ type: 'error', text1: 'Xato yuz berdi' });
    },
  });

  const filteredCats = categories?.filter((c: any) =>
    c.type === type || c.type === 'BOTH'
  ) ?? [];

  const handleDigit = (d: string) => {
    if (d === '⌫') { setAmount(p => p.slice(0, -1)); return; }
    if (amount.length >= 10) return;
    setAmount(p => p + d);
  };

  const displayAmount = amount
    ? new Intl.NumberFormat('uz-UZ').format(Number(amount))
    : '0';

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {/* Header */}
        <LinearGradient colors={Colors.gradient} style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.headerTitle}>Yangi yozuv</Text>

          {/* Type switcher */}
          <View style={styles.switcher}>
            {(['EXPENSE', 'INCOME'] as TransactionType[]).map(t => (
              <TouchableOpacity
                key={t}
                onPress={() => { setType(t); setSelectedCategory(null); }}
                style={[styles.switchBtn, type === t && styles.switchBtnActive]}
              >
                <Ionicons
                  name={t === 'EXPENSE' ? 'arrow-down-outline' : 'arrow-up-outline'}
                  size={14}
                  color={type === t ? (t === 'EXPENSE' ? Colors.expense : Colors.income) : 'rgba(255,255,255,0.5)'}
                />
                <Text style={[styles.switchText, type === t && {
                  color: t === 'EXPENSE' ? Colors.expense : Colors.income
                }]}>
                  {t === 'EXPENSE' ? 'Xarajat' : 'Daromad'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Amount display */}
          <View style={styles.amountWrap}>
            <Text style={styles.amountCur}>so'm</Text>
            <Text style={[styles.amountVal, { color: type === 'EXPENSE' ? '#FCA5A5' : '#6EE7B7' }]}>
              {displayAmount}
            </Text>
          </View>
        </LinearGradient>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
          {/* Quick amounts */}
          <View style={styles.quickRow}>
            {QUICK_AMOUNTS.map(q => (
              <TouchableOpacity
                key={q}
                onPress={() => setAmount(String(q))}
                style={[styles.quickBtn, { backgroundColor: colors.card }]}
              >
                <Text style={[styles.quickText, { color: Colors.primary[600] }]}>
                  {q >= 1000 ? `${q / 1000}k` : q}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Categories */}
          {filteredCats.length > 0 && (
            <>
              <Text style={[styles.sectionLbl, { color: colors.muted }]}>KATEGORIYA</Text>
              <View style={styles.catsGrid}>
                {filteredCats.map((cat: any) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                    style={[
                      styles.catItem,
                      { backgroundColor: colors.card },
                      selectedCategory === cat.id && { borderColor: Colors.primary[600], borderWidth: 2, backgroundColor: Colors.primary[50] }
                    ]}
                  >
                    <Text style={{ fontSize: 22 }}>{cat.icon}</Text>
                    <Text style={[styles.catNm, { color: colors.muted }]} numberOfLines={1}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Note */}
          <Text style={[styles.sectionLbl, { color: colors.muted }]}>IZOH</Text>
          <View style={[styles.noteInput, { backgroundColor: colors.card }]}>
            <Ionicons name="create-outline" size={18} color={colors.muted} />
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Izoh qo'shing..."
              placeholderTextColor={colors.muted}
              style={[styles.noteText, { color: colors.text }]}
            />
          </View>

          {/* Save */}
          <Button
            title="Saqlash"
            onPress={() => { if (Number(amount) > 0) createTx(); }}
            loading={isPending}
            disabled={Number(amount) <= 0}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 16 },
  switcher: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: 4, marginBottom: 20 },
  switchBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 9, borderRadius: 9 },
  switchBtnActive: { backgroundColor: '#fff' },
  switchText: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.5)' },
  amountWrap: { alignItems: 'center', paddingVertical: 8 },
  amountCur: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
  amountVal: { fontSize: 42, fontWeight: '800', letterSpacing: -2 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  quickBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  quickText: { fontSize: 13, fontWeight: '700' },
  sectionLbl: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10, marginTop: 4 },
  catsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  catItem: { width: '22%', aspectRatio: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 1, borderColor: 'transparent' },
  catNm: { fontSize: 9, textAlign: 'center' },
  noteInput: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, padding: 14, marginBottom: 20 },
  noteText: { flex: 1, fontSize: 14 },
});
