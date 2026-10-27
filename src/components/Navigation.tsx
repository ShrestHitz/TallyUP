'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, UserCheck, HardHat, GraduationCap, LayoutDashboard, Globe2, Sparkles } from 'lucide-react';
import { Language } from '@/types';

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
      backgroundColor: 'rgba(8, 9, 10, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid #24292f',
      color: '#ffffff',
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
        {/* Brand & Punchline */}
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
              backgroundColor: '#a3e635',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#08090a',
              boxShadow: '0 0 18px rgba(163, 230, 53, 0.45)',
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
                color: '#ffffff',
              }}>
                Tally<span style={{ color: '#a3e635' }}>UP</span>
              </div>
              <div style={{
                fontSize: '0.65rem',
                color: '#a3e635',
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
              backgroundColor: 'rgba(255, 71, 87, 0.15)',
              border: '1px solid #ff4757',
              color: '#ff4757',
              fontSize: '0.7rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
            }}>
              ⚠️ LEDGER TAMPER DETECTED
            </span>
          )}
        </div>

        {/* Center Punchline Banner (Desktop) */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#14171a',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          border: '1px solid #24292f',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          color: '#8b949e',
        }} className="desktop-punch-pill">
          <span style={{ color: '#a3e635', fontWeight: 800 }}>EVERY HOUR COUNTS.</span>
          <span>•</span>
          <span>PROVABLE ON-CHAIN WAGES</span>
        </div>

        {/* Right side controls: Sector Selector, Language Picker, Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Sector Switcher (Construction <-> Campus) */}
          <div style={{
            display: 'flex',
            backgroundColor: '#14171a',
            borderRadius: '9999px',
            padding: '3px',
            border: '1px solid #24292f',
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
                backgroundColor: sectorId === 'construction' ? '#a3e635' : 'transparent',
                color: sectorId === 'construction' ? '#08090a' : '#8b949e',
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
                backgroundColor: sectorId === 'campus' ? '#00d2d3' : 'transparent',
                color: sectorId === 'campus' ? '#08090a' : '#8b949e',
              }}
            >
              <GraduationCap size={13} />
              <span>Campus</span>
            </button>
          </div>

          {/* Language Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#14171a',
            borderRadius: '9999px',
            padding: '3px 0.5rem',
            border: '1px solid #24292f',
            gap: '0.2rem',
          }}>
            <Globe2 size={13} style={{ color: '#a3e635' }} />
            {(['en', 'hi', 'ta'] as Language[]).map((lng) => (
              <button
                key={lng}
                onClick={() => setLanguage(lng)}
                style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: language === lng ? 800 : 500,
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: language === lng ? '#a3e635' : 'transparent',
                  color: language === lng ? '#08090a' : '#8b949e',
                }}
              >
                {lng === 'en' ? 'EN' : lng === 'hi' ? 'हिंदी' : 'தமிழ்'}
              </button>
            ))}
          </div>

          {/* View Mode Toggle: Worker PWA vs Admin Hub */}
          <div style={{
            display: 'flex',
            backgroundColor: '#14171a',
            borderRadius: '9999px',
            padding: '3px',
            border: '1px solid #24292f',
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
                backgroundColor: viewMode === 'WORKER' ? '#a3e635' : 'transparent',
                color: viewMode === 'WORKER' ? '#08090a' : '#8b949e',
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
                backgroundColor: viewMode === 'ADMIN' ? '#a3e635' : 'transparent',
                color: viewMode === 'ADMIN' ? '#08090a' : '#8b949e',
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
              backgroundColor: 'rgba(163, 230, 53, 0.12)',
              border: '1px solid #a3e635',
              color: '#a3e635',
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
