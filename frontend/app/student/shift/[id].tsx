import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat } from 'react-native-reanimated';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Badge } from '@/src/components/Badge';
import { colors, radius, spacing, typography, shadows } from '@/src/theme';
import { MOCK_SHIFTS, getShiftById } from '@/src/data/shifts';

export default function ShiftDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const shift = getShiftById(id) || MOCK_SHIFTS[0];
  const [shiftStatus, setShiftStatus] = useState(shift.status);
  const [timer, setTimer] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (shiftStatus === 'in_progress') {
      pulseScale.value = withRepeat(withTiming(1.1, { duration: 1000 }), -1, true);
      
      const interval = setInterval(() => {
        setTimer(prev => {
          let { hours, minutes, seconds } = prev;
          seconds++;
          if (seconds >= 60) { seconds = 0; minutes++; }
          if (minutes >= 60) { minutes = 0; hours++; }
          return { hours, minutes, seconds };
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [shiftStatus]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  const handleCheckIn = () => {
    router.push({ pathname: '/student/qr-scan', params: { type: 'checkin', shiftId: id } } as any);
  };

  const handleCheckOut = () => {
    router.push({ pathname: '/student/qr-scan', params: { type: 'checkout', shiftId: id } } as any);
  };

  const simulateCheckIn = () => {
    setShiftStatus('in_progress');
  };

  const simulateCheckOut = () => {
    router.push('/student/shift-complete' as any);
  };

  const getStatusBadge = () => {
    switch (shiftStatus) {
      case 'upcoming': return { label: 'Upcoming', variant: 'warning' as const };
      case 'checked_in': return { label: 'Checked In', variant: 'success' as const };
      case 'in_progress': return { label: 'In Progress', variant: 'primary' as const };
      case 'completed': return { label: 'Completed', variant: 'success' as const };
      case 'cancelled': return { label: 'Cancelled', variant: 'danger' as const };
      default: return { label: 'Upcoming', variant: 'neutral' as const };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Shift Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Business Card */}
        <View style={styles.businessCard}>
          <Image source={{ uri: shift.businessLogo }} style={styles.businessLogo} />
          <View style={{ flex: 1 }}>
            <Text style={styles.businessName}>{shift.businessName}</Text>
            <Text style={styles.jobTitle}>{shift.jobTitle}</Text>
          </View>
          <Badge label={statusBadge.label} variant={statusBadge.variant} />
        </View>

        {/* Timer Card (for in-progress shifts) */}
        {shiftStatus === 'in_progress' && (
          <View style={styles.timerCard}>
            <LinearGradient
              colors={[colors.primary, '#E62E47']}
              style={styles.timerGradient}
            >
              <Text style={styles.timerLabel}>Shift In Progress</Text>
              <View style={styles.timerRow}>
                <Animated.View style={[styles.timerPulse, pulseStyle]}>
                  <View style={styles.timerDot} />
                </Animated.View>
                <Text style={styles.timerText}>
                  {formatTime(timer.hours)}:{formatTime(timer.minutes)}:{formatTime(timer.seconds)}
                </Text>
              </View>
              <Text style={styles.timerSub}>Time elapsed</Text>
            </LinearGradient>
          </View>
        )}

        {/* Shift Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Shift Information</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{shift.date}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Timing</Text>
              <Text style={styles.infoValue}>{shift.startTime} - {shift.endTime}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="hourglass-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{shift.duration}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="cash-outline" size={20} color={colors.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Earnings</Text>
              <Text style={[styles.infoValue, { color: colors.success }]}>
                ₹{shift.totalEarning}
              </Text>
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Location</Text>
          
          <View style={styles.locationRow}>
            <View style={styles.locationIcon}>
              <Ionicons name="location" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.locationName}>{shift.location}</Text>
              <Text style={styles.locationAddress}>{shift.address}</Text>
            </View>
            <Pressable style={styles.directionsBtn}>
              <Ionicons name="navigate" size={18} color="#fff" />
            </Pressable>
          </View>

          {/* Map Preview Placeholder */}
          <View style={styles.mapPreview}>
            <Ionicons name="map" size={40} color={colors.textTertiary} />
            <Text style={styles.mapText}>Tap to open in Maps</Text>
          </View>
        </View>

        {/* Completed Shift Rating */}
        {shiftStatus === 'completed' && shift.rating && (
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Rating Received</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= shift.rating! ? 'star' : 'star-outline'}
                  size={28}
                  color="#FACC15"
                />
              ))}
            </View>
            {shift.review && (
              <Text style={styles.reviewText}>"{shift.review}"</Text>
            )}
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Ionicons name="information-circle" size={20} color={colors.accentPurple} />
          <Text style={styles.instructionsText}>
            {shiftStatus === 'upcoming'
              ? 'Scan the QR code at the venue to check in when you arrive.'
              : shiftStatus === 'in_progress'
              ? 'Scan the QR code to check out when your shift ends.'
              : 'Your shift has been completed. Payment will be processed within 24 hours.'}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomAction, { paddingBottom: insets.bottom + spacing.md }]}>
        {shiftStatus === 'upcoming' && (
          <View style={styles.actionRow}>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                label="Scan QR to Check In"
                onPress={handleCheckIn}
                leftIcon={<Ionicons name="qr-code" size={20} color="#fff" />}
              />
            </View>
            <Pressable onPress={simulateCheckIn} style={styles.demoBtn}>
              <Ionicons name="play" size={20} color={colors.success} />
            </Pressable>
          </View>
        )}
        {shiftStatus === 'in_progress' && (
          <View style={styles.actionRow}>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                label="Scan QR to Check Out"
                onPress={handleCheckOut}
                variant="danger"
                leftIcon={<Ionicons name="qr-code" size={20} color="#fff" />}
              />
            </View>
            <Pressable onPress={simulateCheckOut} style={styles.demoBtn}>
              <Ionicons name="play" size={20} color={colors.success} />
            </Pressable>
          </View>
        )}
        {shiftStatus === 'completed' && (
          <PrimaryButton
            label="View Earnings"
            onPress={() => router.push('/student/wallet' as any)}
            leftIcon={<Ionicons name="wallet" size={20} color="#fff" />}
          />
        )}
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
  businessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  businessLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  businessName: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  jobTitle: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  timerCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.card,
  },
  timerGradient: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: typography.bodySm,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: spacing.sm,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  timerPulse: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  timerText: {
    fontSize: 48,
    fontWeight: typography.weightMedium,
    color: '#fff',
    fontVariant: ['tabular-nums'],
  },
  timerSub: {
    fontSize: typography.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  infoCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.bodySm,
    fontWeight: typography.weightMedium,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationName: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  locationAddress: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  directionsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPreview: {
    height: 120,
    marginTop: spacing.md,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  mapText: {
    fontSize: typography.caption,
    color: colors.textTertiary,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  reviewText: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  instructionsCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.accentPurpleSoft,
    borderRadius: radius.lg,
  },
  instructionsText: {
    flex: 1,
    fontSize: typography.bodySm,
    color: colors.accentPurple,
    lineHeight: 20,
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
    alignItems: 'center',
    gap: spacing.sm,
  },
  demoBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.success,
  },
});
