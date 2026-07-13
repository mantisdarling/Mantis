'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  locale: string;
}

const NAV_LINKS = [
  { href: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { href: 'appointments', label: 'Sessions', icon: '📅' },
  { href: 'messages', label: 'Messages', icon: '💬' },
];

export function Navbar({ locale }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const isActive = (href: string) => pathname.includes(href);

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 64,
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease',
          background: scrolled ? 'rgba(9,9,11,0.85)' : 'rgba(9,9,11,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        }}
      >
        {/* Logo */}
        <Link href={`/${locale}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span
            style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7, #f472b6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '1.4rem',
              fontWeight: 900,
              letterSpacing: '-0.04em',
            }}
          >
            MANTIS
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={`/${locale}/${href}`}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '0.65rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.2s',
                color: isActive(href) ? '#fafafa' : '#71717a',
                background: isActive(href) ? 'rgba(99,102,241,0.15)' : 'transparent',
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Notification bell */}
          <button
            id="navbar-notifications"
            style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(39,39,42,0.6)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#a1a1aa', fontSize: '1rem', position: 'relative' }}
            onClick={() => {}}
          >
            🔔
            <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#6366f1', border: '2px solid #09090b' }} />
          </button>

          {/* Profile avatar */}
          <Link href={`/${locale}/profile`} style={{ textDecoration: 'none' }}>
            <div
              id="navbar-profile"
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', color: '#fff', cursor: 'pointer', flexShrink: 0 }}
            >
              M
            </div>
          </Link>

          {/* Hamburger (mobile) */}
          <button
            id="navbar-menu"
            style={{ display: 'none', width: 38, height: 38, borderRadius: '0.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: '#a1a1aa', fontSize: '1.1rem', alignItems: 'center', justifyContent: 'center' }}
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99, background: 'rgba(9,9,11,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {NAV_LINKS.map(({ href, label, icon }) => (
            <Link key={href} href={`/${locale}/${href}`} onClick={() => setMenuOpen(false)} style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', fontSize: '0.95rem', fontWeight: 500, textDecoration: 'none', color: isActive(href) ? '#818cf8' : '#a1a1aa', background: isActive(href) ? 'rgba(99,102,241,0.1)' : 'transparent', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span>{icon}</span> {label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
