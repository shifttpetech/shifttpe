import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { BottomSheet } from '@/src/components/BottomSheet';
import { Confetti } from '@/src/components/Confetti';
import { colors, radius, spacing, typography, shadows } from '@/src/theme';
import { MOCK_SHIFTS, getShiftById } from '@/src/data/shifts';
import { PaymentMethod, getPaymentMethodLabel } from '@/src/data/payments';

export default function MarkPaid() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const shift = getShiftById(id) || MOCK_SHIFTS[0];
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');
  const [showConfirmSheet, setShowConfirmSheet] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const successScale = useSharedValue(0);

  const handleConfirm = () => {
    setShowConfirmSheet(false);
    setShowSuccess(true);
    setShowConfetti(true);
    successScale.value = withSpring(1, { damping: 10 });
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    
    // Navigate back after animation
    setTimeout(() => {
      router.replace('/business/(tabs)/dashboard');
    }, 2500);
  };

  const successStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
    opacity: successScale.value,
  }));

  if (showSuccess) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Confetti active={showConfetti} count={80} />
        
        <View style={styles.successContainer}>
          <Animated.View style={[styles.successIcon, successStyle]}>
            <Ionicons name="checkmark-circle" size={80} color={colors.success} />
          </Animated.View>
          
          <Text style={styles.successTitle}>Payment Marked!</Text>
          <Text style={styles.successDesc}>
            Student will be notified about the payment
          </Text>

          <View style={styles.paymentSummary}>
            <Text style={styles.successSummaryLabel}>Amount Paid</Text>
            <Text style={styles.successSummaryValue}>₹{shift.totalEarning}</Text>
            <Text style={styles.summaryMethod}>via {getPaymentMethodLabel(paymentMethod)}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Mark as Paid</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      >
        {/* Shift Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shift</Text>
            <Text style={styles.summaryValue}>{shift.jobTitle}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Student</Text>
            <Text style={styles.summaryValue}>Student Name</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount</Text>
            <Text style={[styles.summaryValue, styles.amountValue]}>₹{shift.totalEarning}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.methodCard}>
          <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>
          
          <Pressable 
            onPress={() => setPaymentMethod('cash')}
            style={[styles.methodOption, paymentMethod === 'cash' && styles.methodOptionActive]}
          >
            <View style={[styles.methodRadio, paymentMethod === 'cash' && styles.methodRadioActive]}>
              {paymentMethod === 'cash' && <View style={styles.methodRadioDot} />}
            </View>
            <View style={styles.methodInfo}>
              <Ionicons name="cash" size={24} color={paymentMethod === 'cash' ? colors.primary : colors.textSecondary} />
              <Text style={[styles.methodName, paymentMethod === 'cash' && styles.methodNameActive]}>Cash</Text>
            </View>
          </Pressable>

          <Pressable 
            onPress={() => setPaymentMethod('upi')}
            style={[styles.methodOption, paymentMethod === 'upi' && styles.methodOptionActive]}
          >
            <View style={[styles.methodRadio, paymentMethod === 'upi' && styles.methodRadioActive]}>
              {paymentMethod === 'upi' && <View style={styles.methodRadioDot} />}
            </View>
            <View style={styles.methodInfo}>
              <Ionicons name="phone-portrait" size={24} color={paymentMethod === 'upi' ? colors.primary : colors.textSecondary} />
              <Text style={[styles.methodName, paymentMethod === 'upi' && styles.methodNameActive]}>UPI</Text>
            </View>
          </Pressable>

          <Pressable 
            onPress={() => setPaymentMethod('bank_transfer')}
            style={[styles.methodOption, paymentMethod === 'bank_transfer' && styles.methodOptionActive]}
          >
            <View style={[styles.methodRadio, paymentMethod === 'bank_transfer' && styles.methodRadioActive]}>
              {paymentMethod === 'bank_transfer' && <View style={styles.methodRadioDot} />}
            </View>
            <View style={styles.methodInfo}>
              <Ionicons name="card" size={24} color={paymentMethod === 'bank_transfer' ? colors.primary : colors.textSecondary} />
              <Text style={[styles.methodName, paymentMethod === 'bank_transfer' && styles.methodNameActive]}>Bank Transfer</Text>
            </View>
          </Pressable>
        </View>

        {/* Notes */}
        <View style={styles.notesCard}>
          <Text style={styles.sectionTitle}>NOTES (OPTIONAL)</Text>
          
          <TextInput
            style={styles.notesInput}
            placeholder="Add any notes about this payment..."
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            maxLength={200}
          />
          
          <Text style={styles.charCount}>{notes.length}/200</Text>
        </View>

        {/* Confirm Button */}
        <View style={styles.submitContainer}>
          <PrimaryButton
            label="Mark as Paid"
            onPress={() => setShowConfirmSheet(true)}
            leftIcon={<Ionicons name="checkmark" size={20} color="#fff" />}
          />
        </View>
      </ScrollView>

      {/* Confirm Bottom Sheet */}
      <BottomSheet visible={showConfirmSheet} onClose={() => setShowConfirmSheet(false)}>
        <View style={styles.sheetContent}>
          <View style={[styles.sheetIcon, { backgroundColor: colors.successSoft }]}>
            <Ionicons name="cash" size={32} color={colors.success} />
          </View>
          <Text style={styles.sheetTitle}>Confirm Payment?</Text>
          
          <View style={styles.confirmSummary}>
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Amount</Text>
              <Text style={styles.confirmValue}>₹{shift.totalEarning}</Text>
            </View>
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Method</Text>
              <Text style={styles.confirmValue}>{getPaymentMethodLabel(paymentMethod)}</Text>
            </View>
          </View>
          
          <Text style={styles.sheetDesc}>
            By confirming, you acknowledge that you have paid ₹{shift.totalEarning} to the student.
          </Text>
          
          <View style={styles.sheetActions}>
            <Pressable onPress={() => setShowConfirmSheet(false)} style={styles.sheetCancelBtn}>
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={handleConfirm} style={styles.sheetConfirmBtn}>
              <Text style={styles.sheetConfirmText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  summaryCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  summaryLabel: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  amountValue: {
    fontSize: 24,
    color: colors.primary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  methodCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.caption,
    fontWeight: typography.weightMedium,
    color: colors.textTertiary,
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
  },
  methodOptionActive: {
    backgroundColor: colors.primaryTint,
  },
  methodRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodRadioActive: {
    borderColor: colors.primary,
  },
  methodRadioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  methodName: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  methodNameActive: {
    color: colors.primary,
    fontWeight: typography.weightMedium,
  },
  notesCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  notesInput: {
    fontSize: typography.body,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  charCount: {
    fontSize: typography.caption,
    color: colors.textTertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  submitContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sheetContent: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  sheetIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  sheetTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  confirmSummary: {
    width: '100%',
    padding: spacing.lg,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  confirmLabel: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  confirmValue: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  sheetDesc: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  sheetCancelBtn: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
  },
  sheetCancelText: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  sheetConfirmBtn: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.success,
    alignItems: 'center',
  },
  sheetConfirmText: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: '#fff',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  successDesc: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  paymentSummary: {
    width: '100%',
    padding: spacing.xl,
    backgroundColor: colors.successSoft,
    borderRadius: radius.xl,
    alignItems: 'center',
  },
  successSummaryLabel: {
    fontSize: typography.bodySm,
    color: colors.success,
  },
  successSummaryValue: {
    fontSize: 36,
    fontWeight: typography.weightMedium,
    color: colors.success,
    marginTop: spacing.xs,
  },
  summaryMethod: {
    fontSize: typography.body,
    color: colors.success,
    marginTop: spacing.xs,
  },
});
