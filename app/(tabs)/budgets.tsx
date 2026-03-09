import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService } from '@services/budget.service';
import { categoryService } from '@services/category.service';
import { useTheme } from '@hooks/useTheme';
import { useFormat } from '@hooks/useFormat';
import { BudgetBar } from '@components/common/BudgetBar';
import { Button } from '@components/ui/Button';
import { Colors } from '@constants/colors';
import Toast from 'react-native-toast-message';

export default function BudgetsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { formatMoney } = useFormat();
  const qc = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const now = new Date();

  const { data: budgets } = useQuery({ queryKey: ['budgets'], queryFn: () => budgetService.getAll() });
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: () => categoryService.getAll() });

  const { mutate: createBudget, isPending } = useMutation({
    mutationFn: () => budgetService.create({
      amount: Number(amount),
      categoryId: selectedCat ?? undefined,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['budgets'] });
      setShowAdd(false); setAmount(''); setSelectedCat(null);
      Toast.show({ type: 'success', text1: 'Byudjet qo\'shildi!' });
    },
  });

  const totalBudget = budgets?.reduce((s: number, b: any) => s + b.amount, 0) ?? 0;
  const totalSpent  = budgets?.reduce((s: number, b: any) => s + b.spent,  0) ?? 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <LinearGradient colors={Colors.gradient} style={[styles.hero, { paddingTop: insets.top + 16 }]}>
        <View style={styles.heroTop}>
          <Text style={styles.heroTitle}>Byudjet</Text>
          <TouchableOpacity onPress={() => setShowAdd(true)} style={styles.addBtn}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.heroCard}>
          <Text style={styles.heroLbl}>Jami byudjet</Text>
          <Text style={styles.heroAmt}>{formatMoney(totalBudget)}</Text>
          <View style={styles.heroRow}>
            <Text style={styles.heroSub}>Sarflandi: {formatMoney(totalSpent)}</Text>
            <Text style={styles.heroSub}>Qoldi: {formatMoney(totalBudget - totalSpent)}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {budgets && budgets.length > 0
          ? budgets.map((b: any) => <BudgetBar key={b.id} budget={b} />)
          : (
            <View style={styles.empty}>
              <Ionicons name="wallet-outline" size={48} color={colors.muted} />
              <Text style={[styles.emptyText, { color: colors.muted }]}>Byudjet yo'q</Text>
              <Text style={[styles.emptyHint, { color: colors.muted }]}>+ tugmasi orqali qo'shing</Text>
            </View>
          )
        }
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={showAdd} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Byudjet qo'shish</Text>
              <TouchableOpacity onPress={() => setShowAdd(false)}>
                <Ionicons name="close" size={22} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.fieldLbl, { color: colors.muted }]}>Miqdor (so'm)</Text>
            <View style={[styles.fieldInput, { backgroundColor: colors.card }]}>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="number-pad"
                placeholder="500 000"
                placeholderTextColor={colors.muted}
                style={[styles.fieldText, { color: colors.text }]}
              />
            </View>

            <Text style={[styles.fieldLbl, { color: colors.muted }]}>Kategoriya (ixtiyoriy)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              {categories?.map((c: any) => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => setSelectedCat(c.id === selectedCat ? null : c.id)}
                  style={[
                    styles.catChip,
                    { backgroundColor: colors.card },
                    selectedCat === c.id && { backgroundColor: Colors.primary[50], borderColor: Colors.primary[600] }
                  ]}
                >
                  <Text>{c.icon}</Text>
                  <Text style={[styles.catChipText, { color: selectedCat === c.id ? Colors.primary[600] : colors.muted }]}>{c.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Button title="Saqlash" onPress={() => { if (Number(amount) > 0) createBudget(); }} loading={isPending} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { paddingHorizontal: 20, paddingBottom: 24 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  addBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  heroCard: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  heroLbl: { fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5 },
  heroAmt: { fontSize: 26, fontWeight: '800', color: '#fff', marginVertical: 6 },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between' },
  heroSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 18, fontWeight: '700' },
  emptyHint: { fontSize: 13 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  fieldLbl: { fontSize: 11, fontWeight: '600', letterSpacing: 1, marginBottom: 8 },
  fieldInput: { borderRadius: 12, padding: 14, marginBottom: 16 },
  fieldText: { fontSize: 16, fontWeight: '600' },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginRight: 8, borderWidth: 1, borderColor: 'transparent' },
  catChipText: { fontSize: 12, fontWeight: '600' },
});
