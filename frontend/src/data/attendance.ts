// Mock Attendance Data
export type AttendanceStatus = 
  | 'pending'
  | 'checked_in'
  | 'working'
  | 'checked_out'
  | 'completed';

export type Attendance = {
  id: string;
  shiftId: string;
  studentId: string;
  businessId: string;
  status: AttendanceStatus;
  checkInTime?: string;
  checkInQRCode?: string;
  checkOutTime?: string;
  checkOutQRCode?: string;
  totalHoursWorked?: number;
  locationVerified: boolean;
  locationReachedAt?: string;
  notes?: string;
  createdAt: string;
};

export const MOCK_ATTENDANCE: Attendance[] = [
  {
    id: 'att_1',
    shiftId: 'shift_1',
    studentId: 'st_1',
    businessId: 'biz_1',
    status: 'pending',
    locationVerified: false,
    createdAt: '2024-06-30T10:00:00Z',
  },
  {
    id: 'att_2',
    shiftId: 'shift_2',
    studentId: 'st_1',
    businessId: 'biz_2',
    status: 'pending',
    locationVerified: false,
    createdAt: '2024-06-30T10:00:00Z',
  },
  {
    id: 'att_3',
    shiftId: 'shift_3',
    studentId: 'st_1',
    businessId: 'biz_1',
    status: 'completed',
    checkInTime: '2024-06-28T17:55:00Z',
    checkInQRCode: 'QR_CHECKIN_SHIFT3_123456',
    checkOutTime: '2024-06-28T22:05:00Z',
    checkOutQRCode: 'QR_CHECKOUT_SHIFT3_789012',
    totalHoursWorked: 4.17,
    locationVerified: true,
    locationReachedAt: '2024-06-28T17:50:00Z',
    createdAt: '2024-06-28T10:00:00Z',
  },
  {
    id: 'att_4',
    shiftId: 'shift_4',
    studentId: 'st_1',
    businessId: 'biz_4',
    status: 'completed',
    checkInTime: '2024-06-25T15:50:00Z',
    checkInQRCode: 'QR_CHECKIN_SHIFT4_123456',
    checkOutTime: '2024-06-25T22:10:00Z',
    checkOutQRCode: 'QR_CHECKOUT_SHIFT4_789012',
    totalHoursWorked: 6.33,
    locationVerified: true,
    locationReachedAt: '2024-06-25T15:45:00Z',
    createdAt: '2024-06-25T10:00:00Z',
  },
];

export const getAttendanceByShiftId = (shiftId: string): Attendance | undefined => {
  return MOCK_ATTENDANCE.find(a => a.shiftId === shiftId);
};

export const getAttendanceByStudentId = (studentId: string): Attendance[] => {
  return MOCK_ATTENDANCE.filter(a => a.studentId === studentId);
};

export const generateQRCode = (type: 'checkin' | 'checkout', shiftId: string): string => {
  const timestamp = Date.now();
  return `SHIFTTPE_${type.toUpperCase()}_${shiftId}_${timestamp}`;
};
