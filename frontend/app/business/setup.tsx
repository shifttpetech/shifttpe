import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { Input } from "@/src/components/Input";
import { useApp } from "@/src/store/app-store";
import { colors, radius, spacing, typography } from "@/src/theme";

export default function BusinessSetup() {
  const router = useRouter();
  const { updateBusiness } = useApp();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [owner, setOwner] = useState("");

  const save = async () => {
    if (!name) return;
    await updateBusiness({ businessName: name, category: type, city, area, ownerName: owner });
    router.replace("/business/(tabs)/dashboard");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}><Ionicons name="arrow-back" size={24} color={colors.textPrimary} /></Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <Text style={styles.h1}>Tell us about your business</Text>
          <Text style={styles.sub}>We'll personalize your hiring experience</Text>

          <View style={styles.logoWrap}>
            <View style={styles.logo}><Ionicons name="storefront" size={36} color={colors.accentPurple} /></View>
            <View style={styles.cam}><Ionicons name="camera" size={14} color="#fff" /></View>
          </View>

          <Input label="Business Name" placeholder="Enter business name" value={name} onChangeText={setName} testID="setup-name" />
          <Input label="Business Type" placeholder="Cafe / Restaurant / Retail" value={type} onChangeText={setType} />
          <Input label="Owner Name" placeholder="Your name" value={owner} onChangeText={setOwner} />
          <Input label="City" placeholder="Select city" value={city} onChangeText={setCity} />
          <Input label="Area / Location" placeholder="Select area" value={area} onChangeText={setArea} leftIcon={<Ionicons name="location-outline" size={18} color={colors.primary} />} />
        </ScrollView>

        <View style={styles.bottom}>
          <PrimaryButton testID="setup-continue" label="Continue" onPress={save} disabled={!name} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg },
  body: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, gap: spacing.md },
  h1: { fontSize: 26, color: colors.textPrimary, fontWeight: typography.weightMedium, letterSpacing: -0.3, textAlign: "center" },
  sub: { fontSize: typography.body, color: colors.textSecondary, textAlign: "center", marginBottom: spacing.md },
  logoWrap: { alignSelf: "center", marginBottom: spacing.md },
  logo: { width: 100, height: 100, borderRadius: 24, backgroundColor: colors.accentPurpleSoft, alignItems: "center", justifyContent: "center" },
  cam: { position: "absolute", bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.accentPurple, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#fff" },
  bottom: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.sm },
});
