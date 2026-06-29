// Mock Transactions Data
export type TransactionType = 
  | 'shift_payment'
  | 'withdrawal'
  | 'deposit'
  | 'referral_bonus'
  | 'platform_fee'
  | 'refund'
  | 'tip';

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export type Transaction = {
  id: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description: string;
  reference?: string;
  jobId?: string;
  jobTitle?: string;
  businessName?: string;
  createdAt: string;
};

export const MOCK_STUDENT_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_1',
    walletId: 'wal_st_1',
    type: 'shift_payment',
    amount: 500,
    status: 'completed',
    description: 'Shift Payment',
    jobId: 'j1',
    jobTitle: 'Cafe Staff',
    businessName: 'Cafe Coffee Day',
    createdAt: '2024-06-29T18:30:00Z',
  },
  {
    id: 'txn_2',
    walletId: 'wal_st_1',
    type: 'withdrawal',
    amount: -1000,
    status: 'completed',
    description: 'Withdrawal to HDFC ****4521',
    reference: 'WD2024062901',
    createdAt: '2024-06-28T14:00:00Z',
  },
  {
    id: 'txn_3',
    walletId: 'wal_st_1',
    type: 'shift_payment',
    amount: 480,
    status: 'pending',
    description: 'Shift Payment (Processing)',
    jobId: 'j3',
    jobTitle: 'Retail Sales Associate',
    businessName: 'Urban Closet',
    createdAt: '2024-06-28T10:00:00Z',
  },
  {
    id: 'txn_4',
    walletId: 'wal_st_1',
    type: 'referral_bonus',
    amount: 200,
    status: 'completed',
    description: 'Referral Bonus - Aanya completed 5 shifts',
    createdAt: '2024-06-27T12:00:00Z',
  },
  {
    id: 'txn_5',
    walletId: 'wal_st_1',
    type: 'tip',
    amount: 50,
    status: 'completed',
    description: 'Tip from Cafe Coffee Day',
    jobId: 'j1',
    businessName: 'Cafe Coffee Day',
    createdAt: '2024-06-26T20:00:00Z',
  },
  {
    id: 'txn_6',
    walletId: 'wal_st_1',
    type: 'shift_payment',
    amount: 600,
    status: 'completed',
    description: 'Shift Payment',
    jobId: 'j4',
    jobTitle: 'Event Promoter',
    businessName: 'FestPro Events',
    createdAt: '2024-06-25T22:00:00Z',
  },
  {
    id: 'txn_7',
    walletId: 'wal_st_1',
    type: 'withdrawal',
    amount: -2000,
    status: 'completed',
    description: 'Withdrawal to UPI rohit@upi',
    reference: 'WD2024062501',
    createdAt: '2024-06-25T10:00:00Z',
  },
];

export const MOCK_BUSINESS_TRANSACTIONS: Transaction[] = [
  {
    id: 'btxn_1',
    walletId: 'wal_biz_1',
    type: 'deposit',
    amount: 5000,
    status: 'completed',
    description: 'Wallet Top-up',
    reference: 'DEP2024062901',
    createdAt: '2024-06-29T10:00:00Z',
  },
  {
    id: 'btxn_2',
    walletId: 'wal_biz_1',
    type: 'shift_payment',
    amount: -500,
    status: 'completed',
    description: 'Payment to Rohit Sharma',
    jobId: 'j1',
    jobTitle: 'Cafe Staff',
    createdAt: '2024-06-29T18:30:00Z',
  },
  {
    id: 'btxn_3',
    walletId: 'wal_biz_1',
    type: 'platform_fee',
    amount: -50,
    status: 'completed',
    description: 'Platform Fee (10%)',
    jobId: 'j1',
    createdAt: '2024-06-29T18:30:00Z',
  },
  {
    id: 'btxn_4',
    walletId: 'wal_biz_1',
    type: 'shift_payment',
    amount: -480,
    status: 'pending',
    description: 'Payment to Aanya Patel (Processing)',
    jobId: 'j3',
    jobTitle: 'Retail Sales Associate',
    createdAt: '2024-06-28T17:00:00Z',
  },
  {
    id: 'btxn_5',
    walletId: 'wal_biz_1',
    type: 'refund',
    amount: 300,
    status: 'completed',
    description: 'Refund - Cancelled shift',
    jobId: 'j2',
    createdAt: '2024-06-27T14:00:00Z',
  },
];

export const getTransactionIcon = (type: TransactionType): string => {
  switch (type) {
    case 'shift_payment': return 'briefcase';
    case 'withdrawal': return 'arrow-down-circle';
    case 'deposit': return 'arrow-up-circle';
    case 'referral_bonus': return 'gift';
    case 'platform_fee': return 'card';
    case 'refund': return 'refresh-circle';
    case 'tip': return 'heart';
    default: return 'cash';
  }
};

export const getTransactionColor = (type: TransactionType, amount: number): string => {
  if (amount < 0) return '#EF4444';
  switch (type) {
    case 'shift_payment': return '#10B981';
    case 'referral_bonus': return '#7B61FF';
    case 'tip': return '#EC4899';
    case 'refund': return '#F59E0B';
    default: return '#10B981';
  }
};
