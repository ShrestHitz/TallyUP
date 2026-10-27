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

  // Run ledger chain verification
  const handleVerifyChain = async () => {
    const result = await verifyLedgerChain(attendanceBlocks);
    if (result.valid) {
      setTamperVerificationMessage('✅ Cryptographic Chain Intact: All SHA-256 block hashes are 100% verified and untampered.');
    } else {
      setTamperVerificationMessage(`❌ ${result.reason}`);
    }
  };

  // Filter hazards for current sector
  const sectorHazards = hazards.filter((h) => h.sectorId === sectorId);
  const criticalHazardsCount = sectorHazards.filter((h) => h.severity === 'P1_CRITICAL' && h.status !== 'RESOLVED').length;

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '1.5rem 1.25rem',
      minHeight: 'calc(100vh - 65px)',
    }}>
      {/* Top Sector & Facility Banner */}
      <div style={{
        backgroundColor: '#0f172a',
        borderRadius: '20px',
        padding: '1.25rem 1.5rem',
        color: '#ffffff',
        border: '1px solid #1e293b',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2dd4bf', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {sectorId === 'construction' ? <HardHat size={16} /> : <GraduationCap size={16} />}
            <span>Active Sector Operations</span>
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.2rem' }}>
            {sector.name}
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            {sector.tagline} • Managing {sector.workerType}
          </p>
        </div>

        {/* Quick Sector Toggle */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setSectorId('construction')}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '12px',
              backgroundColor: sectorId === 'construction' ? '#009999' : '#1e293b',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: '1px solid #334155',
            }}
          >
            Metro Construction
          </button>
          <button
            onClick={() => setSectorId('campus')}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '12px',
              backgroundColor: sectorId === 'campus' ? '#0284c7' : '#1e293b',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: '1px solid #334155',
            }}
          >
            Campus Operations
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        {/* Metric 1 */}
        <div className="tally-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e0f7f6', color: '#009999', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Active Headcount</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>28 / 32</div>
            <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>87.5% Present on Site</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="tally-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Cumulative Overtime</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>142.5 hrs</div>
            <div style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 600 }}>Under 2.0x Statutory Multiplier</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="tally-card" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          borderColor: criticalHazardsCount > 0 ? '#ef4444' : '#e2e8f0',
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>P1 Critical Hazards</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>{criticalHazardsCount} Active</div>
            <div style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700 }}>15-Min SLA Auto-Escalating</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="tally-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Ledger Chain Health</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isLedgerTampered ? '#ef4444' : '#10b981' }}>
              {isLedgerTampered ? 'Tampered' : '100% Intact'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>SHA-256 Pocket Witness</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '2px solid #e2e8f0',
        marginBottom: '1.5rem',
        overflowX: 'auto',
      }}>
        {[
          { id: 'LEDGER', label: 'Tamper-Evident Ledger', badge: isLedgerTampered ? 'Tampered' : 'Verified' },
          { id: 'HAZARDS', label: 'Multimodal Hazards & SLA', count: sectorHazards.length },
          { id: 'PAYROLL', label: 'Wage Guardian Audit', badge: '1 Dispute' },
          { id: 'FATIGUE', label: 'Fatigue & Quit-Risk Engine', count: fatigueAlerts.length },
          { id: 'FEEDBACK', label: 'Safe Voice Insights', count: feedbackList.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            style={{
              padding: '0.75rem 1.25rem',
              fontSize: '0.9rem',
              fontWeight: activeAdminTab === tab.id ? 800 : 600,
              color: activeAdminTab === tab.id ? '#009999' : '#64748b',
              borderBottom: activeAdminTab === tab.id ? '3px solid #009999' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{tab.label}</span>
            {tab.badge && (
              <span style={{
                fontSize: '0.7rem',
                backgroundColor: tab.badge === 'Tampered' ? '#fee2e2' : '#e0f7f6',
                color: tab.badge === 'Tampered' ? '#ef4444' : '#009999',
                padding: '0.1rem 0.5rem',
                borderRadius: '9999px',
                fontWeight: 700,
              }}>
                {tab.badge}
              </span>
            )}
            {tab.count !== undefined && (
              <span style={{
                fontSize: '0.7rem',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                padding: '0.1rem 0.5rem',
                borderRadius: '9999px',
                fontWeight: 700,
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
            backgroundColor: isLedgerTampered ? '#fef2f2' : '#f0fdfa',
            border: isLedgerTampered ? '2px solid #ef4444' : '1px solid #99f6e4',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <div style={{
                fontWeight: 800,
                color: isLedgerTampered ? '#b91c1c' : '#0f766e',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}>
                {isLedgerTampered ? <XCircle size={20} /> : <ShieldCheck size={20} />}
                <span>
                  {isLedgerTampered
                    ? 'CRYPTOGRAPHIC CHAIN FAILURE: Boss Tampering Detected!'
                    : 'Pocket Witness Ledger Chain: 100% Cryptographically Intact'}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: isLedgerTampered ? '#7f1d1d' : '#134e4a', marginTop: '0.25rem' }}>
                {isLedgerTampered
                  ? 'Block #2 was altered from 11.0 hrs to 8.0 hrs. The stored SHA-256 hash does not match computed block data!'
                  : 'Every check-in is linked with SHA-256. If any past shift is altered, the entire chain flags the fraud.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button
                onClick={handleVerifyChain}
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <RefreshCw size={15} />
                <span>Verify All Hashes</span>
              </button>

              {!isLedgerTampered ? (
                <button
                  onClick={() => simulateTamper('blk-02', 8.0)}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    padding: '0.65rem 1rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                  }}
                  title="Simulate an administrator secretly reducing Murugan's hours from 11 to 8"
                >
                  <AlertTriangle size={15} />
                  <span>Simulate Boss Tampering</span>
                </button>
              ) : (
                <button
                  onClick={restoreLedger}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    padding: '0.65rem 1rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <CheckCircle2 size={15} />
                  <span>Restore Original Ledger</span>
                </button>
              )}
            </div>
          </div>

          {tamperVerificationMessage && (
            <div style={{
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              padding: '0.85rem',
              borderRadius: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
            }}>
              {tamperVerificationMessage}
            </div>
          )}

          {/* Ledger Table */}
          <div className="tally-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700 }}>
                  <tr>
                    <th style={{ padding: '0.85rem 1rem' }}>Block ID & Code</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Worker Name</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Zone</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Date</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Regular / OT</th>
                    <th style={{ padding: '0.85rem 1rem' }}>SHA-256 Current Hash</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceBlocks.map((blk, idx) => (
                    <tr
                      key={blk.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: blk.tamperFlag ? '#fef2f2' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{blk.id}</div>
                        <div style={{ fontSize: '0.7rem', color: '#009999', fontFamily: 'var(--font-mono)' }}>
                          {blk.verifiedReceiptCode}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{blk.workerName}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>{blk.siteZone.split('—')[0]}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{blk.date}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontWeight: 700 }}>{blk.regularHours}h</span>
                        {blk.overtimeHours > 0 && (
                          <span style={{ color: '#009999', fontWeight: 700, marginLeft: '4px' }}>
                            (+{blk.overtimeHours}h OT)
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#64748b' }}>
                        {blk.hash.substring(0, 16)}...
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {blk.tamperFlag ? (
                          <span style={{
                            backgroundColor: '#ef4444',
                            color: '#ffffff',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '9999px',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                          }}>
                            Tampered
                          </span>
                        ) : (
                          <span style={{
                            backgroundColor: '#e0f7f6',
                            color: '#009999',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '9999px',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                          }}>
                            ✓ Verified
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
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              Multimodal Safety Queue ({sector.name})
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Auto-translated by Gemini 1.5 Flash • 15-Minute SLA Auto-Escalation
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
            {sectorHazards.map((h) => (
              <div
                key={h.id}
                className="tally-card"
                style={{
                  borderLeft: h.severity === 'P1_CRITICAL' ? '5px solid #ef4444' : '5px solid #f59e0b',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className={`badge ${h.severity === 'P1_CRITICAL' ? 'badge-p1' : 'badge-p2'}`}>
                    {h.severity === 'P1_CRITICAL' ? '⚠️ P1 Critical Hazard' : 'P2 Moderate Hazard'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{h.reportedAt}</span>
                </div>

                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', marginBottom: '0.35rem' }}>
                  {h.category}
                </div>

                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>
                  📍 {h.zone} • {h.clusterCount > 1 ? `⚡ ${h.clusterCount} Workers Reported` : 'Single Report'}
                </div>

                {/* English translated summary */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  fontSize: '0.85rem',
                  color: '#1e293b',
                  marginBottom: '0.75rem',
                  lineHeight: 1.4,
                }}>
                  <div style={{ fontSize: '0.7rem', color: '#009999', fontWeight: 700, marginBottom: '0.2rem' }}>
                    Gemini English Translation:
                  </div>
                  {h.translatedEnglishSummary}
                </div>

                {/* Recommended Immediate Action */}
                <div style={{ fontSize: '0.75rem', color: '#b91c1c', marginBottom: '1rem', fontWeight: 600 }}>
                  Protocol: {h.recommendedAction}
                </div>

                {/* Status action buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: h.status === 'RESOLVED' ? '#10b981' : '#f59e0b' }}>
                    Status: {h.status}
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {h.status === 'SUBMITTED' && (
                      <button
                        onClick={() => updateHazardStatus(h.id, 'ACKNOWLEDGED')}
                        style={{
                          backgroundColor: '#009999',
                          color: '#ffffff',
                          padding: '0.4rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        Acknowledge
                      </button>
                    )}
                    {h.status === 'ACKNOWLEDGED' && (
                      <button
                        onClick={() => updateHazardStatus(h.id, 'IN_PROGRESS')}
                        style={{
                          backgroundColor: '#f59e0b',
                          color: '#ffffff',
                          padding: '0.4rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        Dispatch Crew
                      </button>
                    )}
                    {h.status !== 'RESOLVED' && (
                      <button
                        onClick={() => updateHazardStatus(h.id, 'RESOLVED')}
                        style={{
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          padding: '0.4rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
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
          TAB 3: WAGE GUARDIAN PAYROLL DISCREPANCY AUDIT
         =================================================================== */}
      {activeAdminTab === 'PAYROLL' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="tally-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>
              Wage Guardian Audit Table (Current Payout Cycle)
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Cross-referencing verified SHA-256 ledger hours against contractor payroll submissions under BOCW / Factories Act overtime rules.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <tr>
                    <th style={{ padding: '0.85rem 1rem' }}>Worker</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Verified Hours</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Hourly Base Rate</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Statutory Pay</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Contractor Paid</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Discrepancy Gap</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {SEED_WORKERS.filter((w) => w.sectorId === sectorId).map((w) => {
                    const audit = auditWorkerPay(w, attendanceBlocks, w.id === 'w1' ? 7500 : 8500, sector);
                    return (
                      <tr key={w.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: 700 }}>{w.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{w.tradeRole}</div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          {audit.verifiedRegularHours}h Reg + {audit.verifiedOvertimeHours}h OT
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>₹{w.hourlyRate}/h</td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#10b981' }}>
                          ₹{audit.calculatedLegitimatePay}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>₹{audit.employerDeclaredPay}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          {audit.isUnderpaid ? (
                            <span style={{ color: '#ef4444', fontWeight: 800 }}>
                              -₹{audit.discrepancyAmount} Underpaid
                            </span>
                          ) : (
                            <span style={{ color: '#10b981', fontWeight: 600 }}>✓ Settled</span>
                          )}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          {audit.isUnderpaid ? (
                            <button
                              onClick={() => alert(`Back-pay payout of ₹${audit.discrepancyAmount} approved for ${w.name}!`)}
                              style={{
                                backgroundColor: '#009999',
                                color: '#ffffff',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                              }}
                            >
                              Approve Back-Pay
                            </button>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>No Action</span>
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
          <div className="tally-card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
              Explainable Workforce Fatigue & Retention Indicators
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Transparent mathematical rules (consecutive shifts, turnaround rest, overtime burden) — zero opaque black-box scoring.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {fatigueAlerts.map((fa) => (
                <div
                  key={fa.workerId}
                  style={{
                    backgroundColor: '#ffffff',
                    border: fa.fatigueRiskLevel === 'CRITICAL' ? '2px solid #ef4444' : '1px solid #cbd5e1',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    boxShadow: 'var(--shadow-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{fa.workerName}</h4>
                      <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{fa.tradeRole} • {fa.team}</p>
                    </div>
                    <span style={{
                      backgroundColor: fa.fatigueRiskLevel === 'CRITICAL' ? '#fee2e2' : '#fef3c7',
                      color: fa.fatigueRiskLevel === 'CRITICAL' ? '#ef4444' : '#d97706',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}>
                      {fa.fatigueRiskLevel}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', margin: '0.75rem 0', fontSize: '0.8rem' }}>
                    <div>
                      <div style={{ color: '#64748b' }}>Weekly Hours</div>
                      <div style={{ fontWeight: 800, color: fa.weeklyHours > 48 ? '#ef4444' : '#0f172a' }}>
                        {fa.weeklyHours}h / 48h
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b' }}>Rest Between Shifts</div>
                      <div style={{ fontWeight: 800, color: fa.restHoursBetweenShifts < 8 ? '#ef4444' : '#0f172a' }}>
                        {fa.restHoursBetweenShifts} hrs
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b' }}>Quit-Risk Heuristic</div>
                      <div style={{ fontWeight: 800, color: fa.quitRiskScore > 70 ? '#ef4444' : '#d97706' }}>
                        {fa.quitRiskScore}%
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '0.5rem' }}>
                    <strong>Risk Factors:</strong> {fa.quitRiskFactors.join(', ')}
                  </div>

                  <div style={{
                    backgroundColor: '#f1f5f9',
                    borderRadius: '8px',
                    padding: '0.65rem',
                    fontSize: '0.75rem',
                    color: '#0f766e',
                    fontWeight: 600,
                  }}>
                    💡 Action: {fa.suggestedAction}
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
          <div className="tally-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={20} style={{ color: '#009999' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  Safe Voice Sanitized Worker Submissions
                </h3>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#0f766e', backgroundColor: '#e0f7f6', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 700 }}>
                🛡️ AI Identity Scrubber Active • Zero IDs Logged
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Names, shifts, dates, and de-anonymizing details are automatically scrubbed before reaching supervisor review.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {feedbackList.map((fb) => (
                <div
                  key={fb.id}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{
                      backgroundColor: '#e2e8f0',
                      color: '#334155',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}>
                      {fb.thematicCategory}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{fb.submittedAt}</span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.5, fontWeight: 500 }}>
                    "{fb.scrubbedContent}"
                  </p>

                  {fb.rawPreview && (
                    <details style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                      <summary style={{ cursor: 'pointer', color: '#009999', fontWeight: 600 }}>
                        Inspect Scrubber Difference (Demo Mode)
                      </summary>
                      <div style={{ marginTop: '0.35rem', padding: '0.5rem', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
                        <div style={{ color: '#ef4444' }}>Original Worker Input: "{fb.rawPreview}"</div>
                        <div style={{ color: '#10b981', marginTop: '0.2rem' }}>Sanitized Public Version: "{fb.scrubbedContent}"</div>
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
