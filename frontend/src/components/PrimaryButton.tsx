import React from "react";
import { Pressable, Text, View, StyleSheet, ActivityIndicator, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { colors, radius, spacing, shadows, typography } from "../theme";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
  size?: "lg" | "md";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export function PrimaryButton({ label, onPress, variant = "primary", loading, disabled, style, testID, size = "lg", leftIcon, rightIcon }: Props) {
  const bg = variant === "primary" ? colors.primary
    : variant === "secondary" ? colors.surface
    : variant === "danger" ? colors.danger
    : "transparent";
  const fg = variant === "secondary" ? colors.textPrimary : "#fff";
  const border = variant === "secondary" ? { borderWidth: 1.5, borderColor: colors.border } : null;

  const handle = () => {
    if (disabled || loading) return;
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    onPress?.();
  };

  return (
    <Pressable
      testID={testID}
      onPress={handle}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        size === "md" && styles.md,
        { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.92 : 1 },
        variant === "primary" && shadows.button,
        border,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.row}>
          {leftIcon}
          <Text style={[styles.label, { color: fg }]}>{label}</Text>
          {rightIcon}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  md: { height: 48 },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  label: { fontSize: typography.body, fontWeight: typography.weightMedium },
});
