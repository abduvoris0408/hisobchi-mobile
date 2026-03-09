import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { analyticsService } from '@services/analytics.service';
import { useTheme } from '@hooks/useTheme';
import { useFormat } from '@hooks/useFormat';
import { Card } from '@components/ui/Card';
import { Colors } from '@constants/colors';

const { width } = Dimensions.get('window');
const MONTHS = ['Yan','Feb','Mar','Apr','May','Iyn','Iyl','Avg','Sen','Okt','Noy','Dek'];

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { formatMoney } = useFormat();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year] = useState(now.getFullYear());

  const { data: summary } = useQuery({
    queryKey: ['analytics-summary', month, year],
    queryFn: () => analyticsService.getSummary(month, year),
  });

  const { data: byCategory } = useQuery({
    queryKey: ['analytics-by-category', month, year],
    queryFn: () => analyticsService.getByCategory(month, year),
  });

  const { data: daily } = useQuery({
    queryKey: ['analytics-daily', month, year],
    queryFn: () => analyticsService.getDaily(month, year),
  });

  const cats = byCategory ?? [];
  const maxAmount = cats.length > 0 ? Math.max(...cats.map((c: any) => c.total)) : 1;

  const CHART_COLORS = [Colors.primary[600], Colors.income, Colors.expense, Colors.warning, '#8B5CF6', '#EC4899'];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={Colors.gradient} style={[styles.hero, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.heroTitle}>Tahlil</Text>
          <Text style={styles.heroSub}>{MONTHS[month - 1]} {year}</Text>

          {/* Month picker */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            {MONTHS.map((m, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setMonth(i + 1)}
                style={[styles.monthBtn, month === i + 1 && styles.monthBtnActive]}
              >
                <Text style={[styles.monthText, month === i + 1 && styles.monthTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Summary chips */}
          <View style={styles.chips}>
            <View style={styles.chip}>
              <Ionicons name="arrow-down-circle" size={16} color="#FCA5A5" />
              <Text style={styles.chipLbl}>Xarajat</Text>
              <Text style={[styles.chipVal, { color: '#FCA5A5' }]}>{formatMoney(summary?.totalExpense ?? 0)}</Text>
            </View>
            <View style={styles.chipDivider} />
            <View style={styles.chip}>
              <Ionicons name="arrow-up-circle" size={16} color="#6EE7B7" />
              <Text style={styles.chipLbl}>Daromad</Text>
              <Text style={[styles.chipVal, { color: '#6EE7B7' }]}>{formatMoney(summary?.totalIncome ?? 0)}</Text>
            </View>
            <View style={styles.chipDivider} />
            <View style={styles.chip}>
              <Ionicons name="wallet-outline" size={16} color="#fff" />
              <Text style={styles.chipLbl}>Balans</Text>
              <Text style={styles.chipVal}>{formatMoney(summary?.balance ?? 0)}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* By Category */}
          {cats.length > 0 && (
            <Card style={{ marginBottom: 16 }}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Kategoriya bo'yicha</Text>
              {cats.slice(0, 6).map((cat: any, i: number) => (
                <View key={cat.categoryId ?? i} style={styles.catRow}>
                  <View style={[styles.catDot, { backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }]} />
                  <Text style={[styles.catName, { color: colors.text }]} numberOfLines={1}>
                    {cat.category?.name ?? 'Boshqa'}
                  </Text>
                  <View style={styles.catBarWrap}>
                    <View style={[
                      styles.catBar,
                      { width: `${Math.round((cat.total / maxAmount) * 100)}%` as any,
                        backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }
                    ]} />
                  </View>
                  <Text style={[styles.catAmt, { color: colors.muted }]}>{formatMoney(cat.total)}</Text>
                </View>
              ))}
            </Card>
          )}

          {/* Daily bars */}
          {daily && daily.length > 0 && (
            <Card>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Kunlik xarajat</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.barsWrap}>
                  {daily.slice(-14).map((d: any, i: number) => {
                    const maxD = Math.max(...daily.slice(-14).map((x: any) => x.expense));
                    const h = maxD > 0 ? Math.max((d.expense / maxD) * 80, 4) : 4;
                    return (
                      <View key={i} style={styles.barCol}>
                        <View style={[styles.barFill, { height: h, backgroundColor: Colors.primary[600] }]} />
                        <Text style={[styles.barLbl, { color: colors.muted }]}>
                          {new Date(d.date).getDate()}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { paddingHorizontal: 20, paddingBottom: 24 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2, marginBottom: 16 },
  monthBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, marginRight: 8, backgroundColor: 'rgba(255,255,255,0.1)' },
  monthBtnActive: { backgroundColor: 'rgba(255,255,255,0.3)' },
  monthText: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  monthTextActive: { color: '#fff', fontWeight: '700' },
  chips: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  chip: { flex: 1, alignItems: 'center', gap: 4 },
  chipDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  chipLbl: { fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5 },
  chipVal: { fontSize: 13, fontWeight: '700', color: '#fff' },
  body: { padding: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 16 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  catDot: { width: 8, height: 8, borderRadius: 2, flexShrink: 0 },
  catName: { fontSize: 12, width: 80, flexShrink: 0 },
  catBarWrap: { flex: 1, height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  catBar: { height: '100%', borderRadius: 3 },
  catAmt: { fontSize: 11, width: 70, textAlign: 'right', flexShrink: 0 },
  barsWrap: { flexDirection: 'row', alignItems: 'flex-end', height: 100, gap: 8, paddingTop: 16 },
  barCol: { alignItems: 'center', gap: 6, width: 28 },
  barFill: { width: 20, borderRadius: 4, minHeight: 4 },
  barLbl: { fontSize: 10 },
});
