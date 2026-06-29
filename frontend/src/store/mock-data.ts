export type Job = {
  id: string;
  title: string;
  business: string;
  businessVerified: boolean;
  cover: string;
  logo?: string;
  category: string;
  pay: number;
  payUnit: string;
  shiftType: "Part-time" | "Full-time";
  shiftDuration: string;
  shiftTime: string;
  location: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  rating: number;
  applied: number;
  urgent: boolean;
  matchPct: number;
  description: string;
  requirements: string[];
  gallery: string[];
};

export const MOCK_JOBS: Job[] = [
  {
    id: "j1",
    title: "Cafe Staff",
    business: "Cafe Kapi",
    businessVerified: true,
    cover: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&auto=format&fit=crop&q=70",
    category: "Hospitality",
    pay: 120,
    payUnit: "/hr",
    shiftType: "Part-time",
    shiftDuration: "2-3 hrs",
    shiftTime: "Evening (6 PM - 10 PM)",
    location: "Koramangala, Bengaluru",
    latitude: 12.9352,
    longitude: 77.6245,
    distanceKm: 0.8,
    rating: 4.6,
    applied: 18,
    urgent: true,
    matchPct: 96,
    description: "Looking for a friendly person to help with cafe operations. Greet customers, take orders, support baristas during busy hours.",
    requirements: ["Communication skills", "Stand for long hours", "Punctual", "Basic English"],
    gallery: [
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&auto=format&fit=crop&q=70",
      "https://images.unsplash.com/photo-1497636577773-f1231844b336?w=600&auto=format&fit=crop&q=70",
      "https://images.unsplash.com/photo-1525629551402-30b2bcef5fa0?w=600&auto=format&fit=crop&q=70",
    ],
  },
  {
    id: "j2",
    title: "Delivery Partner",
    business: "QuickEats",
    businessVerified: true,
    cover: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=900&auto=format&fit=crop&q=70",
    category: "Delivery",
    pay: 90,
    payUnit: "/delivery",
    shiftType: "Part-time",
    shiftDuration: "4-6 hrs",
    shiftTime: "Lunch & Dinner peak",
    location: "Andheri West, Mumbai",
    latitude: 19.1364,
    longitude: 72.8296,
    distanceKm: 1.4,
    rating: 4.4,
    applied: 32,
    urgent: false,
    matchPct: 88,
    description: "Deliver food orders within 3 km radius. Own bike & smartphone required. Daily payout.",
    requirements: ["Own bike", "Smartphone", "Driving license", "Knows local area"],
    gallery: [
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=70",
      "https://images.unsplash.com/photo-1571867424488-4565932edb41?w=600&auto=format&fit=crop&q=70",
    ],
  },
  {
    id: "j3",
    title: "Retail Sales Associate",
    business: "Urban Closet",
    businessVerified: true,
    cover: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=900&auto=format&fit=crop&q=70",
    category: "Retail",
    pay: 150,
    payUnit: "/hr",
    shiftType: "Part-time",
    shiftDuration: "5 hrs",
    shiftTime: "Weekend, 12-5 PM",
    location: "HSR Layout, Bengaluru",
    latitude: 12.9116,
    longitude: 77.6473,
    distanceKm: 2.1,
    rating: 4.7,
    applied: 11,
    urgent: true,
    matchPct: 92,
    description: "Help customers find their style. Manage trial rooms, billing, and visual merchandising on weekends.",
    requirements: ["Friendly attitude", "Hindi + English", "Weekend availability"],
    gallery: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=70",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=70",
    ],
  },
  {
    id: "j4",
    title: "Event Promoter",
    business: "FestPro Events",
    businessVerified: false,
    cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&auto=format&fit=crop&q=70",
    category: "Events",
    pay: 600,
    payUnit: "/day",
    shiftType: "Part-time",
    shiftDuration: "1 day",
    shiftTime: "Sat, 4-10 PM",
    location: "Powai, Mumbai",
    latitude: 19.1197,
    longitude: 72.9051,
    distanceKm: 3.5,
    rating: 4.3,
    applied: 25,
    urgent: false,
    matchPct: 81,
    description: "Promote a music festival, distribute brochures, engage with audience and capture sign-ups.",
    requirements: ["Energetic", "Social media savvy", "Comfortable in crowds"],
    gallery: [
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=70",
    ],
  },
  {
    id: "j5",
    title: "Warehouse Packer",
    business: "PackZone Logistics",
    businessVerified: true,
    cover: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=900&auto=format&fit=crop&q=70",
    category: "Logistics",
    pay: 110,
    payUnit: "/hr",
    shiftType: "Full-time",
    shiftDuration: "8 hrs",
    shiftTime: "Morning, 8 AM - 4 PM",
    location: "Bhiwandi, Mumbai",
    latitude: 19.2813,
    longitude: 73.0483,
    distanceKm: 5.2,
    rating: 4.1,
    applied: 42,
    urgent: false,
    matchPct: 76,
    description: "Pack and label products in a fast-paced warehouse. Lift up to 15 kg comfortably.",
    requirements: ["Stamina", "Attention to detail", "Punctuality"],
    gallery: [
      "https://images.unsplash.com/photo-1601598851547-4302969d0614?w=600&auto=format&fit=crop&q=70",
    ],
  },
  {
    id: "j6",
    title: "Tutor (Math, Class 8-10)",
    business: "BrightMinds Tuitions",
    businessVerified: true,
    cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&auto=format&fit=crop&q=70",
    category: "Education",
    pay: 300,
    payUnit: "/hr",
    shiftType: "Part-time",
    shiftDuration: "2 hrs",
    shiftTime: "Evening, 5-7 PM",
    location: "Bandra, Mumbai",
    latitude: 19.0596,
    longitude: 72.8295,
    distanceKm: 1.9,
    rating: 4.9,
    applied: 9,
    urgent: true,
    matchPct: 94,
    description: "Tutor school students in Math, 3 days a week. Great pay, friendly center.",
    requirements: ["Strong fundamentals", "Patience", "Pursuing/done engineering preferred"],
    gallery: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=70",
    ],
  },
];

export const MOCK_APPLICANTS = [
  { id: "a1", jobId: "bj_1", name: "Rohit Sharma", photo: "https://i.pravatar.cc/150?img=12", rating: 4.7, completed: 23, distanceKm: 1.2, skills: ["Barista", "Customer Service"], status: "pending" as const },
  { id: "a2", jobId: "bj_1", name: "Aanya Patel", photo: "https://i.pravatar.cc/150?img=45", rating: 4.5, completed: 14, distanceKm: 0.6, skills: ["Cash Handling", "Serving"], status: "pending" as const },
  { id: "a3", jobId: "bj_1", name: "Karan Mehta", photo: "https://i.pravatar.cc/150?img=33", rating: 4.9, completed: 41, distanceKm: 2.4, skills: ["Hospitality", "English"], status: "pending" as const },
  { id: "a4", jobId: "bj_2", name: "Priya Verma", photo: "https://i.pravatar.cc/150?img=47", rating: 4.6, completed: 18, distanceKm: 0.9, skills: ["Retail Sales", "Billing"], status: "pending" as const },
  { id: "a5", jobId: "bj_2", name: "Sahil Khan", photo: "https://i.pravatar.cc/150?img=22", rating: 4.3, completed: 8, distanceKm: 3.1, skills: ["Delivery", "Hindi"], status: "pending" as const },
];

export const MOCK_CHATS = [
  { id: "c1", name: "Cafe Kapi", avatar: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=200&auto=format&fit=crop&q=70", lastMessage: "Welcome! Can you start tomorrow at 6 PM?", time: "2m", unread: 2, online: true, jobId: "j1" },
  { id: "c2", name: "Urban Closet", avatar: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&auto=format&fit=crop&q=70", lastMessage: "Hi! Please share your weekend availability.", time: "1h", unread: 0, online: false, jobId: "j3" },
  { id: "c3", name: "BrightMinds Tuitions", avatar: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&auto=format&fit=crop&q=70", lastMessage: "Trial class scheduled for Saturday.", time: "3h", unread: 0, online: true, jobId: "j6" },
];

export const MOCK_NOTIFICATIONS = [
  { id: "n1", type: "urgent", title: "Urgent hire near you", body: "Cafe Kapi is hiring for tonight's evening shift.", time: "Just now" },
  { id: "n2", type: "match", title: "It's a Match!", body: "Urban Closet liked your application.", time: "2h ago" },
  { id: "n3", type: "update", title: "Shift accepted", body: "BrightMinds Tuitions accepted you for Saturday.", time: "Yesterday" },
  { id: "n4", type: "announce", title: "Earn ₹200 bonus", body: "Refer a friend & earn ₹200 when they complete 5 shifts.", time: "2 days ago" },
];

export const MOCK_BUSINESS_JOBS = [
  { id: "bj_1", title: "Cafe Staff", category: "Hospitality", pay: 120, shiftTime: "Evening (6 PM - 10 PM)", openings: 3, applied: 18, status: "active" as const, createdAt: new Date(Date.now() - 86400000).toISOString(), address: "Koramangala 5th Block", description: "Help us during evening rush." },
  { id: "bj_2", title: "Retail Associate", category: "Retail", pay: 150, shiftTime: "Weekend, 12-5 PM", openings: 2, applied: 7, status: "active" as const, createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), address: "HSR Layout", description: "Weekend retail support." },
];
