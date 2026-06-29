// Mock Payments Data
export type PaymentStatus = 
  | 'pending'
  | 'business_confirmed'
  | 'student_confirmed'
  | 'completed'
  | 'disputed';

export type PaymentMethod = 'cash' | 'upi' | 'bank_transfer';

export type Payment = {
  id: string;
  shiftId: string;
  studentId: string;
  businessId: string;
  amount: number;
  status: PaymentStatus;
  method?: PaymentMethod;
  businessConfirmedAt?: string;
  studentConfirmedAt?: string;
  notes?: string;
  transactionId?: string;
  createdAt: string;
};

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay_1',
    shiftId: 'shift_1',
    studentId: 'st_1',
    businessId: 'biz_1',
    amount: 480,
    status: 'pending',
    createdAt: '2024-06-30T10:00:00Z',
  },
  {
    id: 'pay_2',
    shiftId: 'shift_2',
    studentId: 'st_1',
    businessId: 'biz_2',
    amount: 750,
    status: 'pending',
    createdAt: '2024-06-30T10:00:00Z',
  },
  {
    id: 'pay_3',
    shiftId: 'shift_3',
    studentId: 'st_1',
    businessId: 'biz_1',
    amount: 500,
    status: 'completed',
    method: 'upi',
    businessConfirmedAt: '2024-06-28T22:30:00Z',
    studentConfirmedAt: '2024-06-28T22:35:00Z',
    transactionId: 'TXN_UPI_123456789',
    createdAt: '2024-06-28T22:10:00Z',
  },
  {
    id: 'pay_4',
    shiftId: 'shift_4',
    studentId: 'st_1',
    businessId: 'biz_4',
    amount: 600,
    status: 'completed',
    method: 'cash',
    businessConfirmedAt: '2024-06-25T22:20:00Z',
    studentConfirmedAt: '2024-06-25T22:25:00Z',
    notes: 'Paid in cash at venue',
    createdAt: '2024-06-25T22:15:00Z',
  },
  {
    id: 'pay_5',
    shiftId: 'shift_5',
    studentId: 'st_1',
    businessId: 'biz_5',
    amount: 600,
    status: 'business_confirmed',
    method: 'bank_transfer',
    businessConfirmedAt: '2024-06-22T19:30:00Z',
    transactionId: 'TXN_BANK_987654321',
    createdAt: '2024-06-22T19:10:00Z',
  },
];

export const getPaymentByShiftId = (shiftId: string): Payment | undefined => {
  return MOCK_PAYMENTS.find(p => p.shiftId === shiftId);
};

export const getPaymentsByStudentId = (studentId: string): Payment[] => {
  return MOCK_PAYMENTS.filter(p => p.studentId === studentId);
};

export const getPaymentsByBusinessId = (businessId: string): Payment[] => {
  return MOCK_PAYMENTS.filter(p => p.businessId === businessId);
};

export const getPendingPayments = (businessId: string): Payment[] => {
  return MOCK_PAYMENTS.filter(p => p.businessId === businessId && p.status === 'pending');
};

export const getPaymentMethodLabel = (method: PaymentMethod): string => {
  switch (method) {
    case 'cash': return 'Cash';
    case 'upi': return 'UPI';
    case 'bank_transfer': return 'Bank Transfer';
  }
};
