import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Chip } from "@/src/components/Chip";
import { MOCK_JOBS, useApp } from "@/src/store/app-store";
import { colors, radius, spacing, typography } from "@/src/theme";

const TABS = ["Applied", "Accepted", "Completed", "Cancelled"] as const;

export default function Shifts() {
  const { myShifts } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<typeof TABS[number]>("Applied");

  const filtered = myShifts.filter(s => s.status === tab.toLowerCase());

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Shifts</Text>
        <Text style={styles.sub}>Track your job applications</Text>
      </View>

      <View style={styles.chipsWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {TABS.map(t => {
            const count = myShifts.filter(s => s.status === t.toLowerCase()).length;
            return <Chip key={t} label={`${t}${count > 0 ? ` · ${count}` : ""}`} active={tab === t} onPress={() => setTab(t)} testID={`shift-tab-${t.toLowerCase()}`} />;
          })}
        </ScrollView>
      </View>

      <FlatList
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 64 + insets.bottom + 24, gap: spacing.md }}
        data={filtered}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => {
          const job = MOCK_JOBS.find(j => j.id === item.jobId);
          if (!job) return null;
          return (
            <Pressable onPress={() => router.push({ pathname: "/student/job/[id]", params: { id: job.id } })} style={styles.card}>
              <View style={styles.timelineCol}>
                <View style={[styles.dot, { backgroundColor: statusColor(item.status) }]} />
                <View style={styles.line} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={styles.cardHeader}>
                  <Text style={styles.bizName}>{job.business}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusBg(item.status) }]}>
                    <Text style={[styles.statusText, { color: statusColor(item.status) }]}>{tab}</Text>
                  </View>
                </View>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <View style={styles.metaRow}>
                  <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
                  <Text style={styles.meta}>{job.shiftTime}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Ionicons name="cash-outline" size={14} color={colors.primary} />
                  <Text style={[styles.meta, { color: colors.primary, fontWeight: typography.weightMedium }]}>₹{job.pay}{job.payUnit}</Text>
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}><Ionicons name="briefcase-outline" size={32} color={colors.textTertiary} /></View>
            <Text style={styles.emptyTitle}>No {tab.toLowerCase()} shifts yet</Text>
            <Text style={styles.emptyBody}>Start swiping to apply for jobs near you.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function statusColor(s: string) {
  return s === "applied" ? colors.warning : s === "accepted" ? colors.primary : s === "completed" ? colors.success : colors.danger;
}
function statusBg(s: string) {
  return s === "applied" ? colors.warningSoft : s === "accepted" ? colors.primaryTint : s === "completed" ? colors.successSoft : colors.dangerSoft;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, paddingBottom: spacing.sm },
  title: { fontSize: 28, color: colors.textPrimary, fontWeight: typography.weightMedium, letterSpacing: -0.3 },
  sub: { color: colors.textSecondary, fontSize: typography.bodySm },
  chipsWrap: { height: 56 },
  chipsRow: { paddingHorizontal: spacing.lg, gap: spacing.sm, alignItems: "center" },
  card: { flexDirection: "row", gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  timelineCol: { alignItems: "center" },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  line: { width: 2, flex: 1, backgroundColor: colors.border, marginTop: 4 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  bizName: { fontSize: typography.bodySm, color: colors.textSecondary, fontWeight: typography.weightMedium },
  statusBadge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.pill },
  statusText: { fontSize: 10, fontWeight: typography.weightMedium, letterSpacing: 0.5 },
  jobTitle: { fontSize: 18, color: colors.textPrimary, fontWeight: typography.weightMedium },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  meta: { color: colors.textSecondary, fontSize: typography.bodySm },
  empty: { alignItems: "center", padding: spacing.xxl, gap: spacing.sm },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.surfaceSoft, alignItems: "center", justifyContent: "center" },
  emptyTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: typography.weightMedium },
  emptyBody: { color: colors.textSecondary, fontSize: typography.bodySm, textAlign: "center" },
});
