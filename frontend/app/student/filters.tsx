import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/src/theme";

const DISTANCE_OPTIONS = ["1 km", "3 km", "5 km", "10 km", "20 km"];
const CATEGORY_OPTIONS = ["Retail", "Food Service", "Warehouse", "Events", "Office"];
const TIME_OPTIONS = ["Morning", "Afternoon", "Evening", "Night"];
const PAY_OPTIONS = ["₹100-200/hr", "₹200-300/hr", "₹300-500/hr", "₹500+/hr"];

export default function Filters() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedDistance, setSelectedDistance] = useState("5 km");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPay, setSelectedPay] = useState<string | null>(null);

  const onApply = () => {
    router.back();
  };

  const onReset = () => {
    setSelectedDistance("5 km");
    setSelectedCategory(null);
    setSelectedTime(null);
    setSelectedPay(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Filters</Text>
        <Pressable onPress={onReset} style={styles.resetBtn}>
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}>
        {/* Distance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distance</Text>
          <View style={styles.optionsRow}>
            {DISTANCE_OPTIONS.map((option) => (
              <Pressable
                key={option}
                onPress={() => setSelectedDistance(option)}
                style={[styles.optionChip, selectedDistance === option && styles.optionChipActive]}
              >
                <Text style={[styles.optionText, selectedDistance === option && styles.optionTextActive]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.optionsRow}>
            {CATEGORY_OPTIONS.map((option) => (
              <Pressable
                key={option}
                onPress={() => setSelectedCategory(selectedCategory === option ? null : option)}
                style={[styles.optionChip, selectedCategory === option && styles.optionChipActive]}
              >
                <Text style={[styles.optionText, selectedCategory === option && styles.optionTextActive]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time</Text>
          <View style={styles.optionsRow}>
            {TIME_OPTIONS.map((option) => (
              <Pressable
                key={option}
                onPress={() => setSelectedTime(selectedTime === option ? null : option)}
                style={[styles.optionChip, selectedTime === option && styles.optionChipActive]}
              >
                <Text style={[styles.optionText, selectedTime === option && styles.optionTextActive]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Pay */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pay Range</Text>
          <View style={styles.optionsRow}>
            {PAY_OPTIONS.map((option) => (
              <Pressable
                key={option}
                onPress={() => setSelectedPay(selectedPay === option ? null : option)}
                style={[styles.optionChip, selectedPay === option && styles.optionChipActive]}
              >
                <Text style={[styles.optionText, selectedPay === option && styles.optionTextActive]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 16 + insets.bottom }]}>
        <Pressable onPress={onApply} style={styles.applyBtn}>
          <Text style={styles.applyText}>Apply Filters</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceSoft, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: typography.weightMedium, color: colors.textPrimary },
  resetBtn: { paddingHorizontal: spacing.md },
  resetText: { fontSize: typography.body, color: colors.primary, fontWeight: typography.weightMedium },
  content: { flex: 1 },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },
  sectionTitle: { fontSize: 16, fontWeight: typography.weightMedium, color: colors.textPrimary, marginBottom: spacing.md },
  optionsRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  optionChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  optionChipActive: { backgroundColor: colors.primaryTint, borderColor: colors.primary },
  optionText: { fontSize: typography.bodySm, color: colors.textSecondary, fontWeight: typography.weightMedium },
  optionTextActive: { color: colors.primary },
  footer: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  applyBtn: { backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: radius.lg, alignItems: "center" },
  applyText: { color: "#fff", fontSize: 16, fontWeight: typography.weightMedium },
});
