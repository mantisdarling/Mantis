import { setRequestLocale } from 'next-intl/server';
import { Navbar } from '@/components/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin — MANTIS' };

const MOCK_USERS = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@example.com', role: 'EXPERT', sessions: 42, joined: 'Jan 2024' },
  { id: '2', name: 'Marcus Webb', email: 'marcus@example.com', role: 'EXPERT', sessions: 67, joined: 'Dec 2023' },
  { id: '3', name: 'Alex Kim', email: 'alex@example.com', role: 'LEARNER', sessions: 8, joined: 'Mar 2024' },
  { id: '4', name: 'Priya Patel', email: 'priya@example.com', role: 'EXPERT', sessions: 31, joined: 'Feb 2024' },
  { id: '5', name: 'Jordan Lee', email: 'jordan@example.com', role: 'LEARNER', sessions: 3, joined: 'Apr 2024' },
];

const ADMIN_STATS = [
  { label: 'Total Users', value: '2,847', delta: '+12%', icon: '👥', color: '#6366f1' },
  { label: 'Total Sessions', value: '14,203', delta: '+8%', icon: '📅', color: '#a855f7' },
  { label: 'Revenue (MTD)', value: '$89,421', delta: '+21%', icon: '💰', color: '#10b981' },
  { label: 'Active Experts', value: '512', delta: '+5%', icon: '🧠', color: '#f472b6' },
];

const roleBadge = (role: string) => ({
  display: 'inline-block' as const,
  padding: '0.2rem 0.6rem',
  borderRadius: '9999px',
  fontSize: '0.72rem',
  fontWeight: 600,
  ...(role === 'EXPERT'
    ? { background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }
    : role === 'ADMIN'
    ? { background: 'rgba(244,114,182,0.15)', color: '#f472b6', border: '1px solid rgba(244,114,182,0.3)' }
    : { background: 'rgba(161,161,170,0.1)', color: '#a1a1aa', border: '1px solid rgba(161,161,170,0.2)' }),
});

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#fafafa' }}>
      <Navbar locale={locale} />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
        {/* Header */}
        <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Admin <span className="gradient-text">Dashboard</span></h1>
            <p style={{ color: '#71717a', marginTop: '0.4rem' }}>Platform management and analytics overview.</p>
          </div>
          <span style={{ background: 'rgba(244,114,182,0.1)', border: '1px solid rgba(244,114,182,0.3)', color: '#f472b6', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600 }}>
            🔐 ADMIN ACCESS
          </span>
        </div>

        {/* Stats */}
        <div className="animate-fade-in-up-delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {ADMIN_STATS.map(s => (
            <div key={s.label} className="glass-panel" style={{ borderRadius: '1rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: '0.875rem', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{s.icon}</div>
              <div>
                <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fafafa', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '0.2rem' }}>{s.label}</p>
                <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>{s.delta} this month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div className="glass-panel animate-fade-in-up-delay-2" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>All Users</h2>
            <span style={{ fontSize: '0.8rem', color: '#71717a' }}>2,847 total</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['User', 'Email', 'Role', 'Sessions', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.875rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#71717a', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: i < MOCK_USERS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', color: '#fff', flexShrink: 0 }}>{u.name.charAt(0)}</div>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fafafa' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#71717a', fontSize: '0.875rem' }}>{u.email}</td>
                    <td style={{ padding: '1rem 1.5rem' }}><span style={roleBadge(u.role)}>{u.role}</span></td>
                    <td style={{ padding: '1rem 1.5rem', color: '#a1a1aa', fontSize: '0.875rem', fontWeight: 600 }}>{u.sessions}</td>
                    <td style={{ padding: '1rem 1.5rem', color: '#71717a', fontSize: '0.875rem' }}>{u.joined}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn-ghost" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}>View</button>
                        <button style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', borderRadius: '0.5rem', cursor: 'pointer', fontFamily: 'inherit' }}>Suspend</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
