// Mock Students Data
export type Student = {
  id: string;
  name: string;
  phone: string;
  email: string;
  photo: string;
  dob: string;
  city: string;
  area: string;
  rating: number;
  completedShifts: number;
  skills: string[];
  availability: string;
  preferredDistance: number;
  minPay: number;
  lookingFor: 'Part-time' | 'Full-time' | 'Both';
  verified: boolean;
  joinedAt: string;
  badges: string[];
};

export const MOCK_STUDENTS: Student[] = [
  {
    id: 'st_1',
    name: 'Rohit Sharma',
    phone: '+91 98765 43210',
    email: 'rohit.sharma@email.com',
    photo: 'https://i.pravatar.cc/300?img=12',
    dob: '2001-05-15',
    city: 'Mumbai',
    area: 'Andheri West',
    rating: 4.8,
    completedShifts: 23,
    skills: ['Barista', 'Customer Service', 'Cash Handling', 'English'],
    availability: 'Evening',
    preferredDistance: 5,
    minPay: 100,
    lookingFor: 'Part-time',
    verified: true,
    joinedAt: '2024-01-15',
    badges: ['Top Performer', 'Punctual', 'Friendly'],
  },
  {
    id: 'st_2',
    name: 'Aanya Patel',
    phone: '+91 87654 32109',
    email: 'aanya.patel@email.com',
    photo: 'https://i.pravatar.cc/300?img=45',
    dob: '2002-08-22',
    city: 'Mumbai',
    area: 'Bandra',
    rating: 4.5,
    completedShifts: 14,
    skills: ['Retail Sales', 'Billing', 'Hindi', 'English'],
    availability: 'Weekend',
    preferredDistance: 3,
    minPay: 120,
    lookingFor: 'Part-time',
    verified: true,
    joinedAt: '2024-02-20',
    badges: ['Quick Learner'],
  },
  {
    id: 'st_3',
    name: 'Karan Mehta',
    phone: '+91 76543 21098',
    email: 'karan.mehta@email.com',
    photo: 'https://i.pravatar.cc/300?img=33',
    dob: '2000-11-10',
    city: 'Bengaluru',
    area: 'Koramangala',
    rating: 4.9,
    completedShifts: 41,
    skills: ['Hospitality', 'Event Management', 'Communication', 'Leadership'],
    availability: 'Flexible',
    preferredDistance: 8,
    minPay: 150,
    lookingFor: 'Both',
    verified: true,
    joinedAt: '2023-11-05',
    badges: ['Top Performer', 'Reliable', 'Team Player'],
  },
  {
    id: 'st_4',
    name: 'Priya Verma',
    phone: '+91 65432 10987',
    email: 'priya.verma@email.com',
    photo: 'https://i.pravatar.cc/300?img=47',
    dob: '2001-03-28',
    city: 'Mumbai',
    area: 'Powai',
    rating: 4.6,
    completedShifts: 18,
    skills: ['Data Entry', 'Customer Support', 'Typing', 'MS Office'],
    availability: 'Morning',
    preferredDistance: 4,
    minPay: 100,
    lookingFor: 'Part-time',
    verified: false,
    joinedAt: '2024-03-10',
    badges: ['Punctual'],
  },
  {
    id: 'st_5',
    name: 'Sahil Khan',
    phone: '+91 54321 09876',
    email: 'sahil.khan@email.com',
    photo: 'https://i.pravatar.cc/300?img=22',
    dob: '1999-07-14',
    city: 'Mumbai',
    area: 'Andheri East',
    rating: 4.3,
    completedShifts: 8,
    skills: ['Delivery', 'Driving', 'Navigation', 'Hindi'],
    availability: 'Full Day',
    preferredDistance: 10,
    minPay: 80,
    lookingFor: 'Full-time',
    verified: true,
    joinedAt: '2024-04-01',
    badges: [],
  },
];

export const CURRENT_STUDENT = MOCK_STUDENTS[0];
