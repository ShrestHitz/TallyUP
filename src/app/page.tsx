'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Navigation } from '@/components/Navigation';
import { WorkerHome } from '@/components/worker/WorkerHome';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Github, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Home() {
  const { viewMode, setViewMode, sector } = useApp();

  return (
    <div className="impeccable-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navigation />

      <main style={{ flex: 1, padding: viewMode === 'WORKER' ? '1rem 0.5rem' : '0' }}>
        {viewMode === 'WORKER' ? <WorkerHome /> : <AdminDashboard />}
      </main>

      {/* Global Hackathon Project Showcase Footer */}
      <footer style={{
        backgroundColor: '#0a1118',
        borderTop: '1px solid #1e293b',
        color: '#94a3b8',
        padding: '1.25rem 1rem',
        fontSize: '0.8rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#2dd4bf', fontWeight: 700 }}>TallyUP</span>
            <span>• Built for UN SDG 8 Decent Work</span>
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
                color: '#2dd4bf',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <Github size={15} />
              <span>GitHub Repository</span>
              <ExternalLink size={12} />
            </a>

            <button
              onClick={() => setViewMode(viewMode === 'WORKER' ? 'ADMIN' : 'WORKER')}
              style={{
                backgroundColor: '#1e293b',
                color: '#ffffff',
                padding: '0.3rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: '1px solid #334155',
              }}
            >
              Switch to {viewMode === 'WORKER' ? 'Admin Hub' : 'Worker PWA'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
