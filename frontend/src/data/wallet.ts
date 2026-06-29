// Mock Wallet Data
export type Wallet = {
  id: string;
  ownerId: string;
  ownerType: 'student' | 'business';
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  bankLinked: boolean;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifsc: string;
    holderName: string;
  };
  upiId?: string;
};

export const MOCK_STUDENT_WALLET: Wallet = {
  id: 'wal_st_1',
  ownerId: 'st_1',
  ownerType: 'student',
  balance: 1250,
  pendingBalance: 480,
  totalEarned: 12500,
  totalWithdrawn: 11250,
  bankLinked: true,
  bankDetails: {
    bankName: 'HDFC Bank',
    accountNumber: '****4521',
    ifsc: 'HDFC0001234',
    holderName: 'Rohit Sharma',
  },
  upiId: 'rohit@upi',
};

export const MOCK_BUSINESS_WALLET: Wallet = {
  id: 'wal_biz_1',
  ownerId: 'biz_1',
  ownerType: 'business',
  balance: 5000,
  pendingBalance: 1200,
  totalEarned: 0,
  totalWithdrawn: 45000,
  bankLinked: true,
  bankDetails: {
    bankName: 'ICICI Bank',
    accountNumber: '****8765',
    ifsc: 'ICIC0005678',
    holderName: 'Cafe Coffee Day Pvt Ltd',
  },
};

export type WalletAction = 'add' | 'withdraw';
