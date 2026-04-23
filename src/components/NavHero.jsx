import { useState, useEffect } from 'react';
import FrogSvg from './FrogSvg';
import { useAccent } from '../context';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'shop', label: 'Talismans' },
  { id: 'subscriptions', label: 'Subscribe' },
  { id: 'blog', label: 'Tutorials' },
  { id: 'supplies', label: 'Supplies' },
  { id: 'forum', label: 'Community' },
  { id: 'consult', label: '🐸 Consult' },
];

export function Nav({ page, setPage, cartCount }) {
  const { accent, hFont } = useAccent();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(10,10,22,0.96)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid #2e2e52' : '1px solid transparent',
      transition: 'all 0.3s', padding: '0 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px',
    }}>
      <button onClick={() => setPage('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FrogSvg size={36} color={accent} />
        <span style={{ fontFamily: hFont, fontSize: '1.3rem', color: '#e8d5b7', fontWeight: 700, letterSpacing: '-0.01em' }}>OnlyFrogs</span>
      </button>

      <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)} style={{
            background: page === item.id ? `${accent}1f` : 'none',
            border: 'none', cursor: 'pointer',
            color: page === item.id ? accent : '#b8a98c',
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', fontWeight: 500,
            padding: '0.4rem 0.85rem', borderRadius: '6px', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { if (page !== item.id) e.target.style.color = '#e8d5b7'; }}
          onMouseLeave={e => { if (page !== item.id) e.target.style.color = '#b8a98c'; }}
          >{item.label}</button>
        ))}
        <button onClick={() => setPage('shop')} style={{
          background: `${accent}26`, border: `1px solid ${accent}4d`,
          color: accent, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', fontWeight: 600,
          padding: '0.4rem 1rem', borderRadius: '6px', marginLeft: '0.5rem',
          position: 'relative', transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = `${accent}40`}
        onMouseLeave={e => e.currentTarget.style.background = `${accent}26`}
        >
          🛒 {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -6,
              background: '#c8956a', color: '#0d0d1a', borderRadius: '50%',
              width: 18, height: 18, fontSize: '0.7rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{cartCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
}

export function Hero({ setPage }) {
  const { accent, hFont } = useAccent();
  const [hoveredFrog, setHoveredFrog] = useState(null);
  const colors = ['#5a8a4a', '#4a6b6b', '#6b3f6b', '#6b5a3f', '#3f4a6b', '#5a4a6b'];

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '6rem 2rem 4rem', position: 'relative', overflow: 'hidden', textAlign: 'center',
    }}>
      <div style={{ position: 'absolute', top: '15%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,63,107,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '8%', width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, ${accent}26 0%, transparent 70%)`, pointerEvents: 'none' }} />

      {[
        { x: '8%', y: '20%', s: 55, c: colors[0], delay: '0s' },
        { x: '88%', y: '15%', s: 48, c: colors[1], delay: '0.4s' },
        { x: '5%', y: '65%', s: 40, c: colors[2], delay: '0.8s' },
        { x: '90%', y: '60%', s: 52, c: colors[3], delay: '1.2s' },
        { x: '15%', y: '85%', s: 36, c: colors[4], delay: '1.6s' },
        { x: '82%', y: '80%', s: 44, c: colors[5], delay: '2s' },
      ].map((f, i) => (
        <div key={i} style={{
          position: 'absolute', left: f.x, top: f.y,
          animation: `float${i % 3} 6s ease-in-out infinite`, animationDelay: f.delay,
          cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s',
        }}
        onMouseEnter={() => setHoveredFrog(i)}
        onMouseLeave={() => setHoveredFrog(null)}
        >
          <FrogSvg size={f.s} color={f.c} />
          {hoveredFrog === i && (
            <div style={{
              position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(22,22,40,0.95)', border: '1px solid #2e2e52',
              color: accent, fontSize: '0.7rem', fontFamily: "'DM Sans', sans-serif",
              padding: '0.25rem 0.6rem', borderRadius: '4px', whiteSpace: 'nowrap', marginTop: 4,
            }}>Frog</div>
          )}
        </div>
      ))}

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 720 }}>
        <div style={{ marginBottom: '1.5rem' }}><FrogSvg size={110} color={accent} /></div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', letterSpacing: '0.2em', color: accent, textTransform: 'uppercase', marginBottom: '1rem' }}>
          Handcrafted • Mystical • Slightly Unhinged
        </p>
        <h1 style={{
          fontFamily: hFont, fontSize: 'clamp(2.8rem, 7vw, 5rem)',
          color: '#e8d5b7', lineHeight: 1.1, marginBottom: '1.5rem', fontWeight: 700,
        }}>
          Your frog talisman<br /><em style={{ color: accent }}>awaits in the bog.</em>
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem', color: '#b8a98c', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 560, margin: '0 auto 2.5rem' }}>
          Hand-crocheted frog talismans of dubious magical provenance. Subscribe monthly, browse our shop, learn the craft, and argue about yarn in the forum.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setPage('shop')} style={{
            background: accent, color: '#0d0d1a',
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1rem',
            padding: '0.85rem 2rem', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >Browse Talismans →</button>
          <button onClick={() => setPage('subscriptions')} style={{
            background: 'transparent', color: '#e8d5b7',
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '1rem',
            padding: '0.85rem 2rem', border: '1px solid #2e2e52', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2e2e52'; e.currentTarget.style.color = '#e8d5b7'; }}
          >View Subscriptions</button>
        </div>

        <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginTop: '4rem', flexWrap: 'wrap' }}>
          {[['4,200+', 'Talismans in the wild'], ['98%', 'Bog-certified authentic'], ['3', 'Subscription tiers'], ['∞', 'Frog lore available']].map(([n, l]) => (
            <div key={n} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: hFont, fontSize: '2rem', color: accent, fontWeight: 700 }}>{n}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', color: '#6b6b8a', marginTop: '0.25rem' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float0 { 0%,100%{transform:translateY(0px) rotate(-3deg)} 50%{transform:translateY(-18px) rotate(3deg)} }
        @keyframes float1 { 0%,100%{transform:translateY(0px) rotate(2deg)} 50%{transform:translateY(-12px) rotate(-4deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0px) rotate(-1deg)} 50%{transform:translateY(-22px) rotate(2deg)} }
      `}</style>
    </section>
  );
}
