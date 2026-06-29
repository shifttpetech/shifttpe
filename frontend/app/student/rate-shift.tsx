import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Confetti } from '@/src/components/Confetti';
import { colors, radius, spacing, typography, shadows } from '@/src/theme';
import { MOCK_SHIFTS, getShiftById } from '@/src/data/shifts';

export default function RateShift() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const shift = getShiftById(id) || MOCK_SHIFTS[0];
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const starScale = useSharedValue(1);
  const successScale = useSharedValue(0);

  const handleStarPress = (star: number) => {
    setRating(star);
    starScale.value = withSpring(1.2, { damping: 8 });
    setTimeout(() => {
      starScale.value = withSpring(1, { damping: 8 });
    }, 100);
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    
    setSubmitted(true);
    setShowConfetti(true);
    successScale.value = withSpring(1, { damping: 10 });
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    
    // Navigate back after animation
    setTimeout(() => {
      router.replace('/student/(tabs)/shifts');
    }, 2500);
  };

  const starScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: starScale.value }],
  }));

  const successStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
    opacity: successScale.value,
  }));

  if (submitted) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Confetti active={showConfetti} count={80} />
        
        <View style={styles.successContainer}>
          <Animated.View style={[styles.successIcon, successStyle]}>
            <Ionicons name="checkmark-circle" size={80} color={colors.success} />
          </Animated.View>
          
          <Text style={styles.successTitle}>Thank You!</Text>
          <Text style={styles.successDesc}>
            Your feedback helps us improve the platform
          </Text>
          
          <PrimaryButton
            label="Back to Shifts"
            onPress={() => router.replace('/student/(tabs)/shifts')}
          />
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
        <Text style={styles.headerTitle}>Rate Shift</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      >
        {/* Business Card */}
        <View style={styles.businessCard}>
          <Image
            source={{ uri: shift.businessLogo }}
            style={styles.businessLogo}
            contentFit="cover"
          />
          <View style={styles.businessInfo}>
            <Text style={styles.businessName}>{shift.businessName}</Text>
            <Text style={styles.jobTitle}>{shift.jobTitle}</Text>
            <Text style={styles.shiftDate}>{shift.date} · {shift.duration}</Text>
          </View>
        </View>

        {/* Rating Section */}
        <View style={styles.ratingCard}>
          <Text style={styles.sectionTitle}>RATE YOUR EXPERIENCE</Text>
          
          <Animated.View style={[styles.starsContainer, starScaleStyle]}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                onPress={() => handleStarPress(star)}
                style={styles.starBtn}
              >
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={40}
                  color={star <= rating ? '#FACC15' : colors.border}
                />
              </Pressable>
            ))}
          </Animated.View>

          <Text style={styles.ratingLabel}>
            {rating === 0 ? 'Tap to rate' : 
             rating === 1 ? 'Poor' :
             rating === 2 ? 'Fair' :
             rating === 3 ? 'Good' :
             rating === 4 ? 'Very Good' : 'Excellent'}
          </Text>
        </View>

        {/* Review Section */}
        <View style={styles.reviewCard}>
          <Text style={styles.sectionTitle}>WRITE A REVIEW (OPTIONAL)</Text>
          
          <TextInput
            style={styles.reviewInput}
            placeholder="Share your experience with this shift..."
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={4}
            value={review}
            onChangeText={setReview}
            maxLength={300}
          />
          
          <Text style={styles.charCount}>{review.length}/300</Text>
        </View>

        {/* Quick Tags */}
        <View style={styles.tagsCard}>
          <Text style={styles.sectionTitle}>QUICK TAGS</Text>
          
          <View style={styles.tagsRow}>
            {['On Time', 'Friendly', 'Well Paid', 'Safe', 'Professional'].map((tag) => (
              <Pressable key={tag} style={styles.tagBtn}>
                <Text style={styles.tagText}>{tag}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <PrimaryButton
            label="Submit Rating"
            onPress={handleSubmit}
            disabled={rating === 0}
            leftIcon={<Ionicons name="star" size={20} color="#fff" />}
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
    marginBottom: spacing.lg,
  },
  businessLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  businessInfo: {
    flex: 1,
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
  shiftDate: {
    fontSize: typography.caption,
    color: colors.textTertiary,
    marginTop: 4,
  },
  ratingCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.caption,
    fontWeight: typography.weightMedium,
    color: colors.textTertiary,
    letterSpacing: 1,
    marginBottom: spacing.lg,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  starBtn: {
    padding: spacing.xs,
  },
  ratingLabel: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  reviewCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  reviewInput: {
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
  tagsCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tagBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primaryTint,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  tagText: {
    fontSize: typography.bodySm,
    fontWeight: typography.weightMedium,
    color: colors.primary,
  },
  submitContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
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
    fontSize: 32,
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
});
