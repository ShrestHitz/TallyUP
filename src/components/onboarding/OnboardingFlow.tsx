'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { LANGUAGE_OPTIONS } from '@/lib/i18n';
import { Language, UserRole } from '@/types';
import { ShieldCheck, HardHat, UserCheck, Building2, Check, ArrowRight, Zap, Globe2, Sparkles, Award } from 'lucide-react';

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
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '650px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(163, 230, 53, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ===================================================================
          SCREEN 1: THE EXACT SPLASH SCREEN MATCHING ATTACHED SCREENSHOT
         =================================================================== */}
      {step === 'SPLASH' && (
        <div style={{
          maxWidth: '1180px',
          width: '100%',
          backgroundColor: '#0e1113',
          border: '1px solid #24292f',
          borderRadius: '32px',
          padding: 'clamp(1.75rem, 4vw, 3rem)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
          animation: 'fadeIn 0.5s ease forwards',
        }}>
          {/* Left Column: Brand, Bold Headline, Punchlines, 4 Metric Pills, Buttons */}
          <div>
            {/* Top Brand Pill & UN SDG 8 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#a3e635',
                color: '#08090a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontWeight: 900,
                fontSize: '1.35rem',
                boxShadow: '0 0 20px rgba(163, 230, 53, 0.4)',
              }}>
                :T.
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#14171a',
                border: '1px solid #24292f',
                padding: '0.4rem 0.95rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                color: '#a3e635',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                <Zap size={13} />
                <span>UN SDG 8 • DECENT WORK & SAFETY</span>
              </div>
            </div>

            {/* Massive Bold Headline (Mixed Typography: Bold Sans White + Glowing Lime) */}
            <h1 style={{
              fontSize: 'clamp(2.8rem, 5.5vw, 4.4rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: '-0.04em',
              marginBottom: '0.85rem',
            }}>
              <span style={{ color: '#ffffff', display: 'block' }}>EVERY HOUR</span>
              <span style={{ color: '#a3e635', display: 'block', textShadow: '0 0 35px rgba(163, 230, 53, 0.45)' }}>COUNTS.</span>
            </h1>

            {/* Punchline in Vibrant Monospace */}
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              fontWeight: 800,
              color: '#a3e635',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}>
              COUNT IT. PROVE IT. GET PAID.
            </p>

            {/* Description Paragraph */}
            <p style={{
              fontSize: '0.92rem',
              color: '#8b949e',
              lineHeight: 1.6,
              maxWidth: '520px',
              marginBottom: '2rem',
            }}>
              Tamper-evident attendance ledger, geotagged photo proof of presence, voice payslip audit, safety hazard vigilance rewards, and statutory BOCW insurance for India's frontline workforce.
            </p>

            {/* 4 Feature Telemetry Cards (2x2 Grid) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.85rem',
              marginBottom: '2.25rem',
            }}>
              <div style={{
                backgroundColor: '#14171a',
                border: '1px solid #24292f',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
              }}>
                <div style={{ color: '#a3e635', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.95rem' }}>
                  180+ DAYS
                </div>
                <div style={{ color: '#8b949e', fontSize: '0.75rem', marginTop: '2px' }}>
                  Zero Lost Time Injuries
                </div>
              </div>

              <div style={{
                backgroundColor: '#14171a',
                border: '1px solid #24292f',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
              }}>
                <div style={{ color: '#a3e635', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.95rem' }}>
                  +₹250 REWARD
                </div>
                <div style={{ color: '#8b949e', fontSize: '0.75rem', marginTop: '2px' }}>
                  Per Verified Hazard
                </div>
              </div>

              <div style={{
                backgroundColor: '#14171a',
                border: '1px solid #24292f',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
              }}>
                <div style={{ color: '#00d2d3', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.95rem' }}>
                  SHA-256 PROOF
                </div>
                <div style={{ color: '#8b949e', fontSize: '0.75rem', marginTop: '2px' }}>
                  Geotagged Photo Ledger
                </div>
              </div>

              <div style={{
                backgroundColor: '#14171a',
                border: '1px solid #24292f',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
              }}>
                <div style={{ color: '#00d2d3', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.95rem' }}>
                  INSTANT UPI
                </div>
                <div style={{ color: '#8b949e', fontSize: '0.75rem', marginTop: '2px' }}>
                  Daily Wage Withdrawal
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setStep('LANGUAGE')}
                style={{
                  backgroundColor: '#a3e635',
                  color: '#08090a',
                  padding: '1rem 2rem',
                  borderRadius: '16px',
                  fontSize: '0.95rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.02em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 0 25px rgba(163, 230, 53, 0.45)',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>GET STARTED (STEP 1 OF 2)</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>

              <button
                onClick={() => setOnboardingStage('APP')}
                style={{
                  backgroundColor: '#14171a',
                  color: '#ffffff',
                  padding: '1rem 1.65rem',
                  borderRadius: '16px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  border: '1px solid #24292f',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Skip to App
              </button>
            </div>
          </div>

          {/* Right Column: Safety Preview Card Matching Screenshot */}
          <div style={{
            backgroundColor: '#14171a',
            border: '1px solid #24292f',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
            position: 'relative',
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '360px',
              backgroundColor: '#08090a',
              overflow: 'hidden',
            }}>
              <img
                src="/assets/safety_report_preview.png"
                alt="Monthly Safety Report Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                backgroundColor: 'rgba(8, 9, 10, 0.85)',
                border: '1px solid #24292f',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                color: '#a3e635',
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a3e635', boxShadow: '0 0 10px #a3e635' }} />
                <span>ISO 45001 SAFETY FIRST</span>
              </div>
            </div>

            <div style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: '#14171a',
              borderTop: '1px solid #24292f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em' }}>
                  WORK SAFE. GO HOME SAFE.
                </div>
                <div style={{ fontSize: '0.72rem', color: '#a3e635', fontFamily: 'var(--font-mono)', fontWeight: 800, marginTop: '2px', letterSpacing: '0.04em' }}>
                  OBSERVE • REPORT • PREVENT
                </div>
              </div>

              <span style={{
                backgroundColor: 'rgba(163, 230, 53, 0.12)',
                border: '1px solid #a3e635',
                color: '#a3e635',
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
              }}>
                KAVACH AUDITED
              </span>
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
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8)',
          animation: 'fadeIn 0.4s ease forwards',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#a3e635', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <Globe2 size={14} />
              <span>Step 1 of 2 • Regional Inclusivity</span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff' }}>
              Choose Your Language
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#8b949e', marginTop: '0.25rem' }}>
              Select your native tongue for real-time app translation, voice payslips, and hazard reporting.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.75rem' }}>
            {LANGUAGE_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                onClick={() => setLanguage(opt.code)}
                style={{
                  padding: '1rem 0.95rem',
                  borderRadius: '16px',
                  backgroundColor: language === opt.code ? 'rgba(163, 230, 53, 0.12)' : '#14171a',
                  border: language === opt.code ? '2px solid #a3e635' : '1px solid #24292f',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: language === opt.code ? '0 0 20px rgba(163, 230, 53, 0.25)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>
                    {opt.nativeName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#8b949e', marginTop: '2px' }}>
                    {opt.label} • {opt.region}
                  </div>
                </div>
                {language === opt.code && (
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
                    <Check size={15} strokeWidth={3} />
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
          SCREEN 3: ROLE SELECTOR (WORKER VS SUPERVISOR / ADMIN)
         =================================================================== */}
      {step === 'ROLE' && (
        <div style={{
          maxWidth: '560px',
          width: '100%',
          backgroundColor: '#0e1113',
          border: '1px solid #24292f',
          borderRadius: '28px',
          padding: '2rem 1.75rem',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8)',
          animation: 'fadeIn 0.4s ease forwards',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#a3e635', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <UserCheck size={14} />
              <span>Step 2 of 2 • Role Configuration</span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff' }}>
              Select Your Workspace
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#8b949e', marginTop: '0.25rem' }}>
              Choose your role to launch the tailored frontline interface or supervisor command hub.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
            {/* Role 1: Frontline Worker */}
            <div
              onClick={() => {
                setUserRole('WORKER');
                setViewMode('WORKER');
              }}
              style={{
                padding: '1.25rem',
                borderRadius: '18px',
                backgroundColor: userRole === 'WORKER' ? 'rgba(163, 230, 53, 0.12)' : '#14171a',
                border: userRole === 'WORKER' ? '2px solid #a3e635' : '1px solid #24292f',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: userRole === 'WORKER' ? '0 0 20px rgba(163, 230, 53, 0.25)' : 'none',
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#a3e635',
                color: '#08090a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <HardHat size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>
                  Frontline Site Worker / Labour
                </div>
                <div style={{ fontSize: '0.75rem', color: '#8b949e', marginTop: '3px', lineHeight: 1.4 }}>
                  Geotagged selfie check-in, listen to audio payslip, report safety hazards with instant photo proof, and withdraw daily wages.
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
                  <Check size={15} strokeWidth={3} />
                </div>
              )}
            </div>

            {/* Role 2: Site Supervisor & Boss / Operations Lead */}
            <div
              onClick={() => {
                setUserRole('ADMIN');
                setViewMode('ADMIN');
              }}
              style={{
                padding: '1.25rem',
                borderRadius: '18px',
                backgroundColor: userRole === 'ADMIN' ? 'rgba(0, 210, 211, 0.12)' : '#14171a',
                border: userRole === 'ADMIN' ? '2px solid #00d2d3' : '1px solid #24292f',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: userRole === 'ADMIN' ? '0 0 20px rgba(0, 210, 211, 0.25)' : 'none',
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#00d2d3',
                color: '#08090a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Building2 size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>
                  Site Supervisor / Admin / Boss
                </div>
                <div style={{ fontSize: '0.75rem', color: '#8b949e', marginTop: '3px', lineHeight: 1.4 }}>
                  Presence cross-check radar, tamper detection, real-time hazard verification, worker endorsements & Monthly Safety Report generator.
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
                  <Check size={15} strokeWidth={3} />
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
