import React from "react";
import { TextInput, View, Text, StyleSheet, TextInputProps } from "react-native";
import { colors, radius, spacing, typography } from "../theme";

type Props = TextInputProps & {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  testID?: string;
};

export function Input({ label, leftIcon, rightIcon, style, testID, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.box}>
        {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
        <TextInput
          testID={testID}
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, style as any]}
          {...rest}
        />
        {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%", gap: spacing.sm },
  label: { fontSize: typography.bodySm, color: colors.textSecondary, fontWeight: typography.weightMedium, marginLeft: 4 },
  box: {
    flexDirection: "row", alignItems: "center", height: 56,
    backgroundColor: colors.surfaceSoft, borderRadius: radius.lg,
    paddingHorizontal: spacing.lg, gap: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
    overflow: "hidden",
  },
  icon: { width: 24, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  input: { flex: 1, minWidth: 0, fontSize: typography.body, color: colors.textPrimary, fontWeight: typography.weightRegular, height: "100%" },
});
