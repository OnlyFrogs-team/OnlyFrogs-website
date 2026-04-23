import { useState, useEffect } from 'react';
import { TweaksCtx } from './context';
import { Nav, Hero } from './components/NavHero';
import FrogSvg from './components/FrogSvg';
import Shop from './components/Shop';
import Subscriptions from './components/Subscriptions';
import Blog from './components/Blog';
import Supplies from './components/Supplies';
import Forum from './components/Forum';
import FrogChat from './components/FrogChat';

const TWEAK_DEFAULTS = {
  accentColor: '#5a8a4a',
  bgColor: '#0d0d1a',
  fontStyle: 'classic',
};

function Footer({ setPage }) {
  return (
    <footer style={{
      borderTop: '1px solid #1f1f38',
      padding: '3rem 2rem',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <FrogSvg size={40} color="#2e2e52" />
        </div>
        <p style={{ fontFamily: "'Playfair Display', serif", color: '#2e2e52', fontSize: '1rem', marginBottom: '1rem' }}>
          OnlyFrogs™ — Est. sometime during a full moon
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {['shop', 'subscriptions', 'blog', 'supplies', 'forum'].map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem',
              color: '#3a3a5a', textTransform: 'capitalize',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = '#7ecac3'}
            onMouseLeave={e => e.target.style.color = '#3a3a5a'}
            >{p}</button>
          ))}
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#2e2e52' }}>
          No frogs were harmed. All talismans are crocheted with love and mild obsession. Mystical claims not verified by the FDA, USDA, or the Bog Council.
        </p>
      </div>
    </footer>
  );
}

function TweaksPanel({ tweaks, setTweaks, visible }) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 500,
      background: '#161628', border: '1px solid #4a3f6b',
      borderRadius: '14px', padding: '1.25rem',
      width: 240, boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#e8d5b7', fontSize: '1rem', marginBottom: '1rem' }}>Tweaks</h3>

      <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#8a8aaa', display: 'block', marginBottom: '0.4rem' }}>Accent Color</label>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {['#7ecac3', '#c8956a', '#b87aff', '#5a8a4a'].map(c => (
          <button key={c} onClick={() => setTweaks(t => ({ ...t, accentColor: c }))} style={{
            width: 28, height: 28, borderRadius: '50%', background: c,
            border: tweaks.accentColor === c ? '2px solid #e8d5b7' : '2px solid transparent',
            cursor: 'pointer',
          }} />
        ))}
      </div>

      <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#8a8aaa', display: 'block', marginBottom: '0.4rem' }}>Background</label>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {[['#0d0d1a', 'Dark bog'], ['#0d1a0d', 'Forest deep'], ['#1a0d1a', 'Witch purple']].map(([bg, label]) => (
          <button key={bg} title={label} onClick={() => setTweaks(t => ({ ...t, bgColor: bg }))} style={{
            width: 28, height: 28, borderRadius: '6px', background: bg,
            border: tweaks.bgColor === bg ? '2px solid #e8d5b7' : '2px solid #2e2e52',
            cursor: 'pointer',
          }} />
        ))}
      </div>

      <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#8a8aaa', display: 'block', marginBottom: '0.4rem' }}>Font Mood</label>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {[['classic', 'Serif'], ['modern', 'Sans']].map(([val, lbl]) => (
          <button key={val} onClick={() => setTweaks(t => ({ ...t, fontStyle: val }))} style={{
            flex: 1, background: tweaks.fontStyle === val ? '#2e2e52' : 'transparent',
            border: '1px solid #2e2e52', color: tweaks.fontStyle === val ? '#e8d5b7' : '#6b6b8a',
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem',
            padding: '0.35rem 0', borderRadius: '6px', cursor: 'pointer',
          }}>{lbl}</button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState(() => localStorage.getItem('of_page') || 'home');
  const [cart, setCart] = useState([]);
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [tweaksVisible, setTweaksVisible] = useState(false);

  useEffect(() => {
    localStorage.setItem('of_page', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  useEffect(() => { document.body.style.background = tweaks.bgColor; }, [tweaks.bgColor]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <TweaksCtx.Provider value={tweaks}>
      <Nav page={page} setPage={setPage} cartCount={cartCount} />
      <main>
        {page === 'home' && <Hero setPage={setPage} />}
        {page === 'shop' && <Shop cart={cart} setCart={setCart} />}
        {page === 'subscriptions' && <Subscriptions setPage={setPage} />}
        {page === 'blog' && <Blog />}
        {page === 'supplies' && <Supplies cart={cart} setCart={setCart} />}
        {page === 'forum' && <Forum />}
        {page === 'consult' && <FrogChat />}
      </main>
      <Footer setPage={setPage} />
      <button
        onClick={() => setTweaksVisible(v => !v)}
        style={{
          position: 'fixed', bottom: '1.5rem', left: '1.5rem', zIndex: 499,
          background: '#161628', border: '1px solid #2e2e52', borderRadius: '50%',
          width: 44, height: 44, cursor: 'pointer', fontSize: '1.2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)', transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#4a3f6b'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#2e2e52'}
        title="Tweaks"
      >🎨</button>
      <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} visible={tweaksVisible} />
    </TweaksCtx.Provider>
  );
}
