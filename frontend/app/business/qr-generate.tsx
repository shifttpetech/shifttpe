import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { QRCode } from '@/src/components/QRCode';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { colors, radius, spacing, typography, shadows } from '@/src/theme';
import { generateCheckInQR, generateCheckOutQR } from '@/src/data/shifts';

export default function QRGenerate() {
  const { type, shiftId, studentName } = useLocalSearchParams<{
    type: 'checkin' | 'checkout';
    shiftId: string;
    studentName?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [qrValue, setQrValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const pulseScale = useSharedValue(1);

  const isCheckIn = type === 'checkin';

  useEffect(() => {
    // Generate QR code
    const qr = isCheckIn
      ? generateCheckInQR(shiftId || 'shift_1')
      : generateCheckOutQR(shiftId || 'shift_1');
    setQrValue(qr);

    // Pulse animation
    pulseScale.value = withRepeat(
      withTiming(1.05, { duration: 1500 }),
      -1,
      true
    );

    // Countdown timer
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Regenerate QR when expired
          const newQr = isCheckIn
            ? generateCheckInQR(shiftId || 'shift_1')
            : generateCheckOutQR(shiftId || 'shift_1');
          setQrValue(newQr);
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCheckIn, shiftId]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Shifttpe ${isCheckIn ? 'Check-In' : 'Check-Out'} QR Code\nCode: ${qrValue}\nValid for: ${formatTime(timeLeft)}`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const handleRefresh = () => {
    const newQr = isCheckIn
      ? generateCheckInQR(shiftId || 'shift_1')
      : generateCheckOutQR(shiftId || 'shift_1');
    setQrValue(newQr);
    setTimeLeft(300);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {isCheckIn ? 'Check-In QR' : 'Check-Out QR'}
        </Text>
        <Pressable onPress={handleShare} style={styles.shareBtn}>
          <Ionicons name="share-outline" size={22} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name={isCheckIn ? 'log-in' : 'log-out'}
              size={24}
              color={isCheckIn ? colors.success : colors.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>
              {isCheckIn ? 'Worker Check-In' : 'Worker Check-Out'}
            </Text>
            <Text style={styles.infoSubtitle}>
              {studentName
                ? `Show this QR to ${studentName}`
                : 'Show this QR to the worker'}
            </Text>
          </View>
        </View>

        {/* QR Code Card */}
        <Animated.View style={[styles.qrCard, pulseStyle]}>
          <LinearGradient
            colors={['#fff', '#f8f9fa']}
            style={styles.qrGradient}
          >
            <QRCode
              value={qrValue}
              size={220}
              color={colors.textPrimary}
              backgroundColor="#fff"
              logo={
                <View style={styles.qrLogo}>
                  <Text style={styles.qrLogoText}>S</Text>
                </View>
              }
            />

            {/* Timer */}
            <View style={styles.timerContainer}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.timerText}>
                Expires in {formatTime(timeLeft)}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              Show this QR code to the worker
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              Worker scans using Shifttpe app
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              {isCheckIn
                ? 'Shift starts automatically'
                : 'Shift ends & payment is processed'}
            </Text>
          </View>
        </View>

        {/* Refresh Button */}
        <Pressable onPress={handleRefresh} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={18} color={colors.primary} />
          <Text style={styles.refreshText}>Generate New QR</Text>
        </Pressable>
      </View>

      {/* Bottom Action */}
      <View style={[styles.bottomAction, { paddingBottom: insets.bottom + spacing.md }]}>
        <PrimaryButton
          label="Done"
          onPress={() => router.back()}
        />
      </View>
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
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.xl,
    marginBottom: spacing.xl,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  infoSubtitle: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  qrCard: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
    ...shadows.card,
  },
  qrGradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  qrLogo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrLogoText: {
    fontSize: 24,
    fontWeight: typography.weightMedium,
    color: '#fff',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.pill,
  },
  timerText: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    fontWeight: typography.weightMedium,
  },
  instructions: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionNumberText: {
    fontSize: typography.bodySm,
    fontWeight: typography.weightMedium,
    color: colors.primary,
  },
  instructionText: {
    flex: 1,
    fontSize: typography.bodySm,
    color: colors.textSecondary,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    padding: spacing.md,
  },
  refreshText: {
    fontSize: typography.bodySm,
    color: colors.primary,
    fontWeight: typography.weightMedium,
  },
  bottomAction: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
