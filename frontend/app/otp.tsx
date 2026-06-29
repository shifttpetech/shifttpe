import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { OTPInput } from "@/src/components/OTPInput";
import { useApp } from "@/src/store/app-store";
import { colors, radius, spacing, typography } from "@/src/theme";

export default function OTP() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const { setAuthed, role, studentProfile, businessProfile, updateStudent, updateBusiness } = useApp();
  const [code, setCode] = useState("");
  const [secs, setSecs] = useState(25);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (secs <= 0) return;
    const t = setInterval(() => setSecs((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secs]);

  const verify = async () => {
    if (code.length !== 6) return;
    // Accept any 6-digit code for mock OTP
    setErr(null);
    await setAuthed(true);
    // Persist phone to whichever profile
    if (role === "student") {
      await updateStudent({ phone: `+91 ${phone ?? ""}` });
      if (!studentProfile?.name) router.replace("/student/setup");
      else router.replace("/student/(tabs)/swipe");
    } else {
      await updateBusiness({ phone: `+91 ${phone ?? ""}` });
      if (!businessProfile?.businessName) router.replace("/business/setup");
      else router.replace("/business/(tabs)/dashboard");
    }
  };

  const resend = () => { setSecs(25); setCode(""); };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text style={styles.h1}>Verify your number</Text>
        <View style={styles.subRow}>
          <Text style={styles.sub}>Enter the 6-digit code sent to</Text>
        </View>
        <Pressable style={styles.phoneRow} onPress={() => router.back()}>
          <Text style={styles.phone}>+91 {phone ?? "9876543210"}</Text>
          <Ionicons name="create-outline" size={16} color={colors.primary} />
        </Pressable>

        <View style={{ marginTop: spacing.xl }}>
          <OTPInput value={code} onChange={setCode} testID="otp-input" />
        </View>

        {err && <Text style={styles.err}>{err}</Text>}

        <View style={styles.resendRow}>
          {secs > 0 ? (
            <Text style={styles.resend}>Resend OTP in 00:{secs.toString().padStart(2, "0")}</Text>
          ) : (
            <Pressable onPress={resend}><Text style={[styles.resend, { color: colors.primary }]}>Resend OTP</Text></Pressable>
          )}
        </View>

        <Text style={styles.hint}>Use any 6-digit code (mock OTP)</Text>

        <PrimaryButton testID="otp-verify" label="Verify & Continue" onPress={verify} disabled={code.length !== 6} style={{ marginTop: spacing.xl }} />
      </View>

      <View style={styles.safeNote}>
        <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
        <Text style={styles.safeText}>Your number is safe with us. We never share it.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg },
  body: { paddingHorizontal: spacing.xl, gap: spacing.xs, flex: 1 },
  h1: { fontSize: 28, color: colors.textPrimary, fontWeight: typography.weightMedium, textAlign: "center", letterSpacing: -0.3 },
  subRow: { alignItems: "center", marginTop: spacing.sm },
  sub: { fontSize: typography.body, color: colors.textSecondary },
  phoneRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 4 },
  phone: { color: colors.primary, fontSize: typography.body, fontWeight: typography.weightMedium },
  resendRow: { alignItems: "center", marginTop: spacing.xl },
  resend: { color: colors.primary, fontSize: typography.bodySm, fontWeight: typography.weightMedium },
  hint: { textAlign: "center", color: colors.textTertiary, fontSize: typography.caption, marginTop: spacing.sm },
  err: { color: colors.danger, fontSize: typography.bodySm, textAlign: "center", marginTop: spacing.sm },
  safeNote: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.primaryTint, marginHorizontal: spacing.xl, borderRadius: radius.lg, marginBottom: spacing.lg },
  safeText: { color: colors.textSecondary, fontSize: typography.bodySm, flex: 1 },
});
