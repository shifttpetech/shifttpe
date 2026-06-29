// Mock Skills Data
export type Skill = {
  id: string;
  name: string;
  category: string;
  icon: string;
};

export const MOCK_SKILLS: Skill[] = [
  { id: 'sk_1', name: 'Customer Service', category: 'Soft Skills', icon: 'people' },
  { id: 'sk_2', name: 'Cash Handling', category: 'Technical', icon: 'cash' },
  { id: 'sk_3', name: 'Barista', category: 'Technical', icon: 'cafe' },
  { id: 'sk_4', name: 'Retail Sales', category: 'Technical', icon: 'cart' },
  { id: 'sk_5', name: 'Billing', category: 'Technical', icon: 'receipt' },
  { id: 'sk_6', name: 'Communication', category: 'Soft Skills', icon: 'chatbubbles' },
  { id: 'sk_7', name: 'English', category: 'Language', icon: 'language' },
  { id: 'sk_8', name: 'Hindi', category: 'Language', icon: 'language' },
  { id: 'sk_9', name: 'Driving', category: 'Technical', icon: 'car' },
  { id: 'sk_10', name: 'Delivery', category: 'Technical', icon: 'bicycle' },
  { id: 'sk_11', name: 'Cooking', category: 'Technical', icon: 'restaurant' },
  { id: 'sk_12', name: 'Serving', category: 'Technical', icon: 'fast-food' },
  { id: 'sk_13', name: 'Event Management', category: 'Technical', icon: 'calendar' },
  { id: 'sk_14', name: 'Photography', category: 'Creative', icon: 'camera' },
  { id: 'sk_15', name: 'Data Entry', category: 'Technical', icon: 'document-text' },
  { id: 'sk_16', name: 'MS Office', category: 'Technical', icon: 'desktop' },
  { id: 'sk_17', name: 'Typing', category: 'Technical', icon: 'keypad' },
  { id: 'sk_18', name: 'Teaching', category: 'Technical', icon: 'school' },
  { id: 'sk_19', name: 'Leadership', category: 'Soft Skills', icon: 'flag' },
  { id: 'sk_20', name: 'Teamwork', category: 'Soft Skills', icon: 'people-circle' },
  { id: 'sk_21', name: 'Problem Solving', category: 'Soft Skills', icon: 'bulb' },
  { id: 'sk_22', name: 'Time Management', category: 'Soft Skills', icon: 'time' },
  { id: 'sk_23', name: 'Social Media', category: 'Technical', icon: 'share-social' },
  { id: 'sk_24', name: 'Video Editing', category: 'Creative', icon: 'videocam' },
];

export const SKILL_CATEGORIES = ['All', 'Soft Skills', 'Technical', 'Language', 'Creative'];

export const getSkillsByCategory = (category: string): Skill[] => {
  if (category === 'All') return MOCK_SKILLS;
  return MOCK_SKILLS.filter(s => s.category === category);
};
