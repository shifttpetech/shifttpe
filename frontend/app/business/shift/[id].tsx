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
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { BottomSheet } from '@/src/components/BottomSheet';
import { QRCode } from '@/src/components/QRCode';
import { colors, radius, spacing, typography, shadows } from '@/src/theme';
import { MOCK_SHIFTS, getShiftById } from '@/src/data/shifts';
import { getAttendanceByShiftId } from '@/src/data/attendance';
import { generateQRCode } from '@/src/data/attendance';

export default function BusinessShiftDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const shift = getShiftById(id) || MOCK_SHIFTS[0];
  const attendance = getAttendanceByShiftId(id);
  
  const [showQRSheet, setShowQRSheet] = useState(false);
  const [qrType, setQRType] = useState<'checkin' | 'checkout'>('checkin');
  const [qrValue, setQRValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [timer, setTimer] = useState(0);

  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const handleGenerateQR = (type: 'checkin' | 'checkout') => {
    setQRType(type);
    setQRValue(generateQRCode(type, id));
    setTimeLeft(300);
    setShowQRSheet(true);
    
    // Start countdown
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChat = () => {
    router.push('/business/(tabs)/chats');
  };

  const handleNavigate = () => {
    // In real app, would open maps
  };

  const handleMarkPaid = () => {
    router.push({ pathname: '/business/mark-paid', params: { id } } as any);
  };

  const isShiftCompleted = shift.status === 'completed';
  const isShiftInProgress = shift.status === 'in_progress';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Shift Details</Text>
        <Pressable style={styles.moreBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      >
        {/* Student Card */}
        <View style={styles.studentCard}>
          <View style={styles.studentAvatar}>
            <Ionicons name="person" size={32} color={colors.primary} />
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>Student Name</Text>
            <Text style={styles.studentMeta}>4.8 ⭐ · 12 shifts</Text>
          </View>
          <View style={styles.studentActions}>
            <Pressable onPress={handleChat} style={styles.actionIconBtn}>
              <Ionicons name="chatbubble" size={20} color={colors.primary} />
            </Pressable>
            <Pressable onPress={handleNavigate} style={styles.actionIconBtn}>
              <Ionicons name="navigate" size={20} color={colors.accentPurple} />
            </Pressable>
          </View>
        </View>

        {/* Shift Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>SHIFT DETAILS</Text>
          
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: colors.primaryTint }]}>
              <Ionicons name="briefcase" size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Job Title</Text>
              <Text style={styles.infoValue}>{shift.jobTitle}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: colors.accentPurpleSoft }]}>
              <Ionicons name="time" size={20} color={colors.accentPurple} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>{shift.startTime} - {shift.endTime}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: colors.successSoft }]}>
              <Ionicons name="cash" size={20} color={colors.success} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Salary</Text>
              <Text style={styles.infoValue}>₹{shift.totalEarning}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: colors.warningSoft }]}>
              <Ionicons name="hourglass" size={20} color={colors.warning} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{shift.duration}</Text>
            </View>
          </View>
        </View>

        {/* Attendance Status */}
        <View style={styles.attendanceCard}>
          <Text style={styles.sectionTitle}>ATTENDANCE</Text>
          
          <View style={styles.attendanceRow}>
            <View style={[styles.attendanceDot, { backgroundColor: attendance?.locationVerified ? colors.success : colors.border }]} />
            <View style={styles.attendanceContent}>
              <Text style={styles.attendanceTitle}>Location Verified</Text>
              <Text style={styles.attendanceDesc}>
                {attendance?.locationVerified ? 'Student reached workplace' : 'Waiting for student to arrive'}
              </Text>
            </View>
            {attendance?.locationVerified && (
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            )}
          </View>

          <View style={styles.attendanceRow}>
            <View style={[styles.attendanceDot, { backgroundColor: attendance?.checkInTime ? colors.success : colors.border }]} />
            <View style={styles.attendanceContent}>
              <Text style={styles.attendanceTitle}>Check In</Text>
              <Text style={styles.attendanceDesc}>
                {attendance?.checkInTime ? `Checked in at ${new Date(attendance.checkInTime).toLocaleTimeString()}` : 'Not checked in yet'}
              </Text>
            </View>
            {attendance?.checkInTime && (
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            )}
          </View>

          <View style={styles.attendanceRow}>
            <View style={[styles.attendanceDot, { backgroundColor: attendance?.checkOutTime ? colors.success : colors.border }]} />
            <View style={styles.attendanceContent}>
              <Text style={styles.attendanceTitle}>Check Out</Text>
              <Text style={styles.attendanceDesc}>
                {attendance?.checkOutTime ? `Checked out at ${new Date(attendance.checkOutTime).toLocaleTimeString()}` : 'Not checked out yet'}
              </Text>
            </View>
            {attendance?.checkOutTime && (
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            )}
          </View>
        </View>

        {/* Payment Status */}
        {isShiftCompleted && (
          <View style={styles.paymentCard}>
            <Text style={styles.sectionTitle}>PAYMENT</Text>
            
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Amount</Text>
              <Text style={styles.paymentValue}>₹{shift.totalEarning}</Text>
            </View>
            
            <View style={styles.paymentStatus}>
              <Ionicons name="hourglass" size={20} color={colors.warning} />
              <Text style={styles.paymentStatusText}>Pending Payment</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomAction, { paddingBottom: insets.bottom + spacing.md }]}>
        {isShiftInProgress && (
          <View style={styles.actionRow}>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                label="Generate Check-In QR"
                onPress={() => handleGenerateQR('checkin')}
                leftIcon={<Ionicons name="qr-code" size={20} color="#fff" />}
              />
            </View>
            <Pressable onPress={() => handleGenerateQR('checkout')} style={styles.qrBtn}>
              <Ionicons name="qr-code" size={24} color={colors.primary} />
            </Pressable>
          </View>
        )}
        
        {isShiftCompleted && (
          <PrimaryButton
            label="Mark as Paid"
            onPress={handleMarkPaid}
            variant="success"
            leftIcon={<Ionicons name="cash" size={20} color="#fff" />}
          />
        )}
      </View>

      {/* QR Bottom Sheet */}
      <BottomSheet visible={showQRSheet} onClose={() => setShowQRSheet(false)}>
        <View style={styles.qrSheetContent}>
          <Text style={styles.qrSheetTitle}>
            {qrType === 'checkin' ? 'Check-In QR Code' : 'Check-Out QR Code'}
          </Text>
          
          <Animated.View style={[styles.qrContainer, pulseStyle]}>
            <QRCode value={qrValue} size={200} />
          </Animated.View>
          
          <View style={styles.timerRow}>
            <Ionicons name="time" size={20} color={colors.primary} />
            <Text style={styles.timerText}>Expires in {formatTime(timeLeft)}</Text>
          </View>
          
          <Text style={styles.qrInstructions}>
            Show this QR code to the student to {qrType === 'checkin' ? 'check in' : 'check out'}
          </Text>
          
          <View style={styles.qrActions}>
            <Pressable onPress={() => handleGenerateQR(qrType)} style={styles.refreshBtn}>
              <Ionicons name="refresh" size={20} color={colors.primary} />
              <Text style={styles.refreshText}>Refresh QR</Text>
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
  moreBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  studentAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  studentMeta: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  studentActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.caption,
    color: colors.textTertiary,
  },
  infoValue: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
    marginTop: 2,
  },
  attendanceCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  attendanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  attendanceDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  attendanceContent: {
    flex: 1,
  },
  attendanceTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  attendanceDesc: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  paymentCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.successSoft,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.success,
    marginBottom: spacing.md,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  paymentLabel: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  paymentValue: {
    fontSize: 24,
    fontWeight: typography.weightMedium,
    color: colors.success,
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: radius.lg,
  },
  paymentStatusText: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.warning,
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  qrBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  qrSheetContent: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  qrSheetTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  qrContainer: {
    marginBottom: spacing.lg,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  timerText: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.primary,
  },
  qrInstructions: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  qrActions: {
    width: '100%',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.primaryTint,
    borderRadius: radius.lg,
  },
  refreshText: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.primary,
  },
});
