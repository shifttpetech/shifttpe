import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { JobSwipeCard } from "@/src/components/JobSwipeCard";
import { ShiftPeLogo } from "@/src/components/ShiftPeLogo";
import { MOCK_JOBS, useApp } from "@/src/store/app-store";
import { computeMatchPct } from "@/src/utils/match";
import { colors, radius, shadows, spacing, typography } from "@/src/theme";

export default function Swipe() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addShift, studentProfile } = useApp();
  const [idx, setIdx] = useState(0);

  const sortedJobs = useMemo(() => {
    return [...MOCK_JOBS]
      .map(j => ({ ...j, _match: computeMatchPct(j, studentProfile) }))
      .sort((a, b) => b._match - a._match);
  }, [studentProfile]);

  const visible = useMemo(() => sortedJobs.slice(idx, idx + 3).reverse(), [idx, sortedJobs]);
  const advance = () => setIdx((i) => Math.min(i + 1, sortedJobs.length));

  const onLike = async () => {
    const job = sortedJobs[idx];
    if (!job) return;
    await addShift(job.id);
    advance();
    router.push({ pathname: "/student/match", params: { jobId: job.id } });
  };
  const onPass = () => { advance(); };

  const currentJob = sortedJobs[idx];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <ShiftPeLogo size={26} />
        <View style={styles.headerActions}>
          <Pressable style={styles.iconBtn}><Ionicons name="options-outline" size={20} color={colors.textPrimary} /></Pressable>
          <Pressable style={styles.iconBtn}><Ionicons name="location-outline" size={20} color={colors.textPrimary} /></Pressable>
          <Pressable onPress={() => router.push("/student/(tabs)/profile")} style={styles.avatarBtn}>
            <View style={styles.avatar}><Ionicons name="person" size={18} color={colors.primary} /></View>
            <View style={styles.dot} />
          </Pressable>
        </View>
      </View>

      <View style={styles.titleBlock}>
        <Text style={styles.eyebrow}>NEAR YOU · MUMBAI</Text>
        <Text style={styles.h1}>Pick your shift.</Text>
        <Text style={styles.sub}>{Math.max(sortedJobs.length - idx, 0)} fresh gigs ranked by your match</Text>
      </View>

      <View style={styles.deck}>
        {visible.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}><Ionicons name="sparkles" size={32} color={colors.primary} /></View>
            <Text style={styles.emptyTitle}>You're all caught up!</Text>
            <Text style={styles.emptyBody}>Come back later for fresh shifts in your area.</Text>
            <Pressable onPress={() => setIdx(0)} style={styles.refresh}>
              <Ionicons name="refresh" size={16} color="#fff" />
              <Text style={styles.refreshText}>Reload</Text>
            </Pressable>
          </View>
        ) : (
          visible.map((job, i) => {
            const stackIndex = visible.length - 1 - i;
            const isTop = stackIndex === 0;
            return (
              <JobSwipeCard
                key={job.id}
                job={job}
                matchPct={(job as any)._match}
                isTop={isTop}
                stackIndex={stackIndex}
                onSwipeLeft={onPass}
                onSwipeRight={onLike}
                onDetails={() => router.push({ pathname: "/student/job/[id]", params: { id: job.id } })}
              />
            );
          })
        )}
      </View>

      {currentJob && (
        <View style={styles.actions}>
          <View style={styles.actionCol}>
            <Pressable testID="swipe-pass" onPress={onPass} style={[styles.actionBtn, shadows.floating]}><Ionicons name="close" size={32} color={colors.danger} /></Pressable>
            <Text style={styles.actionLabel}>PASS</Text>
          </View>
          <Pressable onPress={() => router.push({ pathname: "/student/job/[id]", params: { id: currentJob.id } })} style={[styles.detailBtn, shadows.soft]}>
            <Ionicons name="information-circle-outline" size={22} color={colors.accentPurple} />
          </Pressable>
          <View style={styles.actionCol}>
            <Pressable testID="swipe-like" onPress={onLike} style={[styles.actionBtn, { backgroundColor: colors.primary }, shadows.button]}><Ionicons name="heart" size={28} color="#fff" /></Pressable>
            <Text style={styles.actionLabel}>LIKE</Text>
          </View>
        </View>
      )}

      <Pressable testID="referral-banner" onPress={() => router.push("/student/referral")} style={[styles.referral, { marginBottom: insets.bottom + 8 }]}>
        <View style={styles.gift}><Ionicons name="gift" size={20} color={colors.primary} /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.refTitle}>Refer a friend & earn ₹200</Text>
          <Text style={styles.refBody}>When your friend completes 5 shifts!</Text>
        </View>
        <View style={styles.refArrow}><Ionicons name="chevron-forward" size={18} color="#fff" /></View>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  headerActions: { marginLeft: "auto", flexDirection: "row", gap: spacing.sm, alignItems: "center" },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceSoft, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  avatarBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: colors.primary, alignItems: "center", justifyContent: "center", position: "relative" },
  avatar: { flex: 1, width: "100%", borderRadius: 20, backgroundColor: colors.primaryTint, alignItems: "center", justifyContent: "center" },
  dot: { position: "absolute", top: -2, right: -2, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.danger, borderWidth: 2, borderColor: "#fff" },
  titleBlock: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  eyebrow: { color: colors.primary, fontSize: typography.caption, fontWeight: typography.weightMedium, letterSpacing: 1.2 },
  h1: { color: colors.textPrimary, fontSize: 32, fontWeight: typography.weightMedium, letterSpacing: -0.5, marginTop: 2 },
  sub: { color: colors.textSecondary, fontSize: typography.bodySm, marginTop: 2 },
  deck: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: spacing.sm },
  actions: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: spacing.xl, paddingVertical: spacing.md },
  actionCol: { alignItems: "center", gap: 4 },
  actionBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  detailBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.accentPurpleSoft, alignItems: "center", justifyContent: "center" },
  actionLabel: { fontSize: 10, color: colors.textTertiary, fontWeight: typography.weightMedium, letterSpacing: 1 },
  referral: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.primaryTint, marginHorizontal: spacing.lg, marginBottom: spacing.sm, padding: spacing.md, borderRadius: radius.lg },
  gift: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  refTitle: { color: colors.textPrimary, fontSize: typography.bodySm, fontWeight: typography.weightMedium },
  refBody: { color: colors.textSecondary, fontSize: typography.caption, marginTop: 2 },
  refArrow: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  empty: { alignItems: "center", padding: spacing.xl, gap: spacing.sm },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primaryTint, alignItems: "center", justifyContent: "center" },
  emptyTitle: { color: colors.textPrimary, fontSize: 20, fontWeight: typography.weightMedium },
  emptyBody: { color: colors.textSecondary, fontSize: typography.bodySm, textAlign: "center" },
  refresh: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.primary, marginTop: spacing.sm },
  refreshText: { color: "#fff", fontSize: typography.bodySm, fontWeight: typography.weightMedium },
});
