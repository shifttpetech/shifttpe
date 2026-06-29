import React, { useRef, useEffect } from "react";
import { TextInput, View, StyleSheet, Pressable } from "react-native";
import { colors, radius, spacing, typography } from "../theme";

export function OTPInput({ value, onChange, length = 6, testID }: { value: string; onChange: (v: string) => void; length?: number; testID?: string }) {
  const ref = useRef<TextInput>(null);

  useEffect(() => { const t = setTimeout(() => ref.current?.focus(), 250); return () => clearTimeout(t); }, []);

  return (
    <Pressable onPress={() => ref.current?.focus()} style={styles.wrap}>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(t) => onChange(t.replace(/[^0-9]/g, "").slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        style={styles.hidden}
        testID={testID}
      />
      <View style={styles.row}>
        {Array.from({ length }).map((_, i) => {
          const ch = value[i] ?? "";
          const focused = i === value.length;
          return (
            <View key={i} style={[styles.cell, focused && styles.focused, !!ch && styles.filled]}>
              <View>
                <View style={{ minWidth: 14, alignItems: "center" }}>
                  <TextCell ch={ch} />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}

function TextCell({ ch }: { ch: string }) {
  const { Text } = require("react-native");
  return <Text style={styles.txt}>{ch}</Text>;
}

const styles = StyleSheet.create({
  wrap: { width: "100%" },
  hidden: { position: "absolute", opacity: 0, width: 1, height: 1 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: spacing.sm },
  cell: {
    width: 48, height: 56, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: "center", justifyContent: "center",
    backgroundColor: colors.surface,
  },
  focused: { borderColor: colors.primary },
  filled: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  txt: { fontSize: 22, fontWeight: typography.weightMedium, color: colors.textPrimary },
});
