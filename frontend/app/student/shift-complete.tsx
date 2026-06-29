import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Confetti } from '@/src/components/Confetti';
import { colors, radius, spacing, typography, shadows } from '@/src/theme';

export default function ShiftComplete() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);
  const [rating, setRating] = useState(0);

  const cardScale = useSharedValue(0.8);
  const cardOpacity = useSharedValue(0);
  const amountScale = useSharedValue(0);
  const starsOpacity = useSharedValue(0);

  useEffect(() => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    cardScale.value = withSpring(1, { damping: 12 });
    cardOpacity.value = withTiming(1, { duration: 400 });
    amountScale.value = withDelay(300, withSpring(1, { damping: 10 }));
    starsOpacity.value = withDelay(600, withTiming(1, { duration: 400 }));
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const amountStyle = useAnimatedStyle(() => ({
    transform: [{ scale: amountScale.value }],
  }));

  const starsStyle = useAnimatedStyle(() => ({
    opacity: starsOpacity.value,
  }));

  const handleRating = (star: number) => {
    setRating(star);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  const handleDone = () => {
    router.replace('/student/(tabs)/shifts');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.success, '#059669']}
        style={StyleSheet.absoluteFill}
      />

      <Confetti active={showConfetti} count={80} onComplete={() => setShowConfetti(false)} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.content}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconOuter}>
              <View style={styles.iconInner}>
                <Ionicons name="checkmark" size={48} color={colors.success} />
              </View>
            </View>
          </View>

          <Text style={styles.title}>Shift Completed!</Text>
          <Text style={styles.subtitle}>Great job! Your earnings have been credited.</Text>

          {/* Earnings Card */}
          <Animated.View style={[styles.earningsCard, cardStyle]}>
            <Text style={styles.earningsLabel}>You Earned</Text>
            <Animated.View style={amountStyle}>
              <Text style={styles.earningsAmount}>₹500</Text>
            </Animated.View>
            <View style={styles.earningsDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Shift Pay</Text>
                <Text style={styles.detailValue}>₹480</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tip</Text>
                <Text style={[styles.detailValue, { color: colors.success }]}>+₹20</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Added to Wallet</Text>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              </View>
            </View>
          </Animated.View>

          {/* Rating Section */}
          <Animated.View style={[styles.ratingSection, starsStyle]}>
            <Text style={styles.ratingTitle}>Rate your experience</Text>
            <Text style={styles.ratingSubtitle}>How was working at Cafe Coffee Day?</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable key={star} onPress={() => handleRating(star)}>
                  <Ionicons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={40}
                    color={star <= rating ? '#FACC15' : 'rgba(255,255,255,0.4)'}
                  />
                </Pressable>
              ))}
            </View>
          </Animated.View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <PrimaryButton
            label="View Wallet"
            variant="secondary"
            onPress={() => router.push('/student/wallet')}
            leftIcon={<Ionicons name="wallet-outline" size={20} color={colors.textPrimary} />}
          />
          <PrimaryButton
            label="Done"
            onPress={handleDone}
            style={{ backgroundColor: '#fff' }}
            leftIcon={<Ionicons name="checkmark" size={20} color={colors.success} />}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  iconOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: typography.weightMedium,
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.body,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  earningsCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: radius.xxl,
    padding: spacing.xl,
    marginTop: spacing.xl,
    alignItems: 'center',
    ...shadows.card,
  },
  earningsLabel: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  earningsAmount: {
    fontSize: 56,
    fontWeight: typography.weightMedium,
    color: colors.success,
    marginVertical: spacing.sm,
  },
  earningsDetails: {
    width: '100%',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: typography.bodySm,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  ratingSection: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  ratingTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: '#fff',
  },
  ratingSubtitle: {
    fontSize: typography.bodySm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  starsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  bottomActions: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
});
