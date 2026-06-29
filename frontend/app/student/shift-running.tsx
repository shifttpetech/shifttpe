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
  Easing,
} from 'react-native-reanimated';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { colors, radius, spacing, typography, shadows } from '@/src/theme';
import { MOCK_SHIFTS, getShiftById } from '@/src/data/shifts';

export default function ShiftRunning() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const shift = getShiftById(id) || MOCK_SHIFTS[0];
  const [timer, setTimer] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [checkInTime] = useState(new Date());
  const [canCheckout, setCanCheckout] = useState(false);

  const pulseScale = useSharedValue(1);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    // Timer
    const interval = setInterval(() => {
      setTimer(prev => {
        let { hours, minutes, seconds } = prev;
        seconds++;
        if (seconds >= 60) { seconds = 0; minutes++; }
        if (minutes >= 60) { minutes = 0; hours++; }
        return { hours, minutes, seconds };
      });
    }, 1000);

    // Pulse animation
    pulseScale.value = withRepeat(
      withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Enable checkout after 10 seconds for demo
    const checkoutTimer = setTimeout(() => {
      setCanCheckout(true);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(checkoutTimer);
    };
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const formatTime = (num: number) => num.toString().padStart(2, '0');
  const formatCheckInTime = () => {
    return checkInTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleCheckout = () => {
    router.push({ pathname: '/student/qr-scan', params: { type: 'checkout', shiftId: id } } as any);
  };

  const handleEmergency = () => {
    // In real app, would call emergency contact
  };

  const handleChat = () => {
    router.push('/student/(tabs)/chats');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Shift in Progress</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Timer Section */}
      <LinearGradient
        colors={[colors.primary, '#E62E47', colors.primaryDark]}
        style={styles.timerSection}
      >
        <Animated.View style={[styles.timerCircle, pulseStyle]}>
          <View style={styles.timerInner}>
            <Text style={styles.timerText}>
              {formatTime(timer.hours)}:{formatTime(timer.minutes)}:{formatTime(timer.seconds)}
            </Text>
            <Text style={styles.timerLabel}>Time Elapsed</Text>
          </View>
        </Animated.View>

        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>WORKING</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        {/* Shift Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Image
              source={{ uri: shift.businessLogo }}
              style={styles.businessLogo}
              contentFit="cover"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.businessName}>{shift.businessName}</Text>
              <Text style={styles.jobTitle}>{shift.jobTitle}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="time" size={18} color={colors.success} />
              <Text style={styles.infoLabel}>Check-in</Text>
              <Text style={styles.infoValue}>{formatCheckInTime()}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="hourglass" size={18} color={colors.warning} />
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{shift.duration}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="cash" size={18} color={colors.primary} />
              <Text style={styles.infoLabel}>Earning</Text>
              <Text style={styles.infoValue}>₹{shift.totalEarning}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
          
          <Pressable onPress={handleChat} style={styles.actionRow}>
            <View style={[styles.actionIcon, { backgroundColor: colors.primaryTint }]}>
              <Ionicons name="chatbubble" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Chat with Business</Text>
              <Text style={styles.actionDesc}>Send a message to the manager</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </Pressable>

          <Pressable onPress={handleEmergency} style={styles.actionRow}>
            <View style={[styles.actionIcon, { backgroundColor: colors.dangerSoft }]}>
              <Ionicons name="call" size={20} color={colors.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Emergency Contact</Text>
              <Text style={styles.actionDesc}>Call for urgent assistance</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </Pressable>
        </View>

        {/* Shift Status */}
        <View style={styles.statusCard}>
          <Text style={styles.sectionTitle}>SHIFT STATUS</Text>
          
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: colors.success }]} />
            <View style={styles.timelineLine} />
            <View style={{ flex: 1 }}>
              <Text style={styles.timelineTitle}>Checked In</Text>
              <Text style={styles.timelineTime}>{formatCheckInTime()}</Text>
            </View>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
            <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.timelineTitle}>Working</Text>
              <Text style={styles.timelineTime}>In progress...</Text>
            </View>
            <View style={styles.workingBadge}>
              <Text style={styles.workingText}>ACTIVE</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: colors.border }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.timelineTitle, { color: colors.textTertiary }]}>Check Out</Text>
              <Text style={styles.timelineTime}>Pending</Text>
            </View>
            <Ionicons name="ellipse-outline" size={20} color={colors.textTertiary} />
          </View>
        </View>

        {/* Checkout Info */}
        <View style={styles.checkoutInfo}>
          <Ionicons name="information-circle" size={20} color={colors.accentPurple} />
          <Text style={styles.checkoutInfoText}>
            {canCheckout 
              ? 'Your shift is ending soon. You can now scan the checkout QR code.'
              : 'QR checkout will be enabled when your shift ends. Continue working!'}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomAction, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.bottomRow}>
          <View style={{ flex: 1 }}>
            <PrimaryButton
              label={canCheckout ? "Scan QR to Check Out" : "Checkout (Shift Not Ended)"}
              onPress={handleCheckout}
              disabled={!canCheckout}
              variant="danger"
              leftIcon={<Ionicons name="qr-code" size={20} color="#fff" />}
            />
          </View>
        </View>
        {!canCheckout && (
          <Pressable onPress={() => setCanCheckout(true)} style={styles.demoLink}>
            <Text style={styles.demoLinkText}>Demo: Enable checkout now</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weightMedium,
    color: '#fff',
  },
  timerSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingBottom: spacing.xxl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerInner: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 36,
    fontWeight: typography.weightMedium,
    color: '#fff',
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    fontSize: typography.bodySm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.pill,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  statusText: {
    fontSize: typography.caption,
    fontWeight: typography.weightMedium,
    color: '#fff',
    letterSpacing: 1,
  },
  infoCard: {
    marginHorizontal: spacing.lg,
    marginTop: -24,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    ...shadows.card,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  businessLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
    gap: 4,
  },
  infoLabel: {
    fontSize: typography.caption,
    color: colors.textTertiary,
  },
  infoValue: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  actionsCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.caption,
    fontWeight: typography.weightMedium,
    color: colors.textTertiary,
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  actionDesc: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLine: {
    position: 'absolute',
    left: 5,
    top: 28,
    width: 2,
    height: 30,
    backgroundColor: colors.success,
  },
  timelineTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  timelineTime: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  workingBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: colors.primaryTint,
    borderRadius: radius.pill,
  },
  workingText: {
    fontSize: 10,
    fontWeight: typography.weightMedium,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  checkoutInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.accentPurpleSoft,
    borderRadius: radius.lg,
  },
  checkoutInfoText: {
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
  bottomRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  demoLink: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  demoLinkText: {
    fontSize: typography.caption,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});
