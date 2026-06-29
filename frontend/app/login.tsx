import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { Input } from "@/src/components/Input";
import { colors, radius, spacing, typography } from "@/src/theme";

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  const cont = () => {
    if (phone.replace(/\D/g, "").length < 10) return;
    router.push({ pathname: "/otp", params: { phone } });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </Pressable>
        </View>

        <View style={styles.body}>
          <Text style={styles.h1}>Welcome back!</Text>
          <Text style={styles.sub}>Login or Sign up to continue</Text>

          <View style={styles.phoneRow}>
            <View style={styles.cc}>
              <Text style={styles.ccText}>+91</Text>
              <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
            </View>
            <View style={styles.phoneInput}>
              <Input
                testID="phone-input"
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={10}
              />
            </View>
          </View>

          <PrimaryButton testID="login-continue" label="Continue" onPress={cont} disabled={phone.replace(/\D/g, "").length < 10} style={{ marginTop: spacing.lg }} />

          <View style={styles.divider}><View style={styles.line} /><Text style={styles.divText}>or continue with</Text><View style={styles.line} /></View>

          <Pressable style={styles.social} onPress={cont}>
            <Ionicons name="logo-google" size={20} color="#EA4335" />
            <Text style={styles.socialText}>Continue with Google</Text>
          </Pressable>
          <Pressable style={styles.social} onPress={cont}>
            <Ionicons name="logo-apple" size={20} color={colors.textPrimary} />
            <Text style={styles.socialText}>Continue with Apple</Text>
          </Pressable>
        </View>

        <Text style={styles.terms}>
          By continuing, you agree to our {"\n"}
          <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg },
  body: { paddingHorizontal: spacing.xl, gap: spacing.sm },
  h1: { fontSize: 30, color: colors.textPrimary, fontWeight: typography.weightMedium, letterSpacing: -0.5 },
  sub: { fontSize: typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  phoneRow: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-end" },
  phoneInput: { flex: 1, minWidth: 0 },
  cc: { height: 56, flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md, backgroundColor: colors.surfaceSoft, borderRadius: radius.lg, gap: 4, borderWidth: 1, borderColor: colors.border, flexShrink: 0 },
  ccText: { color: colors.textPrimary, fontSize: typography.body, fontWeight: typography.weightMedium },
  divider: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginVertical: spacing.lg },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  divText: { color: colors.textTertiary, fontSize: typography.bodySm },
  social: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm, height: 52, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.border, marginBottom: spacing.sm },
  socialText: { fontSize: typography.body, color: colors.textPrimary, fontWeight: typography.weightMedium },
  terms: { textAlign: "center", color: colors.textTertiary, fontSize: typography.bodySm, marginBottom: spacing.lg, paddingHorizontal: spacing.xl },
  link: { color: colors.primary, fontWeight: typography.weightMedium },
});
