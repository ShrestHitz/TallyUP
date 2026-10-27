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
  siteGeoLocation: {
    latitude: number;
    longitude: number;
    radiusMeters: number;
  };
}

export type UserRole = 'WORKER' | 'SUPERVISOR' | 'ADMIN';
export type OnboardingStage = 'SPLASH' | 'LANGUAGE' | 'ROLE' | 'APP';
export type Language = 'en' | 'hi' | 'ta' | 'bn' | 'te' | 'kn' | 'ml';

export interface WorkerProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  sectorId: SectorType;
  tradeRole: string; // e.g. "Lead Scaffolding Mason"
  dailyBaseWage: number;
  hourlyRate: number;
  preferredLanguage: Language;
  avatar: string;
  yearsExperience: number;
  certifications: string[];
  // Boss / Supervisor Rating
  rating: number; // e.g. 4.9
  ratingCount: number;
  supervisorEndorsements: string[];
  // Wallet & Rewards
  rewardBalance: number; // ₹ earned from verified hazards
  walletBalance: number; // ₹ total available for withdrawal
  withdrawnTotal: number; // ₹ total already withdrawn
}

export interface GeotagProof {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  siteDistanceMeters: number;
  geofenceStatus: 'INSIDE_SITE' | 'OUTSIDE_PERIMETER';
  photoUrl: string; // Geotagged camera selfie / site photo
  capturedAt: string;
  photoHash: string; // Forensic hash
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
  geotagProof?: GeotagProof;
  adminCountersigned?: boolean; // Cross-checked by supervisor
  countersignedBy?: string;
}

export type HazardSeverity = 'P1_CRITICAL' | 'P2_MODERATE' | 'P3_LOW';

export type IncidentClassification =
  | 'NEAR_MISS' // No injury, high potential
  | 'FAC' // First Aid Case (minor, dressing)
  | 'MTC' // Medical Treatment Case (stitches, no lost days)
  | 'RWC' // Restricted Work Case (light duty only)
  | 'LTI' // Lost Time Injury (lost workdays)
  | 'FATALITY'; // Death / Life-critical

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
  classification: IncidentClassification;
  hazardIcon?: string;
  severity: HazardSeverity;
  recommendedAction: string;
  clusterCount: number;
  status: HazardStatus;
  slaMinutesRemaining: number;
  slaBreached: boolean;
  rewardEarned: number; // ₹ earned when verified true
  rewardCredited: boolean;
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
    bn: string;
    te: string;
    kn: string;
    ml: string;
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

export interface InsurancePolicy {
  id: string;
  name: string;
  type: 'GOVT_STATUTORY' | 'ACCIDENTAL' | 'HEALTH' | 'BOCW_WELFARE';
  coverageAmount: string;
  policyNumber: string;
  provider: string;
  status: 'ACTIVE' | 'CLAIM_READY';
  claimHelpline: string;
  renewalDate: string;
  details: string;
}

export interface PayoutTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'WAGE_CREDIT' | 'OVERTIME_BONUS' | 'HAZARD_REWARD' | 'UPI_WITHDRAWAL';
  status: 'COMPLETED' | 'PROCESSING';
  referenceUtr: string;
  note: string;
}
