import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { useApp } from "@/src/store/app-store";
import { colors, radius, spacing, typography, shadows } from "@/src/theme";

const FREE_BENEFITS = [
  { ok: true, label: "Up to 2 active job posts" },
  { ok: true, label: "Standard placement in feed" },
  { ok: false, label: "Verified badge" },
  { ok: false, label: "Featured top-of-stack placement" },
  { ok: false, label: "Priority customer support" },
];
const PRO_BENEFITS = [
  { ok: true, label: "Unlimited active job posts" },
  { ok: true, label: "Verified business badge" },
  { ok: true, label: "Featured top-of-stack placement" },
  { ok: true, label: "Advanced applicant filters" },
  { ok: true, label: "Priority customer support" },
];

export default function Subscription() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { businessProfile, upgradePlan } = useApp();
  const isPro = businessProfile?.plan === "pro";
  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  const subscribe = async () => {
    setLoading(true);
    setTimeout(async () => {
      await upgradePlan();
      setLoading(false);
      router.replace("/business/(tabs)/dashboard");
    }, 800);
  };

  if (isPro) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}><Ionicons name="arrow-back" size={22} color={colors.textPrimary} /></Pressable>
          <Text style={styles.title}>ShiftPe Pro</Text>
          <View style={{ width: 22 }} />
        </View>
        <View style={styles.activeWrap}>
          <View style={styles.activeIcon}><Ionicons name="diamond" size={42} color="#fff" /></View>
          <Text style={styles.activeTitle}>You're on Pro!</Text>
          <Text style={styles.activeBody}>Unlimited job posts, verified badge and priority support.</Text>
          <View style={styles.benefitsCard}>
            {PRO_BENEFITS.map(b => (
              <View key={b.label} style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text style={styles.benefitLabel}>{b.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const price = plan === "monthly" ? 999 : 9588;
  const period = plan === "monthly" ? "/month" : "/year";
  const saving = plan === "yearly" ? "Save ₹2,400" : null;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}><Ionicons name="arrow-back" size={22} color={colors.textPrimary} /></Pressable>
        <Text style={styles.title}>Upgrade to Pro</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 140, gap: spacing.lg }} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <LinearGradient colors={[colors.primary, "#E62E47"]} style={StyleSheet.absoluteFill} />
          <View style={styles.diamondWrap}><Ionicons name="diamond" size={32} color="#fff" /></View>
          <Text style={styles.heroTitle}>ShiftPe Pro</Text>
          <Text style={styles.heroBody}>Hire faster with unlimited postings + verified trust.</Text>
        </View>

        <View style={styles.plans}>
          <Pressable testID="plan-monthly" onPress={() => setPlan("monthly")} style={[styles.planCard, plan === "monthly" && styles.planCardActive]}>
            <View style={styles.planHead}>
              <Text style={styles.planName}>Monthly</Text>
              {plan === "monthly" && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceVal}>₹999</Text>
              <Text style={styles.priceUnit}>/month</Text>
            </View>
            <Text style={styles.planSub}>Billed monthly · cancel anytime</Text>
          </Pressable>

          <Pressable testID="plan-yearly" onPress={() => setPlan("yearly")} style={[styles.planCard, plan === "yearly" && styles.planCardActive]}>
            <View style={styles.planHead}>
              <Text style={styles.planName}>Yearly</Text>
              <View style={styles.savingBadge}><Text style={styles.savingText}>Save 20%</Text></View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceVal}>₹799</Text>
              <Text style={styles.priceUnit}>/month</Text>
            </View>
            <Text style={styles.planSub}>₹9,588 billed yearly</Text>
          </Pressable>
        </View>

        <View style={styles.compare}>
          <View style={styles.compareCol}>
            <Text style={styles.compareHead}>FREE</Text>
            {FREE_BENEFITS.map(b => (
              <View key={b.label} style={styles.benefitRow}>
                <Ionicons name={b.ok ? "checkmark-circle" : "close-circle"} size={16} color={b.ok ? colors.success : colors.textTertiary} />
                <Text style={[styles.benefitLabel, !b.ok && { color: colors.textTertiary }]} numberOfLines={2}>{b.label}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.compareCol, styles.compareColPro]}>
            <Text style={[styles.compareHead, { color: colors.primary }]}>PRO</Text>
            {PRO_BENEFITS.map(b => (
              <View key={b.label} style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.benefitLabel} numberOfLines={2}>{b.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.note}>
          <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
          <Text style={styles.noteText}>This is a frontend demo. Payment is simulated.</Text>
        </View>
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: spacing.md + insets.bottom }]}>
        <PrimaryButton testID="upgrade-cta" label={loading ? "Activating…" : `Subscribe · ₹${price}${period}`} onPress={subscribe} loading={loading} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: spacing.lg },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: typography.weightMedium },
  hero: { padding: spacing.xl, borderRadius: radius.xxl, alignItems: "center", overflow: "hidden", gap: spacing.sm, ...shadows.button },
  diamondWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  heroTitle: { color: "#fff", fontSize: 26, fontWeight: typography.weightMedium, letterSpacing: -0.3 },
  heroBody: { color: "rgba(255,255,255,0.9)", fontSize: typography.bodySm, textAlign: "center" },
  plans: { flexDirection: "row", gap: spacing.sm },
  planCard: { flex: 1, padding: spacing.md, borderRadius: radius.xl, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, gap: 6 },
  planCardActive: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  planHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  planName: { color: colors.textPrimary, fontSize: typography.body, fontWeight: typography.weightMedium },
  savingBadge: { backgroundColor: colors.success, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill },
  savingText: { color: "#fff", fontSize: 10, fontWeight: typography.weightMedium },
  priceRow: { flexDirection: "row", alignItems: "flex-end", gap: 2 },
  priceVal: { color: colors.textPrimary, fontSize: 24, fontWeight: typography.weightMedium },
  priceUnit: { color: colors.textSecondary, fontSize: typography.caption, marginBottom: 4 },
  planSub: { color: colors.textTertiary, fontSize: typography.caption },
  compare: { flexDirection: "row", gap: spacing.sm },
  compareCol: { flex: 1, padding: spacing.md, borderRadius: radius.xl, backgroundColor: colors.surfaceSoft, gap: spacing.sm },
  compareColPro: { backgroundColor: colors.primaryTint },
  compareHead: { color: colors.textTertiary, fontSize: typography.caption, fontWeight: typography.weightMedium, letterSpacing: 1.2 },
  benefitRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  benefitLabel: { flex: 1, color: colors.textPrimary, fontSize: typography.caption },
  note: { flexDirection: "row", alignItems: "center", gap: 6, padding: spacing.md, backgroundColor: colors.primaryTint, borderRadius: radius.lg },
  noteText: { color: colors.textSecondary, fontSize: typography.caption, flex: 1 },
  cta: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: spacing.lg, paddingTop: spacing.md, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: colors.border },
  benefitsCard: { backgroundColor: colors.surfaceSoft, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.sm, width: "100%" },
  activeWrap: { padding: spacing.xl, alignItems: "center", gap: spacing.sm, flex: 1 },
  activeIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  activeTitle: { fontSize: 24, color: colors.textPrimary, fontWeight: typography.weightMedium },
  activeBody: { fontSize: typography.body, color: colors.textSecondary, textAlign: "center" },
});
