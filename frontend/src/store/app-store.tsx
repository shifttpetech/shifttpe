import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MOCK_JOBS, MOCK_APPLICANTS, MOCK_CHATS, MOCK_NOTIFICATIONS, MOCK_BUSINESS_JOBS } from "./mock-data";

export type Role = "student" | "business" | null;

export type ShiftStatus = "applied" | "accepted" | "completed" | "cancelled";

export type StudentProfile = {
  name: string;
  photo?: string;
  dob?: string;
  city?: string;
  phone?: string;
  preferredLocation?: string;
  maxDistance?: number;
  availability?: string;
  minPay?: number;
  lookingFor?: "Part-time" | "Full-time";
  skills?: string[];
  rating?: number;
  completedShifts?: number;
};

export type BusinessProfile = {
  businessName: string;
  ownerName?: string;
  category?: string;
  city?: string;
  area?: string;
  phone?: string;
  logo?: string;
  description?: string;
  verified?: boolean;
  plan?: "free" | "pro";
  planSince?: string;
};

export type Referral = {
  id: string;
  name: string;
  phone: string;
  shiftsCompleted: number;
  rewarded: boolean;
  joinedAt: string;
};

export type MyShift = {
  id: string;
  jobId: string;
  status: ShiftStatus;
  appliedAt: string;
};

export type BusinessJob = {
  id: string;
  title: string;
  category: string;
  pay: number;
  shiftTime: string;
  openings: number;
  applied: number;
  status: "active" | "closed";
  address?: string;
  description?: string;
  createdAt: string;
};

type Ctx = {
  ready: boolean;
  hasSeenOnboarding: boolean;
  role: Role;
  isAuthed: boolean;
  studentProfile: StudentProfile | null;
  businessProfile: BusinessProfile | null;
  myShifts: MyShift[];
  businessJobs: BusinessJob[];
  referrals: Referral[];
  referralEarnings: number;
  setHasSeenOnboarding: (v: boolean) => Promise<void>;
  setRole: (r: Role) => Promise<void>;
  setAuthed: (v: boolean) => Promise<void>;
  updateStudent: (p: Partial<StudentProfile>) => Promise<void>;
  updateBusiness: (p: Partial<BusinessProfile>) => Promise<void>;
  addShift: (jobId: string) => Promise<void>;
  updateShiftStatus: (id: string, status: ShiftStatus) => Promise<void>;
  addBusinessJob: (job: Omit<BusinessJob, "id" | "createdAt" | "applied" | "status">) => Promise<BusinessJob | { error: string }>;
  addReferral: (r: Omit<Referral, "id" | "joinedAt" | "rewarded" | "shiftsCompleted"> & { shiftsCompleted?: number }) => Promise<void>;
  upgradePlan: () => Promise<void>;
  logout: () => Promise<void>;
};

const AppCtx = createContext<Ctx | null>(null);

const KEY = "shiftpe:state:v1";

type Persisted = Omit<Ctx, "ready" | keyof Functions>;
type Functions = {
  setHasSeenOnboarding: any; setRole: any; setAuthed: any;
  updateStudent: any; updateBusiness: any; addShift: any; updateShiftStatus: any; addBusinessJob: any; logout: any;
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [hasSeenOnboarding, _setOnb] = useState(false);
  const [role, _setRole] = useState<Role>(null);
  const [isAuthed, _setAuthed] = useState(false);
  const [studentProfile, _setStudent] = useState<StudentProfile | null>(null);
  const [businessProfile, _setBusiness] = useState<BusinessProfile | null>(null);
  const [myShifts, _setShifts] = useState<MyShift[]>([]);
  const [businessJobs, _setJobs] = useState<BusinessJob[]>(MOCK_BUSINESS_JOBS);
  const [referrals, _setReferrals] = useState<Referral[]>([]);

  const referralEarnings = referrals.filter(r => r.rewarded).length * 200;

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const s = JSON.parse(raw);
          _setOnb(!!s.hasSeenOnboarding);
          _setRole(s.role ?? null);
          _setAuthed(!!s.isAuthed);
          _setStudent(s.studentProfile ?? null);
          _setBusiness(s.businessProfile ?? null);
          _setShifts(s.myShifts ?? []);
          _setJobs(s.businessJobs ?? MOCK_BUSINESS_JOBS);
          _setReferrals(s.referrals ?? []);
        }
      } catch (e) { console.warn("load state", e); }
      setReady(true);
    })();
  }, []);

  const persist = useCallback(async (next: Partial<any>) => {
    const snap = {
      hasSeenOnboarding, role, isAuthed,
      studentProfile, businessProfile, myShifts, businessJobs, referrals,
      ...next,
    };
    try { await AsyncStorage.setItem(KEY, JSON.stringify(snap)); } catch {}
  }, [hasSeenOnboarding, role, isAuthed, studentProfile, businessProfile, myShifts, businessJobs, referrals]);

  const setHasSeenOnboarding = async (v: boolean) => { _setOnb(v); await persist({ hasSeenOnboarding: v }); };
  const setRole = async (r: Role) => { _setRole(r); await persist({ role: r }); };
  const setAuthed = async (v: boolean) => { _setAuthed(v); await persist({ isAuthed: v }); };
  const updateStudent = async (p: Partial<StudentProfile>) => {
    const next = { ...(studentProfile ?? {}), ...p } as StudentProfile;
    _setStudent(next); await persist({ studentProfile: next });
  };
  const updateBusiness = async (p: Partial<BusinessProfile>) => {
    const next = { ...(businessProfile ?? {}), ...p } as BusinessProfile;
    _setBusiness(next); await persist({ businessProfile: next });
  };
  const addShift = async (jobId: string) => {
    if (myShifts.find(s => s.jobId === jobId)) return;
    const next = [{ id: `sh_${Date.now()}`, jobId, status: "applied" as ShiftStatus, appliedAt: new Date().toISOString() }, ...myShifts];
    _setShifts(next); await persist({ myShifts: next });
  };
  const updateShiftStatus = async (id: string, status: ShiftStatus) => {
    const next = myShifts.map(s => s.id === id ? { ...s, status } : s);
    _setShifts(next); await persist({ myShifts: next });
  };
  const addBusinessJob = async (job: Omit<BusinessJob, "id" | "createdAt" | "applied" | "status">) => {
    const isPro = businessProfile?.plan === "pro";
    const activeCount = businessJobs.filter(j => j.status === "active").length;
    if (!isPro && activeCount >= 2) {
      return { error: "Free plan allows up to 2 active jobs. Upgrade to Pro for unlimited postings." };
    }
    const created: BusinessJob = { ...job, id: `bj_${Date.now()}`, applied: 0, status: "active", createdAt: new Date().toISOString() };
    const next = [created, ...businessJobs];
    _setJobs(next); await persist({ businessJobs: next });
    return created;
  };
  const addReferral = async (r: Omit<Referral, "id" | "joinedAt" | "rewarded" | "shiftsCompleted"> & { shiftsCompleted?: number }) => {
    const shifts = r.shiftsCompleted ?? 0;
    const created: Referral = { id: `ref_${Date.now()}`, name: r.name, phone: r.phone, shiftsCompleted: shifts, rewarded: shifts >= 5, joinedAt: new Date().toISOString() };
    const next = [created, ...referrals];
    _setReferrals(next); await persist({ referrals: next });
  };
  const upgradePlan = async () => {
    const next = { ...(businessProfile ?? { businessName: "" }), plan: "pro" as const, verified: true, planSince: new Date().toISOString() };
    _setBusiness(next); await persist({ businessProfile: next });
  };
  const logout = async () => {
    _setOnb(true); _setRole(null); _setAuthed(false); _setStudent(null); _setBusiness(null); _setShifts([]); _setReferrals([]);
    await AsyncStorage.setItem(KEY, JSON.stringify({ hasSeenOnboarding: true }));
  };

  return (
    <AppCtx.Provider value={{
      ready, hasSeenOnboarding, role, isAuthed, studentProfile, businessProfile, myShifts, businessJobs, referrals, referralEarnings,
      setHasSeenOnboarding, setRole, setAuthed, updateStudent, updateBusiness, addShift, updateShiftStatus, addBusinessJob, addReferral, upgradePlan, logout,
    }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used inside AppProvider");
  return c;
}

export { MOCK_JOBS, MOCK_APPLICANTS, MOCK_CHATS, MOCK_NOTIFICATIONS };
