import { setRequestLocale } from 'next-intl/server';
import { Navbar } from '@/components/Navbar';
import { DashboardCharts } from '@/components/DashboardCharts';
import { SearchBar } from '@/components/SearchBar';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard — MANTIS' };

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Expert {
  id: string;
  name: string;
  profile?: { bio?: string; headline?: string; avatarUrl?: string; skills?: string[]; rating?: number; hourlyRate?: number };
}

async function getExperts(): Promise<Expert[]> {
  try {
    const res = await fetch(`${API_URL}/experts`, { next: { revalidate: 60 } });
    if (!res.ok) return MOCK_EXPERTS;
    return await res.json();
  } catch {
    return MOCK_EXPERTS;
  }
}

const MOCK_EXPERTS: Expert[] = [
  { id: '1', name: 'Sarah Chen', profile: { headline: 'Ex-Google Staff Engineer', bio: 'Scaled systems to 100M users.', skills: ['System Design', 'Go', 'Kubernetes'], rating: 4.9, hourlyRate: 220 } },
  { id: '2', name: 'Marcus Webb', profile: { headline: 'Fintech CTO & Angel Investor', bio: 'Built 3 fintech exits.', skills: ['Fundraising', 'Product', 'Fintech'], rating: 4.8, hourlyRate: 350 } },
  { id: '3', name: 'Priya Patel', profile: { headline: 'ML Research Lead at Meta', bio: 'LLM specialist, 12 patents.', skills: ['AI/ML', 'Python', 'LLMs'], rating: 5.0, hourlyRate: 280 } },
  { id: '4', name: 'Daniel Okafor', profile: { headline: 'Y Combinator Alumni (W22)', bio: 'Grew startup 0→$4M ARR.', skills: ['Startup', 'Growth', 'Sales'], rating: 4.7, hourlyRate: 180 } },
  { id: '5', name: 'Elena Rossi', profile: { headline: 'Senior UX Lead at Figma', bio: 'Designed for 20M+ users.', skills: ['UX Design', 'Figma', 'Research'], rating: 4.9, hourlyRate: 160 } },
  { id: '6', name: 'James Liu', profile: { headline: 'Blockchain Core Developer', bio: 'Built DeFi protocols with $1B TVL.', skills: ['Solidity', 'Web3', 'DeFi'], rating: 4.6, hourlyRate: 300 } },
];

const STATS = [
  { label: 'Sessions', value: '0', icon: '📅', color: '#6366f1' },
  { label: 'Hours Learned', value: '0h', icon: '⏱️', color: '#a855f7' },
  { label: 'Experts Available', value: '500+', icon: '🧠', color: '#f472b6' },
  { label: 'Avg. Rating', value: '4.9★', icon: '⭐', color: '#fbbf24' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#fbbf24' : '#3f3f46', fontSize: '0.75rem' }}>★</span>
      ))}
      <span style={{ color: '#71717a', fontSize: '0.75rem', marginLeft: 4 }}>{rating.toFixed(1)}</span>
    </span>
  );
}

function AvatarPlaceholder({ name, size = 52 }: { name: string; size?: number }) {
  const colors = ['#6366f1','#a855f7','#f472b6','#06b6d4','#10b981','#f59e0b'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `linear-gradient(135deg, ${color}, ${color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function ExpertCard({ expert, locale }: { expert: Expert; locale: string }) {
  const p = expert.profile;
  return (
    <div className="glass-panel card-hover" style={{ borderRadius: '1.25rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        {p?.avatarUrl
          ? <img src={p.avatarUrl} alt={expert.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }} />
          : <AvatarPlaceholder name={expert.name} />
        }
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 700, color: '#fafafa', fontSize: '1rem', marginBottom: '0.15rem' }}>{expert.name}</p>
          <p style={{ color: '#71717a', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p?.headline}</p>
          {p?.rating && <div style={{ marginTop: '0.25rem' }}><StarRating rating={p.rating} /></div>}
        </div>
        {p?.hourlyRate && (
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fafafa' }}>${p.hourlyRate}</span>
            <span style={{ fontSize: '0.72rem', color: '#71717a', display: 'block' }}>/hr</span>
          </div>
        )}
      </div>

      {p?.skills && p.skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {p.skills.slice(0, 4).map(s => <span key={s} className="skill-chip">{s}</span>)}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.25rem' }}>
        <a href={`/${locale}/experts/${expert.id}`} className="btn-ghost" style={{ flex: 1, fontSize: '0.8rem', padding: '0.55rem 0.75rem', textAlign: 'center', textDecoration: 'none' }}>View Profile</a>
        <a href={`/${locale}/book?expert=${expert.id}`} className="btn-primary" style={{ flex: 1, fontSize: '0.8rem', padding: '0.55rem 0.75rem', textAlign: 'center', textDecoration: 'none' }}>Book Session</a>
      </div>
    </div>
  );
}

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const experts = await getExperts();

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#fafafa' }}>
      <Navbar locale={locale} />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
        {/* Header */}
        <div className="animate-fade-in-up" style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
            Your <span className="gradient-text">Dashboard</span>
          </h1>
          <p style={{ color: '#71717a', fontSize: '1rem' }}>Find the perfect mentor for your next breakthrough.</p>
        </div>

        {/* Stats */}
        <div className="animate-fade-in-up-delay-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {STATS.map((s) => (
            <div key={s.label} className="glass-panel" style={{ borderRadius: '1rem', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '0.75rem', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{s.icon}</div>
              <div>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fafafa', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '0.78rem', color: '#71717a', marginTop: '0.2rem' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="animate-fade-in-up-delay-2" style={{ marginBottom: '2.5rem' }}>
          <SearchBar locale={locale} />
        </div>

        {/* Expert Grid */}
        <div className="animate-fade-in-up-delay-3">
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem', color: '#fafafa' }}>
            Featured Experts
            <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: '#71717a', fontWeight: 400 }}>{experts.length} available</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '4rem' }}>
            {experts.map((expert) => <ExpertCard key={expert.id} expert={expert} locale={locale} />)}
          </div>
        </div>

        {/* Charts */}
        <DashboardCharts />
      </main>
    </div>
  );
}
