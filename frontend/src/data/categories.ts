// Mock Categories Data
export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  jobCount: number;
};

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat_1',
    name: 'Hospitality',
    icon: 'cafe',
    color: '#FF3D57',
    bgColor: '#FFE5EA',
    jobCount: 24,
  },
  {
    id: 'cat_2',
    name: 'Retail',
    icon: 'cart',
    color: '#7B61FF',
    bgColor: '#EFEBFF',
    jobCount: 18,
  },
  {
    id: 'cat_3',
    name: 'Delivery',
    icon: 'bicycle',
    color: '#10B981',
    bgColor: '#D1FAE5',
    jobCount: 32,
  },
  {
    id: 'cat_4',
    name: 'Events',
    icon: 'calendar',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    jobCount: 12,
  },
  {
    id: 'cat_5',
    name: 'Education',
    icon: 'school',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    jobCount: 15,
  },
  {
    id: 'cat_6',
    name: 'Logistics',
    icon: 'cube',
    color: '#6366F1',
    bgColor: '#E0E7FF',
    jobCount: 21,
  },
  {
    id: 'cat_7',
    name: 'Food & Beverage',
    icon: 'restaurant',
    color: '#EC4899',
    bgColor: '#FCE7F3',
    jobCount: 28,
  },
  {
    id: 'cat_8',
    name: 'Customer Support',
    icon: 'headset',
    color: '#14B8A6',
    bgColor: '#CCFBF1',
    jobCount: 16,
  },
  {
    id: 'cat_9',
    name: 'Sales',
    icon: 'trending-up',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
    jobCount: 22,
  },
  {
    id: 'cat_10',
    name: 'Photography',
    icon: 'camera',
    color: '#06B6D4',
    bgColor: '#CFFAFE',
    jobCount: 8,
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return MOCK_CATEGORIES.find(c => c.id === id);
};

export const getCategoryByName = (name: string): Category | undefined => {
  return MOCK_CATEGORIES.find(c => c.name.toLowerCase() === name.toLowerCase());
};
