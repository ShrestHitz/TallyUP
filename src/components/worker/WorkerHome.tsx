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
  FileCheck,
  Search,
  ListChecks,
} from 'lucide-react';
import { speakText, stopSpeaking, playAuditoryChime, startSpeechToText } from '@/lib/speech';
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
    hazards,
    addHazard,
    addFeedback,
    insurances,
    transactions,
    withdrawEarnings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'HOME' | 'PAY' | 'HAZARD' | 'MY_REPORTS' | 'INSURANCE' | 'WALLET' | 'PASSPORT' | 'FEEDBACK'>('HOME');
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
  const [selectedHazardCategory, setSelectedHazardCategory] = useState<string>('scaffolding_height');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState<boolean>(false);
  const [hazardImagePreview, setHazardImagePreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?w=500&auto=format&fit=crop&q=60'
  );

  // Submission Confirmation Modal & Ticket
  const [submittedTicket, setSubmittedTicket] = useState<{
    id: string;
    category: string;
    classification: IncidentClassification;
    reportedAt: string;
    zone: string;
    status: string;
    reward: number;
    imageUrl?: string;
  } | null>(null);

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

  // Hazards reported by this current worker
  const myReportedHazards = hazards.filter((h) => h.reportedByWorkerId === currentWorker.id);

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
            accuracy: Number(pos.coords.accuracy.toFixed(1)),
          });
        },
        () => {
          // default coordinates
        }
      );
    }
    setShowGeotagModal(true);
  };

  const handleConfirmGeotagCheckIn = async () => {
    await clockInWithGeotag(sector.zones[0], capturedPhotoUrl, geoCoords.lat, geoCoords.lng);
    playAuditoryChime('SUCCESS');
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
      playAuditoryChime('SUCCESS');
      setWithdrawSuccessMsg(`₹${amt} successfully transferred to ${withdrawUpi}! Ref UTR generated.`);
      setTimeout(() => {
        setWithdrawSuccessMsg(null);
        setShowWithdrawModal(false);
      }, 3000);
    }
  };

  // Speech-to-text recording with Web Audio feedback
  const handleVoiceRecordToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      playAuditoryChime('START');

      const recognizer = startSpeechToText(
        language,
        (transcript) => {
          setHazardText(transcript);
        },
        () => {
          // Fallback realistic phrase in worker's tongue
          setTimeout(() => {
            if (language === 'hi') {
              setHazardText('पिलर 14 के पास तार ढीला है और काम करते समय बहुत हिल रहा है, तत्काल जांच चाहिए।');
            } else if (language === 'ta') {
              setHazardText('இரண்டாவது தூண் சாரக்கட்டு மிகவும் ஆடுகிறது, கம்பிகள் தளர்ந்து உள்ளன.');
            } else if (language === 'ml') {
              setHazardText('പില്ലർ 14-ലെ സ്കാഫോൾഡിംഗ് ഇളകി നിൽക്കുന്നു, തൊഴിലാളികൾ താഴെ വീഴാൻ സാധ്യതയുണ്ട്.');
            } else {
              setHazardText('Loose scaffolding clamp at Pier 14 vibrating violently under transit weight.');
            }
          }, 1500);
        }
      );

      // Auto stop after 5 seconds
      setTimeout(() => {
        recognizer.stop();
        setIsRecording(false);
        playAuditoryChime('STOP');
      }, 4500);
    } else {
      setIsRecording(false);
      playAuditoryChime('STOP');
    }
  };

  const handleSubmitHazard = async () => {
    if (!hazardText.trim()) return;
    setIsAnalyzingAi(true);

    const triage = await triageHazardReport(hazardText, selectedZone, sector.name, hazardImagePreview || undefined);
    const matchedCategory = SAFETY_HAZARD_CATEGORIES.find((c) => c.id === selectedHazardCategory);

    const ticketId = `hz-${Date.now().toString().slice(-4)}`;

    addHazard({
      id: ticketId,
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

    playAuditoryChime('SUCCESS');
    setIsAnalyzingAi(false);

    // Set confirmation ticket
    setSubmittedTicket({
      id: ticketId,
      category: matchedCategory?.name || triage.category,
      classification: selectedClassification,
      reportedAt: 'Just now',
      zone: selectedZone,
      status: 'SUBMITTED',
      reward: 250,
      imageUrl: hazardImagePreview || undefined,
    });

    setHazardText('');
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

  const handleSendFeedback = () => {
    if (!rawFeedback.trim()) return;
    addFeedback(rawFeedback, scrubbedPreview || rawFeedback, feedbackCategory);
    playAuditoryChime('SUCCESS');
    setFeedbackSuccess(true);
    setRawFeedback('');
    setScrubbedPreview('');
    setTimeout(() => setFeedbackSuccess(false), 4000);
  };

  return (
    <div style={{
      maxWidth: '1360px',
      margin: '0 auto',
      width: '100%',
      minHeight: 'calc(100vh - 75px)',
      padding: '1.25rem 1rem 5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    }}>
      {/* =====================================================================
          TOP EXECUTIVE HEADER & NAVIGATION BAR (RESPONSIVE LAPTOP & PHONE)
         ===================================================================== */}
      <div style={{
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '24px',
        padding: '1.25rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        {/* Worker Profile Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            backgroundColor: '#131c2a',
            border: '2px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)',
          }}>
            {currentWorker.avatar}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                {currentWorker.name}
              </h2>
              <span className="badge-lime" style={{ fontSize: '0.65rem' }}>
                ★ {currentWorker.rating} Verified
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
              {currentWorker.tradeRole} • {sector.name} ({sector.zones[0].split('—')[0]})
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          backgroundColor: '#131c2a',
          padding: '4px',
          borderRadius: '16px',
          border: '1px solid #1e293b',
          overflowX: 'auto',
          maxWidth: '100%',
        }}>
          {[
            { id: 'HOME', label: t.overviewTab || 'Overview', icon: <Activity size={16} /> },
            { id: 'PAY', label: t.earningsTab || 'Earnings', icon: <TrendingUp size={16} /> },
            { id: 'HAZARD', label: t.hazardTile || 'Report Hazard', icon: <ShieldAlert size={16} />, highlight: true },
            { id: 'MY_REPORTS', label: t.myReportsTab || 'Track Tickets', icon: <ListChecks size={16} />, count: myReportedHazards.length },
            { id: 'INSURANCE', label: t.policiesTab || 'Policies', icon: <Shield size={16} /> },
            { id: 'WALLET', label: t.walletTab || 'Wallet', icon: <Wallet size={16} /> },
            { id: 'PASSPORT', label: 'Passport', icon: <Award size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 0.95rem',
                borderRadius: '12px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
                backgroundColor: activeTab === tab.id ? '#10b981' : tab.highlight ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                border: tab.highlight && activeTab !== tab.id ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span style={{
                  backgroundColor: activeTab === tab.id ? '#090d12' : '#1e293b',
                  color: activeTab === tab.id ? '#34d399' : '#ffffff',
                  fontSize: '0.65rem',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  fontWeight: 800,
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================================
          VIEW 1: HOME SCREEN (BLENDED STANDING WORKER WITH TALLYUP BOARD)
         ===================================================================== */}
      {activeTab === 'HOME' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Punchlines Header with Editorial Italic Typography */}
          <div>
            <h1 className="punchline-italic" style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontStyle: 'italic',
              fontWeight: 500,
              color: '#f8fafc',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '0.35rem',
            }}>
              "{t.punchlineTitle || 'Every hour counts.'}"
            </h1>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem',
              fontWeight: 800,
              color: '#34d399',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              {t.punchlineSub || 'Count it. Prove it. Get paid.'}
            </p>
          </div>

          {/* Main 2-Column Responsive Layout for Laptop & Desktop */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.5rem',
            alignItems: 'stretch',
          }}>
            {/* Left Column: The Standing Safety Worker with TallyUP Report Board (Clean, Professional & Sophisticated) */}
            {/* Left Column: Sophisticated Blended Frontline Worker Holding Board (Pure illustration with no extra text/icons) */}
            <div style={{
              backgroundColor: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '24px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
              position: 'relative',
              padding: '1rem',
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                height: '460px',
                borderRadius: '18px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <img
                  src="/assets/standing_worker_tallyup_board.png"
                  alt="TallyUP Frontline Verified Worker Shift Report"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center',
                  }}
                />
              </div>
            </div>

            {/* Right Column: Shift Management, Telemetry & Proof Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Card 1: Shift Status & Geotag Camera Check-In */}
              <div style={{
                backgroundColor: '#0f172a',
                border: isShiftActive ? '2px solid #10b981' : '1px solid #1e293b',
                borderRadius: '24px',
                padding: '1.5rem',
                boxShadow: isShiftActive ? '0 0 30px rgba(16, 185, 129, 0.2)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: isShiftActive ? '#10b981' : '#64748b',
                      boxShadow: isShiftActive ? '0 0 12px #10b981' : 'none',
                    }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: isShiftActive ? '#34d399' : '#94a3b8', textTransform: 'uppercase' }}>
                      {isShiftActive ? (t.onDuty || 'On Duty — Geotagged Active') : (t.offDuty || 'Standby — Geotag Ready')}
                    </span>
                  </div>

                  {isShiftActive && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#f8fafc', fontSize: '1.15rem' }}>
                      {formatTimer(elapsedSeconds)}
                    </span>
                  )}
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={() => {
                    if (isShiftActive) {
                      clockOut();
                      playAuditoryChime('SUCCESS');
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.65rem',
                  }}
                >
                  <Camera size={20} />
                  <span>
                    {isShiftActive ? 'CLOCK OUT SHIFT' : (t.geotagCheckIn || 'GEOTAG SELFIE CHECK-IN')}
                  </span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <span>📍 Pier 14 Viaduct Centroid (9.9816° N, 76.2999° E)</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>300m Geofenced</span>
                </div>
              </div>

              {/* Card 2: Two Interactive Telemetry Tiles (Wage Guardian + Safety Vigilance) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                {/* Tile 1: Wage Guardian Audio Audit */}
                <button
                  onClick={() => setActiveTab('PAY')}
                  className="tactile-carbon-tile"
                  style={{
                    borderColor: wageAudit.isUnderpaid ? '#ef4444' : '#1e293b',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <TrendingUp size={24} style={{ color: wageAudit.isUnderpaid ? '#ef4444' : '#10b981' }} />
                    {wageAudit.isUnderpaid && (
                      <span className="badge-danger" style={{ fontSize: '0.65rem' }}>
                        -₹{wageAudit.discrepancyAmount} Owed
                      </span>
                    )}
                  </div>
                  <div style={{ marginTop: '0.85rem' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>Wage Guardian</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>
                      {wageAudit.isUnderpaid ? 'Underpayment detected' : '8.0h audited & clear'}
                    </div>
                  </div>
                </button>

                {/* Tile 2: Safety Vigilance Reward Card */}
                <button
                  onClick={() => setActiveTab('HAZARD')}
                  className="tactile-carbon-tile"
                  style={{ padding: '1.25rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <ShieldAlert size={24} style={{ color: '#f59e0b' }} />
                    <span className="badge-lime" style={{ fontSize: '0.65rem' }}>
                      +₹250 Reward
                    </span>
                  </div>
                  <div style={{ marginTop: '0.85rem' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>Report Hazard</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>
                      Photo & voice note in native tongue
                    </div>
                  </div>
                </button>
              </div>

              {/* Card 3: Pocket Witness Cryptographic Ledger Card */}
              {latestBlock && (
                <div style={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '20px',
                  padding: '1.25rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <QrCode size={18} style={{ color: '#10b981' }} />
                      <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#f8fafc', textTransform: 'uppercase' }}>
                        Pocket Witness Block
                      </span>
                    </div>
                    <span className="badge-lime">
                      {latestBlock.verifiedReceiptCode}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Block Hash:</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: '#34d399' }}>
                        {latestBlock.hash.substring(0, 20)}...
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>GPS Proof:</span>
                      <span style={{ color: '#cbd5e1' }}>
                        {latestBlock.geotagProof?.latitude}° N, {latestBlock.geotagProof?.longitude}° E (±{latestBlock.geotagProof?.accuracyMeters}m)
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Supervisor Countersign:</span>
                      <span style={{ color: latestBlock.adminCountersigned ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                        {latestBlock.adminCountersigned ? '✓ Signed by Lead Engineer' : '⏳ Pending Counter-check'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 2: HAZARD REPORTING (SIMPLIFIED & INTUITIVE FOR WORKERS)
         ===================================================================== */}
      {activeTab === 'HAZARD' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '840px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() => setActiveTab('HOME')}
              style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 800 }}
            >
              ← Back to Overview
            </button>
            <button
              onClick={() => setActiveTab('MY_REPORTS')}
              style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <ListChecks size={16} />
              <span>Track My Tickets ({myReportedHazards.length})</span>
            </button>
          </div>

          <div style={{
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '24px',
            padding: '1.75rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#f8fafc' }}>
                  Report Site Hazard
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                  Every verified hazard pays you a ₹250 cash vigilance reward to your wallet.
                </p>
              </div>
              <span className="badge-lime" style={{ fontSize: '0.75rem' }}>+₹250 REWARD</span>
            </div>

            {/* Step 1: Visual Hazard Category Selector */}
            <div style={{ margin: '1.5rem 0' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '0.65rem', display: 'block' }}>
                1. Select Hazard Type (Tap to Choose)
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
                {[
                  { id: 'scaffolding_height', label: 'Scaffold & Height', icon: <Layers size={22} />, desc: 'Loose planks, no harness' },
                  { id: 'electrical_shock', label: 'Electrical Shock', icon: <Zap size={22} />, desc: 'Exposed wire, wet box' },
                  { id: 'slip_trip_wet', label: 'Wet Floor / Slip', icon: <Droplets size={22} />, desc: 'Oil slick, gravel spill' },
                  { id: 'missing_ppe', label: 'Missing Safety Gear', icon: <ShieldAlert size={22} />, desc: 'No helmet, worn boots' },
                  { id: 'fire_hot_work', label: 'Fire / Sparks', icon: <Flame size={22} />, desc: 'Hot work near diesel' },
                  { id: 'crane_overhead', label: 'Crane / Heavy Load', icon: <Anchor size={22} />, desc: 'Overhead hoisted rebar' },
                ].map((item) => {
                  const isSelected = selectedHazardCategory === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedHazardCategory(item.id);
                        playAuditoryChime('START');
                      }}
                      style={{
                        padding: '0.85rem 0.5rem',
                        borderRadius: '16px',
                        backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.15)' : '#131c2a',
                        border: isSelected ? '2px solid #10b981' : '1px solid #1e293b',
                        color: isSelected ? '#34d399' : '#94a3b8',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {item.icon}
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                        {item.label}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#64748b', lineHeight: 1.2 }}>
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Photo Evidence Capture / Upload */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  2. Photo Evidence (Snap or Upload)
                </label>
                <label
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#34d399',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: '#131c2a',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '10px',
                    border: '1px solid #1e293b',
                  }}
                >
                  <Camera size={14} />
                  <span>Choose / Snap Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setHazardImagePreview(ev.target?.result as string);
                          playAuditoryChime('SUCCESS');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {hazardImagePreview && (
                <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1e293b' }}>
                  <img src={hazardImagePreview} alt="Evidence preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(9, 13, 18, 0.85)',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.72rem',
                    color: '#34d399',
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <span>📸 FORENSIC SITE EVIDENCE ATTACHED</span>
                    <span>GPS: 9.9816° N, 76.2999° E</span>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Native Voice Prompt Recording or Text Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem', display: 'block' }}>
                3. Voice Note or Details (In Your Language)
              </label>

              <button
                type="button"
                onClick={handleVoiceRecordToggle}
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  borderRadius: '16px',
                  backgroundColor: isRecording ? '#ef4444' : '#131c2a',
                  border: isRecording ? '2px solid #ef4444' : '1px solid #1e293b',
                  color: isRecording ? '#ffffff' : '#34d399',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.85rem',
                }}
              >
                <Mic size={22} />
                <span>{isRecording ? 'RECORDING... SPEAK NOW IN YOUR LANGUAGE' : 'TAP TO SPEAK VOICE NOTE'}</span>
              </button>

              <textarea
                value={hazardText}
                onChange={(e) => setHazardText(e.target.value)}
                placeholder="Or type hazard details in any language..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  border: '1px solid #1e293b',
                  fontSize: '0.85rem',
                  backgroundColor: '#090d12',
                  color: '#f8fafc',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitHazard}
              disabled={!hazardText.trim() || isAnalyzingAi}
              className="btn-lime-primary"
              style={{
                width: '100%',
                padding: '1.1rem',
                fontSize: '1rem',
                borderRadius: '16px',
              }}
            >
              {isAnalyzingAi ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Submitting to Supervisor Queue...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>SUBMIT HAZARD TICKET (+₹250 REWARD)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          HAZARD SUBMISSION CONFIRMATION MODAL WITH TICKET TRACKING CODE
         ===================================================================== */}
      {submittedTicket && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(9, 13, 18, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
          zIndex: 200,
          animation: 'fadeIn 0.2s ease forwards',
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            backgroundColor: '#0f172a',
            border: '2px solid #10b981',
            borderRadius: '28px',
            padding: '2rem 1.75rem',
            textAlign: 'center',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 30px rgba(16, 185, 129, 0.25)',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              color: '#090d12',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <Check size={32} strokeWidth={3} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.35rem' }}>
              Hazard Ticket Dispatched!
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Your report has been logged into the supervisor cross-audit radar with SHA-256 integrity.
            </p>

            {/* Ticket Details Box */}
            <div style={{
              backgroundColor: '#131c2a',
              border: '1px solid #1e293b',
              borderRadius: '16px',
              padding: '1rem',
              textAlign: 'left',
              marginBottom: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.8rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Tracking ID:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#34d399' }}>
                  #{submittedTicket.id.toUpperCase()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Category:</span>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>{submittedTicket.category}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Reward Status:</span>
                <span style={{ color: '#f59e0b', fontWeight: 800 }}>+₹250 Pending Verification</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Live Queue:</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>Dispatched to Lead Engineer</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  setSubmittedTicket(null);
                  setActiveTab('MY_REPORTS');
                }}
                className="btn-lime-primary"
                style={{ flex: 1, padding: '0.85rem', borderRadius: '12px', fontSize: '0.85rem' }}
              >
                Track Ticket Status
              </button>
              <button
                onClick={() => {
                  setSubmittedTicket(null);
                  setActiveTab('HOME');
                }}
                className="btn-carbon-secondary"
                style={{ flex: 1, padding: '0.85rem', borderRadius: '12px', fontSize: '0.85rem' }}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 3: TRACK MY REPORTS (LIVE STATUS TIMELINE FOR WORKERS)
         ===================================================================== */}
      {activeTab === 'MY_REPORTS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '840px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() => setActiveTab('HOME')}
              style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 800 }}
            >
              ← Back to Overview
            </button>
            <button
              onClick={() => setActiveTab('HAZARD')}
              className="btn-lime-primary"
              style={{ padding: '0.55rem 1rem', fontSize: '0.8rem', borderRadius: '10px' }}
            >
              + Report New Hazard
            </button>
          </div>

          <div style={{
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '24px',
            padding: '1.75rem',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.35rem' }}>
              My Safety Hazard Tickets ({myReportedHazards.length})
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
              Track verification status and watch cash vigilance rewards get credited to your wallet.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myReportedHazards.map((h) => {
                const isResolved = h.status === 'RESOLVED';
                const isUnderReview = h.status === 'SUBMITTED';
                const isInProgress = h.status === 'IN_PROGRESS';

                return (
                  <div
                    key={h.id}
                    style={{
                      backgroundColor: '#131c2a',
                      border: isResolved ? '1px solid #10b981' : '1px solid #1e293b',
                      borderRadius: '18px',
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>
                          {h.category}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                          📍 {h.zone.split('—')[0]} • #{h.id.toUpperCase()} • {h.reportedAt}
                        </div>
                      </div>

                      <span style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        backgroundColor: isResolved ? 'rgba(16, 185, 129, 0.15)' : isInProgress ? 'rgba(6, 182, 212, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: isResolved ? '#34d399' : isInProgress ? '#06b6d4' : '#f59e0b',
                        border: `1px solid ${isResolved ? '#10b981' : isInProgress ? '#06b6d4' : '#f59e0b'}`,
                      }}>
                        {isResolved ? '✓ Verified & +₹250 Paid' : isInProgress ? '⚡ Safety Crew Dispatched' : '⏳ Supervisor Review'}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4, margin: '0.75rem 0' }}>
                      "{h.translatedEnglishSummary || h.voiceTranscriptRaw}"
                    </p>

                    {/* Visual Progress Timeline */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#090d12',
                      borderRadius: '12px',
                      padding: '0.75rem 1rem',
                      marginTop: '0.75rem',
                      fontSize: '0.72rem',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#34d399', fontWeight: 700 }}>
                        <Check size={14} />
                        <span>1. Logged</span>
                      </div>
                      <span style={{ color: '#334155' }}>➔</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: isInProgress || isResolved ? '#34d399' : '#f59e0b', fontWeight: 700 }}>
                        {isInProgress || isResolved ? <Check size={14} /> : <Clock size={14} />}
                        <span>2. Inspected</span>
                      </div>
                      <span style={{ color: '#334155' }}>➔</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: isResolved ? '#34d399' : '#64748b', fontWeight: 700 }}>
                        {isResolved ? <Award size={14} /> : <Lock size={14} />}
                        <span>3. ₹250 Paid</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 4: WAGE GUARDIAN & AUDIO PAYSLIP AUDIT
         ===================================================================== */}
      {activeTab === 'PAY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '840px', margin: '0 auto', width: '100%' }}>
          <button
            onClick={() => setActiveTab('HOME')}
            style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 800, alignSelf: 'flex-start' }}
          >
            ← Back to Overview
          </button>

          {wageAudit.isUnderpaid && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid #ef4444',
              borderRadius: '24px',
              padding: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', marginBottom: '0.5rem' }}>
                <AlertTriangle size={22} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900 }}>
                  Underpayment Discrepancy Found
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#fca5a5', lineHeight: 1.5 }}>
                Your cryptographic ledger indicates you completed verified overtime hours. You are owed <strong>₹{wageAudit.discrepancyAmount}</strong> by the contractor.
              </p>

              <button
                onClick={handlePlayVoicePayslip}
                className="btn-lime-primary"
                style={{
                  marginTop: '1.25rem',
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '14px',
                  backgroundColor: '#ef4444',
                  boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
                }}
              >
                {isPlayingAudio ? <VolumeX size={18} /> : <Volume2 size={18} />}
                <span>{isPlayingAudio ? 'STOP VOICE' : 'LISTEN TO PAYSLIP IN NATIVE TONGUE'}</span>
              </button>
            </div>
          )}

          <div style={{
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '24px',
            padding: '1.5rem',
          }}>
            <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#f8fafc', marginBottom: '1.25rem' }}>
              Verified Hours & Statutory Calculation
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Regular Verified Hours:</span>
                <span style={{ fontWeight: 700, color: '#f8fafc' }}>
                  {wageAudit.verifiedRegularHours}h × ₹{wageAudit.hourlyRate}/h
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Overtime Hours (2x Statutory Rate):</span>
                <span style={{ fontWeight: 800, color: '#34d399' }}>
                  {wageAudit.verifiedOvertimeHours}h × ₹{wageAudit.hourlyRate * 2}/h
                </span>
              </div>

              <div style={{ borderTop: '1px solid #1e293b', margin: '0.5rem 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Verified Statutory Wage:</span>
                <span style={{ fontWeight: 900, fontSize: '1.2rem', color: '#34d399' }}>
                  ₹{wageAudit.calculatedLegitimatePay}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Contractor Disbursed:</span>
                <span style={{ fontWeight: 700, color: '#94a3b8' }}>
                  ₹{wageAudit.employerDeclaredPay}
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                color: '#ef4444',
                fontWeight: 900,
                marginTop: '0.5rem',
              }}>
                <span>Discrepancy Owed to You:</span>
                <span>+₹{wageAudit.discrepancyAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 5: WALLET & INSTANT UPI WITHDRAWAL
         ===================================================================== */}
      {activeTab === 'WALLET' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '840px', margin: '0 auto', width: '100%' }}>
          <button
            onClick={() => setActiveTab('HOME')}
            style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 800, alignSelf: 'flex-start' }}
          >
            ← Back to Overview
          </button>

          <div style={{
            backgroundColor: '#0f172a',
            border: '2px solid #10b981',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 20px 50px rgba(16, 185, 129, 0.15)',
          }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
              Available Balance (Wallet)
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#34d399', fontFamily: 'var(--font-mono)', margin: '0.35rem 0' }}>
              ₹{currentWorker.walletBalance}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Includes ₹{currentWorker.rewardBalance} from verified safety vigilance rewards
            </div>

            <button
              onClick={() => setShowWithdrawModal(true)}
              className="btn-lime-primary"
              style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', borderRadius: '16px' }}
            >
              <ArrowUpRight size={18} />
              <span>WITHDRAW EARNINGS TO UPI / BANK</span>
            </button>
          </div>

          {/* Passbook */}
          <div style={{
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '24px',
            padding: '1.5rem',
          }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1rem' }}>
              Payout & Reward Passbook
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    backgroundColor: '#131c2a',
                    border: '1px solid #1e293b',
                    borderRadius: '14px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#f8fafc' }}>
                      {tx.type === 'UPI_WITHDRAWAL' ? 'UPI Withdrawal' : 'Hazard Vigilance Reward'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                      {tx.date} • Ref: {tx.referenceUtr}
                    </div>
                  </div>
                  <div style={{
                    fontWeight: 900,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.05rem',
                    color: tx.type === 'UPI_WITHDRAWAL' ? '#94a3b8' : '#34d399',
                  }}>
                    {tx.type === 'UPI_WITHDRAWAL' ? `-₹${tx.amount}` : `+₹${tx.amount}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 6: ACTIVE STATUTORY INSURANCE POLICIES
         ===================================================================== */}
      {activeTab === 'INSURANCE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '840px', margin: '0 auto', width: '100%' }}>
          <button
            onClick={() => setActiveTab('HOME')}
            style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 800, alignSelf: 'flex-start' }}
          >
            ← Back to Overview
          </button>

          <div style={{
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '24px',
            padding: '1.75rem',
          }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.35rem' }}>
              Active Statutory Insurance Policies
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
              Tied to your daily verified attendance on the Kochi Metro Pier 14 construction site.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {insurances.map((ins) => (
                <div
                  key={ins.id}
                  style={{
                    backgroundColor: '#131c2a',
                    border: '1px solid #1e293b',
                    borderRadius: '16px',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f8fafc' }}>
                      {ins.name}
                    </div>
                    <span className="badge-lime">{ins.status}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.75rem 0', fontSize: '0.85rem' }}>
                    <span style={{ color: '#94a3b8' }}>Coverage Protection:</span>
                    <span style={{ fontWeight: 900, color: '#34d399', fontSize: '1.15rem' }}>
                      {ins.coverageAmount}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                    {ins.details}
                  </p>

                  <div style={{
                    backgroundColor: '#090d12',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ color: '#94a3b8' }}>24x7 Claims Helpline:</span>
                    <a href={`tel:${ins.claimHelpline.split(' ')[0]}`} style={{ color: '#34d399', fontWeight: 800 }}>
                      {ins.claimHelpline}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 7: SKILL PASSPORT & SUPERVISOR TRUST RATING
         ===================================================================== */}
      {activeTab === 'PASSPORT' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '840px', margin: '0 auto', width: '100%' }}>
          <button
            onClick={() => setActiveTab('HOME')}
            style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 800, alignSelf: 'flex-start' }}
          >
            ← Back to Overview
          </button>

          <div style={{
            backgroundColor: '#0f172a',
            border: '2px solid #10b981',
            borderRadius: '24px',
            padding: '2rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
              {currentWorker.avatar}
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f8fafc' }}>
              {currentWorker.name}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#34d399', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              {currentWorker.tradeRole}
            </p>

            {/* Stars */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', margin: '1rem 0' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  fill={star <= Math.round(currentWorker.rating) ? '#f59e0b' : 'transparent'}
                  style={{ color: '#f59e0b' }}
                />
              ))}
              <span style={{ fontWeight: 900, fontSize: '1.15rem', color: '#ffffff', marginLeft: '0.5rem' }}>
                {currentWorker.rating} / 5.0
              </span>
            </div>

            <div style={{
              backgroundColor: '#131c2a',
              border: '1px solid #1e293b',
              borderRadius: '16px',
              padding: '1.25rem',
              textAlign: 'left',
              marginTop: '1.25rem',
            }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.65rem' }}>
                Supervisor Trust Endorsements ({currentWorker.supervisorEndorsements.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {currentWorker.supervisorEndorsements.map((end, idx) => (
                  <div key={idx} style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                    <span>"{end}"</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          GEOTAG CAMERA CHECK-IN MODAL (KAVACH PROOF ENGINE)
         ===================================================================== */}
      {showGeotagModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(9, 13, 18, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
          zIndex: 200,
          animation: 'fadeIn 0.2s ease forwards',
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            backgroundColor: '#0f172a',
            border: '2px solid #10b981',
            borderRadius: '28px',
            padding: '1.75rem',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 30px rgba(16, 185, 129, 0.25)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Camera size={20} style={{ color: '#10b981' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f8fafc' }}>
                  Geotagged Photo Proof
                </h3>
              </div>
              <span className="badge-lime">GEOFENCE ACTIVE</span>
            </div>

            {/* Camera Viewfinder with GPS Watermark */}
            <div style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid #1e293b',
              marginBottom: '1.25rem',
            }}>
              <img
                src={capturedPhotoUrl}
                alt="Captured Selfie"
                style={{ width: '100%', height: '260px', objectFit: 'cover' }}
              />

              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(9, 13, 18, 0.85)',
                backdropFilter: 'blur(6px)',
                padding: '0.65rem 0.85rem',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: '#34d399',
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div>LAT: {geoCoords.lat}° N • LON: {geoCoords.lng}° E</div>
                  <div>ACCURACY: ±{geoCoords.accuracy}m • SITE: Pier 14</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div>{new Date().toISOString().substring(11, 19)} UTC</div>
                  <div style={{ color: '#10b981', fontWeight: 800 }}>✓ IN GEOFENCE</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowGeotagModal(false)}
                className="btn-carbon-secondary"
                style={{ flex: 1, padding: '0.9rem', borderRadius: '12px' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmGeotagCheckIn}
                className="btn-lime-primary"
                style={{ flex: 2, padding: '0.9rem', borderRadius: '12px' }}
              >
                <span>CONFIRM CHECK-IN PROOF</span>
                <Check size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          WITHDRAWAL MODAL
         ===================================================================== */}
      {showWithdrawModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(9, 13, 18, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
          zIndex: 200,
        }}>
          <div style={{
            maxWidth: '460px',
            width: '100%',
            backgroundColor: '#0f172a',
            border: '2px solid #10b981',
            borderRadius: '28px',
            padding: '1.75rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f8fafc' }}>
                Instant UPI Withdrawal
              </h3>
              <button onClick={() => setShowWithdrawModal(false)} style={{ color: '#94a3b8', fontSize: '1.2rem' }}>✕</button>
            </div>

            {withdrawSuccessMsg ? (
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                padding: '1.25rem',
                borderRadius: '16px',
                textAlign: 'center',
                fontWeight: 700,
              }}>
                ✓ {withdrawSuccessMsg}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>
                    Enter Amount (₹): Available ₹{currentWorker.walletBalance}
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '12px',
                      backgroundColor: '#131c2a',
                      border: '1px solid #1e293b',
                      color: '#ffffff',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>
                    UPI ID or Bank Account:
                  </label>
                  <input
                    type="text"
                    value={withdrawUpi}
                    onChange={(e) => setWithdrawUpi(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '12px',
                      backgroundColor: '#131c2a',
                      border: '1px solid #1e293b',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <button
                  onClick={handleExecuteWithdrawal}
                  className="btn-lime-primary"
                  style={{ width: '100%', padding: '1rem', borderRadius: '14px', marginTop: '0.5rem' }}
                >
                  CONFIRM TRANSFER
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
