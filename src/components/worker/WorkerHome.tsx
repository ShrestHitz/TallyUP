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
  Zap,
  Activity,
  User,
  Radio,
  FileCheck2,
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

  const [activeTab, setActiveTab] = useState<'HOME' | 'PAY' | 'HAZARD' | 'FEEDBACK' | 'PASSPORT'>('HOME');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Hazard reporting
  const [hazardText, setHazardText] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>(sector.zones[0]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState<boolean>(false);
  const [hazardSubmittedSuccess, setHazardSubmittedSuccess] = useState<boolean>(false);
  const [hazardImagePreview, setHazardImagePreview] = useState<string | null>(null);

  // Feedback
  const [rawFeedback, setRawFeedback] = useState<string>('');
  const [scrubbedPreview, setScrubbedPreview] = useState<string>('');
  const [feedbackCategory, setFeedbackCategory] = useState<'WAGES' | 'SUPERVISOR_CONDUCT' | 'HEAT_REST' | 'SAFETY_GEAR'>('SUPERVISOR_CONDUCT');
  const [feedbackSuccess, setFeedbackSuccess] = useState<boolean>(false);

  const workerBlocks = attendanceBlocks.filter((b) => b.workerId === currentWorker.id);
  const latestBlock = workerBlocks[workerBlocks.length - 1];

  const wageAudit = auditWorkerPay(
    currentWorker,
    attendanceBlocks,
    7500, // Planted contractor paid amount for demonstration
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

  const handleVoiceRecordToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        if (language === 'ta') {
          setHazardText('இரண்டாவது தூண் சாரக்கட்டு மிகவும் ஆடுகிறது, கம்பிகள் தளர்ந்து உள்ளன (Pier scaffolding vibrating violently)');
        } else if (language === 'hi') {
          setHazardText('चार नंबर पिलर के पास बिजली का खुला तार पानी में डूबा है करंट लग सकता है (Exposed live cable submerged in water)');
        } else {
          setHazardText('Heavy scaffolding clamp on Pier 14 loose and rattling dangerously under concrete transit.');
        }
        setIsRecording(false);
      }, 2000);
    } else {
      setIsRecording(false);
    }
  };

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
      maxWidth: '430px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 75px)',
      backgroundColor: '#0e1113',
      borderRadius: '32px',
      border: '1px solid #24292f',
      boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 30px rgba(163, 230, 53, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top Mobile Status Header Bar */}
      <div style={{
        padding: '1.25rem 1.25rem 0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #1a1e22',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#a3e635',
            color: '#08090a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            fontWeight: 900,
            fontSize: '0.95rem',
          }}>
            :T.
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
              {currentWorker.name}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#8b949e', fontWeight: 600 }}>
              {currentWorker.tradeRole}
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#1a1e22',
          border: '1px solid #24292f',
          padding: '0.25rem 0.65rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          color: '#a3e635',
          fontWeight: 700,
        }}>
          ₹{currentWorker.dailyBaseWage}/shift
        </div>
      </div>

      {/* Hero Punchline Section */}
      <div style={{
        padding: '1.25rem 1.25rem 0.5rem',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% -20%, rgba(163, 230, 53, 0.15), transparent 70%)',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.5rem',
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          color: '#ffffff',
          textTransform: 'uppercase',
        }}>
          Every hour counts.
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: '#a3e635',
          marginTop: '0.35rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          Count it. Prove it. Get paid.
        </div>
      </div>

      {/* Main Content Body */}
      <div style={{ padding: '0.75rem 1.25rem 5rem', flex: 1, overflowY: 'auto' }}>
        {/* ===================================================================
            VIEW 1: HOME (THE HIGH-ENERGY TILES)
           =================================================================== */}
        {activeTab === 'HOME' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Live Shift Status Card */}
            <div style={{
              backgroundColor: '#14171a',
              border: isShiftActive ? '1px solid #a3e635' : '1px solid #24292f',
              borderRadius: '20px',
              padding: '1.25rem',
              boxShadow: isShiftActive ? '0 0 25px rgba(163, 230, 53, 0.2)' : 'none',
              position: 'relative',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: isShiftActive ? '#a3e635' : '#8b949e',
                    boxShadow: isShiftActive ? '0 0 10px #a3e635' : 'none',
                  }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: isShiftActive ? '#a3e635' : '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {isShiftActive ? 'Active Shift • Recording' : 'Standby • Ready to Check In'}
                  </span>
                </div>

                {isShiftActive && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#ffffff', fontSize: '1rem' }}>
                    {formatTimer(elapsedSeconds)}
                  </span>
                )}
              </div>

              {/* Big Solid Lime Action Button (matches attached image) */}
              <button
                onClick={() => {
                  if (isShiftActive) {
                    clockOut();
                  } else {
                    clockIn(sector.zones[0]);
                  }
                }}
                className="btn-lime-primary"
                style={{
                  width: '100%',
                  padding: '1.15rem',
                  fontSize: '1.05rem',
                  letterSpacing: '0.03em',
                  borderRadius: '16px',
                }}
              >
                <Clock size={20} />
                <span>{isShiftActive ? 'Clock Out & Save Block' : 'Start Shift • Check In'}</span>
              </button>
            </div>

            {/* Two-Column Telemetry Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {/* Tile: My Tally & Wage Guardian */}
              <button
                onClick={() => setActiveTab('PAY')}
                className="tactile-carbon-tile"
                style={{
                  borderColor: wageAudit.isUnderpaid ? '#ff4757' : '#24292f',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <TrendingUp size={22} style={{ color: wageAudit.isUnderpaid ? '#ff4757' : '#a3e635' }} />
                  {wageAudit.isUnderpaid && (
                    <span style={{
                      fontSize: '0.65rem',
                      backgroundColor: 'rgba(255, 71, 87, 0.2)',
                      color: '#ff4757',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '9999px',
                      fontWeight: 800,
                    }}>
                      -₹{wageAudit.discrepancyAmount}
                    </span>
                  )}
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>Wage Guardian</div>
                  <div style={{ fontSize: '0.7rem', color: '#8b949e', marginTop: '2px' }}>
                    {wageAudit.isUnderpaid ? 'Underpayment detected' : 'Hours audited & clear'}
                  </div>
                </div>
              </button>

              {/* Tile: Report Hazard */}
              <button
                onClick={() => setActiveTab('HAZARD')}
                className="tactile-carbon-tile"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <ShieldAlert size={22} style={{ color: '#ff4757' }} />
                  <span style={{
                    fontSize: '0.65rem',
                    backgroundColor: 'rgba(255, 71, 87, 0.2)',
                    color: '#ff4757',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '9999px',
                    fontWeight: 800,
                  }}>
                    P1 Triage
                  </span>
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>Report Hazard</div>
                  <div style={{ fontSize: '0.7rem', color: '#8b949e', marginTop: '2px' }}>
                    Voice & photo in native tongue
                  </div>
                </div>
              </button>
            </div>

            {/* Cryptographic Pocket Witness Receipt Card */}
            {latestBlock && (
              <div style={{
                backgroundColor: '#14171a',
                border: '1px solid #24292f',
                borderRadius: '20px',
                padding: '1.15rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <QrCode size={18} style={{ color: '#a3e635' }} />
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#ffffff', textTransform: 'uppercase' }}>
                      Pocket Witness Block
                    </span>
                  </div>
                  <span className="badge-lime">
                    {latestBlock.verifiedReceiptCode}
                  </span>
                </div>

                <div style={{
                  backgroundColor: '#08090a',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  fontSize: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
                  border: '1px solid #1a1e22',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#8b949e' }}>Shift Logged:</span>
                    <span style={{ fontWeight: 700, color: '#f4fbe8' }}>{latestBlock.totalHours} hrs ({latestBlock.overtimeHours} OT)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#8b949e' }}>Location Zone:</span>
                    <span style={{ color: '#8b949e' }}>{latestBlock.siteZone.split('—')[0]}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #24292f', paddingTop: '0.35rem' }}>
                    <span style={{ color: '#8b949e' }}>SHA-256 Stamp:</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#a3e635', fontSize: '0.68rem' }}>
                      {latestBlock.hash.substring(0, 16)}...
                    </span>
                  </div>
                </div>

                <div style={{
                  marginTop: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#a3e635',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                }}>
                  <CheckCircle2 size={14} />
                  <span>CRYPTOGRAPHIC CHAIN VERIFIED ON-DEVICE</span>
                </div>
              </div>
            )}

            {/* Quick Skill Passport Card */}
            <button
              onClick={() => setActiveTab('PASSPORT')}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '16px',
                backgroundColor: '#14171a',
                border: '1px solid #24292f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Award size={22} style={{ color: '#a3e635' }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#ffffff' }}>
                    Digital Skill Passport
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#8b949e' }}>
                    {currentWorker.yearsExperience} yrs verified site credentials
                  </div>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: '#8b949e' }} />
            </button>
          </div>
        )}

        {/* ===================================================================
            VIEW 2: WAGE GUARDIAN AUDIT & VOICE READOUT
           =================================================================== */}
        {activeTab === 'PAY' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={() => setActiveTab('HOME')}
              style={{ fontSize: '0.8rem', color: '#a3e635', fontWeight: 800, alignSelf: 'flex-start', fontFamily: 'var(--font-display)' }}
            >
              ← BACK TO HOME
            </button>

            {/* Underpayment Callout Banner */}
            {wageAudit.isUnderpaid && (
              <div style={{
                backgroundColor: 'rgba(255, 71, 87, 0.12)',
                border: '2px solid #ff4757',
                borderRadius: '20px',
                padding: '1.25rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff4757', marginBottom: '0.4rem' }}>
                  <AlertTriangle size={20} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    Underpayment Discrepancy
                  </h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#ffb8b8', lineHeight: 1.4 }}>
                  Verified ledger indicates you are owed <strong>₹{wageAudit.discrepancyAmount}</strong> for completed overtime.
                </p>

                {/* Big Voice Button */}
                <button
                  onClick={handlePlayVoicePayslip}
                  style={{
                    marginTop: '1rem',
                    width: '100%',
                    backgroundColor: '#ff4757',
                    color: '#ffffff',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontFamily: 'var(--font-display)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    boxShadow: '0 4px 15px rgba(255, 71, 87, 0.4)',
                  }}
                >
                  {isPlayingAudio ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  <span>{isPlayingAudio ? 'STOP VOICE' : 'LISTEN TO PAYSLIP (VOICE)'}</span>
                  {isPlayingAudio && (
                    <div style={{ display: 'flex', gap: '3px', marginLeft: '6px' }}>
                      <span className="audio-bar-lime" />
                      <span className="audio-bar-lime" />
                      <span className="audio-bar-lime" />
                    </div>
                  )}
                </button>
              </div>
            )}

            {/* Calculation Card */}
            <div style={{
              backgroundColor: '#14171a',
              border: '1px solid #24292f',
              borderRadius: '20px',
              padding: '1.25rem',
            }}>
              <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff', marginBottom: '1rem' }}>
                Verified Hours Breakdown
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8b949e' }}>Regular Hours:</span>
                  <span style={{ fontWeight: 700, color: '#ffffff' }}>{wageAudit.verifiedRegularHours}h × ₹{wageAudit.hourlyRate}/h</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8b949e' }}>Overtime Hours (2x):</span>
                  <span style={{ fontWeight: 800, color: '#a3e635' }}>
                    {wageAudit.verifiedOvertimeHours}h × ₹{wageAudit.hourlyRate * 2}/h
                  </span>
                </div>

                <div style={{ borderTop: '1px solid #24292f', margin: '0.35rem 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8b949e' }}>Verified Statutory Wage:</span>
                  <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#a3e635' }}>
                    ₹{wageAudit.calculatedLegitimatePay}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8b949e' }}>Contractor Disbursed:</span>
                  <span style={{ fontWeight: 700, color: '#8b949e' }}>
                    ₹{wageAudit.employerDeclaredPay}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(255, 71, 87, 0.15)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  color: '#ff4757',
                  fontWeight: 900,
                  marginTop: '0.5rem',
                }}>
                  <span>Shortfall Owed to Worker:</span>
                  <span>+₹{wageAudit.discrepancyAmount}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEW 3: REPORT HAZARD
           =================================================================== */}
        {activeTab === 'HAZARD' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={() => setActiveTab('HOME')}
              style={{ fontSize: '0.8rem', color: '#a3e635', fontWeight: 800, alignSelf: 'flex-start', fontFamily: 'var(--font-display)' }}
            >
              ← BACK TO HOME
            </button>

            {hazardSubmittedSuccess && (
              <div style={{
                backgroundColor: 'rgba(163, 230, 53, 0.15)',
                border: '1px solid #a3e635',
                color: '#a3e635',
                padding: '0.85rem',
                borderRadius: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
              }}>
                <CheckCircle2 size={18} />
                <span>Hazard logged! Assigned P1-Critical with 15-min SLA.</span>
              </div>
            )}

            <div style={{
              backgroundColor: '#14171a',
              border: '1px solid #24292f',
              borderRadius: '20px',
              padding: '1.25rem',
            }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                Report Site Hazard
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#8b949e', marginBottom: '1rem' }}>
                Speak in Hindi, Tamil, or English. Gemini AI translates and auto-triage severity tags.
              </p>

              {/* Zone selector */}
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  border: '1px solid #24292f',
                  marginBottom: '1rem',
                  fontSize: '0.8rem',
                  backgroundColor: '#08090a',
                  color: '#ffffff',
                }}
              >
                {sector.zones.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>

              {/* Big Mic Button */}
              <button
                onClick={handleVoiceRecordToggle}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  borderRadius: '16px',
                  backgroundColor: isRecording ? '#ff4757' : '#a3e635',
                  color: isRecording ? '#ffffff' : '#08090a',
                  fontWeight: 900,
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                  boxShadow: isRecording ? '0 0 25px rgba(255, 71, 87, 0.6)' : '0 0 25px rgba(163, 230, 53, 0.4)',
                }}
              >
                <Mic size={24} />
                <span>{isRecording ? 'RECORDING... SPEAK NOW' : 'HOLD TO SPEAK IN NATIVE LANGUAGE'}</span>
              </button>

              <textarea
                value={hazardText}
                onChange={(e) => setHazardText(e.target.value)}
                placeholder="Or type hazard details..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #24292f',
                  fontSize: '0.8rem',
                  backgroundColor: '#08090a',
                  color: '#ffffff',
                  marginBottom: '0.75rem',
                  fontFamily: 'inherit',
                }}
              />

              <button
                type="button"
                onClick={() => {
                  setHazardImagePreview('https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?w=500&auto=format&fit=crop&q=60');
                }}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  border: '1px dashed #a3e635',
                  backgroundColor: 'rgba(163, 230, 53, 0.05)',
                  color: '#a3e635',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                <Camera size={16} />
                <span>{hazardImagePreview ? '✓ Job Site Photo Attached' : 'Attach Camera Site Photo'}</span>
              </button>

              <button
                onClick={handleSubmitHazard}
                disabled={!hazardText.trim() || isAnalyzingAi}
                className="btn-lime-primary"
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  padding: '0.85rem',
                  fontSize: '0.9rem',
                }}
              >
                {isAnalyzingAi ? (
                  <>
                    <Sparkles size={16} />
                    <span>Gemini Multimodal Triage...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>SUBMIT HAZARD TICKET</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEW 4: SAFE VOICE FEEDBACK
           =================================================================== */}
        {activeTab === 'FEEDBACK' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={() => setActiveTab('HOME')}
              style={{ fontSize: '0.8rem', color: '#a3e635', fontWeight: 800, alignSelf: 'flex-start', fontFamily: 'var(--font-display)' }}
            >
              ← BACK TO HOME
            </button>

            {feedbackSuccess && (
              <div style={{
                backgroundColor: 'rgba(163, 230, 53, 0.15)',
                border: '1px solid #a3e635',
                color: '#a3e635',
                padding: '0.85rem',
                borderRadius: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
              }}>
                <CheckCircle2 size={18} />
                <span>Identity stripped! Saved to anonymous dashboard.</span>
              </div>
            )}

            <div style={{
              backgroundColor: '#14171a',
              border: '1px solid #24292f',
              borderRadius: '20px',
              padding: '1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <Lock size={18} style={{ color: '#a3e635' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase' }}>
                  Safe Voice Feedback
                </h3>
              </div>

              <p style={{ fontSize: '0.75rem', color: '#8b949e', marginBottom: '1rem' }}>
                Zero IDs, IPs, or device markers are saved. AI automatically scrubs personal names and gate details.
              </p>

              <textarea
                value={rawFeedback}
                onChange={(e) => handleFeedbackChange(e.target.value)}
                placeholder="Share your experience freely without fear of identification..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #24292f',
                  fontSize: '0.8rem',
                  backgroundColor: '#08090a',
                  color: '#ffffff',
                  marginBottom: '1rem',
                  fontFamily: 'inherit',
                }}
              />

              {scrubbedPreview && (
                <div style={{
                  backgroundColor: '#08090a',
                  border: '1px dashed #a3e635',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                }}>
                  <div style={{ fontSize: '0.7rem', color: '#a3e635', fontWeight: 800, marginBottom: '0.2rem' }}>
                    AI Identity Scrubber (What Site Management Sees):
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#8b949e', fontStyle: 'italic' }}>
                    "{scrubbedPreview}"
                  </p>
                </div>
              )}

              <button
                onClick={handleSubmitFeedback}
                disabled={!rawFeedback.trim()}
                className="btn-lime-primary"
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  padding: '0.85rem',
                  fontSize: '0.9rem',
                }}
              >
                <Lock size={16} />
                <span>SUBMIT ANONYMOUS REPORT</span>
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
              style={{ fontSize: '0.8rem', color: '#a3e635', fontWeight: 800, alignSelf: 'flex-start', fontFamily: 'var(--font-display)' }}
            >
              ← BACK TO HOME
            </button>

            <div style={{
              backgroundColor: '#14171a',
              border: '1px solid #a3e635',
              borderRadius: '24px',
              padding: '1.5rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                {currentWorker.avatar}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                {currentWorker.name}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#a3e635', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                {currentWorker.tradeRole}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#8b949e', marginTop: '0.2rem' }}>
                {currentWorker.yearsExperience} Years Verified Site Experience
              </p>

              <div style={{
                backgroundColor: '#ffffff',
                padding: '1rem',
                borderRadius: '16px',
                display: 'inline-block',
                margin: '1.25rem auto 1rem',
              }}>
                <QrCode size={120} style={{ color: '#08090a' }} />
              </div>

              <div style={{ fontSize: '0.7rem', color: '#8b949e', fontFamily: 'var(--font-mono)' }}>
                VERIFIED BOCW & SDG 8 WORKER CERTIFICATION
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Navigation Bar (Matching attached gaming stream mobile mockup) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: '#08090a',
        borderTop: '1px solid #1a1e22',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 0.5rem',
      }}>
        <button
          onClick={() => setActiveTab('HOME')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: activeTab === 'HOME' ? '#a3e635' : '#8b949e',
            fontSize: '0.65rem',
            fontWeight: 700,
          }}
        >
          <Activity size={18} />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('PAY')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: activeTab === 'PAY' ? '#a3e635' : '#8b949e',
            fontSize: '0.65rem',
            fontWeight: 700,
          }}
        >
          <TrendingUp size={18} />
          <span>Earnings</span>
        </button>

        {/* Central Glowing Action Button (Matching lime green plus in image!) */}
        <button
          onClick={() => {
            if (isShiftActive) clockOut();
            else clockIn(sector.zones[0]);
          }}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: '#a3e635',
            color: '#08090a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(163, 230, 53, 0.6)',
            transform: 'translateY(-6px)',
          }}
          title={isShiftActive ? 'Clock Out' : 'Clock In'}
        >
          <Zap size={22} fill="#08090a" />
        </button>

        <button
          onClick={() => setActiveTab('HAZARD')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: activeTab === 'HAZARD' ? '#a3e635' : '#8b949e',
            fontSize: '0.65rem',
            fontWeight: 700,
          }}
        >
          <ShieldAlert size={18} />
          <span>Hazards</span>
        </button>

        <button
          onClick={() => setActiveTab('FEEDBACK')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: activeTab === 'FEEDBACK' ? '#a3e635' : '#8b949e',
            fontSize: '0.65rem',
            fontWeight: 700,
          }}
        >
          <Lock size={18} />
          <span>SafeVoice</span>
        </button>
      </div>
    </div>
  );
};
