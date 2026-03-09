import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, RefreshControl
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@stores/auth.store';
import { useTheme } from '@hooks/useTheme';
import { useFormat } from '@hooks/useFormat';
import { analyticsService } from '@services/analytics.service';
import { transactionService } from '@services/transaction.service';
import { budgetService } from '@services/budget.service';
import { Card } from '@components/ui/Card';
import { TransactionItem } from '@components/common/TransactionItem';
import { BudgetBar } from '@components/common/BudgetBar';
import { Colors } from '@constants/colors';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { colors, isDark } = useTheme();
  const { formatMoney } = useFormat();

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { data: summary, refetch: refetchSummary } = useQuery({
    queryKey: ['analytics-summary', month, year],
    queryFn: () => analyticsService.getSummary(month, year),
  });

  const { data: txData, refetch: refetchTx } = useQuery({
    queryKey: ['transactions-recent'],
    queryFn: () => transactionService.getAll({ limit: 5 }),
  });

  const { data: budgets, refetch: refetchBudgets } = useQuery({
    queryKey: ['budgets'],
    queryFn: () => budgetService.getAll(),
  });

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchSummary(), refetchTx(), refetchBudgets()]);
    setRefreshing(false);
  };

  const transactions = txData?.items ?? [];
  const balance = summary?.balance ?? 0;
  const totalIncome = summary?.totalIncome ?? 0;
  const totalExpense = summary?.totalExpense ?? 0;

  const greeting = () => {
    const h = now.getHours();
    if (h < 6)  return 'Yaxshi tun 🌙';
    if (h < 12) return 'Xayrli tong ☀️';
    if (h < 18) return 'Xayrli kun 👋';
    return 'Xayrli kech 🌇';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
      >
        {/* Hero */}
        <LinearGradient
          colors={Colors.gradient}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 16 }]}
        >
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.greeting}>{greeting()}</Text>
              <Text style={styles.userName}>{user?.name ?? user?.phone ?? 'Foydalanuvchi'}</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn} onPress={() => {}}>
              <Ionicons name="notifications-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>JORIY BALANS</Text>
            <Text style={styles.balanceAmount}>{formatMoney(balance)}</Text>
            <View style={styles.balanceRow}>
              <View style={styles.balanceSub}>
                <Ionicons name="arrow-up-circle" size={14} color="#6EE7B7" />
                <Text style={styles.balanceSubText}>{formatMoney(totalIncome)}</Text>
              </View>
              <View style={styles.balanceSub}>
                <Ionicons name="arrow-down-circle" size={14} color="#FCA5A5" />
                <Text style={styles.balanceSubText}>{formatMoney(totalExpense)}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Quick stats */}
          <View style={styles.statsRow}>
            <Card style={styles.statCard} padding={12}>
              <Ionicons name="trending-up-outline" size={20} color={Colors.income} />
              <Text style={[styles.statVal, { color: Colors.income }]}>{formatMoney(totalIncome)}</Text>
              <Text style={[styles.statLbl, { color: colors.muted }]}>Daromad</Text>
            </Card>
            <Card style={styles.statCard} padding={12}>
              <Ionicons name="trending-down-outline" size={20} color={Colors.expense} />
              <Text style={[styles.statVal, { color: Colors.expense }]}>{formatMoney(totalExpense)}</Text>
              <Text style={[styles.statLbl, { color: colors.muted }]}>Xarajat</Text>
            </Card>
          </View>

          {/* Budgets */}
          {budgets && budgets.length > 0 && (
            <>
              <View style={styles.sectionRow}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Byudjet</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/budgets')}>
                  <Text style={[styles.sectionLink, { color: Colors.primary[600] }]}>Barchasi →</Text>
                </TouchableOpacity>
              </View>
              {budgets.slice(0, 2).map(b => <BudgetBar key={b.id} budget={b} />)}
            </>
          )}

          {/* Transactions */}
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Oxirgi xarajatlar</Text>
            <TouchableOpacity>
              <Text style={[styles.sectionLink, { color: Colors.primary[600] }]}>Barchasi →</Text>
            </TouchableOpacity>
          </View>
          <Card padding={0} style={{ overflow: 'hidden' }}>
            <View style={{ paddingHorizontal: 16 }}>
              {transactions.length > 0
                ? transactions.map(tx => <TransactionItem key={tx.id} transaction={tx} />)
                : <Text style={[styles.empty, { color: colors.muted }]}>Hozircha xarajatlar yo'q</Text>
              }
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { paddingHorizontal: 20, paddingBottom: 28 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  userName: { fontSize: 18, fontWeight: '700', color: '#fff', marginTop: 2 },
  notifBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  balanceCard: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  balanceLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: 2 },
  balanceAmount: { fontSize: 30, fontWeight: '800', color: '#fff', letterSpacing: -1, marginVertical: 6 },
  balanceRow: { flexDirection: 'row', gap: 16 },
  balanceSub: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  balanceSubText: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  body: { padding: 16 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, gap: 4 },
  statVal: { fontSize: 14, fontWeight: '700' },
  statLbl: { fontSize: 11 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700' },
  sectionLink: { fontSize: 12, fontWeight: '600' },
  empty: { paddingVertical: 24, textAlign: 'center', fontSize: 14 },
});
