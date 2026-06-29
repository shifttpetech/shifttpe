import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ShiftPeLogo } from "@/src/components/ShiftPeLogo";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { useApp, MOCK_APPLICANTS } from "@/src/store/app-store";
import { colors, radius, spacing, typography, shadows } from "@/src/theme";

export default function BusinessDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { businessProfile, businessJobs } = useApp();

  const activeJobs = businessJobs.filter(j => j.status === "active");
  const totalApplicants = MOCK_APPLICANTS.length;
  const isPro = businessProfile?.plan === "pro";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 64 + insets.bottom + 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View><ShiftPeLogo size={26} /></View>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconBtn} onPress={() => router.push("/business/notifications")}><Ionicons name="notifications-outline" size={20} color={colors.textPrimary} /></Pressable>
          </View>
        </View>

        <View style={styles.greet}>
          <View style={styles.helloRow}>
            <Text style={styles.hello}>Hello, {businessProfile?.businessName || "Business"} 👋</Text>
            {businessProfile?.verified && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
          </View>
          <View style={styles.locRow}>
            <Ionicons name="location" size={14} color={colors.primary} />
            <Text style={styles.loc}>{businessProfile?.area || "Andheri West, Mumbai"}</Text>
          </View>
        </View>

        {!isPro && (
          <Pressable testID="upgrade-banner" onPress={() => router.push("/business/subscription")} style={styles.proBanner}>
            <View style={styles.proIcon}><Ionicons name="diamond" size={20} color="#fff" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.proTitle}>Upgrade to ShiftPe Pro</Text>
              <Text style={styles.proBody}>Unlimited postings + verified badge · ₹999/mo</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.primary} />
          </Pressable>
        )}

        <View style={styles.metrics}>
          <Metric icon="briefcase" label="Active Jobs" value={activeJobs.length} color={colors.primary} bg={colors.primaryTint} />
          <Metric icon="people" label="Applicants" value={totalApplicants} color={colors.accentPurple} bg={colors.accentPurpleSoft} />
          <Metric icon="trending-up" label="Hires (mo)" value={12} color={colors.success} bg={colors.successSoft} />
          <Metric icon="star" label="Rating" value="4.7" color={"#F59E0B"} bg={colors.warningSoft} />
        </View>

        <Pressable onPress={() => router.push("/business/create-shift")} style={[styles.postCta, shadows.button]} testID="post-job-cta">
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={styles.postCtaText}>Post a New Job</Text>
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Jobs</Text>
          <Pressable><Text style={styles.viewAll}>View all</Text></Pressable>
        </View>
        <View style={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}>
          {activeJobs.map(j => (
            <View key={j.id} style={styles.jobCard}>
              <View style={{ flex: 1 }}>
                <View style={styles.jobHead}>
                  <Text style={styles.jobTitle}>{j.title}</Text>
                  <View style={styles.activeBadge}><Text style={styles.activeText}>Active</Text></View>
                </View>
                <View style={styles.jobMeta}>
                  <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                  <Text style={styles.jobMetaText}>{j.shiftTime}</Text>
                </View>
                <View style={styles.jobStats}>
                  <Text style={styles.jobStat}>₹{j.pay}/hr</Text>
                  <Text style={styles.jobDot}>·</Text>
                  <Text style={styles.jobStat}>{j.openings} Openings</Text>
                  <Text style={styles.jobDot}>·</Text>
                  <Text style={[styles.jobStat, { color: colors.primary }]}>{j.applied} Applied</Text>
                </View>
              </View>
              <Pressable onPress={() => router.push("/business/(tabs)/applicants")} style={styles.viewBtn}>
                <Ionicons name="chevron-forward" size={18} color={colors.textPrimary} />
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Applicants</Text>
        </View>
        <View style={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}>
          {MOCK_APPLICANTS.slice(0, 3).map(a => (
            <View key={a.id} style={styles.appCard}>
              <View style={styles.appAvatar}><Ionicons name="person" size={20} color={colors.primary} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.appName}>{a.name}</Text>
                <View style={styles.appMeta}>
                  <Ionicons name="star" size={11} color="#FACC15" /><Text style={styles.appMetaText}>{a.rating}</Text>
                  <Text style={styles.jobDot}>·</Text>
                  <Text style={styles.appMetaText}>{a.distanceKm} km</Text>
                  <Text style={styles.jobDot}>·</Text>
                  <Text style={styles.appMetaText}>{a.completed} shifts</Text>
                </View>
              </View>
              <Pressable style={styles.acceptBtn}><Text style={styles.acceptText}>View</Text></Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Metric({ icon, label, value, color, bg }: any) {
  return (
    <View style={[styles.metric, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", padding: spacing.lg },
  headerActions: { marginLeft: "auto", flexDirection: "row", gap: spacing.sm },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceSoft, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  greet: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  helloRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  hello: { fontSize: 22, color: colors.textPrimary, fontWeight: typography.weightMedium, letterSpacing: -0.3 },
  proBanner: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, marginHorizontal: spacing.lg, marginBottom: spacing.md, backgroundColor: colors.primaryTint, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.primarySoft },
  proIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  proTitle: { color: colors.textPrimary, fontSize: typography.bodySm, fontWeight: typography.weightMedium },
  proBody: { color: colors.textSecondary, fontSize: typography.caption, marginTop: 2 },
  locRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  loc: { color: colors.textSecondary, fontSize: typography.bodySm },
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, paddingHorizontal: spacing.lg },
  metric: { flex: 1, minWidth: "47%", padding: spacing.md, borderRadius: radius.xl, gap: 4 },
  metricValue: { fontSize: 24, fontWeight: typography.weightMedium },
  metricLabel: { color: colors.textSecondary, fontSize: typography.caption, fontWeight: typography.weightMedium },
  postCta: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, height: 56, marginHorizontal: spacing.lg, marginTop: spacing.lg, backgroundColor: colors.primary, borderRadius: radius.pill },
  postCtaText: { color: "#fff", fontSize: typography.body, fontWeight: typography.weightMedium },
  section: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.sm },
  sectionTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: typography.weightMedium },
  viewAll: { color: colors.primary, fontSize: typography.bodySm, fontWeight: typography.weightMedium },
  jobCard: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border },
  jobHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  jobTitle: { color: colors.textPrimary, fontSize: typography.body, fontWeight: typography.weightMedium },
  activeBadge: { backgroundColor: colors.successSoft, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill },
  activeText: { color: colors.success, fontSize: 10, fontWeight: typography.weightMedium },
  jobMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  jobMetaText: { color: colors.textTertiary, fontSize: typography.caption },
  jobStats: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  jobStat: { color: colors.textSecondary, fontSize: typography.caption, fontWeight: typography.weightMedium },
  jobDot: { color: colors.textTertiary },
  viewBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceSoft, alignItems: "center", justifyContent: "center" },
  appCard: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border },
  appAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryTint, alignItems: "center", justifyContent: "center" },
  appName: { color: colors.textPrimary, fontSize: typography.bodySm, fontWeight: typography.weightMedium },
  appMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  appMetaText: { color: colors.textSecondary, fontSize: typography.caption },
  acceptBtn: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.primaryTint },
  acceptText: { color: colors.primary, fontSize: typography.caption, fontWeight: typography.weightMedium },
});
