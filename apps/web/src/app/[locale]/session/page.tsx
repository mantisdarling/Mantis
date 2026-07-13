'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const MOCK_MESSAGES = [
  { id: 1, from: 'Expert', text: 'Welcome! Glad to be connecting with you today.', time: '2:01 PM' },
  { id: 2, from: 'Me', text: 'Thanks! I have a few questions about system design.', time: '2:02 PM' },
  { id: 3, from: 'Expert', text: 'Perfect, let\'s start with your architecture goals.', time: '2:03 PM' },
];

export default function SessionPage() {
  const { locale } = useParams() as { locale: string };
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [ending, setEnding] = useState(false);
  const [ended, setEnded] = useState(false);

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), from: 'Me', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setMessage('');
  }

  async function endSession() {
    setEnding(true);
    await new Promise(r => setTimeout(r, 1200));
    setEnded(true);
    setEnding(false);
  }

  if (ended) {
    return (
      <div style={{ minHeight: '100vh', background: '#09090b', color: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem', textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '4rem' }}>✅</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Session <span className="gradient-text">Complete!</span></h1>
        <p style={{ color: '#71717a', maxWidth: 400 }}>Great session! Your payment has been released to your mentor. Please leave a review to help other learners.</p>
        <a href={`/${locale}/dashboard`} className="btn-primary" style={{ padding: '0.85rem 2rem', textDecoration: 'none' }}>Leave a Review →</a>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#fafafa', display: 'flex', flexDirection: 'column' }}>
      <Navbar locale={locale} />
      <main style={{ flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '5rem 1.5rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Video area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel" style={{ borderRadius: '1.25rem', aspectRatio: '16/9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', position: 'relative', overflow: 'hidden', background: 'rgba(9,9,11,0.9)' }}>
            {/* Gradient bg */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 30%, rgba(99,102,241,0.08), transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(168,85,247,0.06), transparent 60%)' }} />
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎥</div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Live Session</h2>
              <p style={{ color: '#71717a', fontSize: '0.875rem', marginBottom: '1.5rem' }}>WebRTC video — coming in the next release</p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                {['🎤 Mute','📷 Camera','🖥️ Share'].map(btn => (
                  <button key={btn} className="btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>{btn}</button>
                ))}
              </div>
            </div>
            {/* Timer */}
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', borderRadius: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem', fontWeight: 600, color: '#34d399' }}>
              ● LIVE · 00:12:34
            </div>
          </div>
          <button onClick={endSession} disabled={ending} style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', fontWeight: 700, padding: '0.85rem', borderRadius: '0.875rem', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontFamily: 'inherit', transition: 'all 0.2s' }}>
            {ending ? 'Ending session...' : '⏹ End Session & Release Payment'}
          </button>
        </div>

        {/* Chat sidebar */}
        <div className="glass-panel" style={{ borderRadius: '1.25rem', display: 'flex', flexDirection: 'column', height: '75vh' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 700, fontSize: '0.95rem' }}>💬 Session Chat</div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.from === 'Me' ? 'flex-end' : 'flex-start', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#52525b' }}>{msg.from} · {msg.time}</span>
                <div style={{ maxWidth: '85%', padding: '0.6rem 0.9rem', borderRadius: msg.from === 'Me' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem', background: msg.from === 'Me' ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'rgba(39,39,42,0.8)', color: '#fafafa', fontSize: '0.875rem', lineHeight: 1.5 }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '0.5rem' }}>
            <input className="input-base" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message..." style={{ flex: 1 }} />
            <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1rem', flexShrink: 0 }}>↑</button>
          </form>
        </div>
      </main>
    </div>
  );
}
