import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing, typography, shadows } from '@/src/theme';
import { MOCK_BUSINESS_WALLET } from '@/src/data/wallet';
import {
  MOCK_BUSINESS_TRANSACTIONS,
  getTransactionIcon,
  getTransactionColor,
} from '@/src/data/transactions';
import { getPaymentsByBusinessId } from '@/src/data/payments';

export default function BusinessWallet() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const wallet = MOCK_BUSINESS_WALLET;
  const transactions = MOCK_BUSINESS_TRANSACTIONS;
  const payments = getPaymentsByBusinessId('biz_1');

  // Calculate totals from payments
  const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Business Wallet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <LinearGradient
            colors={[colors.accentPurple, '#6B4EE6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceGradient}
          >
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Total Spent</Text>
              <View style={styles.walletIcon}>
                <Ionicons name="business" size={20} color={colors.accentPurple} />
              </View>
            </View>
            <Text style={styles.balanceAmount}>₹{totalSpent.toLocaleString()}</Text>

            {pendingAmount > 0 && (
              <View style={styles.pendingRow}>
                <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.pendingText}>
                  ₹{pendingAmount} pending payments
                </Text>
              </View>
            )}

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>₹{paidAmount.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Paid</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>₹{pendingAmount.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Info Card - No Add Money */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={colors.accentPurple} />
          <Text style={styles.infoText}>
            This is a dummy wallet for demo purposes. No real money deposits or withdrawals are available.
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="arrow-up-circle" size={24} color={colors.danger} />
            <Text style={styles.statValue}>₹{totalSpent.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people" size={24} color={colors.success} />
            <Text style={styles.statValue}>{payments.length}</Text>
            <Text style={styles.statLabel}>Payments Made</Text>
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Pressable>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        </View>

        <View style={styles.transactionsList}>
          {transactions.map((txn) => (
            <View key={txn.id} style={styles.txnCard}>
              <View
                style={[
                  styles.txnIcon,
                  { backgroundColor: `${getTransactionColor(txn.type, txn.amount)}15` },
                ]}
              >
                <Ionicons
                  name={getTransactionIcon(txn.type) as any}
                  size={20}
                  color={getTransactionColor(txn.type, txn.amount)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txnTitle}>{txn.description}</Text>
                <Text style={styles.txnMeta}>
                  {formatDate(txn.createdAt)}
                  {txn.jobTitle && ` · ${txn.jobTitle}`}
                </Text>
              </View>
              <View style={styles.txnAmountCol}>
                <Text
                  style={[
                    styles.txnAmount,
                    { color: txn.amount > 0 ? colors.success : colors.danger },
                  ]}
                >
                  {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount)}
                </Text>
                {txn.status === 'pending' && (
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingBadgeText}>Pending</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  balanceCard: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    ...shadows.card,
  },
  balanceGradient: {
    padding: spacing.xl,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    fontSize: typography.bodySm,
    color: 'rgba(255,255,255,0.9)',
  },
  walletIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: typography.weightMedium,
    color: '#fff',
    marginTop: spacing.sm,
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  pendingText: {
    fontSize: typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  actionBtnText: {
    fontSize: typography.bodySm,
    fontWeight: typography.weightMedium,
    color: '#fff',
  },
  actionDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: typography.h3,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.accentPurpleSoft,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: typography.bodySm,
    color: colors.accentPurple,
    lineHeight: 20,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.warningSoft,
    borderRadius: radius.xl,
  },
  warningTitle: {
    fontSize: typography.bodySm,
    fontWeight: typography.weightMedium,
    color: colors.warning,
  },
  warningText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  warningBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.warning,
    borderRadius: radius.pill,
  },
  warningBtnText: {
    fontSize: typography.caption,
    fontWeight: typography.weightMedium,
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  viewAll: {
    fontSize: typography.bodySm,
    color: colors.primary,
    fontWeight: typography.weightMedium,
  },
  transactionsList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  txnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  txnIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txnTitle: {
    fontSize: typography.bodySm,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  txnMeta: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  txnAmountCol: {
    alignItems: 'flex-end',
  },
  txnAmount: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
  },
  pendingBadge: {
    backgroundColor: colors.warningSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    marginTop: 4,
  },
  pendingBadgeText: {
    fontSize: 10,
    color: colors.warning,
    fontWeight: typography.weightMedium,
  },
  addMoneyContent: {
    gap: spacing.lg,
  },
  addMoneyLabel: {
    fontSize: typography.bodySm,
    fontWeight: typography.weightMedium,
    color: colors.textSecondary,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickAmountBtn: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: spacing.md,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quickAmountBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  quickAmountText: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  quickAmountTextActive: {
    color: colors.primary,
  },
  customAmount: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  customAmountLabel: {
    fontSize: typography.caption,
    color: colors.textTertiary,
  },
  customAmountInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 32,
    color: colors.textTertiary,
    marginRight: spacing.xs,
  },
  customAmountValue: {
    fontSize: 48,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  paymentMethods: {
    gap: spacing.sm,
  },
  paymentLabel: {
    fontSize: typography.bodySm,
    fontWeight: typography.weightMedium,
    color: colors.textSecondary,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentText: {
    flex: 1,
    fontSize: typography.bodySm,
    color: colors.textPrimary,
  },
});
