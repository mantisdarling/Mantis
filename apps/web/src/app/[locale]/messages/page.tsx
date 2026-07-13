'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';

const CONVERSATIONS = [
  { id: '1', name: 'Sarah Chen', headline: 'Ex-Google Staff Engineer', lastMsg: 'Let\'s schedule our next session!', time: '2m ago', unread: 2 },
  { id: '2', name: 'Marcus Webb', headline: 'Fintech CTO', lastMsg: 'Great progress on your pitch deck.', time: '1h ago', unread: 0 },
  { id: '3', name: 'Priya Patel', headline: 'ML Research Lead at Meta', lastMsg: 'Here\'s the paper I mentioned...', time: '3h ago', unread: 1 },
];

const CHAT_MESSAGES = {
  '1': [
    { from: 'Sarah', text: 'Hey! Ready for our session tomorrow?', time: '10:00 AM' },
    { from: 'Me', text: 'Absolutely! I\'ve prepared questions on system design.', time: '10:05 AM' },
    { from: 'Sarah', text: 'Perfect. Let\'s also cover distributed systems.', time: '10:07 AM' },
    { from: 'Sarah', text: 'Let\'s schedule our next session!', time: '2m ago' },
  ],
};

export default function MessagesPage() {
  const { locale } = useParams() as { locale: string };
  const [activeConvo, setActiveConvo] = useState('1');
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState(CHAT_MESSAGES);

  const activeConvoData = CONVERSATIONS.find(c => c.id === activeConvo);
  const chatHistory = (msgs as any)[activeConvo] || [];

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setMsgs(prev => ({
      ...prev,
      [activeConvo]: [...((prev as any)[activeConvo] || []), { from: 'Me', text: input, time: 'Just now' }],
    }));
    setInput('');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#fafafa' }}>
      <Navbar locale={locale} />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '5rem 1.5rem 2rem', height: 'calc(100vh - 0px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.25rem', height: 'calc(100vh - 7rem)' }}>
          {/* Sidebar */}
          <div className="glass-panel" style={{ borderRadius: '1.25rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 700, fontSize: '1rem' }}>
              💬 Messages
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {CONVERSATIONS.map(c => (
                <div key={c.id} onClick={() => setActiveConvo(c.id)} style={{ padding: '1rem 1.25rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'all 0.15s', background: activeConvo === c.id ? 'rgba(99,102,241,0.1)' : 'transparent', display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', color: '#fff', flexShrink: 0, position: 'relative' }}>
                    {c.name.charAt(0)}
                    {c.unread > 0 && <span style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: '#6366f1', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff' }}>{c.unread}</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fafafa' }}>{c.name}</span>
                      <span style={{ fontSize: '0.72rem', color: '#52525b' }}>{c.time}</span>
                    </div>
                    <p style={{ color: '#71717a', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.lastMsg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className="glass-panel" style={{ borderRadius: '1.25rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{activeConvoData?.name.charAt(0)}</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{activeConvoData?.name}</p>
                <p style={{ color: '#71717a', fontSize: '0.78rem' }}>{activeConvoData?.headline}</p>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <a href={`/${locale}/session`} className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.8rem', textDecoration: 'none' }}>Start Session →</a>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {chatHistory.map((msg: any, i: number) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.from === 'Me' ? 'flex-end' : 'flex-start', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#52525b' }}>{msg.from} · {msg.time}</span>
                  <div style={{ maxWidth: '70%', padding: '0.7rem 1rem', borderRadius: msg.from === 'Me' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem', background: msg.from === 'Me' ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'rgba(39,39,42,0.8)', color: '#fafafa', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Socket.io badge */}
            <div style={{ padding: '0.5rem 1.5rem', background: 'rgba(99,102,241,0.06)', borderTop: '1px solid rgba(99,102,241,0.1)', borderBottom: '1px solid rgba(99,102,241,0.1)', fontSize: '0.75rem', color: '#6366f1', textAlign: 'center' }}>
              ⚡ Real-time messaging powered by Socket.io
            </div>

            {/* Input */}
            <form onSubmit={send} style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem' }}>
              <input className="input-base" value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." style={{ flex: 1 }} />
              <button type="submit" className="btn-primary" style={{ padding: '0.7rem 1.25rem', flexShrink: 0 }}>Send ↑</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
