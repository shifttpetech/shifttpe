import React from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MOCK_NOTIFICATIONS } from "@/src/store/app-store";
import { colors, radius, spacing, typography } from "@/src/theme";

const ICONS: Record<string, any> = { urgent: { name: "flash", color: colors.primary, bg: colors.primaryTint }, match: { name: "heart", color: colors.danger, bg: colors.dangerSoft }, update: { name: "checkmark-circle", color: colors.success, bg: colors.successSoft }, announce: { name: "megaphone", color: colors.accentPurple, bg: colors.accentPurpleSoft } };

export default function Notifications() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}><Ionicons name="arrow-back" size={22} color={colors.textPrimary} /></Pressable>
        <Text style={styles.title}>Notifications</Text>
        <Pressable><Text style={styles.markAll}>Mark all read</Text></Pressable>
      </View>
      <FlatList
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
        data={MOCK_NOTIFICATIONS}
        keyExtractor={(n) => n.id}
        renderItem={({ item }) => {
          const ic = ICONS[item.type] || ICONS.update;
          return (
            <View style={styles.card}>
              <View style={[styles.icon, { backgroundColor: ic.bg }]}><Ionicons name={ic.name} size={20} color={ic.color} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.nTitle}>{item.title}</Text>
                <Text style={styles.body}>{item.body}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.lg },
  title: { flex: 1, color: colors.textPrimary, fontSize: 22, fontWeight: typography.weightMedium },
  markAll: { color: colors.primary, fontSize: typography.bodySm, fontWeight: typography.weightMedium },
  card: { flexDirection: "row", gap: spacing.md, backgroundColor: colors.surface, padding: spacing.md, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  nTitle: { color: colors.textPrimary, fontSize: typography.body, fontWeight: typography.weightMedium },
  body: { color: colors.textSecondary, fontSize: typography.bodySm, marginTop: 2 },
  time: { color: colors.textTertiary, fontSize: typography.caption, marginTop: 4 },
});
