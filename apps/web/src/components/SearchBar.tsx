'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface SearchResult {
  id: string;
  name: string;
  profile?: { headline?: string; skills?: string[]; rating?: number };
}

interface SearchBarProps {
  locale: string;
}

export function SearchBar({ locale }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/experts/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setOpen(true);
      }
    } catch {
      // Silently fail — search is non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(query), 300);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, search]);

  // Close on click outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', maxWidth: 560 }}>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#52525b', fontSize: '1rem' }}>🔍</span>
        <input
          id="expert-search"
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search experts by skill, name, or topic..."
          className="input-base"
          style={{ paddingLeft: '2.75rem', paddingRight: loading ? '3rem' : '1rem' }}
        />
        {loading && (
          <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, border: '2px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div
          style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: 'rgba(18,18,22,0.98)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', overflow: 'hidden', zIndex: 200, boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
        >
          {results.map((r, i) => (
            <Link
              key={r.id}
              href={`/${locale}/book?expert=${r.id}`}
              onClick={() => { setOpen(false); setQuery(''); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1.25rem', textDecoration: 'none', borderBottom: i < results.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', color: '#fff', flexShrink: 0 }}>{r.name.charAt(0)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, color: '#fafafa', fontSize: '0.9rem', marginBottom: '0.1rem' }}>{r.name}</p>
                <p style={{ color: '#71717a', fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.profile?.headline}</p>
              </div>
              {r.profile?.skills && (
                <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
                  {r.profile.skills.slice(0, 2).map(s => <span key={s} className="skill-chip" style={{ fontSize: '0.68rem' }}>{s}</span>)}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {open && results.length === 0 && query.trim() && !loading && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: 'rgba(18,18,22,0.98)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center', color: '#71717a', fontSize: '0.875rem', zIndex: 200 }}>
          No experts found for &ldquo;{query}&rdquo;
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
