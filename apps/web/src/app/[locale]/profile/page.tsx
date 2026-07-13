'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const SKILLS_OPTIONS = ['React','TypeScript','Node.js','Python','System Design','Product Management','Fundraising','AI/ML','UX Design','Marketing','Data Science','DevOps','Web3','Leadership'];

export default function ProfilePage() {
  const { locale } = useParams() as { locale: string };
  const [bio, setBio] = useState('');
  const [headline, setHeadline] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  function toggleSkill(s: string) {
    setSelectedSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(''); setSaved(false);
    try {
      const token = document.cookie.split(';').find(c => c.trim().startsWith('jwt='))?.split('=')[1];
      const res = await fetch(`${API_URL}/users/me/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bio, headline, skills: selectedSkills, hourlyRate: hourlyRate ? +hourlyRate : undefined }),
      });
      if (!res.ok) throw new Error('Save failed');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { setError('Failed to save profile. Please try again.'); }
    finally { setSaving(false); }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#fafafa' }}>
      <Navbar locale={locale} />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
        <div className="animate-fade-in-up" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Edit <span className="gradient-text">Profile</span></h1>
          <p style={{ color: '#71717a', marginTop: '0.4rem' }}>How the world sees you on MANTIS.</p>
        </div>

        {/* Avatar */}
        <div className="glass-panel animate-fade-in-up-delay-1" style={{ borderRadius: '1.25rem', padding: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>M</div>
          <div>
            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Profile Photo</p>
            <p style={{ color: '#71717a', fontSize: '0.85rem', marginBottom: '0.75rem' }}>Upload a professional photo to build trust.</p>
            <button className="btn-ghost" style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}>Upload Photo</button>
          </div>
        </div>

        <form onSubmit={handleSave} className="animate-fade-in-up-delay-2">
          <div className="glass-panel" style={{ borderRadius: '1.25rem', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#a1a1aa', marginBottom: '0.5rem' }}>Headline</label>
              <input className="input-base" value={headline} onChange={e => setHeadline(e.target.value)} placeholder="e.g. Senior Software Engineer at Google" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#a1a1aa', marginBottom: '0.5rem' }}>Bio</label>
              <textarea className="input-base" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell learners about your background, expertise, and what you can help them with..." rows={5} style={{ resize: 'vertical', minHeight: 120 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#a1a1aa', marginBottom: '0.75rem' }}>Skills</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {SKILLS_OPTIONS.map(s => (
                  <button key={s} type="button" onClick={() => toggleSkill(s)} style={{ padding: '0.35rem 0.85rem', borderRadius: '9999px', border: '1px solid', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', ...(selectedSkills.includes(s) ? { background: 'rgba(99,102,241,0.2)', borderColor: '#6366f1', color: '#818cf8' } : { background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: '#71717a' }) }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#a1a1aa', marginBottom: '0.5rem' }}>Hourly Rate (USD) — Experts only</label>
              <input className="input-base" type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} placeholder="e.g. 150" min={10} max={2000} style={{ maxWidth: 200 }} />
            </div>

            {error && <p style={{ color: '#f87171', fontSize: '0.85rem' }}>{error}</p>}
            {saved && <p style={{ color: '#34d399', fontSize: '0.85rem' }}>✓ Profile saved successfully!</p>}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '0.8rem 2rem' }}>
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
