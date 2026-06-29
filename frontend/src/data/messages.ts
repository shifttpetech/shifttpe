// Mock Messages Data
export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  senderType: 'student' | 'business';
  content: string;
  type: 'text' | 'image' | 'voice' | 'system';
  read: boolean;
  createdAt: string;
};

export type Chat = {
  id: string;
  jobId: string;
  studentId: string;
  businessId: string;
  businessName: string;
  businessAvatar: string;
  studentName: string;
  studentAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  status: 'active' | 'archived';
};

export const MOCK_CHATS: Chat[] = [
  {
    id: 'chat_1',
    jobId: 'j1',
    studentId: 'st_1',
    businessId: 'biz_1',
    businessName: 'Cafe Coffee Day',
    businessAvatar: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=200&auto=format&fit=crop&q=70',
    studentName: 'Rohit Sharma',
    studentAvatar: 'https://i.pravatar.cc/150?img=12',
    lastMessage: 'Welcome! Can you start tomorrow at 6 PM?',
    lastMessageTime: '2m',
    unreadCount: 2,
    online: true,
    status: 'active',
  },
  {
    id: 'chat_2',
    jobId: 'j3',
    studentId: 'st_1',
    businessId: 'biz_2',
    businessName: 'Urban Closet',
    businessAvatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&auto=format&fit=crop&q=70',
    studentName: 'Rohit Sharma',
    studentAvatar: 'https://i.pravatar.cc/150?img=12',
    lastMessage: 'Hi! Please share your weekend availability.',
    lastMessageTime: '1h',
    unreadCount: 0,
    online: false,
    status: 'active',
  },
  {
    id: 'chat_3',
    jobId: 'j6',
    studentId: 'st_1',
    businessId: 'biz_5',
    businessName: 'BrightMinds Tuitions',
    businessAvatar: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&auto=format&fit=crop&q=70',
    studentName: 'Rohit Sharma',
    studentAvatar: 'https://i.pravatar.cc/150?img=12',
    lastMessage: 'Trial class scheduled for Saturday.',
    lastMessageTime: '3h',
    unreadCount: 0,
    online: true,
    status: 'active',
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  chat_1: [
    {
      id: 'msg_1_1',
      chatId: 'chat_1',
      senderId: 'biz_1',
      senderType: 'business',
      content: 'Hi Rohit! Thanks for applying to the Cafe Staff position.',
      type: 'text',
      read: true,
      createdAt: '2024-06-29T10:00:00Z',
    },
    {
      id: 'msg_1_2',
      chatId: 'chat_1',
      senderId: 'biz_1',
      senderType: 'business',
      content: 'We loved your profile! Your experience looks great.',
      type: 'text',
      read: true,
      createdAt: '2024-06-29T10:01:00Z',
    },
    {
      id: 'msg_1_3',
      chatId: 'chat_1',
      senderId: 'st_1',
      senderType: 'student',
      content: 'Thank you! I am very excited about this opportunity.',
      type: 'text',
      read: true,
      createdAt: '2024-06-29T10:05:00Z',
    },
    {
      id: 'msg_1_4',
      chatId: 'chat_1',
      senderId: 'st_1',
      senderType: 'student',
      content: 'When would you like me to start?',
      type: 'text',
      read: true,
      createdAt: '2024-06-29T10:06:00Z',
    },
    {
      id: 'msg_1_5',
      chatId: 'chat_1',
      senderId: 'biz_1',
      senderType: 'business',
      content: 'Welcome! Can you start tomorrow at 6 PM?',
      type: 'text',
      read: false,
      createdAt: '2024-06-29T14:30:00Z',
    },
    {
      id: 'msg_1_6',
      chatId: 'chat_1',
      senderId: 'biz_1',
      senderType: 'business',
      content: 'Please bring your ID proof and wear comfortable shoes.',
      type: 'text',
      read: false,
      createdAt: '2024-06-29T14:31:00Z',
    },
  ],
  chat_2: [
    {
      id: 'msg_2_1',
      chatId: 'chat_2',
      senderId: 'biz_2',
      senderType: 'business',
      content: 'Hello! We saw your application for Retail Sales Associate.',
      type: 'text',
      read: true,
      createdAt: '2024-06-28T11:00:00Z',
    },
    {
      id: 'msg_2_2',
      chatId: 'chat_2',
      senderId: 'st_1',
      senderType: 'student',
      content: 'Hi! Yes, I am very interested in this role.',
      type: 'text',
      read: true,
      createdAt: '2024-06-28T11:30:00Z',
    },
    {
      id: 'msg_2_3',
      chatId: 'chat_2',
      senderId: 'biz_2',
      senderType: 'business',
      content: 'Hi! Please share your weekend availability.',
      type: 'text',
      read: true,
      createdAt: '2024-06-28T13:00:00Z',
    },
  ],
  chat_3: [
    {
      id: 'msg_3_1',
      chatId: 'chat_3',
      senderId: 'biz_5',
      senderType: 'business',
      content: 'Hi Rohit! We are impressed with your Math skills.',
      type: 'text',
      read: true,
      createdAt: '2024-06-27T15:00:00Z',
    },
    {
      id: 'msg_3_2',
      chatId: 'chat_3',
      senderId: 'st_1',
      senderType: 'student',
      content: 'Thank you! I have been tutoring for 2 years now.',
      type: 'text',
      read: true,
      createdAt: '2024-06-27T15:30:00Z',
    },
    {
      id: 'msg_3_3',
      chatId: 'chat_3',
      senderId: 'biz_5',
      senderType: 'business',
      content: 'Trial class scheduled for Saturday.',
      type: 'text',
      read: true,
      createdAt: '2024-06-27T16:00:00Z',
    },
  ],
};

export const getChatMessages = (chatId: string): Message[] => {
  return MOCK_MESSAGES[chatId] || [];
};

export const getChatById = (chatId: string): Chat | undefined => {
  return MOCK_CHATS.find(c => c.id === chatId);
};
