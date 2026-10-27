'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Clock,
  QrCode,
  ShieldAlert,
  Volume2,
  VolumeX,
  Mic,
  Camera,
  CheckCircle2,
  Send,
  Sparkles,
  Lock,
  Award,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { speakText, stopSpeaking } from '@/lib/speech';
import { auditWorkerPay } from '@/lib/wage-engine';
import { triageHazardReport, scrubFeedbackIdentity } from '@/lib/gemini';

export const WorkerHome: React.FC = () => {
  const {
    currentWorker,
    sector,
    language,
    t,
    isShiftActive,
    shiftStartTime,
    clockIn,
    clockOut,
    attendanceBlocks,
    addHazard,
    addFeedback,
  } = useApp();

  // Active Tab inside Worker view
  const [activeTab, setActiveTab] = useState<'HOME' | 'PAY' | 'HAZARD' | 'FEEDBACK' | 'PASSPORT'>('HOME');

  // Audio playing state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Hazard report state
  const [hazardText, setHazardText] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>(sector.zones[0]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState<boolean>(false);
  const [hazardSubmittedSuccess, setHazardSubmittedSuccess] = useState<boolean>(false);
  const [hazardImagePreview, setHazardImagePreview] = useState<string | null>(null);

  // Safe Voice feedback state
  const [rawFeedback, setRawFeedback] = useState<string>('');
  const [scrubbedPreview, setScrubbedPreview] = useState<string>('');
  const [feedbackCategory, setFeedbackCategory] = useState<'WAGES' | 'SUPERVISOR_CONDUCT' | 'HEAT_REST' | 'SAFETY_GEAR'>('SUPERVISOR_CONDUCT');
  const [feedbackSuccess, setFeedbackSuccess] = useState<boolean>(false);

  // Latest Receipt
  const workerBlocks = attendanceBlocks.filter((b) => b.workerId === currentWorker.id);
  const latestBlock = workerBlocks[workerBlocks.length - 1];

  // Wage Guardian Audit calculation
  const wageAudit = auditWorkerPay(
    currentWorker,
    attendanceBlocks,
    7500, // Planted contractor paid amount
    sector
  );

  // Shift timer calculation
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  useEffect(() => {
    let interval: any;
    if (isShiftActive && shiftStartTime) {
      interval = setInterval(() => {
        const diff = Math.floor((Date.now() - new Date(shiftStartTime).getTime()) / 1000);
        setElapsedSeconds(diff);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isShiftActive, shiftStartTime]);

  const formatTimer = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Play audio payslip explanation
  const handlePlayVoicePayslip = async () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }
    setIsPlayingAudio(true);
    const textToSpeak = wageAudit.explanation[language] || wageAudit.explanation.en;
    await speakText(textToSpeak, language);
    setIsPlayingAudio(false);
  };

  // Speech to text simulation for hazard recording
  const handleVoiceRecordToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate real-time speech transcription in Tamil or Hindi depending on worker's language
      setTimeout(() => {
        if (language === 'ta') {
          setHazardText('இரண்டாவது தூண் சாரக்கட்டு மிகவும் ஆடுகிறது, கம்பிகள் தளர்ந்து உள்ளன (Pier scaffolding vibrating violently)');
        } else if (language === 'hi') {
          setHazardText('चार नंबर पिलर के पास बिजली का खुला तार पानी में डूबा है करंट लग सकता है (Exposed live cable submerged in water)');
        } else {
          setHazardText('Heavy scaffolding clamp on Pier 14 loose and rattling dangerously under concrete transit.');
        }
        setIsRecording(false);
      }, 2200);
    } else {
      setIsRecording(false);
    }
  };

  // Submit Hazard
  const handleSubmitHazard = async () => {
    if (!hazardText.trim()) return;
    setIsAnalyzingAi(true);

    const triage = await triageHazardReport(hazardText, selectedZone, sector.name, hazardImagePreview || undefined);

    addHazard({
      sectorId: sector.id,
      zone: selectedZone,
      reportedByWorkerId: currentWorker.id,
      originalLanguage: language,
      voiceTranscriptRaw: hazardText,
      translatedEnglishSummary: triage.englishSummary,
      imageUrl: hazardImagePreview || undefined,
      category: triage.category,
      severity: triage.severity,
      recommendedAction: triage.recommendedAction,
    });

    setIsAnalyzingAi(false);
    setHazardSubmittedSuccess(true);
    setHazardText('');
    setHazardImagePreview(null);
    setTimeout(() => setHazardSubmittedSuccess(false), 5000);
  };

  // Safe Voice Sanitization preview
  const handleFeedbackChange = async (text: string) => {
    setRawFeedback(text);
    if (text.length > 15) {
      const scrubbed = await scrubFeedbackIdentity(text);
      setScrubbedPreview(scrubbed);
    } else {
      setScrubbedPreview('');
    }
  };

  const handleSubmitFeedback = () => {
    if (!rawFeedback.trim()) return;
    const finalScrubbed = scrubbedPreview || rawFeedback;
    addFeedback(rawFeedback, finalScrubbed, feedbackCategory);
    setFeedbackSuccess(true);
    setRawFeedback('');
    setScrubbedPreview('');
    setTimeout(() => setFeedbackSuccess(false), 4000);
  };

  return (
    <div style={{
      maxWidth: '480px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 65px)',
      backgroundColor: '#f8fafc',
      boxShadow: '0 0 40px rgba(0, 153, 153, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Worker Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, #009999 0%, #006666 100%)',
        color: '#ffffff',
        padding: '1.25rem 1.25rem 1.5rem',
        borderBottomLeftRadius: '24px',
        borderBottomRightRadius: '24px',
        boxShadow: '0 8px 24px rgba(0, 153, 153, 0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}>
              {currentWorker.avatar}
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.2 }}>
                {currentWorker.name}
              </h2>
              <p style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 500 }}>
                {currentWorker.tradeRole}
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              padding: '0.3rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}>
              ₹{currentWorker.dailyBaseWage}/day
            </span>
          </div>
        </div>

        {/* Shift status pill */}
        <div style={{
          marginTop: '1rem',
          backgroundColor: isShiftActive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.12)',
          border: isShiftActive ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.2)',
          borderRadius: '12px',
          padding: '0.6rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isShiftActive ? '#10b981' : '#94a3b8',
              boxShadow: isShiftActive ? '0 0 8px #10b981' : 'none',
            }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              {isShiftActive ? t.onDuty : t.offDuty}
            </span>
          </div>
          {isShiftActive && (
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem' }}>
              {formatTimer(elapsedSeconds)}
            </span>
          )}
        </div>
      </div>

      {/* Main Content Body */}
      <div style={{ padding: '1rem 1.25rem', flex: 1 }}>
        {/* ===================================================================
            VIEW 1: HOME (THE 4 LARGE TACTILE TILES)
           =================================================================== */}
        {activeTab === 'HOME' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Quick action grid (High tactile targets) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              {/* Tile 1: Tally Check-In / Out */}
              <button
                onClick={() => {
                  if (isShiftActive) {
                    clockOut();
                  } else {
                    clockIn(sector.zones[0]);
                  }
                }}
                className={`tactile-btn ${isShiftActive ? 'amber' : 'primary'}`}
                style={{ padding: '1.25rem 0.75rem' }}
              >
                <Clock size={36} />
                <span style={{ fontSize: '1rem', lineHeight: 1.2 }}>
                  {isShiftActive ? 'Clock Out' : t.checkInTile}
                </span>
                <span style={{ fontSize: '0.7rem', opacity: 0.85, fontWeight: 500 }}>
                  {isShiftActive ? 'Save Witness Block' : t.checkInSubtitle}
                </span>
              </button>

              {/* Tile 2: My Pay & Wage Guardian */}
              <button
                onClick={() => setActiveTab('PAY')}
                className="tactile-btn"
                style={{
                  padding: '1.25rem 0.75rem',
                  borderColor: wageAudit.isUnderpaid ? '#ef4444' : '#009999',
                  background: wageAudit.isUnderpaid ? '#fff5f5' : '#ffffff',
                }}
              >
                <div style={{
                  color: wageAudit.isUnderpaid ? '#ef4444' : '#009999',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <TrendingUp size={36} />
                </div>
                <span style={{ fontSize: '1rem', lineHeight: 1.2, color: '#0f172a' }}>
                  {t.myPayTile}
                </span>
                {wageAudit.isUnderpaid && (
                  <span style={{
                    fontSize: '0.65rem',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    fontWeight: 700,
                  }}>
                    -₹{wageAudit.discrepancyAmount} Gap
                  </span>
                )}
              </button>

              {/* Tile 3: Report Site Hazard */}
              <button
                onClick={() => setActiveTab('HAZARD')}
                className="tactile-btn hazard"
                style={{ padding: '1.25rem 0.75rem' }}
              >
                <ShieldAlert size={36} />
                <span style={{ fontSize: '1rem', lineHeight: 1.2 }}>
                  {t.hazardTile}
                </span>
                <span style={{ fontSize: '0.7rem', opacity: 0.9, fontWeight: 500 }}>
                  {t.hazardSubtitle}
                </span>
              </button>

              {/* Tile 4: Safe Voice Feedback */}
              <button
                onClick={() => setActiveTab('FEEDBACK')}
                className="tactile-btn navy"
                style={{ padding: '1.25rem 0.75rem' }}
              >
                <Lock size={36} style={{ color: '#2dd4bf' }} />
                <span style={{ fontSize: '1rem', lineHeight: 1.2 }}>
                  {t.feedbackTile}
                </span>
                <span style={{ fontSize: '0.7rem', opacity: 0.85, fontWeight: 500 }}>
                  {t.feedbackSubtitle}
                </span>
              </button>
            </div>

            {/* Latest Pocket Witness Cryptographic Receipt Card */}
            {latestBlock && (
              <div className="tally-card" style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <QrCode size={20} style={{ color: '#009999' }} />
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                      {t.tamperEvidentReceipt}
                    </span>
                  </div>
                  <span className="badge badge-verified">
                    {latestBlock.verifiedReceiptCode}
                  </span>
                </div>

                <div style={{
                  backgroundColor: '#f1f5f9',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  fontSize: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Date & Zone:</span>
                    <span style={{ fontWeight: 600 }}>{latestBlock.date} • {latestBlock.siteZone.split('—')[0]}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Total Hours:</span>
                    <span style={{ fontWeight: 700, color: '#009999' }}>
                      {latestBlock.totalHours} hrs ({latestBlock.overtimeHours} OT)
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '0.35rem' }}>
                    <span style={{ color: '#64748b' }}>SHA-256 Hash:</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#334155' }}>
                      {latestBlock.hash.substring(0, 16)}...
                    </span>
                  </div>
                </div>

                <div style={{
                  marginTop: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#10b981',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  <CheckCircle2 size={15} />
                  <span>{t.chainStatus}</span>
                </div>
              </div>
            )}

            {/* Skill Passport quick link */}
            <button
              onClick={() => setActiveTab('PASSPORT')}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '14px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Award size={24} style={{ color: '#009999' }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                    {t.skillPassportTile}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {t.skillPassportSubtitle}
                  </div>
                </div>
              </div>
              <ChevronRight size={18} style={{ color: '#94a3b8' }} />
            </button>
          </div>
        )}

        {/* ===================================================================
            VIEW 2: WAGE GUARDIAN (PAY AUDIT & VOICE READOUT)
           =================================================================== */}
        {activeTab === 'PAY' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={() => setActiveTab('HOME')}
              style={{ fontSize: '0.85rem', color: '#009999', fontWeight: 600, alignSelf: 'flex-start' }}
            >
              ← Back to Overview
            </button>

            {/* Underpayment Alert Banner */}
            {wageAudit.isUnderpaid && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '2px solid #ef4444',
                borderRadius: '16px',
                padding: '1.25rem',
                boxShadow: '0 8px 20px rgba(239, 68, 68, 0.12)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b91c1c', marginBottom: '0.5rem' }}>
                  <AlertTriangle size={22} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                    {t.discrepancyAlert}
                  </h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#7f1d1d', lineHeight: 1.4 }}>
                  Contractor payout fell short of verified ledger hours. You are owed <strong>₹{wageAudit.discrepancyAmount}</strong> for overtime completed.
                </p>

                {/* Big Listen to Payslip Voice Button */}
                <button
                  onClick={handlePlayVoicePayslip}
                  style={{
                    marginTop: '1rem',
                    width: '100%',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
                  }}
                >
                  {isPlayingAudio ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  <span>{isPlayingAudio ? t.stopAudio : t.listenToPayslip}</span>
                  {isPlayingAudio && (
                    <div style={{ display: 'flex', gap: '3px', marginLeft: '6px' }}>
                      <span className="voice-wave-bar" />
                      <span className="voice-wave-bar" />
                      <span className="voice-wave-bar" />
                    </div>
                  )}
                </button>
              </div>
            )}

            {/* Ledger breakdown table */}
            <div className="tally-card">
              <h4 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1rem', color: '#0f172a' }}>
                {t.hoursBreakdown} ({wageAudit.period})
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>{t.regularHours}:</span>
                  <span style={{ fontWeight: 700 }}>{wageAudit.verifiedRegularHours} hrs × ₹{wageAudit.hourlyRate}/hr</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>{t.overtimeHours}:</span>
                  <span style={{ fontWeight: 700, color: '#009999' }}>
                    {wageAudit.verifiedOvertimeHours} hrs × ₹{wageAudit.hourlyRate * 2}/hr
                  </span>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', margin: '0.35rem 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>{t.verifiedNet}:</span>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#10b981' }}>
                    ₹{wageAudit.calculatedLegitimatePay}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>{t.declaredPaid}:</span>
                  <span style={{ fontWeight: 700, color: '#64748b' }}>
                    ₹{wageAudit.employerDeclaredPay}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: '#fee2e2',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  color: '#991b1b',
                  fontWeight: 800,
                }}>
                  <span>{t.differenceOwed}:</span>
                  <span>+₹{wageAudit.discrepancyAmount}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEW 3: REPORT SITE HAZARD (VOICE + PHOTO + GEMINI TRIAGE)
           =================================================================== */}
        {activeTab === 'HAZARD' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={() => setActiveTab('HOME')}
              style={{ fontSize: '0.85rem', color: '#009999', fontWeight: 600, alignSelf: 'flex-start' }}
            >
              ← Back to Overview
            </button>

            {hazardSubmittedSuccess && (
              <div style={{
                backgroundColor: '#ecfdf5',
                border: '1px solid #10b981',
                color: '#065f46',
                padding: '0.85rem',
                borderRadius: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <CheckCircle2 size={20} />
                <span>{t.hazardSuccess}</span>
              </div>
            )}

            <div className="tally-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>
                {t.hazardTile}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                Speak in your mother tongue or type. Gemini AI will auto-translate to English and alert the engineer.
              </p>

              {/* Zone selector */}
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                Site Location / Zone:
              </label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                  backgroundColor: '#ffffff',
                }}
              >
                {sector.zones.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>

              {/* Big Voice Record Button */}
              <button
                onClick={handleVoiceRecordToggle}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  borderRadius: '16px',
                  backgroundColor: isRecording ? '#ef4444' : '#009999',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                  boxShadow: isRecording ? '0 0 25px rgba(239, 68, 68, 0.5)' : '0 6px 18px rgba(0, 153, 153, 0.3)',
                }}
              >
                <Mic size={28} className={isRecording ? 'pulse-critical' : ''} />
                <span>{isRecording ? t.listening : t.tapToSpeak}</span>
              </button>

              {/* Text transcript field */}
              <textarea
                value={hazardText}
                onChange={(e) => setHazardText(e.target.value)}
                placeholder="Or type hazard details here..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                  fontFamily: 'inherit',
                }}
              />

              {/* Photo Simulator button */}
              <button
                type="button"
                onClick={() => {
                  setHazardImagePreview('https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?w=500&auto=format&fit=crop&q=60');
                }}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  border: '1px dashed #009999',
                  backgroundColor: '#f0fdfa',
                  color: '#009999',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                <Camera size={18} />
                <span>{hazardImagePreview ? '✓ Photo Attached' : 'Attach Camera Site Photo'}</span>
              </button>

              {/* Submit button */}
              <button
                onClick={handleSubmitHazard}
                disabled={!hazardText.trim() || isAnalyzingAi}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  backgroundColor: !hazardText.trim() || isAnalyzingAi ? '#94a3b8' : '#ef4444',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
                }}
              >
                {isAnalyzingAi ? (
                  <>
                    <Sparkles size={18} />
                    <span>{t.processingAI}</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>{t.submitHazard}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEW 4: SAFE VOICE ANONYMOUS FEEDBACK
           =================================================================== */}
        {activeTab === 'FEEDBACK' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={() => setActiveTab('HOME')}
              style={{ fontSize: '0.85rem', color: '#009999', fontWeight: 600, alignSelf: 'flex-start' }}
            >
              ← Back to Overview
            </button>

            {feedbackSuccess && (
              <div style={{
                backgroundColor: '#ecfdf5',
                border: '1px solid #10b981',
                color: '#065f46',
                padding: '0.85rem',
                borderRadius: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <CheckCircle2 size={20} />
                <span>Anonymous feedback saved safely! No personal identity stored.</span>
              </div>
            )}

            <div className="tally-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Lock size={20} style={{ color: '#009999' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {t.feedbackTile}
                </h3>
              </div>

              <div style={{
                backgroundColor: '#f0fdfa',
                border: '1px solid #99f6e4',
                borderRadius: '10px',
                padding: '0.65rem 0.85rem',
                fontSize: '0.75rem',
                color: '#0f766e',
                lineHeight: 1.4,
                marginBottom: '1rem',
              }}>
                🛡️ {t.anonymousNotice}
              </div>

              {/* Category */}
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                Category of Concern:
              </label>
              <select
                value={feedbackCategory}
                onChange={(e) => setFeedbackCategory(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                  backgroundColor: '#ffffff',
                }}
              >
                <option value="SUPERVISOR_CONDUCT">Supervisor Conduct & Verbal Abuse</option>
                <option value="WAGES">Wage Deductions / Unpaid Overtime</option>
                <option value="HEAT_REST">Heat, Water & Rest Facility Gaps</option>
                <option value="SAFETY_GEAR">Defective Safety Gear / Harnesses</option>
              </select>

              {/* Raw input */}
              <textarea
                value={rawFeedback}
                onChange={(e) => handleFeedbackChange(e.target.value)}
                placeholder="Share your experience freely without fear of reprisal..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                  fontFamily: 'inherit',
                }}
              />

              {/* Live AI Identity Scrubber Demonstration preview */}
              {scrubbedPreview && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px dashed #009999',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                }}>
                  <div style={{ fontSize: '0.7rem', color: '#009999', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
                    <Sparkles size={12} />
                    <span>AI Identity Scrubber (What Site Management Sees):</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#334155', fontStyle: 'italic' }}>
                    "{scrubbedPreview}"
                  </p>
                </div>
              )}

              <button
                onClick={handleSubmitFeedback}
                disabled={!rawFeedback.trim()}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  backgroundColor: !rawFeedback.trim() ? '#94a3b8' : '#009999',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(0, 153, 153, 0.3)',
                }}
              >
                <Lock size={16} />
                <span>{t.submitFeedback}</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEW 5: SKILL PASSPORT
           =================================================================== */}
        {activeTab === 'PASSPORT' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={() => setActiveTab('HOME')}
              style={{ fontSize: '0.85rem', color: '#009999', fontWeight: 600, alignSelf: 'flex-start' }}
            >
              ← Back to Overview
            </button>

            <div className="tally-card" style={{ textAlign: 'center', border: '2px solid #009999' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: '#e0f7f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                fontSize: '2.5rem',
              }}>
                {currentWorker.avatar}
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {currentWorker.name}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#009999', fontWeight: 700, marginBottom: '0.25rem' }}>
                {currentWorker.tradeRole}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>
                {currentWorker.yearsExperience} Years Verified Site Experience
              </p>

              {/* QR Code representation */}
              <div style={{
                backgroundColor: '#f1f5f9',
                padding: '1.25rem',
                borderRadius: '16px',
                display: 'inline-block',
                margin: '0 auto 1rem',
                border: '1px solid #cbd5e1',
              }}>
                <QrCode size={130} style={{ color: '#0f172a' }} />
                <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#64748b', marginTop: '0.5rem' }}>
                  ID: TLY-PASSPORT-{currentWorker.id.toUpperCase()}-VERIFIED
                </div>
              </div>

              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textAlign: 'left', marginBottom: '0.5rem', color: '#334155' }}>
                Verified Certifications:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
                {currentWorker.certifications.map((c, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.8rem',
                    backgroundColor: '#f8fafc',
                    padding: '0.4rem 0.65rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                  }}>
                    <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                    <span style={{ fontWeight: 600 }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
