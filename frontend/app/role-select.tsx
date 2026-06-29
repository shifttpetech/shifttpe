import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ShiftPeLogo } from "@/src/components/ShiftPeLogo";
import { useApp } from "@/src/store/app-store";
import { colors, radius, spacing, typography, shadows } from "@/src/theme";

export default function RoleSelect() {
  const router = useRouter();
  const { setRole } = useApp();

  const choose = async (r: "student" | "business") => {
    await setRole(r);
    router.push("/login");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}><ShiftPeLogo size={28} /></View>

        <Text style={styles.h1}>Choose your role</Text>
        <Text style={styles.sub}>Select how you want to continue on ShiftPe</Text>

        <Pressable testID="role-student" onPress={() => choose("student")} style={({ pressed }) => [styles.card, { backgroundColor: colors.primaryTint, opacity: pressed ? 0.9 : 1 }]}>
          <View style={styles.iconWrap}>
            <Ionicons name="school" size={26} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>I'm a Student</Text>
            <Text style={styles.cardBody}>Find part-time jobs near you</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.primary} />
        </Pressable>

        <Pressable testID="role-business" onPress={() => choose("business")} style={({ pressed }) => [styles.card, { backgroundColor: colors.surfaceSoft, opacity: pressed ? 0.9 : 1 }]}>
          <View style={[styles.iconWrap, { backgroundColor: colors.accentPurpleSoft }]}>
            <Ionicons name="storefront" size={26} color={colors.accentPurple} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>I'm a Business</Text>
            <Text style={styles.cardBody}>Hire trusted talent in minutes</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.accentPurple} />
        </Pressable>

        <View style={styles.info}>
          <Ionicons name="swap-horizontal" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>You can switch roles anytime in settings.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl, gap: spacing.md, flexGrow: 1 },
  header: { marginBottom: spacing.lg },
  h1: { fontSize: 28, color: colors.textPrimary, fontWeight: typography.weightMedium, letterSpacing: -0.5 },
  sub: { fontSize: typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  card: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg, borderRadius: radius.xl, ...shadows.soft },
  iconWrap: { width: 56, height: 56, borderRadius: radius.lg, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  cardTitle: { fontSize: 20, color: colors.textPrimary, fontWeight: typography.weightMedium },
  cardBody: { fontSize: typography.bodySm, color: colors.textSecondary, marginTop: 2 },
  info: { marginTop: "auto", flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.surfaceSoft },
  infoText: { color: colors.textSecondary, fontSize: typography.bodySm, flex: 1 },
});
