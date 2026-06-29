import React from "react";
import { View, Text, StyleSheet, Pressable, Platform, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "../theme";

type Props = {
  latitude: number;
  longitude: number;
  label: string;
  distanceKm?: number;
  height?: number;
};

export function MapPreview({ latitude, longitude, label, distanceKm, height = 180 }: Props) {
  const openInMaps = () => {
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(label)}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${encodeURIComponent(label)})`,
      default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });
    Linking.openURL(url!).catch(() => {});
  };

  // Native: real MapView. Web: styled preview that opens Google Maps.
  if (Platform.OS !== "web") {
    let MapView: any = null;
    let Marker: any = null;
    try {
      const Maps = require("react-native-maps");
      MapView = Maps.default;
      Marker = Maps.Marker;
    } catch {
      MapView = null;
    }

    if (MapView) {
      return (
        <Pressable onPress={openInMaps} style={[styles.wrap, { height }]}>
          <MapView
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
            initialRegion={{ latitude, longitude, latitudeDelta: 0.012, longitudeDelta: 0.012 }}
            liteMode
          >
            <Marker coordinate={{ latitude, longitude }} title={label} />
          </MapView>
          <View style={styles.openBtn}>
            <Ionicons name="navigate" size={14} color="#fff" />
            <Text style={styles.openBtnText}>Open in Maps</Text>
          </View>
        </Pressable>
      );
    }
  }

  // Web (and native fallback) — a stylized map preview with a real link.
  return (
    <Pressable onPress={openInMaps} style={[styles.wrap, { height, backgroundColor: colors.primaryTint }]}>
      <View style={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={[styles.row, { top: i * 36 }]} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={`c-${i}`} style={[styles.col, { left: i * 56 }]} />
        ))}
      </View>
      <View style={styles.pinWrap}>
        <View style={styles.pinPulse} />
        <View style={styles.pin}><Ionicons name="location" size={20} color="#fff" /></View>
      </View>
      <View style={styles.label}>
        <Text style={styles.labelText} numberOfLines={1}>{label}</Text>
        {distanceKm !== undefined && <Text style={styles.dist}>{distanceKm} km away</Text>}
      </View>
      <View style={styles.openBtn}>
        <Ionicons name="navigate" size={14} color="#fff" />
        <Text style={styles.openBtnText}>Open in Maps</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%", borderRadius: radius.lg, overflow: "hidden", borderWidth: 1, borderColor: colors.border, position: "relative" },
  grid: { ...StyleSheet.absoluteFillObject },
  row: { position: "absolute", left: 0, right: 0, height: 1, backgroundColor: "rgba(255,61,87,0.12)" },
  col: { position: "absolute", top: 0, bottom: 0, width: 1, backgroundColor: "rgba(255,61,87,0.08)" },
  pinWrap: { position: "absolute", top: "40%", left: "50%", marginLeft: -18, marginTop: -18, alignItems: "center", justifyContent: "center" },
  pinPulse: { position: "absolute", width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, opacity: 0.18 },
  pin: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#fff" },
  label: { position: "absolute", left: spacing.md, right: spacing.md, bottom: spacing.md, backgroundColor: "rgba(255,255,255,0.95)", borderRadius: radius.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  labelText: { color: colors.textPrimary, fontSize: typography.bodySm, fontWeight: typography.weightMedium },
  dist: { color: colors.textSecondary, fontSize: typography.caption, marginTop: 2 },
  openBtn: { position: "absolute", top: spacing.sm, right: spacing.sm, flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.primary, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.pill },
  openBtnText: { color: "#fff", fontSize: typography.caption, fontWeight: typography.weightMedium },
});
