import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Badge } from '@/src/components/Badge';
import { Avatar } from '@/src/components/Avatar';
import { colors, radius, spacing, typography, shadows } from '@/src/theme';
import { MOCK_APPLICANTS } from '@/src/store/app-store';

export default function ApplicantDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending');

  const applicant = MOCK_APPLICANTS.find(a => a.id === id) || MOCK_APPLICANTS[0];

  const handleAccept = () => {
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    setStatus('accepted');
  };

  const handleReject = () => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    setStatus('rejected');
  };

  const handleGenerateQR = () => {
    router.push({
      pathname: '/business/qr-generate',
      params: { type: 'checkin', shiftId: 'shift_1', studentName: applicant.name },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Applicant Details</Text>
        <Pressable style={styles.moreBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Avatar source={applicant.photo} size="xl" verified />
          <Text style={styles.name}>{applicant.name}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={18} color="#FACC15" />
              <Text style={styles.statValue}>{applicant.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text style={styles.statValue}>{applicant.completed}</Text>
              <Text style={styles.statLabel}>Shifts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="location" size={18} color={colors.primary} />
              <Text style={styles.statValue}>{applicant.distanceKm}</Text>
              <Text style={styles.statLabel}>km away</Text>
            </View>
          </View>

          {status !== 'pending' && (
            <View style={[
              styles.statusBadge,
              { backgroundColor: status === 'accepted' ? colors.successSoft : colors.dangerSoft }
            ]}>
              <Ionicons
                name={status === 'accepted' ? 'checkmark-circle' : 'close-circle'}
                size={18}
                color={status === 'accepted' ? colors.success : colors.danger}
              />
              <Text style={[
                styles.statusText,
                { color: status === 'accepted' ? colors.success : colors.danger }
              ]}>
                {status === 'accepted' ? 'Accepted' : 'Rejected'}
              </Text>
            </View>
          )}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsRow}>
            {applicant.skills.map((skill) => (
              <View key={skill} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          <View style={styles.expCard}>
            <View style={styles.expIcon}>
              <Ionicons name="briefcase" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.expTitle}>{applicant.completed} shifts completed</Text>
              <Text style={styles.expSubtitle}>on Shifttpe platform</Text>
            </View>
            <Badge label="Verified" variant="success" icon="checkmark-circle" />
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Avatar name="Cafe Coffee Day" size="sm" />
              <View style={{ flex: 1 }}>
                <Text style={styles.reviewBusiness}>Cafe Coffee Day</Text>
                <View style={styles.reviewStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= 5 ? 'star' : 'star-outline'}
                      size={12}
                      color="#FACC15"
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewDate}>2 days ago</Text>
            </View>
            <Text style={styles.reviewText}>
              "Great worker! Very punctual and friendly with customers. Would hire again."
            </Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.contactRow}>
            <View style={styles.contactIcon}>
              <Ionicons name="call" size={18} color={colors.primary} />
            </View>
            <Text style={styles.contactText}>+91 98765 43210</Text>
            <Pressable style={styles.contactBtn}>
              <Ionicons name="call" size={16} color="#fff" />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { paddingBottom: insets.bottom + spacing.md }]}>
        {status === 'pending' ? (
          <>
            <Pressable onPress={handleReject} style={styles.rejectBtn}>
              <Ionicons name="close" size={24} color={colors.danger} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                label="Accept"
                onPress={handleAccept}
                leftIcon={<Ionicons name="checkmark" size={20} color="#fff" />}
              />
            </View>
          </>
        ) : status === 'accepted' ? (
          <>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                label="Generate Check-In QR"
                onPress={handleGenerateQR}
                leftIcon={<Ionicons name="qr-code" size={20} color="#fff" />}
              />
            </View>
            <Pressable style={styles.chatBtn}>
              <Ionicons name="chatbubble" size={20} color={colors.primary} />
            </Pressable>
          </>
        ) : (
          <View style={{ flex: 1 }}>
            <PrimaryButton
              label="Back to Applicants"
              variant="secondary"
              onPress={() => router.back()}
            />
          </View>
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
  moreBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    alignItems: 'center',
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: {
    fontSize: typography.h2,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    width: '100%',
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.caption,
    color: colors.textTertiary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  statusText: {
    fontSize: typography.bodySm,
    fontWeight: typography.weightMedium,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.bodySm,
    fontWeight: typography.weightMedium,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  skillTag: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  skillText: {
    fontSize: typography.bodySm,
    color: colors.primary,
    fontWeight: typography.weightMedium,
  },
  expCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  expIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  expSubtitle: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  reviewCard: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  reviewBusiness: {
    fontSize: typography.bodySm,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  reviewDate: {
    fontSize: typography.caption,
    color: colors.textTertiary,
  },
  reviewText: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactText: {
    flex: 1,
    fontSize: typography.body,
    color: colors.textPrimary,
  },
  contactBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rejectBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
