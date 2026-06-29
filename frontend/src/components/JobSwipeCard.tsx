import React from "react";
import { View, Text, StyleSheet, Dimensions, Pressable, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming, runOnJS, interpolate, Extrapolate } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { colors, radius, spacing, shadows, typography } from "../theme";
import type { Job } from "../store/mock-data";

type Props = {
  job: Job;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  onDetails?: () => void;
  isTop?: boolean;
  stackIndex?: number;
  matchPct?: number;
};

export function JobSwipeCard({ job, onSwipeRight, onSwipeLeft, onDetails, isTop = true, stackIndex = 0, matchPct }: Props) {
  const { width: screenW } = useWindowDimensions();
  const CARD_W = Math.min(screenW - 32, 380);
  const SWIPE_THRESHOLD = CARD_W * 0.28;
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const rot = useSharedValue(0);

  const fly = (dir: 1 | -1) => {
    x.value = withTiming(dir * screenW * 1.2, { duration: 280 });
    rot.value = withTiming(dir * 18, { duration: 280 });
    setTimeout(() => {
      try { Haptics.impactAsync(dir === 1 ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light); } catch {}
      if (dir === 1) onSwipeRight(); else onSwipeLeft();
    }, 260);
  };

  const pan = Gesture.Pan()
    .enabled(isTop)
    .onUpdate((e) => {
      x.value = e.translationX;
      y.value = e.translationY * 0.4;
      rot.value = (e.translationX / CARD_W) * 12;
    })
    .onEnd(() => {
      if (x.value > SWIPE_THRESHOLD) {
        x.value = withTiming(screenW * 1.2, { duration: 220 });
        rot.value = withTiming(18, { duration: 220 });
        runOnJS(onSwipeRight)();
      } else if (x.value < -SWIPE_THRESHOLD) {
        x.value = withTiming(-screenW * 1.2, { duration: 220 });
        rot.value = withTiming(-18, { duration: 220 });
        runOnJS(onSwipeLeft)();
      } else {
        x.value = withSpring(0); y.value = withSpring(0); rot.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const scale = isTop ? 1 : 1 - stackIndex * 0.04;
    const ty = isTop ? y.value : stackIndex * 12;
    return {
      transform: [
        { translateX: x.value }, { translateY: ty },
        { rotate: `${rot.value}deg` }, { scale },
      ],
    };
  });

  const likeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(x.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolate.CLAMP),
  }));
  const nopeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(x.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolate.CLAMP),
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, { width: CARD_W }, cardStyle, shadows.card]}>
        <Image source={{ uri: job.cover }} style={styles.cover} contentFit="cover" transition={200} />
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.15)", "rgba(0,0,0,0.85)"]}
          style={styles.scrim}
        />

        {/* Badges */}
        <View style={styles.topRow}>
          {job.urgent && (
            <View style={styles.urgent}>
              <Ionicons name="flash" size={14} color="#fff" />
              <Text style={styles.urgentText}>Urgent</Text>
            </View>
          )}
          <View style={{ flex: 1 }} />
          <Pressable style={styles.bookmark}>
            <Feather name="bookmark" size={18} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Like / Nope overlays */}
        <Animated.View style={[styles.stamp, styles.stampLike, likeStyle]}>
          <Text style={styles.stampText}>LIKE</Text>
        </Animated.View>
        <Animated.View style={[styles.stamp, styles.stampNope, nopeStyle]}>
          <Text style={styles.stampText}>PASS</Text>
        </Animated.View>

        {/* Match pct */}
        <View style={styles.matchPill}>
          <Ionicons name="sparkles" size={12} color={colors.accentPurple} />
          <Text style={styles.matchText}>{matchPct ?? job.matchPct}% Match</Text>
        </View>

        {/* Bottom info */}
        <Pressable onPress={onDetails} style={styles.bottom}>
          <Text style={styles.title}>{job.title}</Text>
          <View style={styles.bizRow}>
            <Text style={styles.biz}>{job.business}</Text>
            {job.businessVerified && (
              <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
            )}
          </View>
          <View style={styles.locRow}>
            <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.85)" />
            <Text style={styles.locText}>{job.location} • {job.distanceKm} km</Text>
          </View>
          <View style={styles.chipsRow}>
            <View style={[styles.tag, { backgroundColor: colors.primary }]}>
              <Text style={styles.tagText}>₹{job.pay}{job.payUnit}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colors.accentPurple }]}>
              <Text style={styles.tagText}>{job.shiftType}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
              <Text style={styles.tagText}>{job.shiftDuration}</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="star" size={14} color="#FACC15" />
            <Text style={styles.metaText}>{job.rating}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{job.applied} Applied</Text>
          </View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    aspectRatio: 0.72,
    borderRadius: radius.xxl, overflow: "hidden",
    backgroundColor: "#111",
    position: "absolute",
  },
  cover: { ...StyleSheet.absoluteFillObject },
  scrim: { ...StyleSheet.absoluteFillObject },
  topRow: {
    position: "absolute", top: spacing.lg, left: spacing.lg, right: spacing.lg,
    flexDirection: "row", alignItems: "center", gap: spacing.sm,
  },
  urgent: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: 6,
    borderRadius: radius.pill,
  },
  urgentText: { color: "#fff", fontSize: typography.caption, fontWeight: typography.weightMedium },
  bookmark: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  matchPill: {
    position: "absolute", top: spacing.lg + 44, right: spacing.lg,
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#fff", paddingHorizontal: spacing.md, paddingVertical: 6,
    borderRadius: radius.pill,
  },
  matchText: { color: colors.accentPurple, fontSize: typography.caption, fontWeight: typography.weightMedium },
  bottom: { position: "absolute", left: spacing.lg, right: spacing.lg, bottom: spacing.lg, gap: 6 },
  title: { color: "#fff", fontSize: 30, fontWeight: typography.weightMedium, letterSpacing: -0.5 },
  bizRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  biz: { color: "#fff", fontSize: typography.body, fontWeight: typography.weightMedium },
  locRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  locText: { color: "rgba(255,255,255,0.9)", fontSize: typography.bodySm },
  chipsRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  tag: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill },
  tagText: { color: "#fff", fontSize: typography.caption, fontWeight: typography.weightMedium },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: spacing.sm },
  metaText: { color: "#fff", fontSize: typography.bodySm, fontWeight: typography.weightMedium },
  metaDot: { color: "rgba(255,255,255,0.5)", fontSize: typography.bodySm },
  stamp: {
    position: "absolute", top: 100, paddingVertical: 8, paddingHorizontal: 18,
    borderRadius: radius.md, borderWidth: 3,
  },
  stampLike: { right: 28, borderColor: colors.success, transform: [{ rotate: "-15deg" }] },
  stampNope: { left: 28, borderColor: colors.danger, transform: [{ rotate: "15deg" }] },
  stampText: { color: "#fff", fontSize: 28, fontWeight: typography.weightMedium },
});

export { };
