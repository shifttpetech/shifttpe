import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing, typography, shadows } from '@/src/theme';
import {
  MOCK_STUDENT_TRANSACTIONS,
  getTransactionIcon,
  getTransactionColor,
} from '@/src/data/transactions';
import { MOCK_STUDENT_WALLET } from '@/src/data/wallet';
import { getPaymentsByStudentId } from '@/src/data/payments';

export default function StudentWallet() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'all' | 'received' | 'pending'>('all');

  const wallet = MOCK_STUDENT_WALLET;
  const transactions = MOCK_STUDENT_TRANSACTIONS;
  const payments = getPaymentsByStudentId('st_1');

  // Calculate totals from payments
  const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);
  const receivedAmount = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter(p => p.status === 'pending' || p.status === 'business_confirmed')
    .reduce((sum, p) => sum + p.amount, 0);

  const filteredTransactions = transactions.filter((t) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'received') return t.amount > 0;
    if (activeTab === 'pending') return t.amount < 0;
    return true;
  });

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
        <Text style={styles.headerTitle}>My Wallet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <LinearGradient
            colors={[colors.primary, '#E62E47']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceGradient}
          >
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Total Earnings</Text>
              <View style={styles.walletIcon}>
                <Ionicons name="wallet" size={20} color={colors.primary} />
              </View>
            </View>
            <Text style={styles.balanceAmount}>₹{totalEarnings.toLocaleString()}</Text>
            
            {pendingAmount > 0 && (
              <View style={styles.pendingRow}>
                <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.pendingText}>
                  ₹{pendingAmount} pending
                </Text>
              </View>
            )}

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>₹{receivedAmount.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Received</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>₹{pendingAmount.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Info Card - No Withdraw */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={colors.accentPurple} />
          <Text style={styles.infoText}>
            This is a dummy wallet for demo purposes. No real withdrawals or bank transfers are available.
          </Text>
        </View>

        {/* Bank Info */}
        {wallet.bankLinked && wallet.bankDetails && (
          <View style={styles.bankCard}>
            <View style={styles.bankIcon}>
              <Ionicons name="business" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bankName}>{wallet.bankDetails.bankName}</Text>
              <Text style={styles.bankAccount}>{wallet.bankDetails.accountNumber}</Text>
            </View>
            <View style={styles.linkedBadge}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={styles.linkedText}>Linked</Text>
            </View>
          </View>
        )}

        {/* Transactions */}
        <View style={styles.transactionsHeader}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['all', 'received', 'pending'] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Transaction List */}
        <View style={styles.transactionsList}>
          {filteredTransactions.map((txn) => (
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
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    color: '#fff',
  },
  statLabel: {
    fontSize: typography.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  actionBtn: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: typography.weightMedium,
  },
  bankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bankIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankName: {
    fontSize: typography.bodySm,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  bankAccount: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  linkedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.successSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  linkedText: {
    fontSize: 10,
    color: colors.success,
    fontWeight: typography.weightMedium,
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
  transactionsHeader: {
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
  tabs: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.md,
  },
  tabActive: {
    backgroundColor: '#fff',
    ...shadows.soft,
  },
  tabText: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    fontWeight: typography.weightMedium,
  },
  tabTextActive: {
    color: colors.textPrimary,
  },
  transactionsList: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
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
});
