import { AttendanceBlock, SectorConfig, WageAuditReport, WorkerProfile } from '@/types';

/**
 * Calculates regular vs overtime hours based on sector daily limits
 */
export function calculateShiftHours(
  checkInIso: string,
  checkOutIso: string,
  regularLimit: number = 8
): { totalHours: number; regularHours: number; overtimeHours: number } {
  const start = new Date(checkInIso).getTime();
  const end = new Date(checkOutIso).getTime();
  const diffHours = Math.max(0, (end - start) / (1000 * 60 * 60));

  const totalHours = Math.round(diffHours * 10) / 10;
  const regularHours = Math.min(totalHours, regularLimit);
  const overtimeHours = Math.max(0, Math.round((totalHours - regularHours) * 10) / 10);

  return { totalHours, regularHours, overtimeHours };
}

/**
 * Wage Guardian: Audits verified ledger hours against employer payout declarations
 */
export function auditWorkerPay(
  worker: WorkerProfile,
  blocks: AttendanceBlock[],
  declaredPay: number,
  sector: SectorConfig,
  periodName: string = 'October 2026 (Week 4)'
): WageAuditReport {
  const workerBlocks = blocks.filter((b) => b.workerId === worker.id);

  let totalRegularHours = 0;
  let totalOvertimeHours = 0;

  for (const block of workerBlocks) {
    totalRegularHours += block.regularHours;
    totalOvertimeHours += block.overtimeHours;
  }

  const basePay = totalRegularHours * worker.hourlyRate;
  const overtimePay = totalOvertimeHours * worker.hourlyRate * sector.shiftRules.overtimeMultiplier;
  const calculatedLegitimatePay = Math.round(basePay + overtimePay);

  const discrepancyAmount = calculatedLegitimatePay - declaredPay;
  const isUnderpaid = discrepancyAmount > 0;

  // Multilingual explanations for text-to-speech
  const explanation = {
    en: isUnderpaid
      ? `Wage discrepancy detected. You worked ${totalRegularHours} regular hours and ${totalOvertimeHours} overtime hours. At a 2.0x overtime multiplier, your verified wage is ₹${calculatedLegitimatePay}. Contractor paid ₹${declaredPay}. You are owed ₹${discrepancyAmount}.`
      : `Your pay is verified. Total earned: ₹${calculatedLegitimatePay} for ${totalRegularHours} regular hours and ${totalOvertimeHours} overtime hours. No underpayment detected.`,
    hi: isUnderpaid
      ? `वेतन विसंगति मिली। आपने ${totalRegularHours} सामान्य घंटे और ${totalOvertimeHours} ओवरटाइम घंटे काम किया। वैधानिक नियमों के अनुसार आपका देय वेतन ₹${calculatedLegitimatePay} है। आपको ₹${declaredPay} मिले। आपका बकाया ₹${discrepancyAmount} है।`
      : `आपका वेतन सत्यापित है। कुल राशि ₹${calculatedLegitimatePay} सही प्राप्त हुई है। कोई विसंगति नहीं मिली।`,
    ta: isUnderpaid
      ? `சம்பள முரண்பாடு கண்டறியப்பட்டது. நீங்கள் ${totalRegularHours} வழக்கமான மணிநேரமும் ${totalOvertimeHours} கூடுதல் மணிநேரமும் உழைத்துள்ளீர்கள். சரிபார்க்கப்பட்ட தொகை ₹${calculatedLegitimatePay}. வழங்கப்பட்டது ₹${declaredPay}. நிலுவைத் தொகை ₹${discrepancyAmount}.`
      : `உங்கள் சம்பளம் சரிபார்க்கப்பட்டது. பெறப்பட்ட தொகை ₹${calculatedLegitimatePay} சரியாக உள்ளது.`,
  };

  return {
    workerId: worker.id,
    workerName: worker.name,
    tradeRole: worker.tradeRole,
    period: periodName,
    verifiedRegularHours: totalRegularHours,
    verifiedOvertimeHours: totalOvertimeHours,
    hourlyRate: worker.hourlyRate,
    overtimeMultiplier: sector.shiftRules.overtimeMultiplier,
    calculatedLegitimatePay,
    employerDeclaredPay: declaredPay,
    discrepancyAmount,
    isUnderpaid,
    explanation,
  };
}
