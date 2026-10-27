'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { LANGUAGE_OPTIONS } from '@/lib/i18n';
import { Language, UserRole } from '@/types';
import { ShieldCheck, HardHat, UserCheck, Building2, Check, ArrowRight, Zap, Globe2, ShieldAlert, Award, FileText, Activity } from 'lucide-react';

export const OnboardingFlow: React.FC = () => {
  const {
    onboardingStage,
    setOnboardingStage,
    language,
    setLanguage,
    userRole,
    setUserRole,
    setViewMode,
  } = useApp();

  const [step, setStep] = useState<'SPLASH' | 'LANGUAGE' | 'ROLE'>('SPLASH');

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#08090a',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient background glows */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '15%',
        width: '600px',
        height: '450px',
        background: 'radial-gradient(ellipse, rgba(163, 230, 53, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '10%',
        width: '500px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(0, 210, 211, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ===================================================================
          SCREEN 1: HERO SPLASH SCREEN WITH STANDING SAFETY WORKER BLEND
         =================================================================== */}
      {step === 'SPLASH' && (
        <div style={{
          maxWidth: '1080px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'center',
          backgroundColor: '#0e1113',
          border: '1px solid #24292f',
          borderRadius: '32px',
          padding: 'clamp(1.5rem, 4vw, 3rem)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(163, 230, 53, 0.1)',
          animation: 'fadeIn 0.5s ease forwards',
        }}>
          {/* Left Column: Punchlines & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#a3e635',
                color: '#08090a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontWeight: 900,
                fontSize: '1.3rem',
                boxShadow: '0 0 20px rgba(163, 230, 53, 0.5)',
              }}>
                :T.
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#14171a',
                border: '1px solid #24292f',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                color: '#a3e635',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                textTransform: 'uppercase',
              }}>
                <Zap size={13} />
                <span>UN SDG 8 • DECENT WORK & SAFETY</span>
              </div>
            </div>

            {/* Bold Punchline Enhancement */}
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: '#ffffff',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}>
              EVERY HOUR <br />
              <span style={{ color: '#a3e635', textShadow: '0 0 30px rgba(163, 230, 53, 0.4)' }}>
                COUNTS.
              </span>
            </h1>

            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              fontWeight: 800,
              color: '#a3e635',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '1rem',
            }}>
              Count it. Prove it. Get paid.
            </p>

            <p style={{
              fontSize: '0.88rem',
              color: '#8b949e',
              lineHeight: 1.6,
              marginBottom: '1.75rem',
              maxWidth: '460px',
            }}>
              Tamper-evident attendance ledger, geotagged photo proof of presence, voice payslip audit, safety hazard vigilance rewards, and statutory BOCW insurance for India's frontline workforce.
            </p>

            {/* 4 Telemetry Value Pills */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.65rem',
              marginBottom: '2rem',
            }}>
              <div style={{
                backgroundColor: '#14171a',
                border: '1px solid #24292f',
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
              }}>
                <div style={{ color: '#a3e635', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>180+ DAYS</div>
                <div style={{ color: '#8b949e', fontSize: '0.7rem' }}>Zero Lost Time Injuries</div>
              </div>
              <div style={{
                backgroundColor: '#14171a',
                border: '1px solid #24292f',
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
              }}>
                <div style={{ color: '#a3e635', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>+₹250 REWARD</div>
                <div style={{ color: '#8b949e', fontSize: '0.7rem' }}>Per Verified Hazard</div>
              </div>
              <div style={{
                backgroundColor: '#14171a',
                border: '1px solid #24292f',
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
              }}>
                <div style={{ color: '#00d2d3', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>SHA-256 PROOF</div>
                <div style={{ color: '#8b949e', fontSize: '0.7rem' }}>Geotagged Photo Ledger</div>
              </div>
              <div style={{
                backgroundColor: '#14171a',
                border: '1px solid #24292f',
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
              }}>
                <div style={{ color: '#00d2d3', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>INSTANT UPI</div>
                <div style={{ color: '#8b949e', fontSize: '0.7rem' }}>Daily Wage Withdrawal</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setStep('LANGUAGE')}
                className="btn-lime-primary"
                style={{ flex: 2, minWidth: '200px', padding: '1rem', fontSize: '1rem', borderRadius: '16px' }}
              >
                <span>GET STARTED (STEP 1 OF 2)</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => setOnboardingStage('APP')}
                className="btn-carbon-secondary"
                style={{ flex: 1, minWidth: '120px', padding: '1rem', fontSize: '0.85rem', borderRadius: '16px' }}
              >
                Skip to App
              </button>
            </div>
          </div>

          {/* Right Column: Blended Standing Worker & Monthly Report Hero Banner */}
          <div style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid #24292f',
            backgroundColor: '#08090a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
          }}>
            {/* Blended Standing Worker Image */}
            <div style={{ position: 'relative', width: '100%', height: '380px' }}>
              <img
                src="/assets/standing_worker_report.png"
                alt="Monthly Safety Engineer Report Generator"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  filter: 'contrast(1.05) brightness(0.95)',
                }}
              />
              {/* Carbon gradient vignette overlay to blend perfectly into dark UI */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(8,9,10,0.1) 0%, rgba(8,9,10,0.4) 60%, rgba(8,9,10,0.95) 100%)',
              }} />

              {/* Safety First Badge */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                backgroundColor: 'rgba(8, 9, 10, 0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid #a3e635',
                borderRadius: '12px',
                padding: '0.4rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#a3e635',
                  boxShadow: '0 0 10px #a3e635',
                }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  ISO 45001 SAFETY FIRST
                </span>
              </div>
            </div>

            {/* Bottom floating safety banner */}
            <div style={{
              width: '100%',
              backgroundColor: '#14171a',
              borderTop: '1px solid #24292f',
              padding: '1rem 1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase' }}>
                  Work Safe. Go Home Safe.
                </span>
                <span className="badge-lime" style={{ fontSize: '0.65rem' }}>
                  KAVACH AUDITED
                </span>
              </div>
              <div style={{
                fontSize: '0.72rem',
                color: '#a3e635',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                letterSpacing: '0.06em',
              }}>
                OBSERVE • REPORT • PREVENT
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          SCREEN 2: MULTI-LANGUAGE SELECTOR (ALL ACROSS INDIA)
         =================================================================== */}
      {step === 'LANGUAGE' && (
        <div style={{
          maxWidth: '560px',
          width: '100%',
          backgroundColor: '#0e1113',
          border: '1px solid #24292f',
          borderRadius: '28px',
          padding: '2rem 1.75rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          animation: 'fadeIn 0.4s ease forwards',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#a3e635', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <Globe2 size={14} />
              <span>Step 1 of 2 • Regional Inclusivity</span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff' }}>
              Choose Your Language
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#8b949e', marginTop: '0.25rem' }}>
              Select your native tongue for voice payslips, hazard reporting, and text prompts.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.75rem' }}>
            {LANGUAGE_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                onClick={() => setLanguage(opt.code)}
                style={{
                  padding: '0.95rem 0.85rem',
                  borderRadius: '16px',
                  backgroundColor: language === opt.code ? 'rgba(163, 230, 53, 0.15)' : '#14171a',
                  border: language === opt.code ? '2px solid #a3e635' : '1px solid #24292f',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: language === opt.code ? '0 0 20px rgba(163, 230, 53, 0.25)' : 'none',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>
                    {opt.nativeName}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#8b949e', marginTop: '2px' }}>
                    {opt.label} • {opt.region}
                  </div>
                </div>
                {language === opt.code && (
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#a3e635',
                    color: '#08090a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setStep('SPLASH')}
              className="btn-carbon-secondary"
              style={{ flex: 1, padding: '0.9rem' }}
            >
              Back
            </button>
            <button
              onClick={() => setStep('ROLE')}
              className="btn-lime-primary"
              style={{ flex: 2, padding: '0.9rem' }}
            >
              <span>NEXT: CHOOSE ROLE</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================
          SCREEN 3: ROLE SELECTOR WITH WORKER SHIELD & SUPERVISOR GRAPHICS
         =================================================================== */}
      {step === 'ROLE' && (
        <div style={{
          maxWidth: '560px',
          width: '100%',
          backgroundColor: '#0e1113',
          border: '1px solid #24292f',
          borderRadius: '28px',
          padding: '2rem 1.75rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          animation: 'fadeIn 0.4s ease forwards',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#a3e635', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <UserCheck size={14} />
              <span>Step 2 of 2 • Role Configuration</span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff' }}>
              Select Your Workspace
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#8b949e', marginTop: '0.25rem' }}>
              Choose your role to launch the tailored frontline PWA or supervisor command suite.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
            {/* Role 1: Frontline Worker (with mascot thumbnail) */}
            <div
              onClick={() => {
                setUserRole('WORKER');
                setViewMode('WORKER');
              }}
              style={{
                padding: '1.15rem',
                borderRadius: '20px',
                backgroundColor: userRole === 'WORKER' ? 'rgba(163, 230, 53, 0.12)' : '#14171a',
                border: userRole === 'WORKER' ? '2px solid #a3e635' : '1px solid #24292f',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: userRole === 'WORKER' ? '0 0 25px rgba(163, 230, 53, 0.2)' : 'none',
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#08090a',
                border: '1px solid #24292f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                <img
                  src="/assets/worker_shield_mascot.png"
                  alt="Frontline Worker"
                  style={{ width: '46px', height: '46px', objectFit: 'contain' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>
                  Frontline Site Worker / Labour
                </div>
                <div style={{ fontSize: '0.75rem', color: '#8b949e', marginTop: '2px', lineHeight: 1.4 }}>
                  Geotagged photo check-in, listen to audio payslip, report safety hazards for +₹250 reward, and withdraw daily earnings.
                </div>
              </div>
              {userRole === 'WORKER' && (
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#a3e635',
                  color: '#08090a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Check size={16} strokeWidth={3} />
                </div>
              )}
            </div>

            {/* Role 2: Site Supervisor & Operations Lead (with standing worker thumbnail) */}
            <div
              onClick={() => {
                setUserRole('ADMIN');
                setViewMode('ADMIN');
              }}
              style={{
                padding: '1.15rem',
                borderRadius: '20px',
                backgroundColor: userRole === 'ADMIN' ? 'rgba(0, 210, 211, 0.12)' : '#14171a',
                border: userRole === 'ADMIN' ? '2px solid #00d2d3' : '1px solid #24292f',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: userRole === 'ADMIN' ? '0 0 25px rgba(0, 210, 211, 0.2)' : 'none',
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#08090a',
                border: '1px solid #24292f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                <img
                  src="/assets/standing_worker_report.png"
                  alt="Site Supervisor"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>
                  Site Supervisor & Operations Lead
                </div>
                <div style={{ fontSize: '0.75rem', color: '#8b949e', marginTop: '2px', lineHeight: 1.4 }}>
                  Geofence cross-audit radar, tamper simulation, hazard triage, worker ratings & Monthly Safety Report generator.
                </div>
              </div>
              {userRole === 'ADMIN' && (
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#00d2d3',
                  color: '#08090a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Check size={16} strokeWidth={3} />
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setStep('LANGUAGE')}
              className="btn-carbon-secondary"
              style={{ flex: 1, padding: '0.9rem' }}
            >
              Back
            </button>
            <button
              onClick={() => setOnboardingStage('APP')}
              className="btn-lime-primary"
              style={{ flex: 2, padding: '0.9rem' }}
            >
              <span>LAUNCH WORKSPACE</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
