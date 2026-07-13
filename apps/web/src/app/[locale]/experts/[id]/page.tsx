import { setRequestLocale } from 'next-intl/server';
import { Navbar } from '@/components/Navbar';
import type { Metadata } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Expert {
  id: string;
  name: string;
  profile?: {
    bio?: string;
    headline?: string;
    avatarUrl?: string;
    skills?: string[];
    rating?: number;
    hourlyRate?: number;
    isVerified?: boolean;
  };
  reviewsReceived?: Array<{
    rating: number;
    comment?: string;
    createdAt: string;
    learner?: { name: string };
  }>;
}

async function getExpert(id: string): Promise<Expert | null> {
  try {
    const res = await fetch(`${API_URL}/experts/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const expert = await getExpert(id);
  return {
    title: expert ? `${expert.name} — MANTIS` : 'Expert Profile — MANTIS',
    description: expert?.profile?.bio || 'View this expert\'s profile on MANTIS.',
  };
}

const MOCK_EXPERT: Expert = {
  id: '1',
  name: 'Sarah Chen',
  profile: {
    headline: 'Ex-Google Staff Engineer · 12 years experience',
    bio: `I spent 12 years at Google scaling distributed systems that serve hundreds of millions of users daily. Before that I led platform engineering at two Series B startups.

I specialize in system design, distributed architecture, Go, Kubernetes, and engineering leadership. Whether you're preparing for a staff engineer interview, debugging a production outage, or designing your startup's first architecture — I've been there and I can help.

My sessions are direct, focused, and immediately actionable. I won't waste your time with theory you can read on a blog. I'll help you solve the actual problem in front of you.`,
    skills: ['System Design', 'Distributed Systems', 'Go', 'Kubernetes', 'Engineering Leadership', 'Staff Eng Interviews', 'PostgreSQL', 'Redis'],
    rating: 4.9,
    hourlyRate: 220,
    isVerified: true,
  },
  reviewsReceived: [
    { rating: 5, comment: 'Sarah helped me pass my Google system design interview. She identified gaps in my thinking that I had completely missed. 100% worth it.', createdAt: '2024-06-10', learner: { name: 'Alex K.' } },
    { rating: 5, comment: 'Incredible session. We designed a real-time notification system from scratch. Sarah explained trade-offs in a way I finally understood.', createdAt: '2024-05-22', learner: { name: 'Jordan M.' } },
    { rating: 5, comment: 'Best mentor I\'ve worked with on this platform. Direct, knowledgeable, and genuinely cares about your growth.', createdAt: '2024-04-15', learner: { name: 'Preet S.' } },
  ],
};

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#fbbf24' : '#3f3f46', fontSize: size }}>★</span>
      ))}
    </span>
  );
}

export default async function ExpertProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const expert = (await getExpert(id)) || MOCK_EXPERT;
  const p = expert.profile;

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#fafafa' }}>
      {/* Background orbs */}
      <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <Navbar locale={locale} />

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
        {/* Hero card */}
        <div className="glass-panel animate-fade-in-up" style={{ borderRadius: '1.5rem', padding: '2.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {p?.avatarUrl ? (
                <img src={p.avatarUrl} alt={expert.name} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
                  {expert.name.charAt(0)}
                </div>
              )}
              {p?.isVerified && (
                <div style={{ position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', border: '2px solid #09090b' }}>✓</div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#fafafa' }}>{expert.name}</h1>
                {p?.isVerified && <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#818cf8', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>✓ VERIFIED</span>}
              </div>
              <p style={{ color: '#a1a1aa', fontSize: '1rem', marginBottom: '0.75rem' }}>{p?.headline}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                {p?.rating && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <StarRating rating={p.rating} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fafafa' }}>{p.rating.toFixed(1)}</span>
                    <span style={{ fontSize: '0.8rem', color: '#71717a' }}>({expert.reviewsReceived?.length || 0} reviews)</span>
                  </div>
                )}
                <span style={{ color: '#3f3f46' }}>·</span>
                <span style={{ fontSize: '0.875rem', color: '#71717a' }}>🕒 Usually responds within 1 hour</span>
              </div>

              {/* Skills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {p?.skills?.map(s => <span key={s} className="skill-chip">{s}</span>)}
              </div>
            </div>

            {/* Booking CTA */}
            <div className="glass-panel-bright" style={{ borderRadius: '1.25rem', padding: '1.75rem', minWidth: 220, flexShrink: 0, textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 900, color: '#fafafa', marginBottom: '0.1rem' }}>${p?.hourlyRate}</p>
              <p style={{ fontSize: '0.8rem', color: '#71717a', marginBottom: '1.25rem' }}>per hour · escrow protected</p>
              <a
                href={`/${locale}/book?expert=${expert.id}`}
                className="btn-primary"
                style={{ display: 'block', padding: '0.85rem', textDecoration: 'none', fontSize: '0.95rem', marginBottom: '0.75rem' }}
              >
                Book a Session →
              </a>
              <p style={{ fontSize: '0.75rem', color: '#52525b' }}>🔒 $0 charged until session ends</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
          {/* Bio + Reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* About */}
            <div className="glass-panel animate-fade-in-up-delay-1" style={{ borderRadius: '1.25rem', padding: '2rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#fafafa' }}>About</h2>
              <div style={{ color: '#a1a1aa', lineHeight: 1.8, fontSize: '0.9rem', whiteSpace: 'pre-line' }}>
                {p?.bio}
              </div>
            </div>

            {/* Reviews */}
            {expert.reviewsReceived && expert.reviewsReceived.length > 0 && (
              <div className="glass-panel animate-fade-in-up-delay-2" style={{ borderRadius: '1.25rem', padding: '2rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#fafafa' }}>
                  Reviews
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: '#71717a', fontWeight: 400 }}>({expert.reviewsReceived.length})</span>
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {expert.reviewsReceived.map((r, i) => (
                    <div key={i} style={{ paddingBottom: i < expert.reviewsReceived!.length - 1 ? '1.25rem' : 0, borderBottom: i < expert.reviewsReceived!.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#3f3f46,#27272a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#a1a1aa' }}>
                          {r.learner?.name.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fafafa' }}>{r.learner?.name}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <StarRating rating={r.rating} size={12} />
                            <span style={{ fontSize: '0.72rem', color: '#52525b' }}>{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                      {r.comment && <p style={{ color: '#a1a1aa', fontSize: '0.875rem', lineHeight: 1.7 }}>&ldquo;{r.comment}&rdquo;</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Quick stats */}
            <div className="glass-panel animate-fade-in-up-delay-1" style={{ borderRadius: '1.25rem', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#71717a', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Stats</h3>
              {[
                { label: 'Sessions completed', value: '142' },
                { label: 'Response time', value: '< 1 hour' },
                { label: 'Languages', value: 'English' },
                { label: 'Timezone', value: 'PST (UTC-8)' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: '#71717a', fontSize: '0.82rem' }}>{label}</span>
                  <span style={{ color: '#fafafa', fontSize: '0.82rem', fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Session types */}
            <div className="glass-panel animate-fade-in-up-delay-2" style={{ borderRadius: '1.25rem', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#71717a', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Session Types</h3>
              {[
                { icon: '🎯', label: 'Career Coaching', duration: '60 min' },
                { icon: '🏗️', label: 'System Design', duration: '90 min' },
                { icon: '💼', label: 'Interview Prep', duration: '60 min' },
                { icon: '🔍', label: 'Code Review', duration: '45 min' },
              ].map(({ icon, label, duration }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                  <span style={{ flex: 1, color: '#a1a1aa', fontSize: '0.82rem' }}>{label}</span>
                  <span style={{ color: '#71717a', fontSize: '0.75rem' }}>{duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
