import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/src/theme';

export default function BusinessTerms() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Business Terms & Conditions</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
      >
        <View style={styles.content}>
          <Text style={styles.intro}>
            By using Shifttpe as a Business, you agree to the following terms:
          </Text>

          <View style={styles.section}>
            <Text style={styles.term}>1. You must provide genuine business information and accurate contact details.</Text>
            <Text style={styles.term}>2. You are responsible for posting legitimate job opportunities only.</Text>
            <Text style={styles.term}>3. Businesses must clearly mention salary, shift timing, location and job responsibilities.</Text>
            <Text style={styles.term}>4. Businesses agree to provide a safe and respectful workplace for students.</Text>
            <Text style={styles.term}>5. Businesses must generate QR Check-In and QR Check-Out only for actual completed shifts.</Text>
            <Text style={styles.term}>6. Any attempt to manipulate attendance or misuse QR verification may result in permanent suspension.</Text>
            <Text style={styles.term}>7. Businesses are responsible for making payments directly to Students through mutually agreed methods such as Cash or UPI.</Text>
            <Text style={styles.term}>8. Shifttpe currently does not collect, process, hold or transfer any user payments.</Text>
            <Text style={styles.term}>9. Payment records inside the application are for tracking purposes only.</Text>
            <Text style={styles.term}>10. Businesses agree to update payment status honestly after payment has been completed.</Text>
            <Text style={styles.term}>11. Businesses must treat all Students fairly without discrimination or harassment.</Text>
            <Text style={styles.term}>12. Fake job postings, misleading information or fraudulent activities are strictly prohibited.</Text>
            <Text style={styles.term}>13. Ratings and reviews should reflect genuine work experiences.</Text>
            <Text style={styles.term}>14. Businesses are responsible for complying with all applicable laws and labour regulations.</Text>
            <Text style={styles.term}>15. Shifttpe reserves the right to suspend or permanently remove any Business account found violating these Terms.</Text>
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>For any questions or support, contact:</Text>
            <View style={styles.contactRow}>
              <Ionicons name="mail" size={20} color={colors.primary} />
              <Text style={styles.contactEmail}>help.shifttpe@gmail.com</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.lg,
  },
  intro: {
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  section: {
    gap: spacing.md,
  },
  term: {
    fontSize: typography.body,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  contactSection: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.primaryTint,
    borderRadius: radius.xl,
  },
  contactTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  contactEmail: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: typography.weightMedium,
  },
});
