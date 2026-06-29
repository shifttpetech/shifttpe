import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "../theme";

export function ShiftPeLogo({ size = 32, showText = true, color }: { size?: number; showText?: boolean; color?: string }) {
  const c = color ?? colors.primary;
  return (
    <View style={styles.wrap}>
      <View style={[styles.badge, { width: size + 8, height: size + 8, borderRadius: (size + 8) / 3, backgroundColor: c }]}>
        <Text style={[styles.s, { fontSize: size * 0.75, color: "#fff" }]}>S</Text>
        <View style={[styles.clock, { right: -2, top: -2 }]}>
          <Ionicons name="time-outline" size={size * 0.4} color={color === "#fff" ? colors.primary : "#fff"} />
        </View>
      </View>
      {showText && (
        <Text style={[styles.word, { fontSize: size * 0.65 }]}>
          <Text style={{ color: color === "#fff" ? "#fff" : colors.textPrimary }}>Shift</Text>
          <Text style={{ color: color === "#fff" ? "#fff" : c }}>Pe</Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  badge: { alignItems: "center", justifyContent: "center", position: "relative" },
  s: { fontWeight: typography.weightMedium, marginTop: -2 },
  clock: {
    position: "absolute",
    backgroundColor: "transparent",
    borderRadius: radius.pill,
    padding: 1,
  },
  word: { fontWeight: typography.weightMedium, letterSpacing: -0.3 },
});
