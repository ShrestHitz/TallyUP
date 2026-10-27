'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AnonymousFeedback,
  AttendanceBlock,
  FatigueAlert,
  GeotagProof,
  HazardReport,
  InsurancePolicy,
  Language,
  OnboardingStage,
  PayoutTransaction,
  SectorConfig,
  SectorType,
  UserRole,
  WorkerProfile,
} from '@/types';
import { SECTORS } from '@/lib/sectors';
import {
  SEED_FATIGUE_ALERTS,
  SEED_FEEDBACK,
  SEED_HAZARDS,
  SEED_INSURANCES,
  SEED_LEDGER,
  SEED_TRANSACTIONS,
  SEED_WORKERS,
} from '@/lib/seed-data';
import { computeBlockHash, generateReceiptCode } from '@/lib/crypto-ledger';
import { TRANSLATIONS } from '@/lib/i18n';

interface AppContextType {
  // Onboarding flow
  onboardingStage: OnboardingStage;
  setOnboardingStage: (stage: OnboardingStage) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Sector & Language
  sectorId: SectorType;
  sector: SectorConfig;
  setSectorId: (id: SectorType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof TRANSLATIONS)['en'];

  // User & Profiles
  currentWorker: WorkerProfile;
  setCurrentWorker: (w: WorkerProfile) => void;
  workers: WorkerProfile[];
  viewMode: 'WORKER' | 'ADMIN';
  setViewMode: (m: 'WORKER' | 'ADMIN') => void;

  // Shift & Geotag Presence
  isShiftActive: boolean;
  shiftStartTime: string | null;
  attendanceBlocks: AttendanceBlock[];
  clockInWithGeotag: (zone: string, photoUrl: string, latitude?: number, longitude?: number) => Promise<AttendanceBlock>;
  clockOut: () => Promise<AttendanceBlock | null>;
  simulateTamper: (blockId: string, forgedHours: number) => void;
  restoreLedger: () => void;
  isLedgerTampered: boolean;
  countersignPresence: (blockId: string, supervisorName: string) => void;

  // Hazards & Rewards
  hazards: HazardReport[];
  addHazard: (report: Omit<HazardReport, 'id' | 'reportedAt' | 'clusterCount' | 'status' | 'slaMinutesRemaining' | 'slaBreached' | 'rewardEarned' | 'rewardCredited'>) => void;
  updateHazardStatus: (id: string, status: HazardReport['status']) => void;
  verifyAndRewardHazard: (hazardId: string) => void;

  // Feedback
  feedbackList: AnonymousFeedback[];
  addFeedback: (rawContent: string, scrubbedContent: string, category: AnonymousFeedback['thematicCategory']) => void;

  // Insurances, Ratings & Withdrawals
  insurances: InsurancePolicy[];
  transactions: PayoutTransaction[];
  rateWorker: (workerId: string, stars: number, endorsement: string) => void;
  withdrawEarnings: (amount: number, destinationUpi: string) => boolean;

  // Fatigue
  fatigueAlerts: FatigueAlert[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Onboarding Stage: Starts at SPLASH, transitions to LANGUAGE, then ROLE, then APP
  const [onboardingStage, setOnboardingStage] = useState<OnboardingStage>('SPLASH');
  const [userRole, setUserRole] = useState<UserRole>('WORKER');

  const [sectorId, setSectorId] = useState<SectorType>('construction');
  const [language, setLanguage] = useState<Language>('en');
  const [viewMode, setViewMode] = useState<'WORKER' | 'ADMIN'>('WORKER');

  // Workers
  const [workers, setWorkers] = useState<WorkerProfile[]>(SEED_WORKERS);
  const [currentWorker, setCurrentWorker] = useState<WorkerProfile>(SEED_WORKERS[0]);

  // Attendance state
  const [isShiftActive, setIsShiftActive] = useState<boolean>(false);
  const [shiftStartTime, setShiftStartTime] = useState<string | null>(null);
  const [attendanceBlocks, setAttendanceBlocks] = useState<AttendanceBlock[]>(SEED_LEDGER);
  const [isLedgerTampered, setIsLedgerTampered] = useState<boolean>(false);

  // Hazards, Insurances, Transactions, Feedback
  const [hazards, setHazards] = useState<HazardReport[]>(SEED_HAZARDS);
  const [insurances] = useState<InsurancePolicy[]>(SEED_INSURANCES);
  const [transactions, setTransactions] = useState<PayoutTransaction[]>(SEED_TRANSACTIONS);
  const [feedbackList, setFeedbackList] = useState<AnonymousFeedback[]>(SEED_FEEDBACK);
  const [fatigueAlerts] = useState<FatigueAlert[]>(SEED_FATIGUE_ALERTS);

  const sector = SECTORS[sectorId];
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  useEffect(() => {
    const match = workers.find((w) => w.sectorId === sectorId) || workers[0];
    setCurrentWorker(match);
  }, [sectorId, workers]);

  // Calculate distance between two GPS coordinates in meters
  const calculateDistanceMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  // Clock In Action with Geotagged Photo
  const clockInWithGeotag = async (
    zone: string,
    photoUrl: string,
    latitude: number = 9.9816,
    longitude: number = 76.2999
  ): Promise<AttendanceBlock> => {
    const nowIso = new Date().toISOString();
    setIsShiftActive(true);
    setShiftStartTime(nowIso);

    const siteDist = calculateDistanceMeters(
      latitude,
      longitude,
      sector.siteGeoLocation.latitude,
      sector.siteGeoLocation.longitude
    );

    const isInside = siteDist <= sector.siteGeoLocation.radiusMeters;

    const geotagProof: GeotagProof = {
      latitude,
      longitude,
      accuracyMeters: 3.2,
      siteDistanceMeters: siteDist,
      geofenceStatus: isInside ? 'INSIDE_SITE' : 'OUTSIDE_PERIMETER',
      photoUrl,
      capturedAt: `${nowIso.split('T')[0]} ${new Date().toLocaleTimeString('en-IN')}`,
      photoHash: `hash-${Date.now().toString(16)}-photo`,
    };

    const lastBlock = attendanceBlocks[attendanceBlocks.length - 1];
    const prevHash = lastBlock
      ? lastBlock.hash
      : '0000000000000000000000000000000000000000000000000000000000000000';

    const newBlockId = `blk-${(attendanceBlocks.length + 1).toString().padStart(2, '0')}`;
    const dateStr = nowIso.split('T')[0];

    const hash = await computeBlockHash(
      currentWorker.id,
      dateStr,
      nowIso,
      '',
      0,
      0,
      0,
      zone,
      prevHash
    );

    const newBlock: AttendanceBlock = {
      id: newBlockId,
      workerId: currentWorker.id,
      workerName: currentWorker.name,
      sectorId,
      siteZone: zone,
      date: dateStr,
      checkInTime: nowIso,
      totalHours: 0,
      regularHours: 0,
      overtimeHours: 0,
      prevHash,
      hash,
      tamperFlag: false,
      verifiedReceiptCode: generateReceiptCode(hash),
      geotagProof,
      adminCountersigned: false,
    };

    setAttendanceBlocks((prev) => [...prev, newBlock]);
    return newBlock;
  };

  // Clock Out Action
  const clockOut = async (): Promise<AttendanceBlock | null> => {
    if (!isShiftActive || !shiftStartTime) return null;
    const nowIso = new Date().toISOString();
    setIsShiftActive(false);

    const totalHours = 9.5;
    const regularHours = 8.0;
    const overtimeHours = 1.5;

    const updated = [...attendanceBlocks];
    const latestIndex = updated.length - 1;
    if (latestIndex >= 0) {
      const openBlock = updated[latestIndex];
      const newHash = await computeBlockHash(
        openBlock.workerId,
        openBlock.date,
        openBlock.checkInTime,
        nowIso,
        totalHours,
        regularHours,
        overtimeHours,
        openBlock.siteZone,
        openBlock.prevHash
      );

      updated[latestIndex] = {
        ...openBlock,
        checkOutTime: nowIso,
        totalHours,
        regularHours,
        overtimeHours,
        hash: newHash,
        verifiedReceiptCode: generateReceiptCode(newHash),
      };

      setAttendanceBlocks(updated);
      setShiftStartTime(null);
      return updated[latestIndex];
    }

    setShiftStartTime(null);
    return null;
  };

  // Supervisor Cross-Checks and Countersigns Presence
  const countersignPresence = (blockId: string, supervisorName: string) => {
    setAttendanceBlocks((prev) =>
      prev.map((blk) =>
        blk.id === blockId
          ? { ...blk, adminCountersigned: true, countersignedBy: supervisorName }
          : blk
      )
    );
  };

  // Simulate Tamper
  const simulateTamper = (blockId: string, forgedHours: number) => {
    setAttendanceBlocks((prev) =>
      prev.map((blk) => {
        if (blk.id === blockId) {
          return {
            ...blk,
            totalHours: forgedHours,
            regularHours: Math.min(forgedHours, 8),
            overtimeHours: Math.max(0, forgedHours - 8),
            tamperFlag: true,
          };
        }
        return blk;
      })
    );
    setIsLedgerTampered(true);
  };

  const restoreLedger = () => {
    setAttendanceBlocks(SEED_LEDGER);
    setIsLedgerTampered(false);
  };

  // Add Hazard Report
  const addHazard = (
    report: Omit<
      HazardReport,
      'id' | 'reportedAt' | 'clusterCount' | 'status' | 'slaMinutesRemaining' | 'slaBreached' | 'rewardEarned' | 'rewardCredited'
    >
  ) => {
    const newHazard: HazardReport = {
      ...report,
      classification: report.classification || 'NEAR_MISS',
      hazardIcon: report.hazardIcon || 'AlertTriangle',
      id: `hz-${Date.now().toString().slice(-4)}`,
      reportedAt: 'Just now',
      clusterCount: 1,
      status: 'SUBMITTED',
      slaMinutesRemaining: 15,
      slaBreached: false,
      rewardEarned: 250,
      rewardCredited: false,
    };
    setHazards((prev) => [newHazard, ...prev]);
  };

  const updateHazardStatus = (id: string, status: HazardReport['status']) => {
    setHazards((prev) =>
      prev.map((h) => (h.id === id ? { ...h, status } : h))
    );
  };

  // Admin Verifies Hazard as Genuine -> Automatically awards worker cash reward!
  const verifyAndRewardHazard = (hazardId: string) => {
    const target = hazards.find((h) => h.id === hazardId);
    if (!target) return;

    setHazards((prev) =>
      prev.map((h) =>
        h.id === hazardId
          ? { ...h, status: 'RESOLVED', rewardCredited: true }
          : h
      )
    );

    // Credit worker's wallet
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === target.reportedByWorkerId
          ? {
              ...w,
              rewardBalance: w.rewardBalance + target.rewardEarned,
              walletBalance: w.walletBalance + target.rewardEarned,
            }
          : w
      )
    );

    // Add payout transaction
    const newTx: PayoutTransaction = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      amount: target.rewardEarned,
      type: 'HAZARD_REWARD',
      status: 'COMPLETED',
      referenceUtr: `RWD-${hazardId.toUpperCase()}-VERIFIED`,
      note: `Safety Vigilance Bonus: Verified ${target.category}`,
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  // Rate a worker
  const rateWorker = (workerId: string, stars: number, endorsement: string) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const newRating = Number(((w.rating * w.ratingCount + stars) / (w.ratingCount + 1)).toFixed(1));
          return {
            ...w,
            rating: newRating,
            ratingCount: w.ratingCount + 1,
            supervisorEndorsements: endorsement ? [endorsement, ...w.supervisorEndorsements] : w.supervisorEndorsements,
          };
        }
        return w;
      })
    );
  };

  // Worker withdraws funds
  const withdrawEarnings = (amount: number, destinationUpi: string): boolean => {
    if (amount <= 0 || amount > currentWorker.walletBalance) return false;

    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === currentWorker.id) {
          return {
            ...w,
            walletBalance: w.walletBalance - amount,
            withdrawnTotal: w.withdrawnTotal + amount,
          };
        }
        return w;
      })
    );

    const newTx: PayoutTransaction = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      amount,
      type: 'UPI_WITHDRAWAL',
      status: 'COMPLETED',
      referenceUtr: `UPI-UTR-${Date.now().toString().slice(-6)}`,
      note: `Instant Transfer to ${destinationUpi}`,
    };

    setTransactions((prev) => [newTx, ...prev]);
    return true;
  };

  const addFeedback = (
    rawContent: string,
    scrubbedContent: string,
    category: AnonymousFeedback['thematicCategory']
  ) => {
    const newFeedback: AnonymousFeedback = {
      id: `fb-${Date.now().toString().slice(-4)}`,
      sectorId,
      submittedAt: 'Just now',
      rawPreview: rawContent,
      scrubbedContent,
      sentiment: 'NEGATIVE',
      thematicCategory: category,
    };
    setFeedbackList((prev) => [newFeedback, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        onboardingStage,
        setOnboardingStage,
        userRole,
        setUserRole,
        sectorId,
        sector,
        setSectorId,
        language,
        setLanguage,
        t,
        currentWorker,
        setCurrentWorker,
        workers,
        viewMode,
        setViewMode,
        isShiftActive,
        shiftStartTime,
        attendanceBlocks,
        clockInWithGeotag,
        clockOut,
        simulateTamper,
        restoreLedger,
        isLedgerTampered,
        countersignPresence,
        hazards,
        addHazard,
        updateHazardStatus,
        verifyAndRewardHazard,
        feedbackList,
        addFeedback,
        insurances,
        transactions,
        rateWorker,
        withdrawEarnings,
        fatigueAlerts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
