import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { useApp } from "@/src/store/app-store";
import { colors, radius, spacing, typography } from "@/src/theme";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    title: "Tinder for",
    accent: "Part-Time Jobs",
    body: "Swipe jobs, match instantly and start earning.",
    emoji: "💼",
    color: "#FFE5EA",
  },
  {
    title: "Find Flexible",
    accent: "Shifts Near You",
    body: "Discover part-time jobs near your college or home.",
    emoji: "📍",
    color: "#EFEBFF",
  },
  {
    title: "Match Instantly",
    accent: "With Employers",
    body: "Interested in a job? Like it and get matched.",
    emoji: "✨",
    color: "#FFF1F4",
  },
];

const FEATURES = [
  { icon: "heart", title: "Swipe Jobs", body: "Like jobs you want" },
  { icon: "location", title: "Get Matched", body: "Employers like you back" },
  { icon: "cash", title: "Start Earning", body: "Work & earn flexibly" },
];

export default function Onboarding() {
  const router = useRouter();
  const { setHasSeenOnboarding } = useApp();
  const ref = useRef<ScrollView>(null);
  const [idx, setIdx] = useState(0);

  const next = async () => {
    if (idx < SLIDES.length - 1) {
      ref.current?.scrollTo({ x: (idx + 1) * width, animated: true });
      setIdx(idx + 1);
    } else {
      await setHasSeenOnboarding(true);
      router.replace("/role-select");
    }
  };

  const skip = async () => {
    await setHasSeenOnboarding(true);
    router.replace("/role-select");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <View />
        <Pressable onPress={skip} testID="onboarding-skip"><Text style={styles.skip}>Skip</Text></Pressable>
      </View>

      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setIdx(Math.round(e.nativeEvent.contentOffset.x / width))}
        style={{ flex: 1 }}
      >
        {SLIDES.map((s, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            <Text style={styles.h1}>
              {s.title} {"\n"}
              <Text style={{ color: colors.primary }}>{s.accent}</Text>
            </Text>
            <Text style={styles.body}>{s.body}</Text>

            <View style={[styles.illust, { backgroundColor: s.color }]}>
              <Text style={styles.emoji}>{s.emoji}</Text>
              <View style={styles.shapesRow}>
                <View style={[styles.shape, { backgroundColor: colors.primary, opacity: 0.7 }]} />
                <View style={[styles.shape, { backgroundColor: colors.accentPurple, opacity: 0.5 }]} />
                <View style={[styles.shape, { backgroundColor: colors.secondary, opacity: 0.6 }]} />
              </View>
            </View>

            <View style={styles.dots}>
              {SLIDES.map((_, j) => (
                <View key={j} style={[styles.dot, j === i && styles.dotActive]} />
              ))}
            </View>

            <View style={styles.features}>
              {FEATURES.map((f) => (
                <View key={f.title} style={styles.feature}>
                  <View style={styles.fIcon}>
                    <Ionicons name={f.icon as any} size={18} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fTitle}>{f.title}</Text>
                    <Text style={styles.fBody}>{f.body}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton testID="onboarding-cta" label={idx < SLIDES.length - 1 ? "Next" : "Get Started"} onPress={next} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  skip: { color: colors.textSecondary, fontSize: typography.body, fontWeight: typography.weightMedium },
  slide: { paddingHorizontal: spacing.xl, gap: spacing.md },
  h1: { fontSize: 30, color: colors.textPrimary, fontWeight: typography.weightMedium, lineHeight: 38, letterSpacing: -0.5 },
  body: { fontSize: typography.body, color: colors.textSecondary, lineHeight: 22 },
  illust: { height: 240, borderRadius: radius.xxl, marginTop: spacing.lg, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  emoji: { fontSize: 96 },
  shapesRow: { position: "absolute", bottom: 20, flexDirection: "row", gap: 12 },
  shape: { width: 12, height: 12, borderRadius: 6 },
  dots: { flexDirection: "row", gap: 6, justifyContent: "center", marginTop: spacing.lg },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { width: 22, backgroundColor: colors.primary },
  features: { gap: spacing.sm, marginTop: spacing.lg },
  feature: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, backgroundColor: colors.surfaceSoft, borderRadius: radius.lg },
  fIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryTint, alignItems: "center", justifyContent: "center" },
  fTitle: { color: colors.textPrimary, fontSize: typography.bodySm, fontWeight: typography.weightMedium },
  fBody: { color: colors.textSecondary, fontSize: typography.caption, marginTop: 2 },
  bottom: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.sm },
});
