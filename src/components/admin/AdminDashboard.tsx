'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Users,
  Clock,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  TrendingDown,
  Lock,
  Layers,
  ArrowRight,
  RefreshCw,
  Building2,
  HardHat,
  GraduationCap,
  Zap,
  Activity,
  Flame,
} from 'lucide-react';
import { verifyLedgerChain } from '@/lib/crypto-ledger';
import { auditWorkerPay } from '@/lib/wage-engine';
import { SEED_WORKERS } from '@/lib/seed-data';

export const AdminDashboard: React.FC = () => {
  const {
    sector,
    sectorId,
    setSectorId,
    attendanceBlocks,
    isLedgerTampered,
    simulateTamper,
    restoreLedger,
    hazards,
    updateHazardStatus,
    feedbackList,
    fatigueAlerts,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'LEDGER' | 'HAZARDS' | 'PAYROLL' | 'FATIGUE' | 'FEEDBACK'>('LEDGER');
  const [tamperVerificationMessage, setTamperVerificationMessage] = useState<string | null>(null);

  const handleVerifyChain = async () => {
    const result = await verifyLedgerChain(attendanceBlocks);
    if (result.valid) {
      setTamperVerificationMessage('✅ CRYPTOGRAPHIC INTEGRITY: All SHA-256 block hashes are 100% verified and untampered.');
    } else {
      setTamperVerificationMessage(`❌ ${result.reason}`);
    }
  };

  const sectorHazards = hazards.filter((h) => h.sectorId === sectorId);
  const criticalHazardsCount = sectorHazards.filter((h) => h.severity === 'P1_CRITICAL' && h.status !== 'RESOLVED').length;

  return (
    <div style={{
      maxWidth: '1360px',
      margin: '0 auto',
      padding: '1.5rem 1.25rem',
      minHeight: 'calc(100vh - 75px)',
    }}>
      {/* Top Punchline & Facility Command Banner */}
      <div style={{
        backgroundColor: '#0e1113',
        borderRadius: '24px',
        padding: '1.5rem 1.75rem',
        color: '#ffffff',
        border: '1px solid #24292f',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient neon lime glow */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '20%',
          width: '250px',
          height: '150px',
          background: 'radial-gradient(ellipse, rgba(163, 230, 53, 0.12), transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: '#a3e635',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.35rem',
          }}>
            <Zap size={13} />
            <span>EVERY HOUR COUNTS • COUNT IT. PROVE IT. GET PAID.</span>
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#ffffff' }}>
            {sector.name}
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#8b949e', marginTop: '0.2rem' }}>
            {sector.tagline} • Managing {sector.workerType}
          </p>
        </div>

        {/* Quick Sector Toggle */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setSectorId('construction')}
            style={{
              padding: '0.65rem 1.1rem',
              borderRadius: '12px',
              backgroundColor: sectorId === 'construction' ? '#a3e635' : '#14171a',
              color: sectorId === 'construction' ? '#08090a' : '#ffffff',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              fontSize: '0.85rem',
              border: '1px solid #24292f',
              boxShadow: sectorId === 'construction' ? '0 0 15px rgba(163, 230, 53, 0.4)' : 'none',
            }}
          >
            Metro Construction
          </button>
          <button
            onClick={() => setSectorId('campus')}
            style={{
              padding: '0.65rem 1.1rem',
              borderRadius: '12px',
              backgroundColor: sectorId === 'campus' ? '#00d2d3' : '#14171a',
              color: sectorId === 'campus' ? '#08090a' : '#ffffff',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              fontSize: '0.85rem',
              border: '1px solid #24292f',
              boxShadow: sectorId === 'campus' ? '0 0 15px rgba(0, 210, 211, 0.4)' : 'none',
            }}
          >
            Campus Operations
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        {/* Metric 1 */}
        <div className="carbon-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(163, 230, 53, 0.15)', color: '#a3e635', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#8b949e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Headcount</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff' }}>28 / 32</div>
            <div style={{ fontSize: '0.7rem', color: '#a3e635', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>87.5% ON SITE</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="carbon-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(255, 165, 2, 0.15)', color: '#ffa502', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#8b949e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cumulative Overtime</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff' }}>142.5 hrs</div>
            <div style={{ fontSize: '0.7rem', color: '#ffa502', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>2.0x MULTIPLIER</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="carbon-card" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          borderColor: criticalHazardsCount > 0 ? '#ff4757' : '#24292f',
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(255, 71, 87, 0.15)', color: '#ff4757', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#8b949e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>P1 Critical Hazards</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ff4757' }}>{criticalHazardsCount} Active</div>
            <div style={{ fontSize: '0.7rem', color: '#ff4757', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>SLA AUTO-ESCALATING</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="carbon-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: isLedgerTampered ? 'rgba(255, 71, 87, 0.15)' : 'rgba(163, 230, 53, 0.15)', color: isLedgerTampered ? '#ff4757' : '#a3e635', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#8b949e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>SHA-256 Ledger State</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: isLedgerTampered ? '#ff4757' : '#a3e635' }}>
              {isLedgerTampered ? 'TAMPERED' : '100% INTACT'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#8b949e', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>POCKET WITNESS CHAIN</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid #24292f',
        marginBottom: '1.5rem',
        overflowX: 'auto',
      }}>
        {[
          { id: 'LEDGER', label: 'Tamper-Evident Ledger', badge: isLedgerTampered ? 'Tampered' : 'Verified' },
          { id: 'HAZARDS', label: 'Multimodal Hazards & SLA', count: sectorHazards.length },
          { id: 'PAYROLL', label: 'Wage Guardian Audit', badge: '1 Dispute' },
          { id: 'FATIGUE', label: 'Fatigue & Quit-Risk Heuristics', count: fatigueAlerts.length },
          { id: 'FEEDBACK', label: 'Safe Voice Insights', count: feedbackList.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            style={{
              padding: '0.75rem 1.25rem',
              fontSize: '0.88rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: activeAdminTab === tab.id ? '#a3e635' : '#8b949e',
              borderBottom: activeAdminTab === tab.id ? '2px solid #a3e635' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span style={{
                fontSize: '0.68rem',
                backgroundColor: tab.badge === 'Tampered' ? 'rgba(255, 71, 87, 0.2)' : 'rgba(163, 230, 53, 0.2)',
                color: tab.badge === 'Tampered' ? '#ff4757' : '#a3e635',
                padding: '0.1rem 0.5rem',
                borderRadius: '9999px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
              }}>
                {tab.badge}
              </span>
            )}
            {tab.count !== undefined && (
              <span style={{
                fontSize: '0.68rem',
                backgroundColor: '#1a1e22',
                color: '#8b949e',
                padding: '0.1rem 0.5rem',
                borderRadius: '9999px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ===================================================================
          TAB 1: TAMPER-EVIDENT ATTENDANCE LEDGER
         =================================================================== */}
      {activeAdminTab === 'LEDGER' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Tamper Simulation Interactive Bar */}
          <div style={{
            backgroundColor: isLedgerTampered ? 'rgba(255, 71, 87, 0.12)' : '#14171a',
            border: isLedgerTampered ? '2px solid #ff4757' : '1px solid #24292f',
            borderRadius: '20px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <div style={{
                fontWeight: 900,
                color: isLedgerTampered ? '#ff4757' : '#a3e635',
                fontSize: '1.05rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontFamily: 'var(--font-display)',
              }}>
                {isLedgerTampered ? <XCircle size={22} /> : <ShieldCheck size={22} />}
                <span>
                  {isLedgerTampered
                    ? 'CRYPTOGRAPHIC BREAKAGE: Boss Tampering Flagged'
                    : 'Pocket Witness Ledger Chain: 100% Cryptographically Intact'}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: isLedgerTampered ? '#ffb8b8' : '#8b949e', marginTop: '0.25rem' }}>
                {isLedgerTampered
                  ? 'Block #2 was altered from 11.0 hrs to 8.0 hrs. The stored SHA-256 hash does not match computed block data!'
                  : 'Every check-in is linked with SHA-256. If any past shift is altered, the entire chain flags the fraud.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button
                onClick={handleVerifyChain}
                className="btn-carbon-secondary"
                style={{ fontSize: '0.82rem', padding: '0.55rem 0.95rem' }}
              >
                <RefreshCw size={14} />
                <span>Verify All Hashes</span>
              </button>

              {!isLedgerTampered ? (
                <button
                  onClick={() => simulateTamper('blk-02', 8.0)}
                  style={{
                    backgroundColor: '#ff4757',
                    color: '#ffffff',
                    padding: '0.55rem 1rem',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 15px rgba(255, 71, 87, 0.4)',
                  }}
                  title="Simulate an administrator secretly reducing Murugan's hours from 11 to 8"
                >
                  <AlertTriangle size={15} />
                  <span>Simulate Boss Tampering</span>
                </button>
              ) : (
                <button
                  onClick={restoreLedger}
                  className="btn-lime-primary"
                  style={{ fontSize: '0.82rem', padding: '0.55rem 1rem' }}
                >
                  <CheckCircle2 size={15} />
                  <span>Restore Original Ledger</span>
                </button>
              )}
            </div>
          </div>

          {tamperVerificationMessage && (
            <div style={{
              backgroundColor: '#08090a',
              border: '1px solid #24292f',
              color: '#f4fbe8',
              padding: '0.85rem 1rem',
              borderRadius: '14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
            }}>
              {tamperVerificationMessage}
            </div>
          )}

          {/* Ledger Table */}
          <div className="carbon-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead style={{ backgroundColor: '#08090a', borderBottom: '1px solid #24292f', color: '#8b949e', fontWeight: 700 }}>
                  <tr>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Block ID & Code</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Worker Name</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Zone</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Date</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Regular / OT</th>
                    <th style={{ padding: '0.85rem 1rem' }}>SHA-256 Current Hash</th>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceBlocks.map((blk) => (
                    <tr
                      key={blk.id}
                      style={{
                        borderBottom: '1px solid #1a1e22',
                        backgroundColor: blk.tamperFlag ? 'rgba(255, 71, 87, 0.12)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <div style={{ fontWeight: 800, color: '#ffffff' }}>{blk.id}</div>
                        <div style={{ fontSize: '0.7rem', color: '#a3e635', fontFamily: 'var(--font-mono)' }}>
                          {blk.verifiedReceiptCode}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#f4fbe8' }}>{blk.workerName}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#8b949e' }}>{blk.siteZone.split('—')[0]}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#8b949e' }}>{blk.date}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontWeight: 800, color: '#ffffff' }}>{blk.regularHours}h</span>
                        {blk.overtimeHours > 0 && (
                          <span style={{ color: '#a3e635', fontWeight: 800, marginLeft: '5px' }}>
                            (+{blk.overtimeHours}h OT)
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#8b949e' }}>
                        {blk.hash.substring(0, 16)}...
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        {blk.tamperFlag ? (
                          <span style={{
                            backgroundColor: 'rgba(255, 71, 87, 0.25)',
                            color: '#ff4757',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '9999px',
                            fontWeight: 800,
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.68rem',
                          }}>
                            TAMPERED
                          </span>
                        ) : (
                          <span className="badge-lime">
                            ✓ VERIFIED
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 2: MULTIMODAL HAZARDS & SLA QUEUE
         =================================================================== */}
      {activeAdminTab === 'HAZARDS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>
              Multimodal Safety Queue ({sector.name})
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#a3e635', fontFamily: 'var(--font-mono)' }}>
              15-MINUTE SLA AUTO-ESCALATION ACTIVE
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
            {sectorHazards.map((h) => (
              <div
                key={h.id}
                className="carbon-card"
                style={{
                  borderLeft: h.severity === 'P1_CRITICAL' ? '4px solid #ff4757' : '4px solid #ffa502',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className={h.severity === 'P1_CRITICAL' ? 'badge-danger' : 'badge-lime'}>
                    {h.severity === 'P1_CRITICAL' ? '⚠️ P1 Critical' : 'P2 Moderate'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#8b949e', fontFamily: 'var(--font-mono)' }}>{h.reportedAt}</span>
                </div>

                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff', marginBottom: '0.25rem' }}>
                  {h.category}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#8b949e', marginBottom: '0.75rem' }}>
                  📍 {h.zone} • {h.clusterCount > 1 ? `⚡ ${h.clusterCount} Workers Reported` : 'Single Report'}
                </div>

                <div style={{
                  backgroundColor: '#08090a',
                  border: '1px solid #1a1e22',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  fontSize: '0.82rem',
                  color: '#f4fbe8',
                  marginBottom: '0.75rem',
                  lineHeight: 1.4,
                }}>
                  <div style={{ fontSize: '0.7rem', color: '#a3e635', fontWeight: 800, marginBottom: '0.2rem' }}>
                    Gemini English Translation:
                  </div>
                  {h.translatedEnglishSummary}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#ffb8b8', marginBottom: '1rem', fontWeight: 600 }}>
                  Immediate Protocol: {h.recommendedAction}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1a1e22', paddingTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: h.status === 'RESOLVED' ? '#a3e635' : '#ffa502', fontFamily: 'var(--font-mono)' }}>
                    STATUS: {h.status}
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {h.status === 'SUBMITTED' && (
                      <button
                        onClick={() => updateHazardStatus(h.id, 'ACKNOWLEDGED')}
                        style={{
                          backgroundColor: '#a3e635',
                          color: '#08090a',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                        }}
                      >
                        Acknowledge
                      </button>
                    )}
                    {h.status === 'ACKNOWLEDGED' && (
                      <button
                        onClick={() => updateHazardStatus(h.id, 'IN_PROGRESS')}
                        style={{
                          backgroundColor: '#ffa502',
                          color: '#08090a',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                        }}
                      >
                        Dispatch Crew
                      </button>
                    )}
                    {h.status !== 'RESOLVED' && (
                      <button
                        onClick={() => updateHazardStatus(h.id, 'RESOLVED')}
                        style={{
                          backgroundColor: '#24292f',
                          color: '#a3e635',
                          border: '1px solid #a3e635',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                        }}
                      >
                        Mark Fixed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 3: WAGE GUARDIAN PAYROLL AUDIT
         =================================================================== */}
      {activeAdminTab === 'PAYROLL' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="carbon-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.4rem', color: '#ffffff' }}>
              Wage Guardian Audit Table
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#8b949e', marginBottom: '1.25rem' }}>
              Recomputes verified SHA-256 ledger hours against contractor payroll submissions under statutory overtime multipliers.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead style={{ backgroundColor: '#08090a', borderBottom: '1px solid #24292f', color: '#8b949e' }}>
                  <tr>
                    <th style={{ padding: '0.85rem 1rem' }}>Worker</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Verified Hours</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Hourly Base Rate</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Statutory Pay</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Contractor Disbursed</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Discrepancy Gap</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {SEED_WORKERS.filter((w) => w.sectorId === sectorId).map((w) => {
                    const audit = auditWorkerPay(w, attendanceBlocks, w.id === 'w1' ? 7500 : 8500, sector);
                    return (
                      <tr key={w.id} style={{ borderBottom: '1px solid #1a1e22' }}>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: 800, color: '#ffffff' }}>{w.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#8b949e' }}>{w.tradeRole}</div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: '#f4fbe8' }}>
                          {audit.verifiedRegularHours}h Reg + {audit.verifiedOvertimeHours}h OT
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: '#8b949e' }}>₹{w.hourlyRate}/h</td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#a3e635' }}>
                          ₹{audit.calculatedLegitimatePay}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: '#8b949e' }}>₹{audit.employerDeclaredPay}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          {audit.isUnderpaid ? (
                            <span style={{ color: '#ff4757', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
                              -₹{audit.discrepancyAmount} Shortfall
                            </span>
                          ) : (
                            <span style={{ color: '#a3e635', fontWeight: 700 }}>✓ Settled</span>
                          )}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          {audit.isUnderpaid ? (
                            <button
                              onClick={() => alert(`Back-pay payout of ₹${audit.discrepancyAmount} approved for ${w.name}!`)}
                              className="btn-lime-primary"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '8px' }}
                            >
                              Settle Shortfall
                            </button>
                          ) : (
                            <span style={{ color: '#57606a', fontSize: '0.75rem' }}>No Action</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 4: FATIGUE & QUIT-RISK HEURISTICS
         =================================================================== */}
      {activeAdminTab === 'FATIGUE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="carbon-card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.25rem' }}>
              Workforce Fatigue & Retention Early Warning
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#8b949e', marginBottom: '1.25rem' }}>
              Transparent mathematical rules: consecutive shifts, turnaround rest, and overtime burden.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {fatigueAlerts.map((fa) => (
                <div
                  key={fa.workerId}
                  style={{
                    backgroundColor: '#08090a',
                    border: fa.fatigueRiskLevel === 'CRITICAL' ? '1px solid #ff4757' : '1px solid #24292f',
                    borderRadius: '16px',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>{fa.workerName}</h4>
                      <p style={{ fontSize: '0.72rem', color: '#8b949e' }}>{fa.tradeRole} • {fa.team}</p>
                    </div>
                    <span style={{
                      backgroundColor: fa.fatigueRiskLevel === 'CRITICAL' ? 'rgba(255, 71, 87, 0.2)' : 'rgba(255, 165, 2, 0.2)',
                      color: fa.fatigueRiskLevel === 'CRITICAL' ? '#ff4757' : '#ffa502',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {fa.fatigueRiskLevel}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', margin: '0.75rem 0', fontSize: '0.8rem' }}>
                    <div>
                      <div style={{ color: '#8b949e' }}>Weekly Hours</div>
                      <div style={{ fontWeight: 800, color: fa.weeklyHours > 48 ? '#ff4757' : '#ffffff' }}>
                        {fa.weeklyHours}h / 48h
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#8b949e' }}>Rest Between Shifts</div>
                      <div style={{ fontWeight: 800, color: fa.restHoursBetweenShifts < 8 ? '#ff4757' : '#ffffff' }}>
                        {fa.restHoursBetweenShifts} hrs
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#8b949e' }}>Quit-Risk Score</div>
                      <div style={{ fontWeight: 800, color: fa.quitRiskScore > 70 ? '#ff4757' : '#ffa502' }}>
                        {fa.quitRiskScore}%
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#8b949e', marginBottom: '0.5rem' }}>
                    <strong>Risk Factors:</strong> {fa.quitRiskFactors.join(', ')}
                  </div>

                  <div style={{
                    backgroundColor: '#14171a',
                    borderRadius: '8px',
                    padding: '0.65rem',
                    fontSize: '0.75rem',
                    color: '#a3e635',
                    fontWeight: 700,
                  }}>
                    💡 Suggested Action: {fa.suggestedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 5: SAFE VOICE ANONYMOUS FEEDBACK INSIGHTS
         =================================================================== */}
      {activeAdminTab === 'FEEDBACK' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="carbon-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={18} style={{ color: '#a3e635' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>
                  Safe Voice Sanitized Worker Reports
                </h3>
              </div>
              <span className="badge-lime">
                AI IDENTITY SCRUBBER ACTIVE
              </span>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#8b949e', marginBottom: '1.25rem' }}>
              Personal names, shifts, gates, and identifying markers are automatically scrubbed before review.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {feedbackList.map((fb) => (
                <div
                  key={fb.id}
                  style={{
                    backgroundColor: '#08090a',
                    border: '1px solid #1a1e22',
                    borderRadius: '14px',
                    padding: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{
                      backgroundColor: '#14171a',
                      color: '#a3e635',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {fb.thematicCategory}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#8b949e', fontFamily: 'var(--font-mono)' }}>{fb.submittedAt}</span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#f4fbe8', lineHeight: 1.5, fontWeight: 500 }}>
                    "{fb.scrubbedContent}"
                  </p>

                  {fb.rawPreview && (
                    <details style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: '#8b949e' }}>
                      <summary style={{ cursor: 'pointer', color: '#a3e635', fontWeight: 700 }}>
                        Inspect Scrubber Difference (Demo Mode)
                      </summary>
                      <div style={{ marginTop: '0.35rem', padding: '0.5rem', backgroundColor: '#14171a', borderRadius: '6px', border: '1px dashed #24292f' }}>
                        <div style={{ color: '#ff4757' }}>Original Input: "{fb.rawPreview}"</div>
                        <div style={{ color: '#a3e635', marginTop: '0.2rem' }}>Sanitized Version: "{fb.scrubbedContent}"</div>
                      </div>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
