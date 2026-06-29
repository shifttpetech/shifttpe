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
  const CARD_H = CARD_W * 1.3;
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
      <Animated.View style={[styles.card, { width: CARD_W, height: CARD_H }, cardStyle, shadows.card]}>
        <Image source={{ uri: job.cover }} style={styles.image} contentFit="cover" transition={200} />

        {/* Dark gradient overlay */}
        <View style={styles.overlay} />

        {/* Urgent badge */}
        {job.urgent && (
          <View style={styles.urgentBadge}>
            <Ionicons name="flash" size={12} color="#fff" />
            <Text style={styles.urgentText}>Urgent</Text>
          </View>
        )}

        {/* Bookmark and Match */}
        <View style={styles.topRightContainer}>
          <Pressable style={styles.bookmarkBtn}>
            <Feather name="bookmark" size={16} color="#fff" />
          </Pressable>
          <View style={styles.matchPill}>
            <Text style={styles.matchText}>{matchPct ?? job.matchPct}% Match</Text>
          </View>
        </View>

        {/* Content overlay */}
        <Pressable onPress={onDetails} style={styles.contentOverlay}>
          <Text style={styles.title}>{job.title}</Text>

          <View style={styles.bizRow}>
            <Text style={styles.biz}>{job.business}</Text>
            {job.businessVerified && (
              <Ionicons name="checkmark-circle" size={14} color="#f40808" />
            )}
          </View>

          <View style={styles.locRow}>
            <Ionicons name="location-outline" size={16} color="#fff" />
            <Text style={styles.locText}>  {job.location}  •  {job.distanceKm} km</Text>
          </View>

          <View style={styles.chipsRow}>
            <View style={[styles.tag, styles.tagRed]}>
              <Text style={styles.tagTextRed}>₹{job.pay}{job.payUnit}</Text>
            </View>
            <View style={[styles.tag, styles.tagPurple]}>
              <Text style={styles.tagTextPurple}>{job.shiftType}</Text>
            </View>
            <View style={[styles.tag, styles.tagGrey]}>
              <Text style={styles.tagTextGrey}>{job.shiftDuration}</Text>
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
    borderRadius: radius.xl,
    overflow: "hidden",
    backgroundColor: colors.surface,
    position: "absolute",
    top: 0,
    bottom: 0,


  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  urgentBadge: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EF4444",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  urgentText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: typography.weightMedium,
  },
  topRightContainer: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    alignItems: "flex-end",
    gap: 8,
  },
  bookmarkBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  matchPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  matchText: {
    color: "#9333EA",
    fontSize: 11,
    fontWeight: typography.weightMedium,
  },
  contentOverlay: {
    position: "absolute",
    bottom: 54,
    left: spacing.md,
    right: spacing.md,
    gap: 4,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  bizRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  biz: {
    color: "#fff",
    fontSize: 14,
    fontWeight: typography.weightMedium,
  },
  locRow: {
    flexDirection: "row",
    alignItems: "center",

  },
  locText: {
    color: "#fff",
    fontSize: 12,
    lineHeight: 16,
  },
  chipsRow: {
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  tagRed: {
    backgroundColor: "#EF4444",
    borderRadius: radius.pill,
  },
  tagTextRed: {
    color: "#fff",
    fontSize: 11,
    fontWeight: typography.weightMedium,
  },
  tagPurple: {
    backgroundColor: "#ba8de3",
    borderRadius: radius.pill,
  },
  tagTextPurple: {
    color: "#fff",
    fontSize: 11,
    fontWeight: typography.weightMedium,
  },
  tagGrey: {
    backgroundColor: "rgba(255, 253, 253, 0.16)",
    borderRadius: radius.pill,
  },
  tagTextGrey: {
    color: "#fff",
    fontSize: 11,
    fontWeight: typography.weightMedium,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  metaText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: typography.weightMedium,
  },
  metaDot: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  actionButtons: {
    position: "absolute",
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xl,
  },
  actionBtn: {
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnRed: {
    backgroundColor: "#EF4444",
  },
  actionBtnPurple: {
    backgroundColor: "#9333EA",
  },
  actionBtnPink: {
    backgroundColor: "#EC4899",
  },
  stamp: {
    position: "absolute",
    top: 80,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 2.5,
  },
  stampLike: {
    right: 20,
    borderColor: colors.success,
    transform: [{ rotate: "-15deg" }],
  },
  stampNope: {
    left: 20,
    borderColor: colors.danger,
    transform: [{ rotate: "15deg" }],
  },
  stampText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: typography.weightMedium,
  },
});

export { };
