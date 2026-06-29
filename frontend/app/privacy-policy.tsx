import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/src/theme';

export default function PrivacyPolicy() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
      >
        <View style={styles.content}>
          <View style={styles.updateBox}>
            <Text style={styles.updateText}>Last Updated: July 2026</Text>
          </View>

          <Text style={styles.intro}>
            Welcome to Shifttpe.
          </Text>
          <Text style={styles.intro}>
            Shifttpe is a technology platform that connects Students and Businesses for part-time, temporary, and shift-based work opportunities.
          </Text>
          <Text style={styles.intro}>
            By using Shifttpe, you agree to this Privacy Policy.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            <Text style={styles.sectionDesc}>We may collect your:</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bullet}>• Name</Text>
              <Text style={styles.bullet}>• Mobile Number</Text>
              <Text style={styles.bullet}>• Profile Photo</Text>
              <Text style={styles.bullet}>• City</Text>
              <Text style={styles.bullet}>• Skills</Text>
              <Text style={styles.bullet}>• Location (with permission)</Text>
              <Text style={styles.bullet}>• QR Attendance Records</Text>
              <Text style={styles.bullet}>• Chat Messages</Text>
              <Text style={styles.bullet}>• Notification Token</Text>
              <Text style={styles.bullet}>• Business Information</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.sectionDesc}>Your information is used to:</Text>
            <View style={styles.bulletList}>
              <Text style={styles.bullet}>• Create your account</Text>
              <Text style={styles.bullet}>• Connect Students and Businesses</Text>
              <Text style={styles.bullet}>• Show nearby opportunities</Text>
              <Text style={styles.bullet}>• Verify QR attendance</Text>
              <Text style={styles.bullet}>• Improve our services</Text>
              <Text style={styles.bullet}>• Prevent fraud</Text>
              <Text style={styles.bullet}>• Send notifications</Text>
              <Text style={styles.bullet}>• Provide customer support</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Permissions</Text>
            
            <View style={styles.permissionBox}>
              <Text style={styles.permissionTitle}>Location:</Text>
              <Text style={styles.permissionDesc}>Used to show nearby jobs and verify attendance.</Text>
            </View>
            
            <View style={styles.permissionBox}>
              <Text style={styles.permissionTitle}>Camera:</Text>
              <Text style={styles.permissionDesc}>Used only for QR Attendance and profile photo upload.</Text>
            </View>
            
            <View style={styles.permissionBox}>
              <Text style={styles.permissionTitle}>Notifications:</Text>
              <Text style={styles.permissionDesc}>Used for shift updates, chat messages, payment updates, and announcements.</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Payment</Text>
            <Text style={styles.term}>Shifttpe does not collect, hold, process or transfer user payments.</Text>
            <Text style={styles.term}>Payments are completed directly between Businesses and Students through mutually agreed methods such as Cash or UPI.</Text>
            <Text style={styles.term}>Any payment information displayed inside the app is for tracking purposes only.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Data Security</Text>
            <Text style={styles.term}>We use reasonable security measures to protect user information. However, no online platform can guarantee complete security.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Account Deletion</Text>
            <Text style={styles.term}>You may request deletion of your account by contacting:</Text>
            <View style={styles.contactRow}>
              <Ionicons name="mail" size={18} color={colors.primary} />
              <Text style={styles.contactEmail}>help.shifttpe@gmail.com</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Policy Updates</Text>
            <Text style={styles.term}>We may update this Privacy Policy at any time. Continued use of the platform means you accept the updated policy.</Text>
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Contact</Text>
            <Text style={styles.contactLabel}>Email:</Text>
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
  updateBox: {
    padding: spacing.sm,
    backgroundColor: colors.primaryTint,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
  },
  updateText: {
    fontSize: typography.caption,
    color: colors.primary,
    fontWeight: typography.weightMedium,
  },
  intro: {
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  section: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  sectionDesc: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  bulletList: {
    gap: spacing.xs,
  },
  bullet: {
    fontSize: typography.body,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  term: {
    fontSize: typography.body,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  permissionBox: {
    padding: spacing.md,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
  },
  permissionTitle: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  permissionDesc: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    lineHeight: 20,
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
    marginBottom: spacing.xs,
  },
  contactLabel: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
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
