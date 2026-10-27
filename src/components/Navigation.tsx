'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, UserCheck, HardHat, GraduationCap, LayoutDashboard, Globe2, Sparkles, AlertTriangle } from 'lucide-react';
import { Language } from '@/types';
import { LANGUAGE_OPTIONS } from '@/lib/i18n';

export const Navigation: React.FC = () => {
  const {
    sectorId,
    setSectorId,
    language,
    setLanguage,
    viewMode,
    setViewMode,
    isLedgerTampered,
    setOnboardingStage,
  } = useApp();

  return (
    <header style={{
      backgroundColor: 'rgba(9, 13, 18, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid #1e293b',
      color: '#f8fafc',
      padding: '0.75rem 1.25rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        {/* Brand & Editorial Business Punchline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            onClick={() => setOnboardingStage('SPLASH')}
            title="Click to replay 3-Screen Onboarding"
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#090d12',
              boxShadow: '0 0 18px rgba(16, 185, 129, 0.35)',
              fontWeight: 900,
              fontFamily: 'var(--font-mono)',
              fontSize: '1.15rem',
            }}>
              :T.
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: '#f8fafc',
              }}>
                Tally<span style={{ color: '#34d399' }}>UP</span>
              </div>
              <div style={{
                fontSize: '0.65rem',
                color: '#34d399',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}>
                Count it. Prove it. Get paid.
              </div>
            </div>
          </div>

          {/* Tamper status indicator pill */}
          {isLedgerTampered && (
            <span style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              color: '#ef4444',
              fontSize: '0.7rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}>
              <AlertTriangle size={12} />
              <span>LEDGER TAMPER DETECTED</span>
            </span>
          )}
        </div>

        {/* Center Punchline Banner (Desktop Editorial Italic) */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#0f172a',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          border: '1px solid #1e293b',
          fontSize: '0.8rem',
        }} className="desktop-punch-pill">
          <span className="punchline-italic" style={{ color: '#34d399', fontSize: '0.95rem' }}>
            "Every hour counts."
          </span>
          <span style={{ color: '#64748b' }}>•</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: '#94a3b8', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
            PROVABLE STATUTORY WAGES
          </span>
        </div>

        {/* Right side controls: Sector Selector, Language Picker, Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Sector Switcher (Construction <-> Campus) */}
          <div style={{
            display: 'flex',
            backgroundColor: '#0f172a',
            borderRadius: '9999px',
            padding: '3px',
            border: '1px solid #1e293b',
          }}>
            <button
              onClick={() => setSectorId('construction')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                backgroundColor: sectorId === 'construction' ? '#10b981' : 'transparent',
                color: sectorId === 'construction' ? '#090d12' : '#94a3b8',
              }}
            >
              <HardHat size={13} />
              <span>Construction</span>
            </button>
            <button
              onClick={() => setSectorId('campus')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                backgroundColor: sectorId === 'campus' ? '#06b6d4' : 'transparent',
                color: sectorId === 'campus' ? '#090d12' : '#94a3b8',
              }}
            >
              <GraduationCap size={13} />
              <span>Campus</span>
            </button>
          </div>

          {/* 7-Language Responsive Dropdown Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#0f172a',
            borderRadius: '9999px',
            padding: '2px 0.65rem',
            border: '1px solid #1e293b',
            gap: '0.35rem',
          }}>
            <Globe2 size={13} style={{ color: '#34d399' }} />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              style={{
                backgroundColor: 'transparent',
                color: '#f8fafc',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                outline: 'none',
                cursor: 'pointer',
                padding: '0.2rem 0',
              }}
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option
                  key={opt.code}
                  value={opt.code}
                  style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}
                >
                  {opt.nativeName} ({opt.label})
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle: Worker PWA vs Admin Hub */}
          <div style={{
            display: 'flex',
            backgroundColor: '#0f172a',
            borderRadius: '9999px',
            padding: '3px',
            border: '1px solid #1e293b',
          }}>
            <button
              onClick={() => setViewMode('WORKER')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                backgroundColor: viewMode === 'WORKER' ? '#10b981' : 'transparent',
                color: viewMode === 'WORKER' ? '#090d12' : '#94a3b8',
              }}
            >
              <UserCheck size={14} />
              <span>Worker App</span>
            </button>
            <button
              onClick={() => setViewMode('ADMIN')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                backgroundColor: viewMode === 'ADMIN' ? '#10b981' : 'transparent',
                color: viewMode === 'ADMIN' ? '#090d12' : '#94a3b8',
              }}
            >
              <LayoutDashboard size={14} />
              <span>Command Hub</span>
            </button>
          </div>

          <button
            onClick={() => setOnboardingStage('SPLASH')}
            title="Launch 3-Screen Onboarding Flow"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={13} />
            <span>Tour</span>
          </button>
        </div>
      </div>
    </header>
  );
};
