// Mock Notifications Data
export type NotificationType = 
  | 'urgent'
  | 'match'
  | 'update'
  | 'payment'
  | 'reminder'
  | 'announce'
  | 'chat';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  actionUrl?: string;
  jobId?: string;
  chatId?: string;
  createdAt: string;
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'urgent',
    title: 'Urgent hire near you',
    body: 'Cafe Coffee Day is hiring for tonight\'s evening shift. ₹120/hr',
    read: false,
    jobId: 'j1',
    createdAt: '2024-06-29T14:00:00Z',
  },
  {
    id: 'n2',
    type: 'match',
    title: "It's a Match!",
    body: 'Urban Closet liked your application. Start chatting now!',
    read: false,
    jobId: 'j3',
    chatId: 'chat_2',
    createdAt: '2024-06-29T12:00:00Z',
  },
  {
    id: 'n3',
    type: 'payment',
    title: 'Payment Received',
    body: '₹500 has been added to your wallet for Cafe Staff shift.',
    read: true,
    createdAt: '2024-06-29T10:00:00Z',
  },
  {
    id: 'n4',
    type: 'update',
    title: 'Shift Accepted',
    body: 'BrightMinds Tuitions accepted you for Saturday\'s tutoring session.',
    read: true,
    jobId: 'j6',
    chatId: 'chat_3',
    createdAt: '2024-06-28T16:00:00Z',
  },
  {
    id: 'n5',
    type: 'reminder',
    title: 'Shift Tomorrow',
    body: 'Don\'t forget! Your shift at Cafe Coffee Day starts at 6 PM tomorrow.',
    read: true,
    jobId: 'j1',
    createdAt: '2024-06-28T10:00:00Z',
  },
  {
    id: 'n6',
    type: 'announce',
    title: 'Earn ₹200 Bonus',
    body: 'Refer a friend & earn ₹200 when they complete 5 shifts!',
    read: true,
    createdAt: '2024-06-27T09:00:00Z',
  },
  {
    id: 'n7',
    type: 'chat',
    title: 'New Message',
    body: 'Cafe Coffee Day: Welcome! Can you start tomorrow?',
    read: true,
    chatId: 'chat_1',
    createdAt: '2024-06-26T14:30:00Z',
  },
];

export const MOCK_BUSINESS_NOTIFICATIONS: Notification[] = [
  {
    id: 'bn1',
    type: 'update',
    title: 'New Applicant',
    body: 'Rohit Sharma applied for Cafe Staff position.',
    read: false,
    jobId: 'j1',
    createdAt: '2024-06-29T13:00:00Z',
  },
  {
    id: 'bn2',
    type: 'update',
    title: 'New Applicant',
    body: 'Aanya Patel applied for Cafe Staff position.',
    read: false,
    jobId: 'j1',
    createdAt: '2024-06-29T11:00:00Z',
  },
  {
    id: 'bn3',
    type: 'payment',
    title: 'Payment Processed',
    body: '₹500 paid to Rohit Sharma for completed shift.',
    read: true,
    createdAt: '2024-06-28T18:30:00Z',
  },
  {
    id: 'bn4',
    type: 'reminder',
    title: 'Low Wallet Balance',
    body: 'Your wallet balance is low. Add funds to continue hiring.',
    read: true,
    createdAt: '2024-06-28T10:00:00Z',
  },
  {
    id: 'bn5',
    type: 'announce',
    title: 'Upgrade to Pro',
    body: 'Get unlimited job postings and verified badge with ShiftPe Pro!',
    read: true,
    createdAt: '2024-06-27T09:00:00Z',
  },
];

export const getNotificationIcon = (type: NotificationType): string => {
  switch (type) {
    case 'urgent': return 'flash';
    case 'match': return 'heart';
    case 'update': return 'checkmark-circle';
    case 'payment': return 'wallet';
    case 'reminder': return 'alarm';
    case 'announce': return 'megaphone';
    case 'chat': return 'chatbubble';
    default: return 'notifications';
  }
};

export const getNotificationColor = (type: NotificationType): string => {
  switch (type) {
    case 'urgent': return '#EF4444';
    case 'match': return '#EC4899';
    case 'update': return '#10B981';
    case 'payment': return '#10B981';
    case 'reminder': return '#F59E0B';
    case 'announce': return '#7B61FF';
    case 'chat': return '#3B82F6';
    default: return '#6B7280';
  }
};
