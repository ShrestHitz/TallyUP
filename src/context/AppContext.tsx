'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AnonymousFeedback,
  AttendanceBlock,
  FatigueAlert,
  HazardReport,
  SectorConfig,
  SectorType,
  WorkerProfile,
} from '@/types';
import { SECTORS } from '@/lib/sectors';
import {
  SEED_FATIGUE_ALERTS,
  SEED_FEEDBACK,
  SEED_HAZARDS,
  SEED_LEDGER,
  SEED_WORKERS,
} from '@/lib/seed-data';
import { computeBlockHash, generateReceiptCode } from '@/lib/crypto-ledger';
import { Language, TRANSLATIONS } from '@/lib/i18n';

interface AppContextType {
  // Sector & Language
  sectorId: SectorType;
  sector: SectorConfig;
  setSectorId: (id: SectorType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof TRANSLATIONS)['en'];

  // User & Role
  currentWorker: WorkerProfile;
  setCurrentWorker: (w: WorkerProfile) => void;
  viewMode: 'WORKER' | 'ADMIN';
  setViewMode: (m: 'WORKER' | 'ADMIN') => void;

  // Shift & Attendance
  isShiftActive: boolean;
  shiftStartTime: string | null;
  attendanceBlocks: AttendanceBlock[];
  clockIn: (zone: string) => Promise<AttendanceBlock>;
  clockOut: () => Promise<AttendanceBlock | null>;
  simulateTamper: (blockId: string, forgedHours: number) => void;
  restoreLedger: () => void;
  isLedgerTampered: boolean;

  // Hazards
  hazards: HazardReport[];
  addHazard: (report: Omit<HazardReport, 'id' | 'reportedAt' | 'clusterCount' | 'status' | 'slaMinutesRemaining' | 'slaBreached'>) => void;
  updateHazardStatus: (id: string, status: HazardReport['status']) => void;

  // Feedback
  feedbackList: AnonymousFeedback[];
  addFeedback: (rawContent: string, scrubbedContent: string, category: AnonymousFeedback['thematicCategory']) => void;

  // Fatigue
  fatigueAlerts: FatigueAlert[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sectorId, setSectorId] = useState<SectorType>('construction');
  const [language, setLanguage] = useState<Language>('en');
  const [viewMode, setViewMode] = useState<'WORKER' | 'ADMIN'>('WORKER');
  
  // Default worker is Murugan (construction) or Priya (campus)
  const [currentWorker, setCurrentWorker] = useState<WorkerProfile>(SEED_WORKERS[0]);

  // Attendance state
  const [isShiftActive, setIsShiftActive] = useState<boolean>(false);
  const [shiftStartTime, setShiftStartTime] = useState<string | null>(null);
  const [attendanceBlocks, setAttendanceBlocks] = useState<AttendanceBlock[]>(SEED_LEDGER);
  const [isLedgerTampered, setIsLedgerTampered] = useState<boolean>(false);

  // Hazards & Feedback
  const [hazards, setHazards] = useState<HazardReport[]>(SEED_HAZARDS);
  const [feedbackList, setFeedbackList] = useState<AnonymousFeedback[]>(SEED_FEEDBACK);
  const [fatigueAlerts, setFatigueAlerts] = useState<FatigueAlert[]>(SEED_FATIGUE_ALERTS);

  const sector = SECTORS[sectorId];
  const t = TRANSLATIONS[language];

  // Auto-switch default worker when sector changes
  useEffect(() => {
    const match = SEED_WORKERS.find((w) => w.sectorId === sectorId) || SEED_WORKERS[0];
    setCurrentWorker(match);
  }, [sectorId]);

  // Clock In Action
  const clockIn = async (zone: string): Promise<AttendanceBlock> => {
    const nowIso = new Date().toISOString();
    setIsShiftActive(true);
    setShiftStartTime(nowIso);

    // Get previous block hash for chaining
    const lastBlock = attendanceBlocks[attendanceBlocks.length - 1];
    const prevHash = lastBlock
      ? lastBlock.hash
      : '0000000000000000000000000000000000000000000000000000000000000000';

    const newBlockId = `blk-${Date.now().toString().slice(-4)}`;
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
    };

    setAttendanceBlocks((prev) => [...prev, newBlock]);
    return newBlock;
  };

  // Clock Out Action
  const clockOut = async (): Promise<AttendanceBlock | null> => {
    if (!isShiftActive || !shiftStartTime) return null;
    const nowIso = new Date().toISOString();
    setIsShiftActive(false);

    // Calculate hours (mocking a productive 9.5h shift for demo impact)
    const totalHours = 9.5;
    const regularHours = 8.0;
    const overtimeHours = 1.5;

    // Find the latest open block
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

  // Simulate Boss Tampering (Demonstration of hash chain integrity)
  const simulateTamper = (blockId: string, forgedHours: number) => {
    setAttendanceBlocks((prev) =>
      prev.map((blk) => {
        if (blk.id === blockId) {
          return {
            ...blk,
            totalHours: forgedHours,
            regularHours: Math.min(forgedHours, 8),
            overtimeHours: Math.max(0, forgedHours - 8),
            tamperFlag: true, // Flagged because stored hash won't match data
          };
        }
        return blk;
      })
    );
    setIsLedgerTampered(true);
  };

  // Restore Ledger
  const restoreLedger = () => {
    setAttendanceBlocks(SEED_LEDGER);
    setIsLedgerTampered(false);
  };

  // Add Hazard Report
  const addHazard = (
    report: Omit<HazardReport, 'id' | 'reportedAt' | 'clusterCount' | 'status' | 'slaMinutesRemaining' | 'slaBreached'>
  ) => {
    const newHazard: HazardReport = {
      ...report,
      id: `hz-${Date.now().toString().slice(-4)}`,
      reportedAt: 'Just now',
      clusterCount: 1,
      status: 'SUBMITTED',
      slaMinutesRemaining: 15,
      slaBreached: false,
    };
    setHazards((prev) => [newHazard, ...prev]);
  };

  // Update Hazard Status
  const updateHazardStatus = (id: string, status: HazardReport['status']) => {
    setHazards((prev) =>
      prev.map((h) => (h.id === id ? { ...h, status } : h))
    );
  };

  // Add Anonymous Feedback
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
        sectorId,
        sector,
        setSectorId,
        language,
        setLanguage,
        t,
        currentWorker,
        setCurrentWorker,
        viewMode,
        setViewMode,
        isShiftActive,
        shiftStartTime,
        attendanceBlocks,
        clockIn,
        clockOut,
        simulateTamper,
        restoreLedger,
        isLedgerTampered,
        hazards,
        addHazard,
        updateHazardStatus,
        feedbackList,
        addFeedback,
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
