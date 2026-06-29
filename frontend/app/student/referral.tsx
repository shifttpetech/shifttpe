import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { Input } from "@/src/components/Input";
import { useApp } from "@/src/store/app-store";
import { colors, radius, spacing, typography, shadows } from "@/src/theme";

export default function Referral() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { studentProfile, referrals, referralEarnings, addReferral } = useApp();
  const code = "SP" + (studentProfile?.name?.replace(/\s/g, "").slice(0, 4).toUpperCase() || "USER") + "200";
  const [friendName, setFriendName] = useState("");
  const [friendPhone, setFriendPhone] = useState("");
  const [copied, setCopied] = useState(false);

  const send = async () => {
    if (!friendName || friendPhone.length < 10) return;
    await addReferral({ name: friendName, phone: friendPhone });
    setFriendName(""); setFriendPhone("");
  };
  const copy = async () => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rewardedCount = referrals.filter(r => r.rewarded).length;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}><Ionicons name="arrow-back" size={22} color={colors.textPrimary} /></Pressable>
        <Text style={styles.title}>Refer & Earn</Text>
        <View style={{ width: 22 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.xl, gap: spacing.lg }} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.giftWrap}>
              <Ionicons name="gift" size={42} color="#fff" />
            </View>
            <Text style={styles.heroTitle}>Earn ₹200 for every friend</Text>
            <Text style={styles.heroBody}>You'll both earn ₹200 when your friend completes 5 shifts on ShiftPe.</Text>
            <View style={styles.earningsCard}>
              <View style={styles.earningCol}>
                <Text style={styles.earningVal}>₹{referralEarnings}</Text>
                <Text style={styles.earningLabel}>Total Earned</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.earningCol}>
                <Text style={styles.earningVal}>{referrals.length}</Text>
                <Text style={styles.earningLabel}>Invited</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.earningCol}>
                <Text style={[styles.earningVal, { color: colors.success }]}>{rewardedCount}</Text>
                <Text style={styles.earningLabel}>Rewarded</Text>
              </View>
            </View>
          </View>

          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>YOUR REFERRAL CODE</Text>
            <View style={styles.codeRow}>
              <Text style={styles.code}>{code}</Text>
              <Pressable testID="copy-code" onPress={copy} style={styles.copyBtn}>
                <Ionicons name={copied ? "checkmark" : "copy-outline"} size={16} color="#fff" />
                <Text style={styles.copyText}>{copied ? "Copied" : "Copy"}</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Invite a friend</Text>
            <Input label="Friend's Name" value={friendName} onChangeText={setFriendName} placeholder="e.g. Aman" testID="ref-name" />
            <Input label="Phone Number" value={friendPhone} onChangeText={setFriendPhone} placeholder="10-digit mobile" keyboardType="phone-pad" maxLength={10} testID="ref-phone" />
            <PrimaryButton testID="send-referral" label="Send Invite" onPress={send} disabled={!friendName || friendPhone.length < 10} />
          </View>

          {referrals.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Your invites</Text>
              <View style={styles.list}>
                {referrals.map(r => (
                  <View key={r.id} style={styles.refRow}>
                    <View style={[styles.refAvatar, r.rewarded && { backgroundColor: colors.successSoft }]}>
                      <Ionicons name={r.rewarded ? "checkmark-circle" : "person"} size={20} color={r.rewarded ? colors.success : colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.refName}>{r.name}</Text>
                      <Text style={styles.refMeta}>{r.shiftsCompleted}/5 shifts · {r.phone}</Text>
                    </View>
                    {r.rewarded ? (
                      <Text style={styles.earned}>+₹200</Text>
                    ) : (
                      <Text style={styles.pending}>Pending</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: spacing.lg },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: typography.weightMedium },
  hero: { backgroundColor: colors.primary, borderRadius: radius.xxl, padding: spacing.xl, alignItems: "center", gap: spacing.sm, ...shadows.button },
  giftWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", marginBottom: spacing.sm },
  heroTitle: { color: "#fff", fontSize: 22, fontWeight: typography.weightMedium, textAlign: "center", letterSpacing: -0.3 },
  heroBody: { color: "rgba(255,255,255,0.9)", fontSize: typography.bodySm, textAlign: "center", lineHeight: 20 },
  earningsCard: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: radius.xl, padding: spacing.md, marginTop: spacing.sm, width: "100%", alignItems: "center" },
  earningCol: { flex: 1, alignItems: "center" },
  earningVal: { color: "#fff", fontSize: 20, fontWeight: typography.weightMedium },
  earningLabel: { color: "rgba(255,255,255,0.85)", fontSize: typography.caption, marginTop: 2 },
  divider: { width: 1, height: 28, backgroundColor: "rgba(255,255,255,0.25)" },
  codeCard: { padding: spacing.lg, backgroundColor: colors.primaryTint, borderRadius: radius.xl, gap: spacing.sm },
  codeLabel: { color: colors.primary, fontSize: typography.caption, fontWeight: typography.weightMedium, letterSpacing: 1 },
  codeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  code: { color: colors.textPrimary, fontSize: 22, fontWeight: typography.weightMedium, letterSpacing: 2 },
  copyBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.primary, borderRadius: radius.pill },
  copyText: { color: "#fff", fontSize: typography.bodySm, fontWeight: typography.weightMedium },
  section: { gap: spacing.sm },
  sectionTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: typography.weightMedium, marginBottom: spacing.sm },
  list: { backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  refRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.divider },
  refAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryTint, alignItems: "center", justifyContent: "center" },
  refName: { color: colors.textPrimary, fontSize: typography.bodySm, fontWeight: typography.weightMedium },
  refMeta: { color: colors.textSecondary, fontSize: typography.caption, marginTop: 2 },
  earned: { color: colors.success, fontSize: typography.bodySm, fontWeight: typography.weightMedium },
  pending: { color: colors.warning, fontSize: typography.caption, fontWeight: typography.weightMedium },
});
