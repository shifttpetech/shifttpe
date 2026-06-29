import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radius, spacing, typography } from "../theme";

interface GetStartedCardProps {
  onPress: () => void;
}

const GetStartedCard: React.FC<GetStartedCardProps> = ({ onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <LinearGradient
        colors={[colors.primary, colors.accentPurple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="rocket" size={32} color="#fff" />
          </View>
          <Text style={styles.title}>Get Started</Text>
          <Text style={styles.description}>
            Complete your profile to start matching with perfect gigs
          </Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.progressText}>60% Complete</Text>
          </View>
          <View style={styles.steps}>
            <View style={styles.step}>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.stepText}>Basic Info</Text>
            </View>
            <View style={styles.step}>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.stepText}>Skills</Text>
            </View>
            <View style={styles.step}>
              <Ionicons name="ellipse-outline" size={20} color="rgba(255,255,255,0.5)" />
              <Text style={[styles.stepText, styles.stepTextPending]}>Verification</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    overflow: "hidden",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  gradient: {
    padding: spacing.lg,
  },
  content: {
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  progressContainer: {
    width: "100%",
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: spacing.xs,
  },
  progressFill: {
    width: "60%",
    height: "100%",
    backgroundColor: "#fff",
  },
  progressText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    textAlign: "right",
  },
  steps: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: spacing.sm,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stepText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: typography.weightMedium,
  },
  stepTextPending: {
    color: "rgba(255,255,255,0.6)",
  },
});

export default GetStartedCard;
