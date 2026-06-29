import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/src/theme';

export default function StudentTerms() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student Terms & Conditions</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
      >
        <View style={styles.content}>
          <Text style={styles.intro}>
            By using Shifttpe as a Student, you agree to the following terms:
          </Text>

          <View style={styles.section}>
            <Text style={styles.term}>1. You must provide accurate and truthful personal information.</Text>
            <Text style={styles.term}>2. You are responsible for maintaining the confidentiality of your account and OTP.</Text>
            <Text style={styles.term}>3. You agree to attend accepted shifts on time.</Text>
            <Text style={styles.term}>4. If you are unable to attend a confirmed shift, you should cancel it as early as possible through the application.</Text>
            <Text style={styles.term}>5. QR Check-In and QR Check-Out must only be completed by the assigned student at the actual work location.</Text>
            <Text style={styles.term}>6. Sharing, manipulating or attempting to misuse QR attendance is strictly prohibited.</Text>
            <Text style={styles.term}>7. Students must behave professionally and respectfully at the workplace.</Text>
            <Text style={styles.term}>8. Students must not use abusive language, harassment, discrimination or illegal activities while using the platform.</Text>
            <Text style={styles.term}>9. Any fake profile, fake attendance, fake identity or fraudulent activity may result in permanent suspension.</Text>
            <Text style={styles.term}>10. Payments are made directly by the Business. Shifttpe currently does not collect, hold or transfer payments.</Text>
            <Text style={styles.term}>11. Payment records shown inside the application are for tracking purposes only.</Text>
            <Text style={styles.term}>12. Students are responsible for confirming payment status honestly.</Text>
            <Text style={styles.term}>13. Ratings and reviews should be genuine and based on actual work experience.</Text>
            <Text style={styles.term}>14. Students are responsible for complying with all applicable laws while using the platform.</Text>
            <Text style={styles.term}>15. Shifttpe reserves the right to suspend or terminate any account that violates these Terms.</Text>
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
