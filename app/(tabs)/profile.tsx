import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/auth.store';
import { useThemeStore } from '@stores/theme.store';
import { useTheme } from '@hooks/useTheme';
import { useFormat } from '@hooks/useFormat';
import { Colors } from '@constants/colors';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

function MenuItem({ icon, iconBg, label, value, onPress, danger }: MenuItemProps) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.menuRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.menuIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={18} color={danger ? Colors.expense : Colors.primary[600]} />
      </View>
      <Text style={[styles.menuLabel, { color: danger ? Colors.expense : colors.text }]}>{label}</Text>
      {value && <Text style={[styles.menuValue, { color: colors.muted }]}>{value}</Text>}
      <Ionicons name="chevron-forward" size={16} color={colors.muted} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const { theme, setTheme, isDark } = useThemeStore();
  const { colors } = useTheme();

  const handleLogout = () => {
    Alert.alert('Chiqish', 'Rostdan ham chiqmoqchimisiz?', [
      { text: 'Bekor qilish', style: 'cancel' },
      { text: 'Chiqish', style: 'destructive', onPress: logout },
    ]);
  };

  const themeLabel = theme === 'auto' ? 'Avtomatik' : theme === 'dark' ? 'Tungi' : 'Kunduzgi';
  const nextTheme = theme === 'auto' ? 'light' : theme === 'light' ? 'dark' : 'auto';

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : (user?.phone?.slice(-4) ?? 'HI');

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={Colors.gradient} style={[styles.hero, { paddingTop: insets.top + 16 }]}>
          <View style={styles.heroTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="pencil-outline" size={18} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name ?? 'Foydalanuvchi'}</Text>
          <Text style={styles.userPhone}>{user?.phone}</Text>
        </LinearGradient>

        <View style={styles.body}>
          {/* Shaxsiy */}
          <Text style={[styles.secLabel, { color: colors.muted }]}>SHAXSIY MA'LUMOT</Text>
          <View style={[styles.menuCard, { backgroundColor: colors.surface }]}>
            <MenuItem icon="person-outline" iconBg={Colors.primary[50]} label="Ma'lumotlarim" />
            <MenuItem icon="bar-chart-outline" iconBg="#F0FDF4" label="Statistika" />
          </View>

          {/* Ilova */}
          <Text style={[styles.secLabel, { color: colors.muted }]}>ILOVA</Text>
          <View style={[styles.menuCard, { backgroundColor: colors.surface }]}>
            <MenuItem
              icon="moon-outline"
              iconBg="#F8FAFC"
              label="Mavzu"
              value={themeLabel}
              onPress={() => setTheme(nextTheme)}
            />
            <MenuItem icon="language-outline" iconBg="#FFF7ED" label="Til" value="O'zbekcha" />
            <MenuItem icon="notifications-outline" iconBg={Colors.primary[50]} label="Bildirishnomalar" />
            <MenuItem
              icon="logo-telegram"
              iconBg="#F0FDF4"
              label="Telegram ulash"
              value={user?.telegramId ? 'Ulangan ✅' : 'Ulanmagan'}
            />
          </View>

          {/* Boshqa */}
          <Text style={[styles.secLabel, { color: colors.muted }]}>BOSHQA</Text>
          <View style={[styles.menuCard, { backgroundColor: colors.surface }]}>
            <MenuItem icon="shield-outline" iconBg="#EFF6FF" label="Maxfiylik siyosati" />
            <MenuItem icon="help-circle-outline" iconBg="#F0FDF4" label="Yordam" />
            <MenuItem icon="information-circle-outline" iconBg="#FFF7ED" label="Versiya" value="1.0.0" />
          </View>

          {/* Chiqish */}
          <View style={[styles.menuCard, { backgroundColor: colors.surface }]}>
            <MenuItem icon="log-out-outline" iconBg="#FEF2F2" label="Chiqish" onPress={handleLogout} danger />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { paddingHorizontal: 20, paddingBottom: 28 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  avatar: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 24, fontWeight: '800', color: '#fff' },
  editBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  userName: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  userPhone: { fontSize: 14, color: 'rgba(255,255,255,0.65)', marginTop: 4 },
  body: { padding: 16 },
  secLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 8, marginTop: 12 },
  menuCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1 },
  menuIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '500' },
  menuValue: { fontSize: 13, marginRight: 6 },
});
