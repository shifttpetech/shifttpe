import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { Input } from "@/src/components/Input";
import { Chip } from "@/src/components/Chip";
import { useApp } from "@/src/store/app-store";
import { colors, radius, spacing, typography } from "@/src/theme";

const SHIFTS = ["Morning (8 AM - 12 PM)", "Afternoon (12 - 4 PM)", "Evening (6 PM - 10 PM)", "Night (10 PM - 2 AM)"];

export default function CreateShift() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addBusinessJob, businessProfile, businessJobs } = useApp();
  const isPro = businessProfile?.plan === "pro";
  const activeCount = businessJobs.filter(j => j.status === "active").length;
  const limitReached = !isPro && activeCount >= 2;
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Hospitality");
  const [pay, setPay] = useState("120");
  const [shift, setShift] = useState(SHIFTS[2]);
  const [openings, setOpenings] = useState(1);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const publish = async () => {
    if (!title || !pay) return;
    setError(null);
    const result = await addBusinessJob({ title, category, pay: parseInt(pay), shiftTime: shift, openings, address, description });
    if (result && "error" in result) { setError(result.error); return; }
    router.replace("/business/(tabs)/dashboard");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}><Ionicons name="arrow-back" size={22} color={colors.textPrimary} /></Pressable>
          <Text style={styles.title}>Post a Job</Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {limitReached && (
            <Pressable testID="plan-limit-banner" onPress={() => router.push("/business/subscription")} style={styles.limitBanner}>
              <Ionicons name="diamond" size={18} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.limitTitle}>Free plan limit reached</Text>
                <Text style={styles.limitBody}>Upgrade to Pro for unlimited job postings.</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </Pressable>
          )}
          <Input testID="job-title" label="Job Title" placeholder="e.g. Cafe Staff" value={title} onChangeText={setTitle} />

          <View>
            <Text style={styles.lbl}>Category</Text>
            <View style={styles.row}>
              {["Hospitality", "Retail", "Delivery", "Events", "Education", "Logistics"].map(c => <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />)}
            </View>
          </View>

          <Input label="Pay per hour (₹)" placeholder="120" keyboardType="numeric" value={pay} onChangeText={setPay} leftIcon={<Text style={{ color: colors.textTertiary, fontSize: 16 }}>₹</Text>} />

          <View>
            <Text style={styles.lbl}>Shift Time</Text>
            <View style={styles.row}>{SHIFTS.map(s => <Chip key={s} label={s} active={shift === s} onPress={() => setShift(s)} />)}</View>
          </View>

          <View>
            <Text style={styles.lbl}>Number of Openings</Text>
            <View style={styles.stepper}>
              <Pressable onPress={() => setOpenings(o => Math.max(1, o - 1))} style={styles.stepBtn}><Ionicons name="remove" size={18} color={colors.textPrimary} /></Pressable>
              <Text style={styles.stepVal}>{openings}</Text>
              <Pressable onPress={() => setOpenings(o => Math.min(20, o + 1))} style={styles.stepBtn}><Ionicons name="add" size={18} color={colors.textPrimary} /></Pressable>
            </View>
          </View>

          <Input label="Address" placeholder="Shop address" value={address} onChangeText={setAddress} leftIcon={<Ionicons name="location-outline" size={18} color={colors.primary} />} />
          <Input label="Description" placeholder="Tell candidates more about the role…" value={description} onChangeText={setDescription} multiline numberOfLines={4} style={{ height: 100, textAlignVertical: "top", paddingTop: 12 }} />
        </ScrollView>

        <View style={[styles.bottom, { paddingBottom: spacing.md + insets.bottom }]}>
          {error && <Text style={styles.err}>{error}</Text>}
          <PrimaryButton testID="publish-job" label={limitReached ? "Upgrade to Post" : "Publish Job"} onPress={limitReached ? () => router.push("/business/subscription") : publish} disabled={!limitReached && (!title || !pay)} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: spacing.lg },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: typography.weightMedium },
  lbl: { fontSize: typography.bodySm, color: colors.textSecondary, fontWeight: typography.weightMedium, marginLeft: 4, marginBottom: spacing.sm },
  row: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  stepper: { flexDirection: "row", alignItems: "center", gap: spacing.xl, alignSelf: "flex-start", backgroundColor: colors.surfaceSoft, paddingHorizontal: spacing.md, height: 56, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border },
  stepBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  stepVal: { fontSize: 18, color: colors.textPrimary, fontWeight: typography.weightMedium, minWidth: 28, textAlign: "center" },
  bottom: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.sm },
  limitBanner: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md, backgroundColor: colors.primaryTint, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.primarySoft },
  limitTitle: { color: colors.textPrimary, fontSize: typography.bodySm, fontWeight: typography.weightMedium },
  limitBody: { color: colors.textSecondary, fontSize: typography.caption, marginTop: 2 },
  err: { color: colors.danger, fontSize: typography.bodySm, textAlign: "center" },
});
