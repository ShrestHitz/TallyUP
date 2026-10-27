export type SectorType = 'construction' | 'campus';

export interface SectorConfig {
  id: SectorType;
  name: string;
  tagline: string;
  workerType: string;
  currency: string;
  shiftRules: {
    regularHoursPerDay: number;
    weeklyHoursCap: number;
    overtimeMultiplier: number;
    mandatoryRestHours: number;
  };
  zones: string[];
  hazardCategories: string[];
  themeColor: string;
}

export type UserRole = 'WORKER' | 'ADMIN';

export interface WorkerProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  sectorId: SectorType;
  tradeRole: string; // e.g. "Lead Mason", "Scaffolding Rigger", "Sanitation Specialist"
  dailyBaseWage: number;
  hourlyRate: number;
  preferredLanguage: 'en' | 'hi' | 'ta';
  avatar: string;
  yearsExperience: number;
  certifications: string[];
}

export interface AttendanceBlock {
  id: string;
  workerId: string;
  workerName: string;
  sectorId: SectorType;
  siteZone: string;
  date: string;
  checkInTime: string; // ISO
  checkOutTime?: string; // ISO
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  prevHash: string; // SHA-256 of previous block
  hash: string; // SHA-256 of this block
  tamperFlag: boolean; // Flagged if hash does not match recalculation
  verifiedReceiptCode: string;
}

export type HazardSeverity = 'P1_CRITICAL' | 'P2_MODERATE' | 'P3_LOW';
export type HazardStatus = 'SUBMITTED' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED';

export interface HazardReport {
  id: string;
  sectorId: SectorType;
  zone: string;
  reportedAt: string;
  reportedByWorkerId: string;
  originalLanguage: string;
  voiceTranscriptRaw: string;
  translatedEnglishSummary: string;
  imageUrl?: string;
  category: string;
  severity: HazardSeverity;
  recommendedAction: string;
  clusterCount: number;
  status: HazardStatus;
  slaMinutesRemaining: number;
  slaBreached: boolean;
}

export interface AnonymousFeedback {
  id: string;
  sectorId: SectorType;
  submittedAt: string;
  rawPreview?: string;
  scrubbedContent: string; // Sanitized by AI to strip names, gates, dates
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  thematicCategory: 'WAGES' | 'SUPERVISOR_CONDUCT' | 'HEAT_REST' | 'SAFETY_GEAR';
}

export interface WageAuditReport {
  workerId: string;
  workerName: string;
  tradeRole: string;
  period: string;
  verifiedRegularHours: number;
  verifiedOvertimeHours: number;
  hourlyRate: number;
  overtimeMultiplier: number;
  calculatedLegitimatePay: number;
  employerDeclaredPay: number;
  discrepancyAmount: number;
  isUnderpaid: boolean;
  explanation: {
    en: string;
    hi: string;
    ta: string;
  };
}

export interface FatigueAlert {
  workerId: string;
  workerName: string;
  tradeRole: string;
  team: string;
  weeklyHours: number;
  consecutiveDays: number;
  restHoursBetweenShifts: number;
  fatigueRiskLevel: 'CRITICAL' | 'WARNING' | 'NORMAL';
  quitRiskScore: number; // 0-100 heuristic
  quitRiskFactors: string[];
  suggestedAction: string;
}
