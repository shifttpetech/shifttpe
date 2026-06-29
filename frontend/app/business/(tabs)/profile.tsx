import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/src/store/app-store";
import { colors, radius, spacing, typography, shadows } from "@/src/theme";

export default function BusinessProfile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { businessProfile, logout, businessJobs } = useApp();
  const isPro = businessProfile?.plan === "pro";

  const doLogout = async () => { await logout(); router.replace("/role-select"); };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 64 + insets.bottom + 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <View style={styles.logo}><Ionicons name="storefront" size={32} color={colors.accentPurple} /></View>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{businessProfile?.businessName || "Your Business"}</Text>
            {businessProfile?.verified && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
          </View>
          {isPro && (
            <View style={styles.proBadge}>
              <Ionicons name="diamond" size={12} color="#fff" />
              <Text style={styles.proBadgeText}>ShiftPe Pro</Text>
            </View>
          )}
          <View style={styles.bizMeta}>
            <Ionicons name="business-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.sub}>{businessProfile?.category || "Cafe / Restaurant"}</Text>
          </View>
          <View style={styles.bizMeta}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.sub}>{businessProfile?.area || "Andheri West, Mumbai"}</Text>
          </View>

          <View style={styles.stats}>
            <Stat label="Jobs" value={businessJobs.length} />
            <View style={styles.statDivider} />
            <Stat label="Hires" value="12" />
            <View style={styles.statDivider} />
            <Stat label="Rating" value="4.7" />
          </View>
        </View>

        <View style={styles.menu}>
          {!isPro && <MenuItem icon="diamond-outline" label="Upgrade to Pro" onPress={() => router.push("/business/subscription")} accent />}
          <MenuItem icon="create-outline" label="Edit Business Profile" />
          <MenuItem icon="briefcase-outline" label="Active Job Posts" onPress={() => router.push("/business/(tabs)/dashboard")} />
          <MenuItem icon="notifications-outline" label="Notifications" onPress={() => router.push("/business/notifications")} />
          <MenuItem icon="settings-outline" label="Settings" onPress={() => router.push("/student/settings")} />
          <MenuItem icon="help-circle-outline" label="Help & Support" />
          <Pressable testID="biz-logout" onPress={doLogout} style={[styles.menuItem, { borderTopWidth: 1, borderTopColor: colors.divider }]}>
            <View style={[styles.menuIcon, { backgroundColor: colors.dangerSoft }]}><Ionicons name="log-out-outline" size={20} color={colors.danger} /></View>
            <Text style={[styles.menuLabel, { color: colors.danger }]}>Logout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: any) { return (<View style={styles.statBox}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>); }
function MenuItem({ icon, label, onPress, accent }: any) {
  return (
    <Pressable onPress={onPress} style={styles.menuItem}>
      <View style={[styles.menuIcon, accent && { backgroundColor: colors.primaryTint }]}><Ionicons name={icon} size={20} color={accent ? colors.primary : colors.textPrimary} /></View>
      <Text style={[styles.menuLabel, accent && { color: colors.primary }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  headerCard: { alignItems: "center", padding: spacing.xl, backgroundColor: colors.accentPurpleSoft, borderRadius: radius.xxl, ...shadows.soft },
  logo: { width: 88, height: 88, borderRadius: 22, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontSize: 22, color: colors.textPrimary, fontWeight: typography.weightMedium },
  proBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.pill, backgroundColor: colors.primary, marginTop: 6 },
  proBadgeText: { color: "#fff", fontSize: typography.caption, fontWeight: typography.weightMedium },
  bizMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  sub: { color: colors.textSecondary, fontSize: typography.bodySm },
  stats: { flexDirection: "row", marginTop: spacing.lg, padding: spacing.md, backgroundColor: "#fff", borderRadius: radius.xl, width: "100%", alignItems: "center" },
  statBox: { flex: 1, alignItems: "center", gap: 2 },
  statValue: { fontSize: 22, color: colors.textPrimary, fontWeight: typography.weightMedium },
  statLabel: { fontSize: 10, color: colors.textTertiary, fontWeight: typography.weightMedium, letterSpacing: 0.5 },
  statDivider: { width: 1, height: 32, backgroundColor: colors.border },
  menu: { marginTop: spacing.xl, backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  menuItem: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md },
  menuIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceSoft, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, color: colors.textPrimary, fontSize: typography.body, fontWeight: typography.weightMedium },
});
