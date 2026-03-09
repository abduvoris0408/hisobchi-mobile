import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/auth.store';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Colors } from '@constants/colors';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('+998');
  const [loading, setLoading] = useState(false);
  const { sendOtp } = useAuthStore();

  const handleSendOtp = async () => {
    if (phone.length < 13) {
      Toast.show({ type: 'error', text1: 'Telefon raqami noto\'g\'ri' });
      return;
    }
    setLoading(true);
    try {
      await sendOtp(phone);
      router.push({ pathname: '/(auth)/otp', params: { phone } });
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Xato', text2: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={Colors.gradient} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 40 }]}>
          {/* Logo */}
          <View style={styles.logoWrap}>
            <View style={styles.logoIcon}>
              <Ionicons name="wallet-outline" size={36} color="#fff" />
            </View>
            <Text style={styles.logoText}>Hisobchi</Text>
            <Text style={styles.logoSub}>Moliyangizni nazorat qiling</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Kirish</Text>
            <Text style={styles.subtitle}>Telefon raqamingizni kiriting</Text>

            <Input
              label="Telefon raqam"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+998 90 123 45 67"
              maxLength={13}
              prefix={<Ionicons name="call-outline" size={18} color={Colors.muted} />}
            />

            <Button title="SMS kod olish" onPress={handleSendOtp} loading={loading} />

            <Text style={styles.note}>
              SMS orqali tasdiqlash kodi yuboriladi
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  logoWrap: { alignItems: 'center', marginBottom: 40 },
  logoIcon: {
    width: 80, height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: { fontSize: 32, fontWeight: '800', color: '#fff', letterSpacing: -1 },
  logoSub: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 8 },
  title: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#94A3B8', marginBottom: 24 },
  note: { textAlign: 'center', fontSize: 12, color: '#94A3B8', marginTop: 16 },
});
