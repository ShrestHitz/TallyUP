import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateShiftHours, auditWorkerPay } from '../src/lib/wage-engine.ts';
import { WorkerProfile, SectorConfig, AttendanceBlock } from '../src/types/index.ts';
import { SECTORS } from '../src/lib/sectors.ts';

test('calculateShiftHours: accurately separates standard and overtime hours', () => {
  // 8-hour standard shift
  const standard = calculateShiftHours('2026-10-27T08:00:00Z', '2026-10-27T16:00:00Z', 8);
  assert.strictEqual(standard.totalHours, 8.0);
  assert.strictEqual(standard.regularHours, 8.0);
  assert.strictEqual(standard.overtimeHours, 0.0);

  // 11.5-hour extended shift (3.5 hours statutory overtime)
  const extended = calculateShiftHours('2026-10-27T07:30:00Z', '2026-10-27T19:00:00Z', 8);
  assert.strictEqual(extended.totalHours, 11.5);
  assert.strictEqual(extended.regularHours, 8.0);
  assert.strictEqual(extended.overtimeHours, 3.5);

  // Partial 4.5-hour shift
  const partial = calculateShiftHours('2026-10-27T09:00:00Z', '2026-10-27T13:30:00Z', 8);
  assert.strictEqual(partial.totalHours, 4.5);
  assert.strictEqual(partial.regularHours, 4.5);
  assert.strictEqual(partial.overtimeHours, 0.0);
});

test('auditWorkerPay: detects wage underpayment using BOCW 2.0x overtime multiplier', () => {
  const constructionSector: SectorConfig = SECTORS.construction;

  const mockWorker: WorkerProfile = {
    id: 'WRK-201',
    name: 'Suresh Raina',
    phone: '+91 98765 43210',
    role: 'WORKER',
    sectorId: 'construction',
    tradeRole: 'Track Alignment Fitter',
    dailyBaseWage: 800,
    hourlyRate: 100, // ₹100/hr
    preferredLanguage: 'hi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    yearsExperience: 6,
    certifications: ['BOCW Certified Scaffolder'],
    rating: 4.9,
    ratingCount: 38,
    supervisorEndorsements: ['Top Punctuality', 'Zero Safety Breaches'],
    rewardBalance: 500,
    walletBalance: 2400,
    withdrawnTotal: 6000,
  };

  // Worker logged 16 regular hours and 2 overtime hours
  const mockBlocks: AttendanceBlock[] = [
    {
      id: 'blk-1',
      workerId: 'WRK-201',
      workerName: 'Suresh Raina',
      date: '2026-10-20',
      checkInTime: '08:00',
      checkOutTime: '18:00',
      totalHours: 10,
      regularHours: 8,
      overtimeHours: 2,
      siteZone: 'Pillar 14',
      hash: 'mockhash1',
      prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
      status: 'VERIFIED',
      receiptCode: 'PW-1111-2222',
    },
    {
      id: 'blk-2',
      workerId: 'WRK-201',
      workerName: 'Suresh Raina',
      date: '2026-10-21',
      checkInTime: '08:00',
      checkOutTime: '16:00',
      totalHours: 8,
      regularHours: 8,
      overtimeHours: 0,
      siteZone: 'Pillar 14',
      hash: 'mockhash2',
      prevHash: 'mockhash1',
      status: 'VERIFIED',
      receiptCode: 'PW-3333-4444',
    },
  ];

  // 16 regular hours @ ₹100 = ₹1,600
  // 2 overtime hours @ ₹100 * 2.0x = ₹400
  // Total legitimate pay = ₹2,000

  // Case A: Contractor underpays by declaring only ₹1,600 (ignoring overtime)
  const reportUnderpaid = auditWorkerPay(mockWorker, mockBlocks, 1600, constructionSector);
  assert.strictEqual(reportUnderpaid.calculatedLegitimatePay, 2000);
  assert.strictEqual(reportUnderpaid.employerDeclaredPay, 1600);
  assert.strictEqual(reportUnderpaid.discrepancyAmount, 400);
  assert.strictEqual(reportUnderpaid.isUnderpaid, true);
  assert.match(reportUnderpaid.explanation.en, /Wage discrepancy detected/i);
  assert.match(reportUnderpaid.explanation.hi, /वेतन विसंगति मिली/);

  // Case B: Contractor pays the full verified ₹2,000
  const reportFair = auditWorkerPay(mockWorker, mockBlocks, 2000, constructionSector);
  assert.strictEqual(reportFair.calculatedLegitimatePay, 2000);
  assert.strictEqual(reportFair.discrepancyAmount, 0);
  assert.strictEqual(reportFair.isUnderpaid, false);
  assert.match(reportFair.explanation.en, /Your pay is verified/i);
  assert.match(reportFair.explanation.hi, /आपका वेतन सत्यापित है/);
});

test('auditWorkerPay: supports voice synthesis explanations across 7 Indian languages', () => {
  const constructionSector: SectorConfig = SECTORS.construction;
  const mockWorker: WorkerProfile = {
    id: 'WRK-202',
    name: 'Anbu Selvan',
    phone: '+91 98765 12345',
    role: 'WORKER',
    sectorId: 'construction',
    tradeRole: 'Scaffolding Lead',
    dailyBaseWage: 900,
    hourlyRate: 112.5,
    preferredLanguage: 'ta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    yearsExperience: 8,
    certifications: ['Master Scaffolder'],
    rating: 4.95,
    ratingCount: 50,
    supervisorEndorsements: ['Zero Incidents'],
    rewardBalance: 1000,
    walletBalance: 1500,
    withdrawnTotal: 10000,
  };

  const report = auditWorkerPay(mockWorker, [], 0, constructionSector);
  const langs = ['en', 'hi', 'ta', 'ml', 'bn', 'te', 'kn'] as const;

  for (const lang of langs) {
    assert.strictEqual(typeof report.explanation[lang], 'string');
    assert.ok(report.explanation[lang].length > 10, `Explanation for ${lang} is too short or empty`);
  }
});
