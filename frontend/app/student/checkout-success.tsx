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
  withDelay,
  withSequence,
  FadeIn,
  SlideInUp,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Confetti } from '@/src/components/Confetti';
import { colors, radius, spacing, typography, shadows } from '@/src/theme';
import { MOCK_SHIFTS, getShiftById } from '@/src/data/shifts';
import { generateTimeline, getTimelineByShiftId, TimelineItem } from '@/src/data/timeline';

export default function CheckoutSuccess() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const shift = getShiftById(id) || MOCK_SHIFTS[0];
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeline, setTimeline] = useState(getTimelineByShiftId(id) || generateTimeline(id, 'checked_out'));

  const successScale = useSharedValue(0);
  const timelineOpacity = useSharedValue(0);

  useEffect(() => {
    setShowConfetti(true);
    successScale.value = withSpring(1, { damping: 10 });
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}

    // Animate timeline items
    timelineOpacity.value = withDelay(500, withSpring(1, { damping: 12 }));
  }, []);

  const successStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
    opacity: successScale.value,
  }));

  const timelineStyle = useAnimatedStyle(() => ({
    opacity: timelineOpacity.value,
  }));

  const handleContinue = () => {
    router.push({ pathname: '/student/payment-status', params: { id, status: 'pending' } } as any);
  };

  const renderTimelineItem = (item: TimelineItem, index: number) => (
    <Animated.View 
      key={item.id} 
      entering={SlideInUp.delay(index * 100).springify()}
      style={styles.timelineItem}
    >
      <View style={styles.timelineLeft}>
        <View style={[
          styles.timelineDot, 
          { 
            backgroundColor: item.completed ? colors.success : 
                           item.active ? colors.primary : colors.border 
          }
        ]} />
        {index < timeline.items.length - 1 && (
          <View style={[
            styles.timelineLine,
            { backgroundColor: item.completed ? colors.success : colors.border }
          ]} />
        )}
      </View>
      
      <View style={styles.timelineContent}>
        <Text style={[
          styles.timelineTitle,
          { color: item.completed || item.active ? colors.textPrimary : colors.textTertiary }
        ]}>
          {item.title}
        </Text>
        <Text style={styles.timelineDesc}>{item.description}</Text>
        {item.timestamp && (
          <Text style={styles.timelineTime}>
            {new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>

      {item.completed && (
        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
      )}
      {item.active && (
        <View style={styles.activeBadge}>
          <Text style={styles.activeText}>CURRENT</Text>
        </View>
      )}
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Confetti active={showConfetti} count={80} />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle}>Shift Completed!</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      >
        {/* Success Animation */}
        <Animated.View style={[styles.successContainer, successStyle]}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color={colors.success} />
          </View>
          
          <Text style={styles.successTitle}>Great Job!</Text>
          <Text style={styles.successDesc}>
            You've successfully completed your shift
          </Text>

          <View style={styles.earningCard}>
            <Text style={styles.earningLabel}>Total Earnings</Text>
            <Text style={styles.earningValue}>₹{shift.totalEarning}</Text>
          </View>
        </Animated.View>

        {/* Timeline */}
        <Animated.View style={[styles.timelineCard, timelineStyle]}>
          <Text style={styles.sectionTitle}>SHIFT TIMELINE</Text>
          
          <View style={styles.timelineList}>
            {timeline.items.map((item, index) => renderTimelineItem(item, index))}
          </View>
        </Animated.View>

        {/* Next Steps */}
        <View style={styles.nextStepsCard}>
          <Text style={styles.sectionTitle}>WHAT'S NEXT?</Text>
          
          <View style={styles.stepItem}>
            <View style={[styles.stepIcon, { backgroundColor: colors.warningSoft }]}>
              <Ionicons name="hourglass" size={20} color={colors.warning} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Payment Pending</Text>
              <Text style={styles.stepDesc}>Business will confirm payment within 24 hours</Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={[styles.stepIcon, { backgroundColor: colors.successSoft }]}>
              <Ionicons name="wallet" size={20} color={colors.success} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Receive Payment</Text>
              <Text style={styles.stepDesc}>Confirm once you receive the payment</Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={[styles.stepIcon, { backgroundColor: colors.primaryTint }]}>
              <Ionicons name="star" size={20} color={colors.primary} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Rate Shift</Text>
              <Text style={styles.stepDesc}>Share your experience to help others</Text>
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.submitContainer}>
          <PrimaryButton
            label="Continue to Payment"
            onPress={handleContinue}
            leftIcon={<Ionicons name="arrow-forward" size={20} color="#fff" />}
          />
        </View>
      </ScrollView>
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
  headerTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  successContainer: {
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
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
  earningCard: {
    width: '100%',
    padding: spacing.xl,
    backgroundColor: colors.successSoft,
    borderRadius: radius.xl,
    alignItems: 'center',
  },
  earningLabel: {
    fontSize: typography.bodySm,
    color: colors.success,
  },
  earningValue: {
    fontSize: 36,
    fontWeight: typography.weightMedium,
    color: colors.success,
    marginTop: spacing.xs,
  },
  timelineCard: {
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
    marginBottom: spacing.lg,
  },
  timelineList: {
    gap: spacing.lg,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  timelineLeft: {
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLine: {
    width: 2,
    height: 40,
    marginTop: spacing.xs,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    marginBottom: 2,
  },
  timelineDesc: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
  },
  timelineTime: {
    fontSize: typography.caption,
    color: colors.textTertiary,
    marginTop: 4,
  },
  activeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: colors.primaryTint,
    borderRadius: radius.pill,
  },
  activeText: {
    fontSize: 10,
    fontWeight: typography.weightMedium,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  nextStepsCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  stepIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  stepDesc: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  submitContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
});
