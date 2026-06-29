import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors, radius, spacing, typography } from "../theme";

export function Chip({ label, active, onPress, icon, testID, size = "md" }: { label: string; active?: boolean; onPress?: () => void; icon?: React.ReactNode; testID?: string; size?: "sm" | "md" | "lg" }) {
  const h = size === "sm" ? 30 : size === "lg" ? 44 : 36;
  return (
    <Pressable testID={testID} onPress={onPress} style={({ pressed }) => [
      styles.chip,
      { height: h, opacity: pressed ? 0.85 : 1 },
      active ? styles.active : styles.inactive,
    ]}>
      {icon}
      <Text style={[styles.label, { color: active ? "#fff" : colors.textPrimary, fontSize: size === "sm" ? typography.caption : typography.bodySm }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    flexShrink: 0,
    borderWidth: 1.5,
  },
  active: { backgroundColor: colors.primary, borderColor: colors.primary },
  inactive: { backgroundColor: colors.surfaceSoft, borderColor: colors.border },
  label: { fontWeight: typography.weightMedium },
});
