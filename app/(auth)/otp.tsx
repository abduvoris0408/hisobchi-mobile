import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/auth.store';
import { Button } from '@components/ui/Button';
import { Colors } from '@constants/colors';
import Toast from 'react-native-toast-message';

const OTP_LENGTH = 6;

export default function OtpScreen() {
  const insets = useSafeAreaInsets();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const { verifyOtp, sendOtp } = useAuthStore();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleVerify = async () => {
    if (otp.length !== OTP_LENGTH) return;
    setLoading(true);
    try {
      await verifyOtp(phone!, otp);
      router.replace('/(tabs)');
    } catch {
      Toast.show({ type: 'error', text1: 'Kod noto\'g\'ri yoki muddati o\'tgan' });
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    await sendOtp(phone!);
    setTimer(60);
    Toast.show({ type: 'success', text1: 'Kod qayta yuborildi' });
  };

  return (
    <LinearGradient colors={Colors.gradient} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>SMS kod</Text>
            <Text style={styles.sub}>{phone} raqamiga yuborildi</Text>
          </View>

          <View style={styles.card}>
            {/* Hidden input */}
            <TextInput
              ref={inputRef}
              value={otp}
              onChangeText={(v) => { setOtp(v.slice(0, OTP_LENGTH)); }}
              keyboardType="number-pad"
              style={styles.hiddenInput}
              maxLength={OTP_LENGTH}
            />

            {/* OTP boxes */}
            <TouchableOpacity onPress={() => inputRef.current?.focus()} style={styles.otpRow} activeOpacity={1}>
              {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                <View key={i} style={[
                  styles.otpBox,
                  { borderColor: otp.length === i ? Colors.primary[600] : otp[i] ? Colors.primary[400] : '#E2E8F0' }
                ]}>
                  <Text style={styles.otpChar}>{otp[i] ?? ''}</Text>
                </View>
              ))}
            </TouchableOpacity>

            <Button
              title="Tasdiqlash"
              onPress={handleVerify}
              loading={loading}
              disabled={otp.length !== OTP_LENGTH}
              style={{ marginTop: 24 }}
            />

            <TouchableOpacity onPress={handleResend} style={styles.resend} disabled={timer > 0}>
              <Text style={[styles.resendText, { color: timer > 0 ? '#94A3B8' : Colors.primary[600] }]}>
                {timer > 0 ? `Qayta yuborish (${timer}s)` : 'Qayta yuborish'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  back: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -1 },
  sub: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 6 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 8 },
  hiddenInput: { position: 'absolute', opacity: 0, height: 0 },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between' },
  otpBox: { width: 46, height: 56, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  otpChar: { fontSize: 24, fontWeight: '700', color: '#0F172A' },
  resend: { marginTop: 16, alignItems: 'center' },
  resendText: { fontSize: 14, fontWeight: '600' },
});
