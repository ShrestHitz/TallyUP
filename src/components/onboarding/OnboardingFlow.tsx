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
      backgroundColor: '#090d12',
      color: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle executive ambient glows */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '650px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ===================================================================
          SCREEN 1: SOPHISTICATED EDITORIAL SPLASH SCREEN
         =================================================================== */}
      {step === 'SPLASH' && (
        <div style={{
          maxWidth: '680px',
          width: '100%',
          textAlign: 'center',
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '28px',
          padding: 'clamp(2rem, 5vw, 3.5rem)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
          animation: 'fadeIn 0.5s ease forwards',
        }}>
          {/* Executive Brand Logo */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            backgroundColor: '#10b981',
            color: '#090d12',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.35)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 900,
            fontSize: '2rem',
          }}>
            :T.
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            padding: '0.35rem 0.95rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            color: '#34d399',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            marginBottom: '1.5rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            <Zap size={13} />
            <span>UN SDG 8 • DECENT WORK & ECONOMIC GROWTH</span>
          </div>

          {/* Sophisticated Editorial Business Italic Punchline */}
          <h1 className="punchline-italic" style={{
            fontSize: 'clamp(2.6rem, 6.5vw, 4rem)',
            fontStyle: 'italic',
            fontWeight: 500,
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            color: '#f8fafc',
            marginBottom: '0.85rem',
          }}>
            "Every hour counts."
          </h1>

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(1rem, 2.8vw, 1.25rem)',
            fontWeight: 800,
            color: '#34d399',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '1.5rem',
          }}>
            Count it. Prove it. Get paid.
          </p>

          <p style={{
            fontSize: '0.92rem',
            color: '#94a3b8',
            lineHeight: 1.65,
            maxWidth: '520px',
            margin: '0 auto 2rem',
          }}>
            A tamper-evident workforce platform where every hour worked, every rupee earned, and every safety hazard reported becomes mathematically provable in the worker's native language and voice.
          </p>

          {/* Business Value Badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '2.25rem',
            fontSize: '0.78rem',
            color: '#cbd5e1',
          }}>
            <span style={{ backgroundColor: '#1e293b', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid #334155' }}>
              ✓ SHA-256 Pocket Witness
            </span>
            <span style={{ backgroundColor: '#1e293b', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid #334155' }}>
              ✓ Geotagged Photo Presence
            </span>
            <span style={{ backgroundColor: '#1e293b', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid #334155' }}>
              ✓ +₹250 Verified Hazard Rewards
            </span>
            <span style={{ backgroundColor: '#1e293b', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid #334155' }}>
              ✓ ISO 45001 & BOCW Protection
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setStep('LANGUAGE')}
              className="btn-lime-primary"
              style={{ padding: '1rem 2rem', fontSize: '1rem', borderRadius: '16px' }}
            >
              <span>GET STARTED</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => setOnboardingStage('APP')}
              className="btn-carbon-secondary"
              style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', borderRadius: '16px' }}
            >
              Skip to Workspace
            </button>
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
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '28px',
          padding: '2rem 1.75rem',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8)',
          animation: 'fadeIn 0.4s ease forwards',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <Globe2 size={14} />
              <span>Step 1 of 2 • Regional Inclusivity</span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#f8fafc' }}>
              Choose Your Language
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.25rem' }}>
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
                  backgroundColor: language === opt.code ? 'rgba(16, 185, 129, 0.12)' : '#131c2a',
                  border: language === opt.code ? '2px solid #10b981' : '1px solid #1e293b',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: language === opt.code ? '0 0 20px rgba(16, 185, 129, 0.2)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#f8fafc' }}>
                    {opt.nativeName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                    {opt.label} • {opt.region}
                  </div>
                </div>
                {language === opt.code && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    color: '#090d12',
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
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '28px',
          padding: '2rem 1.75rem',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8)',
          animation: 'fadeIn 0.4s ease forwards',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <UserCheck size={14} />
              <span>Step 2 of 2 • Role Configuration</span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#f8fafc' }}>
              Select Your Workspace
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.25rem' }}>
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
                backgroundColor: userRole === 'WORKER' ? 'rgba(16, 185, 129, 0.12)' : '#131c2a',
                border: userRole === 'WORKER' ? '2px solid #10b981' : '1px solid #1e293b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: userRole === 'WORKER' ? '0 0 20px rgba(16, 185, 129, 0.15)' : 'none',
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#10b981',
                color: '#090d12',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <HardHat size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                  Frontline Site Worker / Labour
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '3px', lineHeight: 1.4 }}>
                  Geotagged selfie check-in, listen to audio payslip, report safety hazards with instant photo proof, and withdraw daily wages.
                </div>
              </div>
              {userRole === 'WORKER' && (
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  color: '#090d12',
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
                backgroundColor: userRole === 'ADMIN' ? 'rgba(6, 182, 212, 0.12)' : '#131c2a',
                border: userRole === 'ADMIN' ? '2px solid #06b6d4' : '1px solid #1e293b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: userRole === 'ADMIN' ? '0 0 20px rgba(6, 182, 212, 0.15)' : 'none',
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#06b6d4',
                color: '#090d12',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Building2 size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                  Site Supervisor / Admin / Boss
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '3px', lineHeight: 1.4 }}>
                  Presence cross-check radar, tamper detection, real-time hazard verification, worker endorsements & Monthly Safety Report generator.
                </div>
              </div>
              {userRole === 'ADMIN' && (
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#06b6d4',
                  color: '#090d12',
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
