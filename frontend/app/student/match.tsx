import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, withTiming } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { Confetti } from "@/src/components/Confetti";
import { MOCK_JOBS } from "@/src/store/app-store";
import { colors, radius, spacing, typography } from "@/src/theme";

export default function Match() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const router = useRouter();
  const job = MOCK_JOBS.find(j => j.id === jobId) || MOCK_JOBS[0];
  const [showConfetti, setShowConfetti] = useState(true);

  const s = useSharedValue(0.2);
  const o = useSharedValue(0);

  useEffect(() => {
    s.value = withSpring(1, { damping: 8 });
    o.value = withDelay(200, withTiming(1, { duration: 500 }));
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }], opacity: o.value }));

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={[colors.primary, "#E62E47", colors.primaryDark]} style={StyleSheet.absoluteFill} />
      <Confetti active={showConfetti} count={80} onComplete={() => setShowConfetti(false)} />
      {[...Array(8)].map((_, i) => (
        <View key={i} style={[styles.spark, { top: 80 + (i * 70) % 600, left: (i * 80) % 300, opacity: 0.2 }]} />
      ))}
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View style={styles.body}>
          <Animated.View style={[styles.center, style]}>
            <Text style={styles.itsAMatch}>It's a Match!</Text>
            <Text style={styles.sub}>{job.business} is interested in you</Text>

            <View style={styles.avatars}>
              <View style={[styles.avatar, { transform: [{ rotate: "-8deg" }] }]}>
                <View style={styles.avatarInner}><Ionicons name="person" size={40} color={colors.primary} /></View>
              </View>
              <View style={styles.heartBubble}><Ionicons name="heart" size={28} color="#fff" /></View>
              <View style={[styles.avatar, { transform: [{ rotate: "8deg" }] }]}>
                <Image source={{ uri: job.cover }} style={styles.avatarInner} contentFit="cover" />
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobBiz}>{job.business} · ₹{job.pay}{job.payUnit}</Text>
            </View>
          </Animated.View>
        </View>

        <View style={styles.bottom}>
          <PrimaryButton testID="match-chat" label="Send a Message" variant="secondary" onPress={() => router.replace({ pathname: "/student/chat/[id]", params: { id: "c1" } })} />
          <Pressable onPress={() => router.replace("/student/(tabs)/swipe")} style={styles.keepBtn}>
            <Text style={styles.keepText}>Keep Swiping</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  spark: { position: "absolute", width: 8, height: 8, borderRadius: 4, backgroundColor: "#fff" },
  body: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl },
  center: { alignItems: "center", gap: spacing.md },
  itsAMatch: { color: "#fff", fontSize: 40, fontWeight: typography.weightMedium, letterSpacing: -1 },
  sub: { color: "rgba(255,255,255,0.9)", fontSize: typography.body },
  avatars: { flexDirection: "row", alignItems: "center", marginTop: spacing.xl, gap: spacing.md },
  avatar: { width: 110, height: 140, borderRadius: 24, backgroundColor: "#fff", padding: 6, ...{ shadowColor: "#000", shadowOpacity: 0.2, shadowOffset: { width: 0, height: 8 }, shadowRadius: 16 } },
  avatarInner: { flex: 1, borderRadius: 18, backgroundColor: colors.primaryTint, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  heartBubble: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", borderWidth: 4, borderColor: "#fff" },
  card: { marginTop: spacing.xl, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: radius.xl, padding: spacing.lg, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.25)" },
  jobTitle: { color: "#fff", fontSize: 20, fontWeight: typography.weightMedium },
  jobBiz: { color: "rgba(255,255,255,0.85)", fontSize: typography.bodySm, marginTop: 4 },
  bottom: { padding: spacing.xl, gap: spacing.md },
  keepBtn: { alignItems: "center", padding: spacing.md },
  keepText: { color: "#fff", fontSize: typography.body, fontWeight: typography.weightMedium },
});
