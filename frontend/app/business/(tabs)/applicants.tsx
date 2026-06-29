import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Chip } from "@/src/components/Chip";
import { MOCK_APPLICANTS, useApp } from "@/src/store/app-store";
import { colors, radius, spacing, typography } from "@/src/theme";

export default function Applicants() {
  const { businessJobs } = useApp();
  const insets = useSafeAreaInsets();
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [statuses, setStatuses] = useState<Record<string, "pending" | "accepted" | "rejected">>({});

  const data = MOCK_APPLICANTS.filter(a => jobFilter === "all" || a.jobId === jobFilter);

  const setStatus = (id: string, s: "accepted" | "rejected") => setStatuses(p => ({ ...p, [id]: s }));

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Applicants</Text>
        <Text style={styles.sub}>Review and respond to your job applicants</Text>
      </View>

      <View style={styles.chipsWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          <Chip label="All" active={jobFilter === "all"} onPress={() => setJobFilter("all")} />
          {businessJobs.map(j => <Chip key={j.id} label={j.title} active={jobFilter === j.id} onPress={() => setJobFilter(j.id)} />)}
        </ScrollView>
      </View>

      <FlatList
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 64 + insets.bottom + 24, gap: spacing.sm }}
        data={data}
        keyExtractor={(a) => a.id}
        renderItem={({ item }) => {
          const s = statuses[item.id] || "pending";
          return (
            <View style={styles.card}>
              <View style={styles.avatar}><Ionicons name="person" size={22} color={colors.primary} /></View>
              <View style={{ flex: 1 }}>
                <View style={styles.row}>
                  <Text style={styles.name}>{item.name}</Text>
                  <View style={styles.starRow}><Ionicons name="star" size={12} color="#FACC15" /><Text style={styles.star}>{item.rating}</Text></View>
                </View>
                <View style={styles.meta}>
                  <Ionicons name="location-outline" size={12} color={colors.textTertiary} />
                  <Text style={styles.metaText}>{item.distanceKm} km</Text>
                  <Text style={styles.dot}>·</Text>
                  <Ionicons name="checkmark-circle-outline" size={12} color={colors.success} />
                  <Text style={styles.metaText}>{item.completed} shifts</Text>
                </View>
                <View style={styles.skillsRow}>{item.skills.map(k => <View key={k} style={styles.skill}><Text style={styles.skillText}>{k}</Text></View>)}</View>
                <View style={styles.actions}>
                  {s === "pending" ? (
                    <>
                      <Pressable testID={`reject-${item.id}`} onPress={() => setStatus(item.id, "rejected")} style={[styles.btn, styles.reject]}>
                        <Ionicons name="close" size={16} color={colors.danger} />
                        <Text style={[styles.btnText, { color: colors.danger }]}>Reject</Text>
                      </Pressable>
                      <Pressable testID={`accept-${item.id}`} onPress={() => setStatus(item.id, "accepted")} style={[styles.btn, styles.accept]}>
                        <Ionicons name="checkmark" size={16} color="#fff" />
                        <Text style={[styles.btnText, { color: "#fff" }]}>Accept</Text>
                      </Pressable>
                    </>
                  ) : (
                    <View style={[styles.btn, { backgroundColor: s === "accepted" ? colors.successSoft : colors.dangerSoft, flex: 1 }]}>
                      <Ionicons name={s === "accepted" ? "checkmark-circle" : "close-circle"} size={16} color={s === "accepted" ? colors.success : colors.danger} />
                      <Text style={[styles.btnText, { color: s === "accepted" ? colors.success : colors.danger }]}>{s === "accepted" ? "Accepted" : "Rejected"}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No applicants yet</Text>
            <Text style={styles.sub}>New applicants will appear here as they apply.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, paddingBottom: spacing.sm },
  title: { fontSize: 28, color: colors.textPrimary, fontWeight: typography.weightMedium, letterSpacing: -0.3 },
  sub: { color: colors.textSecondary, fontSize: typography.bodySm },
  chipsWrap: { height: 56 },
  chipsRow: { paddingHorizontal: spacing.lg, gap: spacing.sm, alignItems: "center" },
  card: { flexDirection: "row", gap: spacing.md, padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primaryTint, alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { color: colors.textPrimary, fontSize: typography.body, fontWeight: typography.weightMedium },
  starRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  star: { color: colors.textPrimary, fontSize: typography.caption, fontWeight: typography.weightMedium },
  meta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  metaText: { color: colors.textSecondary, fontSize: typography.caption },
  dot: { color: colors.textTertiary },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: spacing.sm },
  skill: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.pill, backgroundColor: colors.surfaceSoft },
  skillText: { color: colors.textSecondary, fontSize: 10, fontWeight: typography.weightMedium },
  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  btn: { flex: 1, height: 38, borderRadius: radius.pill, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4 },
  reject: { backgroundColor: colors.dangerSoft },
  accept: { backgroundColor: colors.primary },
  btnText: { fontSize: typography.caption, fontWeight: typography.weightMedium },
  empty: { alignItems: "center", padding: spacing.xxl, gap: spacing.sm },
  emptyTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: typography.weightMedium },
});
