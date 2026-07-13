'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';

type Tab = 'upcoming' | 'past' | 'canceled';

const MOCK_UPCOMING = [
  { id: '1', expert: 'Sarah Chen', headline: 'Ex-Google Staff Engineer', day: 'Mon Jul 14', time: '10:00 AM', rate: '$220/hr', skills: ['System Design', 'Go'] },
  { id: '2', expert: 'Priya Patel', headline: 'ML Research Lead at Meta', day: 'Wed Jul 16', time: '2:00 PM', rate: '$280/hr', skills: ['AI/ML', 'LLMs'] },
];

const MOCK_PAST = [
  { id: '3', expert: 'Marcus Webb', headline: 'Fintech CTO & Angel Investor', day: 'Mon Jul 7', time: '3:00 PM', rate: '$350/hr', rating: 5 },
];

export default function AppointmentsPage() {
  const { locale } = useParams() as { locale: string };
  const [tab, setTab] = useState<Tab>('upcoming');

  const tabStyle = (t: Tab) => ({
    padding: '0.5rem 1.25rem', borderRadius: '0.6rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.2s',
    ...(tab === t ? { background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff' } : { background: 'transparent', color: '#71717a' }),
  });

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#fafafa' }}>
      <Navbar locale={locale} />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
        <div className="animate-fade-in-up" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em' }}>My <span className="gradient-text">Appointments</span></h1>
          <p style={{ color: '#71717a', marginTop: '0.4rem' }}>Manage your upcoming and past mentorship sessions.</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.75rem', padding: '4px', width: 'fit-content', marginBottom: '2rem' }}>
          {(['upcoming', 'past', 'canceled'] as Tab[]).map(t => (
            <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'upcoming' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {MOCK_UPCOMING.map(s => (
              <div key={s.id} className="glass-panel card-hover" style={{ borderRadius: '1.25rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', color: '#fff', flexShrink: 0 }}>{s.expert.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.15rem' }}>{s.expert}</p>
                  <p style={{ color: '#71717a', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{s.headline}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {s.skills.map(sk => <span key={sk} className="skill-chip">{sk}</span>)}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontWeight: 700, color: '#fafafa', marginBottom: '0.15rem' }}>{s.day}</p>
                  <p style={{ color: '#818cf8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{s.time}</p>
                  <span style={{ fontSize: '0.8rem', color: '#71717a' }}>{s.rate}</span>
                </div>
                <a href={`/${locale}/session`} className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.82rem', textDecoration: 'none', flexShrink: 0 }}>Join →</a>
              </div>
            ))}
          </div>
        )}

        {tab === 'past' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {MOCK_PAST.map(s => (
              <div key={s.id} className="glass-panel" style={{ borderRadius: '1.25rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', opacity: 0.85 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#3f3f46,#27272a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', color: '#a1a1aa', flexShrink: 0 }}>{s.expert.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.15rem' }}>{s.expert}</p>
                  <p style={{ color: '#71717a', fontSize: '0.8rem' }}>{s.headline}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ color: '#a1a1aa', fontSize: '0.875rem', marginBottom: '0.15rem' }}>{s.day} · {s.time}</p>
                  <span style={{ color: '#fbbf24' }}>{'★'.repeat(s.rating || 0)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'canceled' && (
          <div className="glass-panel" style={{ borderRadius: '1.25rem', padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗑️</div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No Canceled Sessions</h3>
            <p style={{ color: '#71717a', fontSize: '0.875rem', marginBottom: '1.5rem' }}>You haven&apos;t canceled any sessions.</p>
            <a href={`/${locale}/dashboard`} className="btn-primary" style={{ padding: '0.75rem 1.75rem', textDecoration: 'none' }}>Find a Mentor →</a>
          </div>
        )}
      </main>
    </div>
  );
}
