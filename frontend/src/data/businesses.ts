// Mock Businesses Data
export type Business = {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  logo: string;
  cover: string;
  category: string;
  city: string;
  area: string;
  address: string;
  rating: number;
  totalHires: number;
  activeJobs: number;
  verified: boolean;
  plan: 'free' | 'pro';
  description: string;
  joinedAt: string;
};

export const MOCK_BUSINESSES: Business[] = [
  {
    id: 'biz_1',
    name: 'Cafe Coffee Day',
    ownerName: 'Rajesh Kumar',
    phone: '+91 98765 00001',
    email: 'hr@cafecoffeeday.com',
    logo: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=200&auto=format&fit=crop&q=70',
    cover: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&auto=format&fit=crop&q=70',
    category: 'Hospitality',
    city: 'Mumbai',
    area: 'Andheri West',
    address: 'Shop 12, Infinity Mall, Andheri West',
    rating: 4.6,
    totalHires: 156,
    activeJobs: 3,
    verified: true,
    plan: 'pro',
    description: 'Premium coffee chain with 1500+ outlets across India.',
    joinedAt: '2023-06-15',
  },
  {
    id: 'biz_2',
    name: 'Urban Closet',
    ownerName: 'Sneha Agarwal',
    phone: '+91 98765 00002',
    email: 'jobs@urbancloset.in',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&auto=format&fit=crop&q=70',
    cover: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=900&auto=format&fit=crop&q=70',
    category: 'Retail',
    city: 'Bengaluru',
    area: 'HSR Layout',
    address: '27th Main, HSR Layout Sector 1',
    rating: 4.7,
    totalHires: 89,
    activeJobs: 2,
    verified: true,
    plan: 'pro',
    description: 'Trendy fashion retail store for young professionals.',
    joinedAt: '2023-09-20',
  },
  {
    id: 'biz_3',
    name: 'QuickEats',
    ownerName: 'Amit Patel',
    phone: '+91 98765 00003',
    email: 'partners@quickeats.com',
    logo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&auto=format&fit=crop&q=70',
    cover: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=900&auto=format&fit=crop&q=70',
    category: 'Delivery',
    city: 'Mumbai',
    area: 'Multiple Locations',
    address: 'Pan Mumbai Operations',
    rating: 4.4,
    totalHires: 312,
    activeJobs: 8,
    verified: true,
    plan: 'pro',
    description: 'Fast food delivery platform with 30-min guarantee.',
    joinedAt: '2023-04-10',
  },
  {
    id: 'biz_4',
    name: 'FestPro Events',
    ownerName: 'Vikram Singh',
    phone: '+91 98765 00004',
    email: 'hire@festpro.in',
    logo: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&auto=format&fit=crop&q=70',
    cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&auto=format&fit=crop&q=70',
    category: 'Events',
    city: 'Mumbai',
    area: 'Powai',
    address: 'Hiranandani Gardens, Powai',
    rating: 4.3,
    totalHires: 67,
    activeJobs: 1,
    verified: false,
    plan: 'free',
    description: 'Event management company for corporate & private events.',
    joinedAt: '2024-01-05',
  },
  {
    id: 'biz_5',
    name: 'BrightMinds Tuitions',
    ownerName: 'Dr. Meera Sharma',
    phone: '+91 98765 00005',
    email: 'careers@brightminds.edu',
    logo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&auto=format&fit=crop&q=70',
    cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&auto=format&fit=crop&q=70',
    category: 'Education',
    city: 'Mumbai',
    area: 'Bandra',
    address: 'Turner Road, Bandra West',
    rating: 4.9,
    totalHires: 45,
    activeJobs: 2,
    verified: true,
    plan: 'pro',
    description: 'Premium tutoring center for classes 8-12.',
    joinedAt: '2023-08-12',
  },
];
