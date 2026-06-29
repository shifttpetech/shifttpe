// Mock Timeline Data for Shift Progress
export type TimelineStep = 
  | 'accepted'
  | 'reached'
  | 'checked_in'
  | 'working'
  | 'checked_out'
  | 'payment_pending'
  | 'payment_confirmed'
  | 'student_confirmed'
  | 'completed'
  | 'rated';

export type TimelineItem = {
  id: string;
  step: TimelineStep;
  title: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  active: boolean;
  icon: string;
};

export const SHIFT_TIMELINE_STEPS: Omit<TimelineItem, 'id' | 'timestamp' | 'completed' | 'active'>[] = [
  {
    step: 'accepted',
    title: 'Shift Accepted',
    description: 'You have been accepted for this shift',
    icon: 'checkmark-circle',
  },
  {
    step: 'reached',
    title: 'Reached Workplace',
    description: 'Location verified at workplace',
    icon: 'location',
  },
  {
    step: 'checked_in',
    title: 'Checked In',
    description: 'QR scanned, shift started',
    icon: 'qr-code',
  },
  {
    step: 'working',
    title: 'Working',
    description: 'Shift in progress',
    icon: 'time',
  },
  {
    step: 'checked_out',
    title: 'Checked Out',
    description: 'QR scanned, shift completed',
    icon: 'exit',
  },
  {
    step: 'payment_pending',
    title: 'Payment Pending',
    description: 'Waiting for business confirmation',
    icon: 'hourglass',
  },
  {
    step: 'payment_confirmed',
    title: 'Payment Confirmed',
    description: 'Business marked as paid',
    icon: 'cash',
  },
  {
    step: 'student_confirmed',
    title: 'Payment Received',
    description: 'You confirmed receiving payment',
    icon: 'wallet',
  },
  {
    step: 'completed',
    title: 'Completed',
    description: 'Shift fully completed',
    icon: 'checkmark-done-circle',
  },
  {
    step: 'rated',
    title: 'Rated',
    description: 'You rated this shift',
    icon: 'star',
  },
];

export type ShiftTimeline = {
  shiftId: string;
  currentStep: TimelineStep;
  items: TimelineItem[];
};

export const generateTimeline = (shiftId: string, currentStep: TimelineStep): ShiftTimeline => {
  const stepOrder: TimelineStep[] = [
    'accepted', 'reached', 'checked_in', 'working', 'checked_out',
    'payment_pending', 'payment_confirmed', 'student_confirmed', 'completed', 'rated'
  ];
  
  const currentIndex = stepOrder.indexOf(currentStep);
  
  const items: TimelineItem[] = SHIFT_TIMELINE_STEPS.map((step, index) => ({
    ...step,
    id: `${shiftId}_${step.step}`,
    completed: index < currentIndex,
    active: index === currentIndex,
    timestamp: index <= currentIndex ? new Date().toISOString() : undefined,
  }));
  
  return {
    shiftId,
    currentStep,
    items,
  };
};

export const MOCK_SHIFT_TIMELINES: ShiftTimeline[] = [
  generateTimeline('shift_1', 'accepted'),
  generateTimeline('shift_2', 'accepted'),
  generateTimeline('shift_3', 'completed'),
  generateTimeline('shift_4', 'completed'),
  generateTimeline('shift_5', 'payment_confirmed'),
];

export const getTimelineByShiftId = (shiftId: string): ShiftTimeline | undefined => {
  return MOCK_SHIFT_TIMELINES.find(t => t.shiftId === shiftId);
};
