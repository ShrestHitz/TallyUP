'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Building2, Globe2, ShieldCheck, UserCheck, HardHat, GraduationCap, LayoutDashboard } from 'lucide-react';
import { Language } from '@/lib/i18n';

export const Navigation: React.FC = () => {
  const {
    sectorId,
    setSectorId,
    sector,
    language,
    setLanguage,
    t,
    viewMode,
    setViewMode,
    isLedgerTampered,
  } = useApp();

  return (
    <header style={{
      backgroundColor: '#0a1118',
      borderBottom: '2px solid #009999',
      color: '#ffffff',
      padding: '0.75rem 1.25rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0, 153, 153, 0.15)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        {/* Brand & SDG 8 Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #009999 0%, #2dd4bf 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 10px rgba(0, 153, 153, 0.4)',
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}>
                Tally<span style={{ color: '#2dd4bf' }}>UP</span>
              </div>
              <div style={{
                fontSize: '0.65rem',
                color: '#94a3b8',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}>
                Pocket Witness • SDG 8
              </div>
            </div>
          </div>

          {/* Tamper status indicator pill */}
          {isLedgerTampered ? (
            <span style={{
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid #ef4444',
              color: '#ef4444',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}>
              ⚠️ Ledger Tamper Detected
            </span>
          ) : (
            <span style={{
              backgroundColor: 'rgba(0, 153, 153, 0.15)',
              border: '1px solid #009999',
              color: '#2dd4bf',
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              display: 'none',
            }}>
              ✓ Ledger Verified
            </span>
          )}
        </div>

        {/* Right side controls: Sector Selector, Language Picker, Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Sector Switcher (Construction <-> Campus) */}
          <div style={{
            display: 'flex',
            backgroundColor: '#1e293b',
            borderRadius: '9999px',
            padding: '2px',
            border: '1px solid #334155',
          }}>
            <button
              onClick={() => setSectorId('construction')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: sectorId === 'construction' ? '#009999' : 'transparent',
                color: sectorId === 'construction' ? '#ffffff' : '#94a3b8',
              }}
              title="Switch to SkyRise Metro Construction Sector"
            >
              <HardHat size={14} />
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
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: sectorId === 'campus' ? '#0284c7' : 'transparent',
                color: sectorId === 'campus' ? '#ffffff' : '#94a3b8',
              }}
              title="Switch to Apex Central University Campus Sector"
            >
              <GraduationCap size={14} />
              <span>Campus</span>
            </button>
          </div>

          {/* Language Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#1e293b',
            borderRadius: '9999px',
            padding: '2px 0.5rem',
            border: '1px solid #334155',
            gap: '0.25rem',
          }}>
            <Globe2 size={13} style={{ color: '#2dd4bf' }} />
            {(['en', 'hi', 'ta'] as Language[]).map((lng) => (
              <button
                key={lng}
                onClick={() => setLanguage(lng)}
                style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: language === lng ? 700 : 500,
                  backgroundColor: language === lng ? '#009999' : 'transparent',
                  color: language === lng ? '#ffffff' : '#94a3b8',
                }}
              >
                {lng === 'en' ? 'EN' : lng === 'hi' ? 'हिंदी' : 'தமிழ்'}
              </button>
            ))}
          </div>

          {/* View Mode Toggle: Worker PWA vs Admin Command Center */}
          <div style={{
            display: 'flex',
            backgroundColor: '#0f172a',
            borderRadius: '9999px',
            padding: '2px',
            border: '1px solid #334155',
          }}>
            <button
              onClick={() => setViewMode('WORKER')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                backgroundColor: viewMode === 'WORKER' ? '#009999' : 'transparent',
                color: viewMode === 'WORKER' ? '#ffffff' : '#94a3b8',
              }}
            >
              <UserCheck size={14} />
              <span>Worker PWA</span>
            </button>
            <button
              onClick={() => setViewMode('ADMIN')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                backgroundColor: viewMode === 'ADMIN' ? '#0f766e' : 'transparent',
                color: viewMode === 'ADMIN' ? '#ffffff' : '#94a3b8',
              }}
            >
              <LayoutDashboard size={14} />
              <span>Admin Hub</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
