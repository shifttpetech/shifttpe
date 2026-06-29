import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { Input } from "@/src/components/Input";
import { Chip } from "@/src/components/Chip";
import { useApp } from "@/src/store/app-store";
import { colors, radius, spacing, typography } from "@/src/theme";

const DISTANCES = [2, 5, 10, 20];
const SLOTS = ["Morning", "Afternoon", "Evening", "Night"];
const PAYS = [300, 500, 1000, 1500];
const SKILLS = ["Cash Handling", "Serving", "Barista", "Retail Sales", "Packing", "Customer Support", "Promotions", "Delivery", "Cleaning", "Event Support", "Accounting", "Tutoring"];

export default function StudentSetup() {
  const router = useRouter();
  const { updateStudent } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("Andheri West, Mumbai");
  const [dist, setDist] = useState(5);
  const [slot, setSlot] = useState("Evening");
  const [pay, setPay] = useState(500);
  const [lookingFor, setLookingFor] = useState<"Part-time" | "Full-time">("Part-time");
  const [skills, setSkills] = useState<string[]>(["Cash Handling", "Retail Sales"]);

  const toggleSkill = (s: string) => setSkills((p) => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const next = async () => {
    if (step === 0 && !name) return;
    if (step < 2) { setStep(step + 1); return; }
    await updateStudent({ name, dob, city, preferredLocation: location, maxDistance: dist, availability: slot, minPay: pay, lookingFor, skills, rating: 0, completedShifts: 0 });
    router.replace("/student/(tabs)/swipe");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => step > 0 ? setStep(step - 1) : router.back()} hitSlop={10}><Ionicons name="arrow-back" size={24} color={colors.textPrimary} /></Pressable>
          <View style={styles.progressBar}>
            {[0, 1, 2].map(i => <View key={i} style={[styles.pSeg, i <= step && styles.pSegActive]} />)}
          </View>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {step === 0 && (
            <>
              <Text style={styles.h1}>Basic Details</Text>
              <Text style={styles.sub}>Tell us a bit about yourself</Text>
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}><Ionicons name="person" size={42} color={colors.primary} /></View>
                <View style={styles.cam}><Ionicons name="camera" size={14} color="#fff" /></View>
              </View>
              <Input label="Full Name" placeholder="Enter your full name" value={name} onChangeText={setName} testID="setup-name" />
              <Input label="Date of Birth" placeholder="DD / MM / YYYY" value={dob} onChangeText={setDob} leftIcon={<Ionicons name="calendar-outline" size={18} color={colors.textTertiary} />} />
              <Input label="City" placeholder="Select your city" value={city} onChangeText={setCity} />
            </>
          )}
          {step === 1 && (
            <>
              <Text style={styles.h1}>Set Preferences</Text>
              <Text style={styles.sub}>Help us show you better matches</Text>
              <Input label="Preferred Location" value={location} onChangeText={setLocation} leftIcon={<Ionicons name="location-outline" size={18} color={colors.primary} />} />
              <Text style={styles.lbl}>Max Travel Distance</Text>
              <View style={styles.row}>{DISTANCES.map(d => <Chip key={d} label={`${d} km`} active={dist === d} onPress={() => setDist(d)} />)}</View>
              <Text style={styles.lbl}>Available For</Text>
              <View style={styles.row}>{SLOTS.map(s => <Chip key={s} label={s} active={slot === s} onPress={() => setSlot(s)} />)}</View>
              <Text style={styles.lbl}>Minimum Pay Expectation</Text>
              <View style={styles.row}>{PAYS.map(p => <Chip key={p} label={`₹${p}+`} active={pay === p} onPress={() => setPay(p)} />)}</View>
              <Text style={styles.lbl}>Looking for</Text>
              <View style={styles.row}>{(["Part-time", "Full-time"] as const).map(t => <Chip key={t} label={t} active={lookingFor === t} onPress={() => setLookingFor(t)} />)}</View>
            </>
          )}
          {step === 2 && (
            <>
              <Text style={styles.h1}>Skills (Optional)</Text>
              <Text style={styles.sub}>Add skills to get better matches</Text>
              <View style={[styles.row, { marginTop: spacing.lg }]}>{SKILLS.map(s => <Chip key={s} label={s} active={skills.includes(s)} onPress={() => toggleSkill(s)} />)}</View>
            </>
          )}
        </ScrollView>

        <View style={styles.bottom}>
          <PrimaryButton testID="setup-continue" label={step === 2 ? "Finish" : "Continue"} onPress={next} disabled={step === 0 && !name} />
          {step === 2 && <Pressable onPress={next}><Text style={styles.skip}>Skip for now</Text></Pressable>}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", padding: spacing.lg, gap: spacing.md },
  progressBar: { flex: 1, flexDirection: "row", gap: 6 },
  pSeg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border },
  pSegActive: { backgroundColor: colors.primary },
  body: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, gap: spacing.md },
  h1: { fontSize: 26, color: colors.textPrimary, fontWeight: typography.weightMedium, letterSpacing: -0.3 },
  sub: { fontSize: typography.body, color: colors.textSecondary, marginBottom: spacing.md },
  avatarWrap: { alignSelf: "center", marginBottom: spacing.md },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primaryTint, alignItems: "center", justifyContent: "center" },
  cam: { position: "absolute", bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#fff" },
  lbl: { fontSize: typography.bodySm, color: colors.textSecondary, fontWeight: typography.weightMedium, marginTop: spacing.md, marginBottom: -spacing.xs },
  row: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  bottom: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.sm, gap: spacing.sm, alignItems: "center" },
  skip: { color: colors.textSecondary, fontSize: typography.bodySm, padding: spacing.sm },
});
