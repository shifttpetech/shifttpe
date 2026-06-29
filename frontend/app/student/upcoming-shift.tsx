import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, Platform } from 'react-native';
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
import * as Haptics from 'expo-haptics';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { BottomSheet } from '@/src/components/BottomSheet';
import { colors, radius, spacing, typography, shadows } from '@/src/theme';
import { MOCK_SHIFTS, getShiftById } from '@/src/data/shifts';

export default function UpcomingShift() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const shift = getShiftById(id) || MOCK_SHIFTS[0];
  const [locationReached, setLocationReached] = useState(false);
  const [showCancelSheet, setShowCancelSheet] = useState(false);
  
  const pulseScale = useSharedValue(1);
  const locationPulse = useSharedValue(1);

  useEffect(() => {
    // Simulate location check - in real app would use GPS
    const timer = setTimeout(() => {
      setLocationReached(true);
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    }, 5000);
    
    // Pulse animation for location indicator
    locationPulse.value = withRepeat(
      withTiming(1.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    
    return () => clearTimeout(timer);
  }, []);

  const locationPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: locationPulse.value }],
    opacity: 2 - locationPulse.value,
  }));

  const handleNavigate = () => {
    const address = encodeURIComponent(shift.address);
    const url = Platform.select({
      ios: `maps:0,0?q=${address}`,
      android: `geo:0,0?q=${address}`,
    });
    if (url) Linking.openURL(url);
  };

  const handleChat = () => {
    router.push('/student/(tabs)/chats');
  };

  const handleCheckIn = () => {
    router.push({ pathname: '/student/qr-scan', params: { type: 'checkin', shiftId: id } } as any);
  };

  const handleCancelShift = () => {
    setShowCancelSheet(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Upcoming Shift</Text>
        <Pressable style={styles.moreBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        {/* Business Card */}
        <View style={styles.businessCard}>
          <Image
            source={{ uri: shift.businessLogo }}
            style={styles.businessImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.businessGradient}
          />
          <View style={styles.businessInfo}>
            <Text style={styles.businessName}>{shift.businessName}</Text>
            <Text style={styles.jobTitle}>{shift.jobTitle}</Text>
          </View>
        </View>

        {/* Shift Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>SHIFT DETAILS</Text>
          
          <View style={styles.detailRow}>
            <View style={[styles.detailIcon, { backgroundColor: colors.primaryTint }]}>
              <Ionicons name="calendar" size={20} color={colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{shift.date}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={[styles.detailIcon, { backgroundColor: colors.accentPurpleSoft }]}>
              <Ionicons name="time" size={20} color={colors.accentPurple} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{shift.startTime} - {shift.endTime}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={[styles.detailIcon, { backgroundColor: colors.successSoft }]}>
              <Ionicons name="cash" size={20} color={colors.success} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Salary</Text>
              <Text style={styles.detailValue}>₹{shift.totalEarning}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={[styles.detailIcon, { backgroundColor: colors.warningSoft }]}>
              <Ionicons name="hourglass" size={20} color={colors.warning} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{shift.duration}</Text>
            </View>
          </View>
        </View>

        {/* Location Card */}
        <View style={styles.locationCard}>
          <Text style={styles.sectionTitle}>LOCATION</Text>
          
          <View style={styles.addressRow}>
            <View style={styles.locationIconWrap}>
              <Ionicons name="location" size={24} color={colors.primary} />
              {!locationReached && (
                <Animated.View style={[styles.locationPulse, locationPulseStyle]} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.addressText}>{shift.address}</Text>
              <Text style={styles.distanceText}>2.5 km away</Text>
            </View>
          </View>

          {locationReached ? (
            <View style={styles.locationReachedBanner}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              <Text style={styles.locationReachedText}>You've reached the workplace!</Text>
            </View>
          ) : (
            <View style={styles.locationPendingBanner}>
              <Ionicons name="navigate" size={20} color={colors.warning} />
              <Text style={styles.locationPendingText}>Navigate to workplace to enable check-in</Text>
            </View>
          )}

          <Pressable onPress={handleNavigate} style={styles.navigateBtn}>
            <Ionicons name="navigate" size={18} color="#fff" />
            <Text style={styles.navigateBtnText}>Navigate</Text>
          </Pressable>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <Pressable onPress={handleNavigate} style={styles.actionBtn}>
            <View style={[styles.actionIcon, { backgroundColor: colors.primaryTint }]}>
              <Ionicons name="navigate" size={22} color={colors.primary} />
            </View>
            <Text style={styles.actionLabel}>Navigate</Text>
          </Pressable>

          <Pressable onPress={handleChat} style={styles.actionBtn}>
            <View style={[styles.actionIcon, { backgroundColor: colors.accentPurpleSoft }]}>
              <Ionicons name="chatbubble" size={22} color={colors.accentPurple} />
            </View>
            <Text style={styles.actionLabel}>Chat</Text>
          </Pressable>

          <Pressable onPress={() => router.push({ pathname: '/student/shift/[id]', params: { id } } as any)} style={styles.actionBtn}>
            <View style={[styles.actionIcon, { backgroundColor: colors.successSoft }]}>
              <Ionicons name="document-text" size={22} color={colors.success} />
            </View>
            <Text style={styles.actionLabel}>Details</Text>
          </Pressable>

          <Pressable onPress={() => setShowCancelSheet(true)} style={styles.actionBtn}>
            <View style={[styles.actionIcon, { backgroundColor: colors.dangerSoft }]}>
              <Ionicons name="close-circle" size={22} color={colors.danger} />
            </View>
            <Text style={styles.actionLabel}>Cancel</Text>
          </Pressable>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Ionicons name="information-circle" size={20} color={colors.accentPurple} />
          <Text style={styles.instructionsText}>
            {locationReached 
              ? 'You can now scan the QR code to check in. Ask the manager for the check-in QR.'
              : 'Navigate to the workplace. QR check-in will be enabled when you reach the location.'}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomAction, { paddingBottom: insets.bottom + spacing.md }]}>
        <PrimaryButton
          label={locationReached ? "Scan QR to Check In" : "QR Check-in (Reach Location First)"}
          onPress={handleCheckIn}
          disabled={!locationReached}
          leftIcon={<Ionicons name="qr-code" size={20} color="#fff" />}
        />
        {!locationReached && (
          <Pressable onPress={() => setLocationReached(true)} style={styles.demoLink}>
            <Text style={styles.demoLinkText}>Demo: Simulate reaching location</Text>
          </Pressable>
        )}
      </View>

      {/* Cancel Bottom Sheet */}
      <BottomSheet visible={showCancelSheet} onClose={() => setShowCancelSheet(false)}>
        <View style={styles.sheetContent}>
          <View style={styles.sheetIcon}>
            <Ionicons name="warning" size={32} color={colors.danger} />
          </View>
          <Text style={styles.sheetTitle}>Cancel Shift?</Text>
          <Text style={styles.sheetDesc}>
            Are you sure you want to cancel this shift? This may affect your rating.
          </Text>
          <View style={styles.sheetActions}>
            <Pressable onPress={() => setShowCancelSheet(false)} style={styles.sheetCancelBtn}>
              <Text style={styles.sheetCancelText}>Keep Shift</Text>
            </Pressable>
            <Pressable onPress={handleCancelShift} style={styles.sheetConfirmBtn}>
              <Text style={styles.sheetConfirmText}>Yes, Cancel</Text>
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
  businessCard: {
    marginHorizontal: spacing.lg,
    height: 180,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  businessImage: {
    width: '100%',
    height: '100%',
  },
  businessGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  businessInfo: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
  },
  businessName: {
    fontSize: 22,
    fontWeight: typography.weightMedium,
    color: '#fff',
  },
  jobTitle: {
    fontSize: typography.body,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  detailsCard: {
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  detailIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: typography.caption,
    color: colors.textTertiary,
  },
  detailValue: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
    marginTop: 2,
  },
  locationCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  locationIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationPulse: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
  },
  addressText: {
    fontSize: typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  distanceText: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  locationReachedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.successSoft,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  locationReachedText: {
    fontSize: typography.bodySm,
    fontWeight: typography.weightMedium,
    color: colors.success,
  },
  locationPendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.warningSoft,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  locationPendingText: {
    fontSize: typography.bodySm,
    color: colors.warning,
    flex: 1,
  },
  navigateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
  },
  navigateBtnText: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: '#fff',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  actionBtn: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: typography.weightMedium,
  },
  instructionsCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
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
  demoLink: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  demoLinkText: {
    fontSize: typography.caption,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  sheetContent: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  sheetIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.dangerSoft,
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
    backgroundColor: colors.danger,
    alignItems: 'center',
  },
  sheetConfirmText: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: '#fff',
  },
});
