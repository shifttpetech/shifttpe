// Mock Shifts Data (Active/Completed shifts for students)
export type ShiftStatus = 
  | 'upcoming'
  | 'checked_in'
  | 'in_progress'
  | 'checked_out'
  | 'completed'
  | 'cancelled';

export type Shift = {
  id: string;
  jobId: string;
  studentId: string;
  businessId: string;
  jobTitle: string;
  businessName: string;
  businessLogo: string;
  location: string;
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  pay: number;
  payUnit: string;
  totalEarning: number;
  status: ShiftStatus;
  checkInTime?: string;
  checkOutTime?: string;
  checkInQR?: string;
  checkOutQR?: string;
  rating?: number;
  review?: string;
  createdAt: string;
};

export const MOCK_SHIFTS: Shift[] = [
  {
    id: 'shift_1',
    jobId: 'j1',
    studentId: 'st_1',
    businessId: 'biz_1',
    jobTitle: 'Cafe Staff',
    businessName: 'Cafe Coffee Day',
    businessLogo: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=200&auto=format&fit=crop&q=70',
    location: 'Andheri West, Mumbai',
    address: 'Shop 12, Infinity Mall, Andheri West',
    date: '2024-06-30',
    startTime: '06:00 PM',
    endTime: '10:00 PM',
    duration: '4 hrs',
    pay: 120,
    payUnit: '/hr',
    totalEarning: 480,
    status: 'upcoming',
    checkInQR: 'SHIFT_1_CHECKIN_QR',
    createdAt: '2024-06-29T10:00:00Z',
  },
  {
    id: 'shift_2',
    jobId: 'j3',
    studentId: 'st_1',
    businessId: 'biz_2',
    jobTitle: 'Retail Sales Associate',
    businessName: 'Urban Closet',
    businessLogo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&auto=format&fit=crop&q=70',
    location: 'HSR Layout, Bengaluru',
    address: '27th Main, HSR Layout Sector 1',
    date: '2024-07-01',
    startTime: '12:00 PM',
    endTime: '05:00 PM',
    duration: '5 hrs',
    pay: 150,
    payUnit: '/hr',
    totalEarning: 750,
    status: 'upcoming',
    checkInQR: 'SHIFT_2_CHECKIN_QR',
    createdAt: '2024-06-28T14:00:00Z',
  },
  {
    id: 'shift_3',
    jobId: 'j1',
    studentId: 'st_1',
    businessId: 'biz_1',
    jobTitle: 'Cafe Staff',
    businessName: 'Cafe Coffee Day',
    businessLogo: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=200&auto=format&fit=crop&q=70',
    location: 'Andheri West, Mumbai',
    address: 'Shop 12, Infinity Mall, Andheri West',
    date: '2024-06-28',
    startTime: '06:00 PM',
    endTime: '10:00 PM',
    duration: '4 hrs',
    pay: 120,
    payUnit: '/hr',
    totalEarning: 500,
    status: 'completed',
    checkInTime: '2024-06-28T17:55:00Z',
    checkOutTime: '2024-06-28T22:05:00Z',
    rating: 5,
    review: 'Great worker! Very punctual and friendly.',
    createdAt: '2024-06-27T10:00:00Z',
  },
  {
    id: 'shift_4',
    jobId: 'j4',
    studentId: 'st_1',
    businessId: 'biz_4',
    jobTitle: 'Event Promoter',
    businessName: 'FestPro Events',
    businessLogo: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&auto=format&fit=crop&q=70',
    location: 'Powai, Mumbai',
    address: 'Hiranandani Gardens, Powai',
    date: '2024-06-25',
    startTime: '04:00 PM',
    endTime: '10:00 PM',
    duration: '6 hrs',
    pay: 600,
    payUnit: '/day',
    totalEarning: 600,
    status: 'completed',
    checkInTime: '2024-06-25T15:50:00Z',
    checkOutTime: '2024-06-25T22:10:00Z',
    rating: 4,
    createdAt: '2024-06-24T10:00:00Z',
  },
  {
    id: 'shift_5',
    jobId: 'j6',
    studentId: 'st_1',
    businessId: 'biz_5',
    jobTitle: 'Math Tutor',
    businessName: 'BrightMinds Tuitions',
    businessLogo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&auto=format&fit=crop&q=70',
    location: 'Bandra, Mumbai',
    address: 'Turner Road, Bandra West',
    date: '2024-06-22',
    startTime: '05:00 PM',
    endTime: '07:00 PM',
    duration: '2 hrs',
    pay: 300,
    payUnit: '/hr',
    totalEarning: 600,
    status: 'completed',
    checkInTime: '2024-06-22T16:58:00Z',
    checkOutTime: '2024-06-22T19:02:00Z',
    rating: 5,
    review: 'Excellent tutor! Students loved the session.',
    createdAt: '2024-06-21T10:00:00Z',
  },
];

export const getShiftsByStatus = (status: ShiftStatus): Shift[] => {
  return MOCK_SHIFTS.filter(s => s.status === status);
};

export const getUpcomingShifts = (): Shift[] => {
  return MOCK_SHIFTS.filter(s => s.status === 'upcoming');
};

export const getCompletedShifts = (): Shift[] => {
  return MOCK_SHIFTS.filter(s => s.status === 'completed');
};

export const getShiftById = (id: string): Shift | undefined => {
  return MOCK_SHIFTS.find(s => s.id === id);
};

// QR Code generation helpers (dummy)
export const generateCheckInQR = (shiftId: string): string => {
  return `SHIFTTPE_CHECKIN_${shiftId}_${Date.now()}`;
};

export const generateCheckOutQR = (shiftId: string): string => {
  return `SHIFTTPE_CHECKOUT_${shiftId}_${Date.now()}`;
};

export const validateQR = (qrCode: string): { valid: boolean; type: 'checkin' | 'checkout' | 'invalid'; shiftId?: string } => {
  if (qrCode.startsWith('SHIFTTPE_CHECKIN_')) {
    const parts = qrCode.split('_');
    return { valid: true, type: 'checkin', shiftId: parts[2] };
  }
  if (qrCode.startsWith('SHIFTTPE_CHECKOUT_')) {
    const parts = qrCode.split('_');
    return { valid: true, type: 'checkout', shiftId: parts[2] };
  }
  return { valid: false, type: 'invalid' };
};
