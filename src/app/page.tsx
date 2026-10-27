'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Navigation } from '@/components/Navigation';
import { WorkerHome } from '@/components/worker/WorkerHome';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { Github, ExternalLink, Zap } from 'lucide-react';

export default function Home() {
  const { viewMode, setViewMode, onboardingStage, setOnboardingStage } = useApp();

  if (onboardingStage !== 'APP') {
    return <OnboardingFlow />;
  }

  return (
    <div className="impeccable-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#08090a' }}>
      <Navigation />

      <main style={{ flex: 1, padding: viewMode === 'WORKER' ? '1.5rem 0.75rem' : '0' }}>
        {viewMode === 'WORKER' ? <WorkerHome /> : <AdminDashboard />}
      </main>

      {/* Global Carbon & Lime Footer */}
      <footer style={{
        backgroundColor: '#08090a',
        borderTop: '1px solid #1a1e22',
        color: '#8b949e',
        padding: '1.25rem 1rem',
        fontSize: '0.8rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#a3e635', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>:T. TallyUP</span>
            <span>• Every hour counts. Count it. Prove it. Get paid.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a
              href="https://github.com/ShrestHitz/TallyUP.git"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#a3e635',
                fontWeight: 700,
                textDecoration: 'none',
                fontFamily: 'var(--font-display)',
              }}
            >
              <Github size={15} />
              <span>GitHub Repo</span>
              <ExternalLink size={12} />
            </a>

            <button
              onClick={() => setOnboardingStage('SPLASH')}
              style={{
                backgroundColor: 'rgba(163, 230, 53, 0.1)',
                color: '#a3e635',
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 800,
                border: '1px solid #a3e635',
                fontFamily: 'var(--font-display)',
                cursor: 'pointer',
              }}
            >
              ✨ Replay 3-Screen Onboarding
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'WORKER' ? 'ADMIN' : 'WORKER')}
              style={{
                backgroundColor: '#14171a',
                color: '#ffffff',
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 800,
                border: '1px solid #24292f',
                fontFamily: 'var(--font-display)',
              }}
            >
              Switch to {viewMode === 'WORKER' ? 'Command Hub' : 'Worker App'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
