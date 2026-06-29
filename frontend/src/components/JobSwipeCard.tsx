import React from "react";
import { View, Text, StyleSheet, Dimensions, Pressable, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
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
        <View style={styles.imageContainer}>
          <Image source={{ uri: job.cover }} style={styles.image} contentFit="cover" transition={200} />
          {job.urgent && (
            <View style={styles.urgentBadge}>
              <Ionicons name="flash" size={12} color="#fff" />
              <Text style={styles.urgentText}>Urgent</Text>
            </View>
          )}
          <Pressable style={styles.bookmarkBtn}>
            <Feather name="bookmark" size={16} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Like / Nope overlays */}
        <Animated.View style={[styles.stamp, styles.stampLike, likeStyle]}>
          <Text style={styles.stampText}>LIKE</Text>
        </Animated.View>
        <Animated.View style={[styles.stamp, styles.stampNope, nopeStyle]}>
          <Text style={styles.stampText}>PASS</Text>
        </Animated.View>

        {/* Match pill */}
        <View style={styles.matchPill}>
          <Ionicons name="sparkles" size={10} color={colors.accentPurple} />
          <Text style={styles.matchText}>{matchPct ?? job.matchPct}% Match</Text>
        </View>

        {/* Content section */}
        <Pressable onPress={onDetails} style={styles.content}>
          <Text style={styles.title}>{job.title}</Text>
          <View style={styles.bizRow}>
            <Text style={styles.biz}>{job.business}</Text>
            {job.businessVerified && (
              <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
            )}
          </View>
          <View style={styles.locRow}>
            <Ionicons name="location-outline" size={12} color={colors.textTertiary} />
            <Text style={styles.locText}>{job.location} • {job.distanceKm} km</Text>
          </View>
          <View style={styles.chipsRow}>
            <View style={[styles.tag, { backgroundColor: colors.primaryTint, borderColor: colors.primary }]}>
              <Text style={[styles.tagText, { color: colors.primary }]}>₹{job.pay}{job.payUnit}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colors.accentPurpleSoft, borderColor: colors.accentPurple }]}>
              <Text style={[styles.tagText, { color: colors.accentPurple }]}>{job.shiftType}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>{job.shiftDuration}</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="star" size={12} color="#FACC15" />
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
    borderRadius: radius.xxl, overflow: "hidden",
    backgroundColor: colors.surface,
    position: "absolute",
  },
  imageContainer: {
    height: 140,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  urgentBadge: {
    position: "absolute", top: spacing.md, left: spacing.md,
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: colors.primary, paddingHorizontal: spacing.sm, paddingVertical: 4,
    borderRadius: radius.pill,
  },
  urgentText: { color: "#fff", fontSize: 10, fontWeight: typography.weightMedium },
  bookmarkBtn: {
    position: "absolute", top: spacing.md, right: spacing.md,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center", justifyContent: "center",
  },
  matchPill: {
    position: "absolute", top: 120, right: spacing.md,
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#fff", paddingHorizontal: spacing.sm, paddingVertical: 4,
    borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  matchText: { color: colors.accentPurple, fontSize: 11, fontWeight: typography.weightMedium },
  content: {
    padding: spacing.md,
    gap: 6,
  },
  title: { color: colors.textPrimary, fontSize: 16, fontWeight: typography.weightMedium, letterSpacing: -0.3, lineHeight: 20 },
  bizRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  biz: { color: colors.textSecondary, fontSize: 13, fontWeight: typography.weightMedium },
  locRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  locText: { color: colors.textTertiary, fontSize: 12, lineHeight: 16 },
  chipsRow: { flexDirection: "row", gap: spacing.xs, marginTop: 2, flexWrap: "wrap" },
  tag: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.pill, borderWidth: 1 },
  tagText: { fontSize: 11, fontWeight: typography.weightMedium },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  metaText: { color: colors.textSecondary, fontSize: 12, fontWeight: typography.weightMedium },
  metaDot: { color: colors.textTertiary, fontSize: 12 },
  stamp: {
    position: "absolute", top: 80, paddingVertical: 6, paddingHorizontal: 14,
    borderRadius: radius.md, borderWidth: 2.5,
  },
  stampLike: { right: 20, borderColor: colors.success, transform: [{ rotate: "-15deg" }] },
  stampNope: { left: 20, borderColor: colors.danger, transform: [{ rotate: "15deg" }] },
  stampText: { color: "#fff", fontSize: 22, fontWeight: typography.weightMedium },
});

export { };
