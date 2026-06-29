import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Switch } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/src/theme";

export default function Settings() {
  const router = useRouter();
  const [push, setPush] = React.useState(true);
  const [loc, setLoc] = React.useState(true);
  const [dark, setDark] = React.useState(false);

  const items = [
    { sec: "Preferences", rows: [
      { icon: "notifications-outline", label: "Push notifications", toggle: push, setToggle: setPush },
      { icon: "location-outline", label: "Location services", toggle: loc, setToggle: setLoc },
      { icon: "moon-outline", label: "Dark mode", toggle: dark, setToggle: setDark },
      { icon: "language-outline", label: "Language", value: "English" },
    ]},
    { sec: "Privacy", rows: [
      { icon: "lock-closed-outline", label: "Privacy policy" },
      { icon: "document-text-outline", label: "Terms of service" },
      { icon: "shield-checkmark-outline", label: "Account security" },
    ]},
    { sec: "Support", rows: [
      { icon: "help-circle-outline", label: "Help center" },
      { icon: "chatbubble-ellipses-outline", label: "Contact support" },
      { icon: "star-outline", label: "Rate ShiftPe" },
    ]},
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}><Ionicons name="arrow-back" size={22} color={colors.textPrimary} /></Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        {items.map(g => (
          <View key={g.sec} style={{ marginBottom: spacing.lg }}>
            <Text style={styles.sec}>{g.sec.toUpperCase()}</Text>
            <View style={styles.group}>
              {g.rows.map((r: any) => (
                <View key={r.label} style={styles.row}>
                  <View style={styles.icon}><Ionicons name={r.icon} size={18} color={colors.textPrimary} /></View>
                  <Text style={styles.label}>{r.label}</Text>
                  {"toggle" in r ? (
                    <Switch value={r.toggle} onValueChange={r.setToggle} trackColor={{ false: colors.border, true: colors.primary }} thumbColor="#fff" />
                  ) : r.value ? (
                    <View style={styles.valRow}><Text style={styles.val}>{r.value}</Text><Ionicons name="chevron-forward" size={16} color={colors.textTertiary} /></View>
                  ) : (
                    <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: typography.weightMedium },
  sec: { color: colors.textTertiary, fontSize: 11, fontWeight: typography.weightMedium, letterSpacing: 1.2, marginLeft: spacing.sm, marginBottom: spacing.sm },
  group: { backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.divider },
  icon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceSoft, alignItems: "center", justifyContent: "center" },
  label: { flex: 1, color: colors.textPrimary, fontSize: typography.bodySm, fontWeight: typography.weightMedium },
  valRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  val: { color: colors.textSecondary, fontSize: typography.bodySm },
});
