import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/src/store/app-store";
import { colors, radius, spacing, typography, shadows } from "@/src/theme";

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { studentProfile, logout, myShifts, referralEarnings } = useApp();
  const completed = myShifts.filter(s => s.status === "completed").length;

  const items = [
    { icon: "wallet-outline", label: "My Wallet", route: "/student/wallet", highlight: true },
    { icon: "gift-outline", label: `Refer & Earn${referralEarnings > 0 ? ` · ₹${referralEarnings}` : ""}`, route: "/student/referral" },
    { icon: "notifications-outline", label: "Notifications", route: "/student/notifications" },
    { icon: "settings-outline", label: "Settings", route: "/student/settings" },
    { icon: "help-circle-outline", label: "Help & Support" },
    { icon: "document-text-outline", label: "Terms & Conditions", route: "/student/terms" },
    { icon: "shield-checkmark-outline", label: "Privacy Policy", route: "/privacy-policy" },
  ];

  const doLogout = async () => {
    await logout();
    router.replace("/role-select");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 64 + insets.bottom + 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <View style={styles.avatar}><Ionicons name="person" size={42} color={colors.primary} /></View>
          <Text style={styles.name}>{studentProfile?.name || "Your Name"}</Text>
          <View style={styles.phoneRow}>
            <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.phone}>{studentProfile?.phone || "Add phone"}</Text>
          </View>

          <View style={styles.stats}>
            <Stat label="Rating" value="4.8" icon="star" color="#FACC15" />
            <View style={styles.statDivider} />
            <Stat label="Shifts" value={`${completed}`} icon="checkmark-circle" color={colors.success} />
            <View style={styles.statDivider} />
            <Stat label="Badges" value="3" icon="ribbon" color={colors.accentPurple} />
          </View>
        </View>

        <Section title="Skills">
          <View style={styles.tagsRow}>
            {(studentProfile?.skills || ["Cash Handling", "Retail Sales", "Customer Service"]).map(s => (
              <View key={s} style={styles.tag}><Text style={styles.tagText}>{s}</Text></View>
            ))}
          </View>
        </Section>

        <Section title="Preferences">
          <Row icon="location-outline" label="Location" value={studentProfile?.preferredLocation || "Andheri West"} />
          <Row icon="navigate-outline" label="Max distance" value={`${studentProfile?.maxDistance || 5} km`} />
          <Row icon="time-outline" label="Availability" value={studentProfile?.availability || "Evening"} />
          <Row icon="cash-outline" label="Minimum pay" value={`₹${studentProfile?.minPay || 500}+`} />
        </Section>

        <View style={styles.menu}>
          {items.map((it: any) => (
            <Pressable key={it.label} onPress={() => it.route && router.push(it.route as any)} style={styles.menuItem}>
              <View style={[styles.menuIcon, it.highlight && { backgroundColor: colors.primaryTint }]}>
                <Ionicons name={it.icon as any} size={20} color={it.highlight ? colors.primary : colors.textPrimary} />
              </View>
              <Text style={[styles.menuLabel, it.highlight && { color: colors.primary }]}>{it.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </Pressable>
          ))}
          <Pressable testID="logout" onPress={doLogout} style={[styles.menuItem, { borderTopWidth: 1, borderTopColor: colors.divider }]}>
            <View style={[styles.menuIcon, { backgroundColor: colors.dangerSoft }]}><Ionicons name="log-out-outline" size={20} color={colors.danger} /></View>
            <Text style={[styles.menuLabel, { color: colors.danger }]}>Logout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, icon, color }: any) {
  return (
    <View style={styles.statBox}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}
function Section({ title, children }: any) {
  return (
    <View style={{ marginTop: spacing.xl }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}
function Row({ icon, label, value }: any) {
  return (
    <View style={styles.row}>
      <View style={styles.menuIcon}><Ionicons name={icon} size={18} color={colors.primary} /></View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  headerCard: { alignItems: "center", padding: spacing.xl, backgroundColor: colors.primaryTint, borderRadius: radius.xxl, ...shadows.soft },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#fff", marginBottom: spacing.sm },
  name: { fontSize: 22, color: colors.textPrimary, fontWeight: typography.weightMedium },
  phoneRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  phone: { color: colors.textSecondary, fontSize: typography.bodySm },
  stats: { flexDirection: "row", marginTop: spacing.lg, padding: spacing.md, backgroundColor: "#fff", borderRadius: radius.xl, width: "100%", alignItems: "center" },
  statBox: { flex: 1, alignItems: "center", gap: 2 },
  statValue: { fontSize: 18, color: colors.textPrimary, fontWeight: typography.weightMedium },
  statLabel: { fontSize: 10, color: colors.textTertiary, fontWeight: typography.weightMedium, letterSpacing: 0.5 },
  statDivider: { width: 1, height: 32, backgroundColor: colors.border },
  sectionTitle: { fontSize: 11, color: colors.textTertiary, fontWeight: typography.weightMedium, letterSpacing: 1.2, marginBottom: spacing.sm, marginLeft: spacing.sm },
  sectionBody: { backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.md, borderWidth: 1, borderColor: colors.border, gap: spacing.sm },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  tag: { backgroundColor: colors.primaryTint, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill },
  tagText: { color: colors.primary, fontSize: typography.caption, fontWeight: typography.weightMedium },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.sm },
  rowLabel: { flex: 1, color: colors.textPrimary, fontSize: typography.bodySm },
  rowValue: { color: colors.textSecondary, fontSize: typography.bodySm, fontWeight: typography.weightMedium },
  menu: { marginTop: spacing.xl, backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  menuItem: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md },
  menuIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceSoft, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, color: colors.textPrimary, fontSize: typography.body, fontWeight: typography.weightMedium },
});
