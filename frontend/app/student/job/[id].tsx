import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { MapPreview } from "@/src/components/MapPreview";
import { MOCK_JOBS, useApp } from "@/src/store/app-store";
import { computeMatchPct } from "@/src/utils/match";
import { colors, radius, spacing, typography, shadows } from "@/src/theme";

export default function JobDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addShift, studentProfile } = useApp();
  const job = MOCK_JOBS.find(j => j.id === id);
  if (!job) return null;
  const matchPct = computeMatchPct(job, studentProfile);

  const apply = async () => {
    await addShift(job.id);
    router.replace({ pathname: "/student/match", params: { jobId: job.id } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <Image source={{ uri: job.cover }} style={styles.hero} contentFit="cover" />
          <LinearGradient colors={["rgba(0,0,0,0.4)", "transparent", "rgba(0,0,0,0.3)"]} style={StyleSheet.absoluteFill} />
          <SafeAreaView edges={["top"]} style={styles.heroTop}>
            <Pressable onPress={() => router.back()} style={styles.iconBtn}><Ionicons name="arrow-back" size={20} color={colors.textPrimary} /></Pressable>
            <View style={{ flex: 1 }} />
            <Pressable style={styles.iconBtn}><Ionicons name="share-outline" size={20} color={colors.textPrimary} /></Pressable>
            <Pressable style={styles.iconBtn}><Ionicons name="bookmark-outline" size={20} color={colors.textPrimary} /></Pressable>
          </SafeAreaView>
          {job.urgent && (
            <View style={styles.urgent}><Ionicons name="flash" size={12} color="#fff" /><Text style={styles.urgentText}>Urgent Hiring</Text></View>
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{job.title}</Text>
              <View style={styles.bizRow}>
                <Text style={styles.biz}>{job.business}</Text>
                {job.businessVerified && <Ionicons name="checkmark-circle" size={14} color={colors.primary} />}
              </View>
              <View style={styles.matchInline}>
                <Ionicons name="sparkles" size={12} color={colors.accentPurple} />
                <Text style={styles.matchInlineText}>{matchPct}% match for you</Text>
              </View>
            </View>
            <View style={styles.payBox}>
              <Text style={styles.payVal}>₹{job.pay}</Text>
              <Text style={styles.payUnit}>{job.payUnit}</Text>
            </View>
          </View>

          <View style={styles.chipsRow}>
            <Chip icon="location" label={`${job.distanceKm} km`} />
            <Chip icon="time" label={job.shiftDuration} />
            <Chip icon="briefcase" label={job.shiftType} />
            <Chip icon="star" label={`${job.rating}`} color="#FACC15" />
          </View>

          <Section title="About the shift">
            <Text style={styles.body2}>{job.description}</Text>
          </Section>

          <Section title="Shift timing">
            <View style={styles.timingRow}>
              <View style={styles.timingIcon}><Ionicons name="time" size={20} color={colors.primary} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.timingTitle}>{job.shiftTime}</Text>
                <Text style={styles.timingSub}>Duration: {job.shiftDuration}</Text>
              </View>
            </View>
          </Section>

          <Section title="Requirements">
            <View style={{ gap: spacing.sm }}>
              {job.requirements.map(r => (
                <View key={r} style={styles.reqRow}>
                  <View style={styles.checkBox}><Ionicons name="checkmark" size={14} color={colors.primary} /></View>
                  <Text style={styles.body2}>{r}</Text>
                </View>
              ))}
            </View>
          </Section>

          <Section title="Gallery">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
              {job.gallery.map(g => <Image key={g} source={{ uri: g }} style={styles.galleryImg} contentFit="cover" />)}
            </ScrollView>
          </Section>

          <Section title="Location">
            <MapPreview
              latitude={job.latitude}
              longitude={job.longitude}
              label={job.location}
              distanceKm={job.distanceKm}
            />
          </Section>
        </View>
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: spacing.lg + insets.bottom }]}>
        <PrimaryButton testID="apply-cta" label="I'm Interested" onPress={apply} />
      </View>
    </View>
  );
}

function Chip({ icon, label, color }: { icon: any; label: string; color?: string }) {
  return (
    <View style={styles.chip}>
      <Ionicons name={icon} size={14} color={color || colors.textSecondary} />
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}
function Section({ title, children }: any) {
  return (
    <View style={{ marginTop: spacing.lg }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const { width: W } = Dimensions.get("window");
const styles = StyleSheet.create({
  heroWrap: { height: 320, position: "relative" },
  hero: { ...StyleSheet.absoluteFillObject },
  heroTop: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.lg, gap: spacing.sm },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.95)", alignItems: "center", justifyContent: "center" },
  urgent: { position: "absolute", bottom: spacing.lg, left: spacing.lg, flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill },
  urgentText: { color: "#fff", fontSize: typography.caption, fontWeight: typography.weightMedium },
  body: { padding: spacing.lg, marginTop: -24, backgroundColor: colors.background, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  title: { fontSize: 26, color: colors.textPrimary, fontWeight: typography.weightMedium, letterSpacing: -0.3 },
  bizRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  biz: { color: colors.textSecondary, fontSize: typography.bodySm },
  payBox: { backgroundColor: colors.primaryTint, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.lg, alignItems: "center" },
  payVal: { color: colors.primary, fontSize: 22, fontWeight: typography.weightMedium },
  payUnit: { color: colors.primary, fontSize: typography.caption },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md },
  chip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: spacing.md, paddingVertical: 6, backgroundColor: colors.surfaceSoft, borderRadius: radius.pill },
  chipText: { color: colors.textPrimary, fontSize: typography.caption, fontWeight: typography.weightMedium },
  sectionTitle: { fontSize: 11, color: colors.textTertiary, fontWeight: typography.weightMedium, letterSpacing: 1.2, marginBottom: spacing.sm },
  body2: { color: colors.textSecondary, fontSize: typography.bodySm, lineHeight: 22 },
  timingRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.surfaceSoft, padding: spacing.md, borderRadius: radius.lg },
  timingIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primaryTint, alignItems: "center", justifyContent: "center" },
  timingTitle: { color: colors.textPrimary, fontSize: typography.body, fontWeight: typography.weightMedium },
  timingSub: { color: colors.textTertiary, fontSize: typography.caption, marginTop: 2 },
  reqRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  checkBox: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primaryTint, alignItems: "center", justifyContent: "center" },
  galleryImg: { width: 160, height: 110, borderRadius: radius.lg, backgroundColor: colors.surfaceSoft },
  mapBox: { height: 140, borderRadius: radius.lg, backgroundColor: colors.primaryTint, alignItems: "center", justifyContent: "center", gap: 6 },
  cta: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: colors.border },
  matchInline: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  matchInlineText: { color: colors.accentPurple, fontSize: typography.caption, fontWeight: typography.weightMedium },
});
