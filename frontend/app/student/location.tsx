import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/src/theme";

const POPULAR_LOCATIONS = [
  "Andheri West, Mumbai",
  "Bandra West, Mumbai",
  "Juhu, Mumbai",
  "Powai, Mumbai",
  "Malad, Mumbai",
  "Thane, Mumbai",
];

export default function Location() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Andheri West, Mumbai");

  const onApply = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Set Location</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}>
        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color={colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search location..."
              placeholderTextColor={colors.textTertiary}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <Pressable onPress={() => setSearchText("")}>
                <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Current Location */}
        <Pressable style={styles.currentLocation} onPress={() => {}}>
          <View style={styles.locationIcon}>
            <Ionicons name="navigate" size={24} color={colors.primary} />
          </View>
          <View style={styles.locationText}>
            <Text style={styles.locationTitle}>Use current location</Text>
            <Text style={styles.locationSub}>Andheri West, Mumbai</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </Pressable>

        {/* Popular Locations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Locations</Text>
          <View style={styles.locationsList}>
            {POPULAR_LOCATIONS.map((location) => (
              <Pressable
                key={location}
                onPress={() => setSelectedLocation(location)}
                style={[styles.locationItem, selectedLocation === location && styles.locationItemActive]}
              >
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={selectedLocation === location ? colors.primary : colors.textTertiary}
                />
                <Text
                  style={[
                    styles.locationName,
                    selectedLocation === location && styles.locationNameActive,
                  ]}
                >
                  {location}
                </Text>
                {selectedLocation === location && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 16 + insets.bottom }]}>
        <Pressable onPress={onApply} style={styles.applyBtn}>
          <Text style={styles.applyText}>Confirm Location</Text>
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
  content: { flex: 1 },
  searchSection: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, fontSize: typography.body, color: colors.textPrimary },
  currentLocation: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryTint,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  locationIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  locationText: { flex: 1 },
  locationTitle: { fontSize: typography.body, fontWeight: typography.weightMedium, color: colors.textPrimary },
  locationSub: { fontSize: typography.bodySm, color: colors.textSecondary, marginTop: 2 },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },
  sectionTitle: { fontSize: 16, fontWeight: typography.weightMedium, color: colors.textPrimary, marginBottom: spacing.md },
  locationsList: { gap: spacing.xs },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  locationItemActive: { backgroundColor: colors.primaryTint },
  locationName: { flex: 1, fontSize: typography.body, color: colors.textSecondary },
  locationNameActive: { color: colors.textPrimary, fontWeight: typography.weightMedium },
  footer: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  applyBtn: { backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: radius.lg, alignItems: "center" },
  applyText: { color: "#fff", fontSize: 16, fontWeight: typography.weightMedium },
});
