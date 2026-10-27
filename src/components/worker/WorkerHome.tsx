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
  Shield,
  Wallet,
  ArrowUpRight,
  MapPin,
  Star,
  ExternalLink,
  PhoneCall,
  Check,
  RefreshCw,
  Flame,
  Droplets,
  Layers,
  Anchor,
  Wind,
  Construction,
  AlertOctagon,
} from 'lucide-react';
import { speakText, stopSpeaking } from '@/lib/speech';
import { auditWorkerPay } from '@/lib/wage-engine';
import { triageHazardReport, scrubFeedbackIdentity } from '@/lib/gemini';
import {
  INCIDENT_CLASSIFICATIONS,
  SAFETY_HAZARD_CATEGORIES,
} from '@/lib/safety-taxonomy';
import { IncidentClassification } from '@/types';

export const WorkerHome: React.FC = () => {
  const {
    currentWorker,
    sector,
    language,
    t,
    isShiftActive,
    shiftStartTime,
    clockInWithGeotag,
    clockOut,
    attendanceBlocks,
    addHazard,
    addFeedback,
    insurances,
    transactions,
    withdrawEarnings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'HOME' | 'PAY' | 'HAZARD' | 'INSURANCE' | 'WALLET' | 'PASSPORT' | 'FEEDBACK'>('HOME');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Geotag Camera Check-In Modal
  const [showGeotagModal, setShowGeotagModal] = useState<boolean>(false);
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lng: number; accuracy: number }>({
    lat: 9.9816,
    lng: 76.2999,
    accuracy: 3.2,
  });
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60'
  );

  // Hazard reporting with safety taxonomy & incident classification
  const [hazardText, setHazardText] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>(sector.zones[0]);
  const [selectedClassification, setSelectedClassification] = useState<IncidentClassification>('NEAR_MISS');
  const [selectedHazardCategory, setSelectedHazardCategory] = useState<string>('electrical_shock');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState<boolean>(false);
  const [hazardSubmittedSuccess, setHazardSubmittedSuccess] = useState<boolean>(false);
  const [hazardImagePreview, setHazardImagePreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?w=500&auto=format&fit=crop&q=60'
  );

  // Withdrawal Modal
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('3000');
  const [withdrawUpi, setWithdrawUpi] = useState<string>(`${currentWorker.phone.replace(/[^0-9]/g, '')}@oksbi`);
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);

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
    7500,
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

  // Trigger Geotag capture
  const handleOpenGeotagModal = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeoCoords({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4)),
            accuracy: Math.round(pos.coords.accuracy),
          });
        },
        () => {
          // Fallback to Kochi Metro pier 14 coordinates
          setGeoCoords({ lat: 9.9816, lng: 76.2999, accuracy: 3.5 });
        }
      );
    }
    setShowGeotagModal(true);
  };

  const handleConfirmGeotagCheckIn = async () => {
    await clockInWithGeotag(sector.zones[0], capturedPhotoUrl, geoCoords.lat, geoCoords.lng);
    setShowGeotagModal(false);
  };

  // Withdraw action
  const handleExecuteWithdrawal = () => {
    const amt = Number(withdrawAmount);
    if (!amt || amt > currentWorker.walletBalance) {
      alert('Invalid withdrawal amount or insufficient wallet balance.');
      return;
    }

    const success = withdrawEarnings(amt, withdrawUpi);
    if (success) {
      setWithdrawSuccessMsg(`₹${amt} successfully transferred to ${withdrawUpi}! Ref UTR generated.`);
      setTimeout(() => {
        setWithdrawSuccessMsg(null);
        setShowWithdrawModal(false);
      }, 3000);
    }
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
    const matchedCategory = SAFETY_HAZARD_CATEGORIES.find((c) => c.id === selectedHazardCategory);

    addHazard({
      sectorId: sector.id,
      zone: selectedZone,
      reportedByWorkerId: currentWorker.id,
      originalLanguage: language,
      voiceTranscriptRaw: hazardText,
      translatedEnglishSummary: triage.englishSummary,
      imageUrl: hazardImagePreview || undefined,
      category: matchedCategory?.name || triage.category,
      classification: selectedClassification,
      hazardIcon: matchedCategory?.iconSymbol || 'AlertTriangle',
      severity: triage.severity,
      recommendedAction: triage.recommendedAction,
    });

    setIsAnalyzingAi(false);
    setHazardSubmittedSuccess(true);
    setHazardText('');
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
      maxWidth: '440px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 80px)',
      backgroundColor: '#0e1113',
      borderRadius: '32px',
      border: '1px solid #24292f',
      boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 40px rgba(163, 230, 53, 0.08)',
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
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#a3e635',
            color: '#08090a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            fontWeight: 900,
            fontSize: '1rem',
          }}>
            :T.
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
              {currentWorker.name}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#a3e635', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>{currentWorker.tradeRole}</span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#ffa502' }}>
                <Star size={11} fill="#ffa502" />
                {currentWorker.rating} ({currentWorker.ratingCount})
              </span>
            </div>
          </div>
        </div>

        {/* Wallet Quick Balance Badge */}
        <button
          onClick={() => setActiveTab('WALLET')}
          style={{
            backgroundColor: '#14171a',
            border: '1px solid #24292f',
            padding: '0.35rem 0.65rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Wallet size={14} style={{ color: '#a3e635' }} />
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#ffffff', fontWeight: 900 }}>
            ₹{currentWorker.walletBalance}
          </span>
        </button>
      </div>

      {/* Hero Punchline Banner */}
      <div style={{
        padding: '1.25rem 1.25rem 0.65rem',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% -20%, rgba(163, 230, 53, 0.18), transparent 70%)',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.55rem',
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
          fontWeight: 800,
          color: '#a3e635',
          marginTop: '0.35rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          Count it. Prove it. Get paid.
        </div>
      </div>

      {/* Main Content Body */}
      <div style={{ padding: '0.75rem 1.25rem 5.5rem', flex: 1, overflowY: 'auto' }}>
        {/* ===================================================================
            VIEW 1: HOME (THE HIGH-ENERGY TILES)
           =================================================================== */}
        {activeTab === 'HOME' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Blended Industrial Safety Banner (Image 1 & 4 Reference) */}
            <div style={{
              backgroundColor: '#0e1113',
              border: '1px solid #24292f',
              borderRadius: '20px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: '#08090a',
                border: '1px solid #a3e635',
                overflow: 'hidden',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <img
                  src="/assets/worker_shield_mascot.png"
                  alt="Safety First"
                  style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase' }}>
                    Work Safe. Go Home Safe.
                  </span>
                  <span className="badge-lime" style={{ fontSize: '0.62rem' }}>
                    184D SAFE
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#a3e635', fontFamily: 'var(--font-mono)', fontWeight: 700, marginTop: '2px' }}>
                  OBSERVE • REPORT • PREVENT • +₹250 REWARD
                </div>
              </div>
            </div>

            {/* Live Shift Status Card */}
            <div style={{
              backgroundColor: '#14171a',
              border: isShiftActive ? '1px solid #a3e635' : '1px solid #24292f',
              borderRadius: '22px',
              padding: '1.25rem',
              boxShadow: isShiftActive ? '0 0 25px rgba(163, 230, 53, 0.2)' : 'none',
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
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: isShiftActive ? '#a3e635' : '#8b949e', textTransform: 'uppercase' }}>
                    {isShiftActive ? 'Active Shift • Recording' : 'Standby • Geotag Ready'}
                  </span>
                </div>

                {isShiftActive && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#ffffff', fontSize: '1rem' }}>
                    {formatTimer(elapsedSeconds)}
                  </span>
                )}
              </div>

              {/* Big Solid Lime Action Button (Matches attached image) */}
              <button
                onClick={() => {
                  if (isShiftActive) {
                    clockOut();
                  } else {
                    handleOpenGeotagModal();
                  }
                }}
                className="btn-lime-primary"
                style={{
                  width: '100%',
                  padding: '1.15rem',
                  fontSize: '1rem',
                  borderRadius: '16px',
                }}
              >
                <Camera size={19} />
                <span>{isShiftActive ? 'Clock Out & Save Block' : 'Geotag Photo Check-In'}</span>
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

              {/* Tile: Report Hazard (+₹250 Reward) */}
              <button
                onClick={() => setActiveTab('HAZARD')}
                className="tactile-carbon-tile"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <ShieldAlert size={22} style={{ color: '#ff4757' }} />
                  <span style={{
                    fontSize: '0.65rem',
                    backgroundColor: 'rgba(163, 230, 53, 0.2)',
                    color: '#a3e635',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '9999px',
                    fontWeight: 800,
                  }}>
                    +₹250 Reward
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
                  gap: '0.35rem',
                  border: '1px solid #1a1e22',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#8b949e' }}>Shift Duration:</span>
                    <span style={{ fontWeight: 700, color: '#f4fbe8' }}>{latestBlock.totalHours} hrs ({latestBlock.overtimeHours} OT)</span>
                  </div>

                  {latestBlock.geotagProof && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a3e635' }}>
                      <span>GPS Geotag:</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                        {latestBlock.geotagProof.latitude}°N, {latestBlock.geotagProof.longitude}°E ({latestBlock.geotagProof.siteDistanceMeters}m inside)
                      </span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #24292f', paddingTop: '0.35rem' }}>
                    <span style={{ color: '#8b949e' }}>SHA-256 Stamp:</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#a3e635', fontSize: '0.68rem' }}>
                      {latestBlock.hash.substring(0, 16)}...
                    </span>
                  </div>

                  {latestBlock.adminCountersigned && (
                    <div style={{
                      backgroundColor: 'rgba(163, 230, 53, 0.1)',
                      color: '#a3e635',
                      padding: '0.3rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}>
                      <Check size={12} />
                      <span>Supervisor Countersigned: {latestBlock.countersignedBy}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Action List: Insurance & Wallet */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                onClick={() => setActiveTab('INSURANCE')}
                style={{
                  padding: '0.85rem',
                  borderRadius: '16px',
                  backgroundColor: '#14171a',
                  border: '1px solid #24292f',
                  textAlign: 'left',
                }}
              >
                <Shield size={20} style={{ color: '#a3e635' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', marginTop: '0.4rem' }}>
                  Insurance Cover
                </div>
                <div style={{ fontSize: '0.68rem', color: '#8b949e' }}>
                  PMSBY & PM-JAY Active
                </div>
              </button>

              <button
                onClick={() => setActiveTab('WALLET')}
                style={{
                  padding: '0.85rem',
                  borderRadius: '16px',
                  backgroundColor: '#14171a',
                  border: '1px solid #24292f',
                  textAlign: 'left',
                }}
              >
                <Wallet size={20} style={{ color: '#a3e635' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', marginTop: '0.4rem' }}>
                  Wallet Payout
                </div>
                <div style={{ fontSize: '0.68rem', color: '#8b949e' }}>
                  Withdraw to UPI
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEW 2: INSURANCE POLICIES HUB
           =================================================================== */}
        {activeTab === 'INSURANCE' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={() => setActiveTab('HOME')}
              style={{ fontSize: '0.8rem', color: '#a3e635', fontWeight: 800, alignSelf: 'flex-start', fontFamily: 'var(--font-display)' }}
            >
              ← BACK TO HOME
            </button>

            <div style={{
              backgroundColor: '#14171a',
              border: '1px solid #24292f',
              borderRadius: '22px',
              padding: '1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Shield size={22} style={{ color: '#a3e635' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>
                  Active Insurance Policies
                </h3>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#8b949e', marginBottom: '1rem' }}>
                Statutory government and site welfare policies tied to your verified attendance.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {insurances.map((ins) => (
                  <div
                    key={ins.id}
                    style={{
                      backgroundColor: '#08090a',
                      border: '1px solid #1a1e22',
                      borderRadius: '14px',
                      padding: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#ffffff', maxWidth: '75%' }}>
                        {ins.name}
                      </div>
                      <span className="badge-lime" style={{ fontSize: '0.65rem' }}>
                        {ins.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.65rem 0', fontSize: '0.8rem' }}>
                      <span style={{ color: '#8b949e' }}>Coverage:</span>
                      <span style={{ fontWeight: 900, color: '#a3e635', fontSize: '1rem' }}>
                        {ins.coverageAmount}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: '#8b949e', marginBottom: '0.5rem' }}>
                      {ins.details}
                    </div>

                    <div style={{
                      backgroundColor: '#14171a',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '8px',
                      fontSize: '0.7rem',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <span>Emergency Claim Helpline:</span>
                      <a href={`tel:${ins.claimHelpline.split(' ')[0]}`} style={{ color: '#a3e635', fontWeight: 800 }}>
                        {ins.claimHelpline.split(' ')[0]}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEW 3: WALLET & INSTANT UPI WITHDRAWAL
           =================================================================== */}
        {activeTab === 'WALLET' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={() => setActiveTab('HOME')}
              style={{ fontSize: '0.8rem', color: '#a3e635', fontWeight: 800, alignSelf: 'flex-start', fontFamily: 'var(--font-display)' }}
            >
              ← BACK TO HOME
            </button>

            {/* Wallet Overview Card */}
            <div style={{
              backgroundColor: '#14171a',
              border: '1px solid #a3e635',
              borderRadius: '24px',
              padding: '1.5rem',
              boxShadow: '0 0 30px rgba(163, 230, 53, 0.15)',
            }}>
              <div style={{ fontSize: '0.75rem', color: '#8b949e', textTransform: 'uppercase', fontWeight: 700 }}>
                Available Balance
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#a3e635', fontFamily: 'var(--font-mono)', margin: '0.25rem 0' }}>
                ₹{currentWorker.walletBalance}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#8b949e' }}>
                Includes ₹{currentWorker.rewardBalance} from verified safety hazard reports
              </div>

              <button
                onClick={() => setShowWithdrawModal(true)}
                className="btn-lime-primary"
                style={{ width: '100%', marginTop: '1.25rem', padding: '0.9rem', borderRadius: '14px' }}
              >
                <ArrowUpRight size={18} />
                <span>WITHDRAW TO UPI / BANK</span>
              </button>
            </div>

            {/* Transaction Passbook */}
            <div style={{
              backgroundColor: '#14171a',
              border: '1px solid #24292f',
              borderRadius: '20px',
              padding: '1.25rem',
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
                Recent Payout Passbook
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    style={{
                      backgroundColor: '#08090a',
                      border: '1px solid #1a1e22',
                      borderRadius: '12px',
                      padding: '0.75rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff' }}>
                        {tx.note}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#8b949e', fontFamily: 'var(--font-mono)' }}>
                        {tx.date} • {tx.referenceUtr}
                      </div>
                    </div>
                    <div style={{
                      fontWeight: 900,
                      fontSize: '0.95rem',
                      color: tx.type === 'UPI_WITHDRAWAL' ? '#ff4757' : '#a3e635',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {tx.type === 'UPI_WITHDRAWAL' ? '-' : '+'}₹{tx.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            VIEW 4: WAGE GUARDIAN AUDIT & VOICE READOUT
           =================================================================== */}
        {activeTab === 'PAY' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={() => setActiveTab('HOME')}
              style={{ fontSize: '0.8rem', color: '#a3e635', fontWeight: 800, alignSelf: 'flex-start', fontFamily: 'var(--font-display)' }}
            >
              ← BACK TO HOME
            </button>

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
                    Underpayment Discrepancy Found
                  </h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#ffb8b8', lineHeight: 1.4 }}>
                  Verified ledger indicates you are owed <strong>₹{wageAudit.discrepancyAmount}</strong> for completed overtime.
                </p>

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
                </button>
              </div>
            )}

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
            VIEW 5: REPORT HAZARD WITH PHOTO & +₹250 REWARD
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
                <span>Hazard logged! Once verified by engineer, +₹250 will be credited to your wallet.</span>
              </div>
            )}

            <div style={{
              backgroundColor: '#14171a',
              border: '1px solid #24292f',
              borderRadius: '20px',
              padding: '1.25rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase' }}>
                  Report Site Hazard
                </h3>
                <span className="badge-lime">+₹250 Reward</span>
              </div>

              <p style={{ fontSize: '0.75rem', color: '#8b949e', marginBottom: '1rem' }}>
                Every verified hazard pays you a ₹250 vigilance reward. Select incident classification & hazard type from the industrial safety catalog.
              </p>

              {/* Step A: Incident Classification Selector (Image 1) */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a3e635', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    1. Incident Classification
                  </label>
                  <span style={{ fontSize: '0.68rem', color: '#8b949e' }}>
                    Right Action Saves Lives
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem', marginBottom: '0.65rem' }}>
                  {(['NEAR_MISS', 'FAC', 'MTC', 'RWC', 'LTI', 'FATALITY'] as IncidentClassification[]).map((code) => {
                    const detail = INCIDENT_CLASSIFICATIONS[code];
                    const isSelected = selectedClassification === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setSelectedClassification(code)}
                        style={{
                          padding: '0.6rem 0.4rem',
                          borderRadius: '10px',
                          border: isSelected ? `2px solid ${detail.color}` : '1px solid #24292f',
                          backgroundColor: isSelected ? detail.bgRgba : '#08090a',
                          color: isSelected ? '#ffffff' : '#8b949e',
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          textAlign: 'center',
                          cursor: 'pointer',
                          boxShadow: isSelected ? `0 0 12px ${detail.bgRgba}` : 'none',
                        }}
                      >
                        <div>{detail.shortLabel}</div>
                        <div style={{ fontSize: '0.6rem', color: detail.color, marginTop: '2px', fontWeight: 700 }}>
                          {code === 'NEAR_MISS' ? 'No Injury' : code === 'FAC' ? 'First Aid' : code === 'MTC' ? 'Medical' : code === 'RWC' ? 'Light Duty' : code === 'LTI' ? '1 Day Lost' : 'Life Critical'}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Classification Callout Card */}
                {selectedClassification && (
                  <div style={{
                    backgroundColor: '#08090a',
                    border: `1px solid ${INCIDENT_CLASSIFICATIONS[selectedClassification].borderColor}`,
                    borderRadius: '12px',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.72rem',
                    marginBottom: '1rem',
                  }}>
                    <div style={{ fontWeight: 800, color: INCIDENT_CLASSIFICATIONS[selectedClassification].color, marginBottom: '2px' }}>
                      {INCIDENT_CLASSIFICATIONS[selectedClassification].fullTitle} — {INCIDENT_CLASSIFICATIONS[selectedClassification].tagline}
                    </div>
                    <div style={{ color: '#8b949e', lineHeight: 1.35 }}>
                      <strong>Definition:</strong> {INCIDENT_CLASSIFICATIONS[selectedClassification].definition}
                    </div>
                    <div style={{ color: '#8b949e', marginTop: '2px', lineHeight: 1.35 }}>
                      <strong>Example:</strong> {INCIDENT_CLASSIFICATIONS[selectedClassification].example}
                    </div>
                  </div>
                )}
              </div>

              {/* Step B: Work Safety Icon Pack Selector (Image 2) */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a3e635', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    2. Safety Category (Icon Pack)
                  </label>
                  <span style={{ fontSize: '0.68rem', color: '#8b949e' }}>Tap to select</span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                }}>
                  {SAFETY_HAZARD_CATEGORIES.map((cat) => {
                    const isSelected = selectedHazardCategory === cat.id;
                    const renderIcon = () => {
                      switch (cat.iconSymbol) {
                        case 'Zap': return <Zap size={18} />;
                        case 'Layers': return <Layers size={18} />;
                        case 'Droplets': return <Droplets size={18} />;
                        case 'ShieldAlert': return <ShieldAlert size={18} />;
                        case 'Flame': return <Flame size={18} />;
                        case 'Anchor': return <Anchor size={18} />;
                        case 'Wind': return <Wind size={18} />;
                        case 'Construction': return <Construction size={18} />;
                        case 'Volume2': return <Volume2 size={18} />;
                        case 'Lock': return <Lock size={18} />;
                        default: return <AlertTriangle size={18} />;
                      }
                    };

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedHazardCategory(cat.id);
                          setHazardText(cat.exampleDetail);
                          setSelectedClassification(cat.defaultClassification);
                        }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.25rem',
                          padding: '0.55rem 0.25rem',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #a3e635' : '1px solid #24292f',
                          backgroundColor: isSelected ? 'rgba(163, 230, 53, 0.15)' : '#08090a',
                          color: isSelected ? '#a3e635' : '#8b949e',
                          cursor: 'pointer',
                          boxShadow: isSelected ? '0 0 15px rgba(163, 230, 53, 0.25)' : 'none',
                        }}
                        title={cat.name}
                      >
                        {renderIcon()}
                        <span style={{ fontSize: '0.58rem', fontWeight: 800, textAlign: 'center', lineHeight: 1.1 }}>
                          {cat.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location Zone */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8b949e', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block' }}>
                  Site Zone
                </label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '10px',
                    border: '1px solid #24292f',
                    fontSize: '0.8rem',
                    backgroundColor: '#08090a',
                    color: '#ffffff',
                  }}
                >
                  {sector.zones.map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>

              {/* Voice Prompt Recording Button */}
              <button
                onClick={handleVoiceRecordToggle}
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  borderRadius: '16px',
                  backgroundColor: isRecording ? '#ff4757' : '#a3e635',
                  color: isRecording ? '#ffffff' : '#08090a',
                  fontWeight: 900,
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                }}
              >
                <Mic size={22} />
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

              {/* Photo Attachment preview & file uploader */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8b949e', textTransform: 'uppercase' }}>
                    Hazard Evidence Photo
                  </label>
                  <label
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#a3e635',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      backgroundColor: '#08090a',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '8px',
                      border: '1px solid #24292f',
                    }}
                  >
                    <Camera size={14} />
                    <span>Upload / Snap Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setHazardImagePreview(ev.target?.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {hazardImagePreview && (
                  <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #24292f' }}>
                    <img src={hazardImagePreview} alt="Hazard preview" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(0,0,0,0.7)',
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.68rem',
                      color: '#a3e635',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      📸 FORENSIC SITE PHOTO ATTACHED
                    </div>
                  </div>
                )}
              </div>

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
            VIEW 6: SKILL PASSPORT & SUPERVISOR RATING
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

              {/* Supervisor Rating Star Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'rgba(255, 165, 2, 0.15)',
                color: '#ffa502',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                marginTop: '0.65rem',
                fontWeight: 800,
                fontSize: '0.85rem',
              }}>
                <Star size={16} fill="#ffa502" />
                <span>{currentWorker.rating} / 5.0 Trust Score ({currentWorker.ratingCount} Ratings)</span>
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                padding: '1rem',
                borderRadius: '16px',
                display: 'inline-block',
                margin: '1.25rem auto 1rem',
              }}>
                <QrCode size={120} style={{ color: '#08090a' }} />
              </div>

              {/* Endorsements */}
              <div style={{ textAlign: 'left', marginTop: '1rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#8b949e', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Supervisor Endorsements:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {currentWorker.supervisorEndorsements.map((end, i) => (
                    <div key={i} style={{
                      backgroundColor: '#08090a',
                      border: '1px solid #1a1e22',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      color: '#a3e635',
                      fontWeight: 700,
                    }}>
                      🏅 {end}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Geotag Photo Camera Modal */}
      {showGeotagModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div style={{
            maxWidth: '380px',
            width: '100%',
            backgroundColor: '#0e1113',
            border: '2px solid #a3e635',
            borderRadius: '24px',
            padding: '1.25rem',
            boxShadow: '0 0 40px rgba(163, 230, 53, 0.4)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a3e635', fontWeight: 900, fontSize: '0.9rem' }}>
                <Camera size={18} />
                <span>GEOTAG PROOF CAPTURE</span>
              </div>
              <button onClick={() => setShowGeotagModal(false)} style={{ color: '#8b949e', fontWeight: 800 }}>✕</button>
            </div>

            {/* Camera Viewfinder with Forensic Watermark Overlay */}
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #24292f',
              marginBottom: '1rem',
            }}>
              <img src={capturedPhotoUrl} alt="Geotag proof" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />

              {/* Real-time Forensic Watermark */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(8, 9, 10, 0.88)',
                padding: '0.5rem',
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                color: '#a3e635',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                borderTop: '1px solid #a3e635',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>📍 GPS: {geoCoords.lat}° N, {geoCoords.lng}° E</span>
                  <span>ACC: ±{geoCoords.accuracy}m</span>
                </div>
                <div>🏢 SITE: Pier Section 14 (Kochi Metro Viaduct)</div>
                <div>⏱️ TIMESTAMP: {new Date().toLocaleDateString('en-IN')} {new Date().toLocaleTimeString('en-IN')}</div>
                <div style={{ color: '#ffffff' }}>🔒 SHA-256 FORENSIC PHOTOGRAPHIC SEAL</div>
              </div>
            </div>

            <button
              onClick={handleConfirmGeotagCheckIn}
              className="btn-lime-primary"
              style={{ width: '100%', padding: '0.95rem', borderRadius: '12px' }}
            >
              <span>CONFIRM & RECORD ON-CHAIN</span>
              <Check size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div style={{
            maxWidth: '380px',
            width: '100%',
            backgroundColor: '#0e1113',
            border: '2px solid #a3e635',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: '0 0 40px rgba(163, 230, 53, 0.4)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a3e635', fontWeight: 900, fontSize: '1rem' }}>
                <Wallet size={20} />
                <span>INSTANT PAYOUT WITHDRAWAL</span>
              </div>
              <button onClick={() => setShowWithdrawModal(false)} style={{ color: '#8b949e', fontWeight: 800 }}>✕</button>
            </div>

            {withdrawSuccessMsg ? (
              <div style={{
                backgroundColor: 'rgba(163, 230, 53, 0.15)',
                color: '#a3e635',
                padding: '1rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 700,
                textAlign: 'center',
              }}>
                <CheckCircle2 size={32} style={{ margin: '0 auto 0.5rem' }} />
                <div>{withdrawSuccessMsg}</div>
              </div>
            ) : (
              <div>
                <label style={{ fontSize: '0.75rem', color: '#8b949e', display: 'block', marginBottom: '0.35rem' }}>
                  Withdrawal Amount (Max: ₹{currentWorker.walletBalance}):
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: '1px solid #24292f',
                    backgroundColor: '#08090a',
                    color: '#a3e635',
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    fontFamily: 'var(--font-mono)',
                    marginBottom: '1rem',
                  }}
                />

                <label style={{ fontSize: '0.75rem', color: '#8b949e', display: 'block', marginBottom: '0.35rem' }}>
                  Destination UPI ID:
                </label>
                <input
                  type="text"
                  value={withdrawUpi}
                  onChange={(e) => setWithdrawUpi(e.target.value)}
                  placeholder="e.g. mobile@upi or name@oksbi"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: '1px solid #24292f',
                    backgroundColor: '#08090a',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    marginBottom: '1.25rem',
                  }}
                />

                <button
                  onClick={handleExecuteWithdrawal}
                  className="btn-lime-primary"
                  style={{ width: '100%', padding: '0.95rem', borderRadius: '12px' }}
                >
                  CONFIRM TRANSFER
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
            fontWeight: 800,
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
            fontWeight: 800,
          }}
        >
          <TrendingUp size={18} />
          <span>Earnings</span>
        </button>

        {/* Central Glowing Action Button */}
        <button
          onClick={() => {
            if (isShiftActive) clockOut();
            else handleOpenGeotagModal();
          }}
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            backgroundColor: '#a3e635',
            color: '#08090a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(163, 230, 53, 0.7)',
            transform: 'translateY(-8px)',
          }}
          title={isShiftActive ? 'Clock Out' : 'Geotag Check In'}
        >
          <Zap size={24} fill="#08090a" />
        </button>

        <button
          onClick={() => setActiveTab('INSURANCE')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: activeTab === 'INSURANCE' ? '#a3e635' : '#8b949e',
            fontSize: '0.65rem',
            fontWeight: 800,
          }}
        >
          <Shield size={18} />
          <span>Policies</span>
        </button>

        <button
          onClick={() => setActiveTab('WALLET')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: activeTab === 'WALLET' ? '#a3e635' : '#8b949e',
            fontSize: '0.65rem',
            fontWeight: 800,
          }}
        >
          <Wallet size={18} />
          <span>Wallet</span>
        </button>
      </div>
    </div>
  );
};
