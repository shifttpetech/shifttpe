import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Chip } from "@/src/components/Chip";
import { MOCK_SHIFTS } from "@/src/data/shifts";
import { colors, radius, spacing, typography } from "@/src/theme";

const TABS = ["Upcoming", "In Progress", "Completed", "Cancelled"] as const;

const statusMap: Record<string, string> = {
  "Upcoming": "upcoming",
  "In Progress": "in_progress",
  "Completed": "completed",
  "Cancelled": "cancelled",
};

export default function Shifts() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<typeof TABS[number]>("Upcoming");

  const filtered = MOCK_SHIFTS.filter(s => s.status === statusMap[tab]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Shifts</Text>
        <Text style={styles.sub}>Track your job applications</Text>
      </View>

      <View style={styles.chipsWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {TABS.map(t => {
            const count = MOCK_SHIFTS.filter(s => s.status === statusMap[t]).length;
            return <Chip key={t} label={`${t}${count > 0 ? ` · ${count}` : ""}`} active={tab === t} onPress={() => setTab(t)} testID={`shift-tab-${t.toLowerCase().replace(' ', '-')}`} />;
          })}
        </ScrollView>
      </View>

      <FlatList
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 64 + insets.bottom + 24, gap: spacing.md }}
        data={filtered}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => {
          // Navigate to appropriate screen based on status
          const handlePress = () => {
            if (item.status === 'upcoming') {
              router.push({ pathname: "/student/upcoming-shift", params: { id: item.id } } as any);
            } else if (item.status === 'in_progress') {
              router.push({ pathname: "/student/shift-running", params: { id: item.id } } as any);
            } else {
              router.push({ pathname: "/student/shift/[id]", params: { id: item.id } } as any);
            }
          };
          
          return (
            <Pressable onPress={handlePress} style={styles.card}>
              <View style={styles.timelineCol}>
                <View style={[styles.dot, { backgroundColor: statusColor(item.status) }]} />
                <View style={styles.line} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={styles.cardHeader}>
                  <Text style={styles.bizName}>{item.businessName}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusBg(item.status) }]}>
                    <Text style={[styles.statusText, { color: statusColor(item.status) }]}>{tab}</Text>
                  </View>
                </View>
                <Text style={styles.jobTitle}>{item.jobTitle}</Text>
                <View style={styles.metaRow}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textTertiary} />
                  <Text style={styles.meta}>{item.date} · {item.startTime}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
                  <Text style={styles.meta}>{item.duration}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Ionicons name="cash-outline" size={14} color={colors.primary} />
                  <Text style={[styles.meta, { color: colors.primary, fontWeight: typography.weightMedium }]}>₹{item.totalEarning}</Text>
                </View>
              </View>
              <View style={styles.arrowBtn}>
                <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}><Ionicons name="briefcase-outline" size={32} color={colors.textTertiary} /></View>
            <Text style={styles.emptyTitle}>No {tab.toLowerCase()} shifts</Text>
            <Text style={styles.emptyBody}>Start swiping to apply for jobs near you.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function statusColor(s: string) {
  return s === "upcoming" ? colors.warning : s === "in_progress" ? colors.primary : s === "completed" ? colors.success : colors.danger;
}
function statusBg(s: string) {
  return s === "upcoming" ? colors.warningSoft : s === "in_progress" ? colors.primaryTint : s === "completed" ? colors.successSoft : colors.dangerSoft;
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
  arrowBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surfaceSoft, alignItems: "center", justifyContent: "center", alignSelf: "center" },
});
