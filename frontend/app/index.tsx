import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withSpring, withTiming } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { ShiftPeLogo } from "@/src/components/ShiftPeLogo";
import { useApp } from "@/src/store/app-store";
import { colors, typography } from "@/src/theme";

export default function Splash() {
  const router = useRouter();
  const { ready, hasSeenOnboarding, role, isAuthed } = useApp();

  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12 });
    opacity.value = withDelay(150, withTiming(1, { duration: 600 }));
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      if (!hasSeenOnboarding) router.replace("/onboarding");
      else if (!role) router.replace("/role-select");
      else if (!isAuthed) router.replace("/login");
      else if (role === "student") router.replace("/student/(tabs)/swipe");
      else router.replace("/business/(tabs)/dashboard");
    }, 1500);
    return () => clearTimeout(t);
  }, [ready, hasSeenOnboarding, role, isAuthed]);

  const logoStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: opacity.value }));

  return (
    <View style={styles.container} testID="splash-screen">
      <LinearGradient colors={[colors.primary, "#E62E47"]} style={StyleSheet.absoluteFill} />
      {/* Decorative shapes */}
      <View style={[styles.blob, { top: -80, right: -60 }]} />
      <View style={[styles.blob, { bottom: -100, left: -80, opacity: 0.15 }]} />

      <Animated.View style={[styles.center, logoStyle]}>
        <View style={styles.logoBig}>
          <Text style={styles.logoS}>S</Text>
        </View>
        <Text style={styles.brand}>ShiftPe</Text>
        <Text style={styles.tagline}>Swipe. Work. Earn.</Text>
      </Animated.View>

      <View style={styles.bottomBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  blob: { position: "absolute", width: 280, height: 280, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.08)" },
  center: { alignItems: "center", gap: 12 },
  logoBig: { width: 110, height: 110, borderRadius: 30, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  logoS: { fontSize: 70, color: "#fff", fontWeight: typography.weightMedium, marginTop: -6 },
  brand: { fontSize: 44, color: "#fff", fontWeight: typography.weightMedium, letterSpacing: -1 },
  tagline: { fontSize: 16, color: "rgba(255,255,255,0.9)", fontWeight: typography.weightRegular, marginTop: 4 },
  bottomBar: { position: "absolute", bottom: 24, width: 80, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.5)" },
});
