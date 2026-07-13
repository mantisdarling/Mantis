'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';

const SLOTS = ['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM'];
const DAYS = ['Mon Jul 14','Tue Jul 15','Wed Jul 16','Thu Jul 17','Fri Jul 18'];

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function BookPage() {
  const { locale } = useParams() as { locale: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  const expertId = searchParams.get('expert') || '';

  const [selectedDay, setSelectedDay] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [booking, setBooking] = useState(false);

  async function handleBook() {
    if (!selectedDay || !selectedSlot) return;
    setBooking(true);
    try {
      const token = document.cookie.split(';').find(c => c.trim().startsWith('jwt='))?.split('=')[1];
      const res = await fetch(`${API_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ expertId }),
      });
      if (res.ok) router.push(`/${locale}/checkout?expert=${expertId}&day=${encodeURIComponent(selectedDay)}&slot=${encodeURIComponent(selectedSlot)}`);
    } finally { setBooking(false); }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#fafafa' }}>
      <Navbar locale={locale} />
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
        <div className="animate-fade-in-up" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Book a <span className="gradient-text">Session</span></h1>
          <p style={{ color: '#71717a', marginTop: '0.4rem' }}>Choose a day and time that works for you.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Expert card */}
          <div className="glass-panel" style={{ borderRadius: '1.25rem', padding: '2rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>E</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Expert Mentor</h2>
            <p style={{ color: '#71717a', fontSize: '0.85rem', marginBottom: '1rem' }}>Industry veteran · 4.9★</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[['⏱️ Duration','60 minutes'],['💰 Rate','$150/hr'],['🔒 Payment','Escrow — only released after session'],['🎥 Format','Live video + chat']].map(([icon, val]) => (
                <div key={val} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#71717a' }}>{icon}</span>
                  <span style={{ color: '#fafafa', fontWeight: 500 }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="glass-panel" style={{ borderRadius: '1.25rem', padding: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Select a Day</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {DAYS.map(d => (
                <button key={d} onClick={() => setSelectedDay(d)} style={{ padding: '0.5rem 0.9rem', borderRadius: '0.6rem', border: '1px solid', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', ...(selectedDay === d ? { background: 'linear-gradient(135deg,#6366f1,#4f46e5)', borderColor: '#6366f1', color: '#fff' } : { background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: '#a1a1aa' }) }}>
                  {d}
                </button>
              ))}
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Select a Time</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.5rem', marginBottom: '2rem' }}>
              {SLOTS.map(slot => (
                <button key={slot} onClick={() => setSelectedSlot(slot)} disabled={!selectedDay} style={{ padding: '0.65rem', borderRadius: '0.6rem', border: '1px solid', fontSize: '0.85rem', fontWeight: 500, cursor: selectedDay ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 0.2s', opacity: selectedDay ? 1 : 0.4, ...(selectedSlot === slot ? { background: 'linear-gradient(135deg,#6366f1,#4f46e5)', borderColor: '#6366f1', color: '#fff' } : { background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: '#a1a1aa' }) }}>
                  {slot}
                </button>
              ))}
            </div>

            <button onClick={handleBook} disabled={!selectedDay || !selectedSlot || booking} className="btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem' }}>
              {booking ? 'Booking...' : selectedDay && selectedSlot ? `Confirm ${selectedDay} at ${selectedSlot} →` : 'Select a day and time'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
