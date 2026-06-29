import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat,
  withTiming,
  withSpring,
  Easing,
  FadeIn,
  SlideInUp,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { BottomSheet } from '@/src/components/BottomSheet';
import { Confetti } from '@/src/components/Confetti';
import { colors, radius, spacing, typography, shadows } from '@/src/theme';
import { MOCK_SHIFTS, getShiftById } from '@/src/data/shifts';
import { getPaymentByShiftId, PaymentMethod, getPaymentMethodLabel } from '@/src/data/payments';

type PaymentState = 'pending' | 'confirmed' | 'received' | 'completed';

export default function PaymentStatus() {
  const { id, status: initialStatus } = useLocalSearchParams<{ id: string; status?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const shift = getShiftById(id) || MOCK_SHIFTS[0];
  const payment = getPaymentByShiftId(id);
  
  const [paymentState, setPaymentState] = useState<PaymentState>(
    (initialStatus as PaymentState) || 'pending'
  );
  const [showConfirmSheet, setShowConfirmSheet] = useState(false);
  const [showReportSheet, setShowReportSheet] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');

  const pulseScale = useSharedValue(1);
  const successScale = useSharedValue(0);

  useEffect(() => {
    if (paymentState === 'pending') {
      pulseScale.value = withRepeat(
        withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      
      // Simulate business confirmation after 5 seconds
      const timer = setTimeout(() => {
        setPaymentState('confirmed');
        setPaymentMethod('upi');
        try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [paymentState]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: 2 - pulseScale.value,
  }));

  const handleConfirmReceived = () => {
    setShowConfirmSheet(false);
    setPaymentState('completed');
    setShowConfetti(true);
    successScale.value = withSpring(1, { damping: 10 });
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    
    // Navigate to rating after animation
    setTimeout(() => {
      router.push({ pathname: '/student/rate-shift', params: { id } } as any);
    }, 2500);
  };

  const handleReportIssue = () => {
    setShowReportSheet(false);
    // In real app, would submit report
  };

  const renderPendingState = () => (
    <View style={styles.stateContainer}>
      <View style={styles.iconContainer}>
        <Animated.View style={[styles.pulseRing, pulseStyle]} />
        <View style={[styles.iconCircle, { backgroundColor: colors.warningSoft }]}>
          <Ionicons name="hourglass" size={48} color={colors.warning} />
        </View>
      </View>
      
      <Text style={styles.stateTitle}>Payment Pending</Text>
      <Text style={styles.stateDesc}>
        Waiting for business to confirm payment
      </Text>

      <View style={styles.amountCard}>
        <Text style={styles.amountLabel}>Amount</Text>
        <Text style={styles.amountValue}>₹{shift.totalEarning}</Text>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={20} color={colors.accentPurple} />
        <Text style={styles.infoText}>
          The business will mark the payment once they've paid you. You'll receive a notification.
        </Text>
      </View>

      <Pressable onPress={() => setPaymentState('confirmed')} style={styles.demoLink}>
        <Text style={styles.demoLinkText}>Demo: Simulate business confirmation</Text>
      </Pressable>
    </View>
  );

  const renderConfirmedState = () => (
    <Animated.View entering={FadeIn} style={styles.stateContainer}>
      <View style={styles.iconContainer}>
        <View style={[styles.iconCircle, { backgroundColor: colors.successSoft }]}>
          <Ionicons name="checkmark-circle" size={48} color={colors.success} />
        </View>
      </View>
      
      <Text style={styles.stateTitle}>Payment Confirmed!</Text>
      <Text style={styles.stateDesc}>
        Business has marked the payment as complete
      </Text>

      <View style={styles.paymentCard}>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Amount</Text>
          <Text style={styles.paymentValue}>₹{shift.totalEarning}</Text>
        </View>
        <View style={styles.paymentDivider} />
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Payment Method</Text>
          <View style={styles.methodBadge}>
            <Ionicons 
              name={paymentMethod === 'cash' ? 'cash' : paymentMethod === 'upi' ? 'phone-portrait' : 'card'} 
              size={16} 
              color={colors.primary} 
            />
            <Text style={styles.methodText}>{getPaymentMethodLabel(paymentMethod)}</Text>
          </View>
        </View>
        <View style={styles.paymentDivider} />
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Business</Text>
          <Text style={styles.paymentValue}>{shift.businessName}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <PrimaryButton
          label="Confirm Received"
          onPress={() => setShowConfirmSheet(true)}
          leftIcon={<Ionicons name="checkmark" size={20} color="#fff" />}
        />
        <Pressable onPress={() => setShowReportSheet(true)} style={styles.reportBtn}>
          <Ionicons name="flag" size={18} color={colors.danger} />
          <Text style={styles.reportText}>Report Issue</Text>
        </Pressable>
      </View>
    </Animated.View>
  );

  const renderCompletedState = () => (
    <Animated.View entering={SlideInUp} style={styles.stateContainer}>
      <Confetti active={showConfetti} count={80} />
      
      <View style={styles.iconContainer}>
        <View style={[styles.iconCircle, { backgroundColor: colors.successSoft }]}>
          <Ionicons name="checkmark-done-circle" size={48} color={colors.success} />
        </View>
      </View>
      
      <Text style={styles.stateTitle}>Payment Completed!</Text>
      <Text style={styles.stateDesc}>
        Thank you for confirming. Your shift is complete!
      </Text>

      <View style={styles.successCard}>
        <View style={styles.successRow}>
          <Ionicons name="cash" size={24} color={colors.success} />
          <View>
            <Text style={styles.successLabel}>Earned</Text>
            <Text style={styles.successValue}>₹{shift.totalEarning}</Text>
          </View>
        </View>
      </View>

      <PrimaryButton
        label="Rate This Shift"
        onPress={() => router.push({ pathname: '/student/rate-shift', params: { id } } as any)}
        leftIcon={<Ionicons name="star" size={20} color="#fff" />}
      />
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Payment Status</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Shift Info */}
      <View style={styles.shiftInfo}>
        <Image
          source={{ uri: shift.businessLogo }}
          style={styles.businessLogo}
          contentFit="cover"
        />
        <View>
          <Text style={styles.businessName}>{shift.businessName}</Text>
          <Text style={styles.shiftDate}>{shift.date} · {shift.duration}</Text>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {paymentState === 'pending' && renderPendingState()}
        {paymentState === 'confirmed' && renderConfirmedState()}
        {paymentState === 'completed' && renderCompletedState()}
      </ScrollView>

      {/* Confirm Bottom Sheet */}
      <BottomSheet visible={showConfirmSheet} onClose={() => setShowConfirmSheet(false)}>
        <View style={styles.sheetContent}>
          <View style={[styles.sheetIcon, { backgroundColor: colors.successSoft }]}>
            <Ionicons name="checkmark-circle" size={32} color={colors.success} />
          </View>
          <Text style={styles.sheetTitle}>Confirm Payment Received?</Text>
          <Text style={styles.sheetDesc}>
            By confirming, you acknowledge that you have received ₹{shift.totalEarning} from {shift.businessName}.
          </Text>
          <View style={styles.sheetActions}>
            <Pressable onPress={() => setShowConfirmSheet(false)} style={styles.sheetCancelBtn}>
              <Text style={styles.sheetCancelText}>Not Yet</Text>
            </Pressable>
            <Pressable onPress={handleConfirmReceived} style={styles.sheetConfirmBtn}>
              <Text style={styles.sheetConfirmText}>Yes, Received</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheet>

      {/* Report Bottom Sheet */}
      <BottomSheet visible={showReportSheet} onClose={() => setShowReportSheet(false)}>
        <View style={styles.sheetContent}>
          <View style={[styles.sheetIcon, { backgroundColor: colors.dangerSoft }]}>
            <Ionicons name="flag" size={32} color={colors.danger} />
          </View>
          <Text style={styles.sheetTitle}>Report Payment Issue</Text>
          <Text style={styles.sheetDesc}>
            If you haven't received the payment or there's an issue, please report it. Our team will investigate.
          </Text>
          
          <View style={styles.reportOptions}>
            <Pressable style={styles.reportOption}>
              <Ionicons name="close-circle" size={20} color={colors.danger} />
              <Text style={styles.reportOptionText}>Payment not received</Text>
            </Pressable>
            <Pressable style={styles.reportOption}>
              <Ionicons name="cash" size={20} color={colors.warning} />
              <Text style={styles.reportOptionText}>Wrong amount</Text>
            </Pressable>
            <Pressable style={styles.reportOption}>
              <Ionicons name="help-circle" size={20} color={colors.textSecondary} />
              <Text style={styles.reportOptionText}>Other issue</Text>
            </Pressable>
          </View>

          <PrimaryButton
            label="Submit Report"
            onPress={handleReportIssue}
            variant="danger"
          />
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
  shiftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  businessLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  businessName: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  shiftDate: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  stateContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    marginVertical: spacing.xl,
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.warning,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateTitle: {
    fontSize: 24,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  stateDesc: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  amountCard: {
    width: '100%',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  amountLabel: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
  },
  amountValue: {
    fontSize: 48,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    width: '100%',
    padding: spacing.md,
    backgroundColor: colors.accentPurpleSoft,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
  },
  infoText: {
    flex: 1,
    fontSize: typography.bodySm,
    color: colors.accentPurple,
    lineHeight: 20,
  },
  demoLink: {
    padding: spacing.md,
  },
  demoLinkText: {
    fontSize: typography.caption,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  paymentCard: {
    width: '100%',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  paymentLabel: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  paymentValue: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  paymentDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  methodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: colors.primaryTint,
    borderRadius: radius.pill,
  },
  methodText: {
    fontSize: typography.bodySm,
    fontWeight: typography.weightMedium,
    color: colors.primary,
  },
  actionButtons: {
    width: '100%',
    gap: spacing.md,
  },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  reportText: {
    fontSize: typography.body,
    color: colors.danger,
    fontWeight: typography.weightMedium,
  },
  successCard: {
    width: '100%',
    padding: spacing.xl,
    backgroundColor: colors.successSoft,
    borderRadius: radius.xl,
    marginBottom: spacing.xl,
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  successLabel: {
    fontSize: typography.bodySm,
    color: colors.success,
  },
  successValue: {
    fontSize: 32,
    fontWeight: typography.weightMedium,
    color: colors.success,
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
    marginBottom: spacing.sm,
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
  reportOptions: {
    width: '100%',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  reportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
  },
  reportOptionText: {
    fontSize: typography.body,
    color: colors.textPrimary,
  },
});
