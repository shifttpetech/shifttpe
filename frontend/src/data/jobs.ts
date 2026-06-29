// Mock Jobs Data
export type Job = {
  id: string;
  businessId: string;
  title: string;
  business: string;
  businessVerified: boolean;
  cover: string;
  logo?: string;
  category: string;
  pay: number;
  payUnit: string;
  shiftType: 'Part-time' | 'Full-time';
  shiftDuration: string;
  shiftTime: string;
  shiftDate?: string;
  location: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  rating: number;
  applied: number;
  openings: number;
  urgent: boolean;
  matchPct: number;
  description: string;
  requirements: string[];
  perks: string[];
  gallery: string[];
  status: 'active' | 'closed' | 'filled';
  createdAt: string;
};

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    businessId: 'biz_1',
    title: 'Cafe Staff',
    business: 'Cafe Coffee Day',
    businessVerified: true,
    cover: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&auto=format&fit=crop&q=70',
    category: 'Hospitality',
    pay: 120,
    payUnit: '/hr',
    shiftType: 'Part-time',
    shiftDuration: '4 hrs',
    shiftTime: '06:00 PM - 10:00 PM',
    shiftDate: 'Tomorrow',
    location: 'Andheri West, Mumbai',
    latitude: 19.1364,
    longitude: 72.8296,
    distanceKm: 0.8,
    rating: 4.6,
    applied: 18,
    openings: 3,
    urgent: true,
    matchPct: 96,
    description: 'Looking for a friendly person to help with cafe operations. Greet customers, take orders, support baristas during busy hours. Great opportunity to learn coffee making!',
    requirements: ['Communication skills', 'Stand for long hours', 'Punctual', 'Basic English'],
    perks: ['Free meals', 'Flexible timing', 'Tips allowed'],
    gallery: [
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&auto=format&fit=crop&q=70',
      'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=600&auto=format&fit=crop&q=70',
      'https://images.unsplash.com/photo-1525629551402-30b2bcef5fa0?w=600&auto=format&fit=crop&q=70',
    ],
    status: 'active',
    createdAt: '2024-06-28',
  },
  {
    id: 'j2',
    businessId: 'biz_3',
    title: 'Delivery Partner',
    business: 'QuickEats',
    businessVerified: true,
    cover: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=900&auto=format&fit=crop&q=70',
    category: 'Delivery',
    pay: 90,
    payUnit: '/delivery',
    shiftType: 'Part-time',
    shiftDuration: '4-6 hrs',
    shiftTime: 'Lunch & Dinner peak',
    location: 'Andheri West, Mumbai',
    latitude: 19.1364,
    longitude: 72.8296,
    distanceKm: 1.4,
    rating: 4.4,
    applied: 32,
    openings: 10,
    urgent: false,
    matchPct: 88,
    description: 'Deliver food orders within 3 km radius. Own bike & smartphone required. Daily payout available.',
    requirements: ['Own bike', 'Smartphone', 'Driving license', 'Knows local area'],
    perks: ['Daily payout', 'Incentives', 'Fuel allowance'],
    gallery: [
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=70',
      'https://images.unsplash.com/photo-1571867424488-4565932edb41?w=600&auto=format&fit=crop&q=70',
    ],
    status: 'active',
    createdAt: '2024-06-27',
  },
  {
    id: 'j3',
    businessId: 'biz_2',
    title: 'Retail Sales Associate',
    business: 'Urban Closet',
    businessVerified: true,
    cover: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=900&auto=format&fit=crop&q=70',
    category: 'Retail',
    pay: 150,
    payUnit: '/hr',
    shiftType: 'Part-time',
    shiftDuration: '5 hrs',
    shiftTime: '12:00 PM - 05:00 PM',
    shiftDate: 'Weekend',
    location: 'HSR Layout, Bengaluru',
    latitude: 12.9116,
    longitude: 77.6473,
    distanceKm: 2.1,
    rating: 4.7,
    applied: 11,
    openings: 2,
    urgent: true,
    matchPct: 92,
    description: 'Help customers find their style. Manage trial rooms, billing, and visual merchandising on weekends.',
    requirements: ['Friendly attitude', 'Hindi + English', 'Weekend availability'],
    perks: ['Staff discount', 'Commission on sales', 'AC environment'],
    gallery: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=70',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=70',
    ],
    status: 'active',
    createdAt: '2024-06-26',
  },
  {
    id: 'j4',
    businessId: 'biz_4',
    title: 'Event Promoter',
    business: 'FestPro Events',
    businessVerified: false,
    cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&auto=format&fit=crop&q=70',
    category: 'Events',
    pay: 600,
    payUnit: '/day',
    shiftType: 'Part-time',
    shiftDuration: '6 hrs',
    shiftTime: '04:00 PM - 10:00 PM',
    shiftDate: 'Saturday',
    location: 'Powai, Mumbai',
    latitude: 19.1197,
    longitude: 72.9051,
    distanceKm: 3.5,
    rating: 4.3,
    applied: 25,
    openings: 5,
    urgent: false,
    matchPct: 81,
    description: 'Promote a music festival, distribute brochures, engage with audience and capture sign-ups.',
    requirements: ['Energetic', 'Social media savvy', 'Comfortable in crowds'],
    perks: ['Free event access', 'Networking', 'Certificate'],
    gallery: [
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=70',
    ],
    status: 'active',
    createdAt: '2024-06-25',
  },
  {
    id: 'j5',
    businessId: 'biz_3',
    title: 'Warehouse Packer',
    business: 'PackZone Logistics',
    businessVerified: true,
    cover: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=900&auto=format&fit=crop&q=70',
    category: 'Logistics',
    pay: 110,
    payUnit: '/hr',
    shiftType: 'Full-time',
    shiftDuration: '8 hrs',
    shiftTime: '08:00 AM - 04:00 PM',
    location: 'Bhiwandi, Mumbai',
    latitude: 19.2813,
    longitude: 73.0483,
    distanceKm: 5.2,
    rating: 4.1,
    applied: 42,
    openings: 8,
    urgent: false,
    matchPct: 76,
    description: 'Pack and label products in a fast-paced warehouse. Lift up to 15 kg comfortably.',
    requirements: ['Stamina', 'Attention to detail', 'Punctuality'],
    perks: ['Overtime pay', 'Transport provided', 'Lunch included'],
    gallery: [
      'https://images.unsplash.com/photo-1601598851547-4302969d0614?w=600&auto=format&fit=crop&q=70',
    ],
    status: 'active',
    createdAt: '2024-06-24',
  },
  {
    id: 'j6',
    businessId: 'biz_5',
    title: 'Math Tutor (Class 8-10)',
    business: 'BrightMinds Tuitions',
    businessVerified: true,
    cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&auto=format&fit=crop&q=70',
    category: 'Education',
    pay: 300,
    payUnit: '/hr',
    shiftType: 'Part-time',
    shiftDuration: '2 hrs',
    shiftTime: '05:00 PM - 07:00 PM',
    location: 'Bandra, Mumbai',
    latitude: 19.0596,
    longitude: 72.8295,
    distanceKm: 1.9,
    rating: 4.9,
    applied: 9,
    openings: 2,
    urgent: true,
    matchPct: 94,
    description: 'Tutor school students in Math, 3 days a week. Great pay, friendly center.',
    requirements: ['Strong fundamentals', 'Patience', 'Pursuing/done engineering preferred'],
    perks: ['High pay', 'Flexible days', 'AC classroom'],
    gallery: [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=70',
    ],
    status: 'active',
    createdAt: '2024-06-23',
  },
];

export const getJobById = (id: string) => MOCK_JOBS.find(j => j.id === id);
export const getJobsByBusiness = (businessId: string) => MOCK_JOBS.filter(j => j.businessId === businessId);
