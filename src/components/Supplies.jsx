import { useState } from 'react';
import FrogSvg from './FrogSvg';
import { useAccent } from '../context';
import OF from '../data';

function SupplyCard({ item, onAdd, inCart }) {
  const { accent, hFont } = useAccent();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const catColors = { Yarn: '#5a8a4a', 'Eyes & Notions': '#b87aff', Tools: '#c8956a', Patterns: '#7ecac3', Stuffing: '#8a6b4a', Kits: '#4a6b8a' };
  const cc = catColors[item.category] || accent;

  const handle = () => { onAdd(item); setAdded(true); setTimeout(() => setAdded(false), 1400); };

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      background: hovered ? '#1f1f38' : '#161628',
      border: `1px solid ${hovered ? '#4a3f6b' : '#2e2e52'}`,
      borderRadius: '10px', padding: '1.25rem',
      transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '0.6rem',
      transform: hovered ? 'translateY(-2px)' : 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ background: cc + '22', color: cc, border: `1px solid ${cc}44`, fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.55rem', borderRadius: '20px' }}>{item.category}</span>
        {item.stock < 10 && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', color: '#c8956a' }}>{item.stock} left</span>}
      </div>
      <div style={{
        background: 'repeating-linear-gradient(135deg, #1a1a2e 0px, #1a1a2e 6px, #1f1f38 6px, #1f1f38 12px)',
        borderRadius: '6px', height: 80,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#3a3a5a', fontFamily: 'monospace', fontSize: '0.65rem',
      }}>supply photo</div>
      <h4 style={{ fontFamily: hFont, color: '#e8d5b7', fontSize: '0.92rem' }}>{item.name}</h4>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#6b6b8a', lineHeight: 1.5 }}>{item.desc}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <span style={{ fontFamily: hFont, color: accent, fontSize: '1.15rem', fontWeight: 700 }}>${item.price}</span>
        <button onClick={handle} style={{
          background: added ? '#5a8a4a' : `${accent}1a`,
          border: `1px solid ${added ? '#5a8a4a' : `${accent}40`}`,
          color: added ? '#e8d5b7' : accent,
          fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 600,
          padding: '0.35rem 0.85rem', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s',
        }}>{added ? '✓ Added' : inCart ? '+ More' : 'Add'}</button>
      </div>
    </div>
  );
}

export default function Supplies({ cart, setCart }) {
  const { accent, hFont } = useAccent();
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const items = OF.supplies;
  const cats = ['All', 'Yarn', 'Tools', 'Eyes & Notions', 'Patterns', 'Stuffing', 'Kits'];
  const filtered = items.filter(i => (cat === 'All' || i.category === cat) && (search === '' || i.name.toLowerCase().includes(search.toLowerCase())));

  const addToCart = (item) => setCart(prev => {
    const ex = prev.find(i => i.id === 's' + item.id);
    if (ex) return prev.map(i => i.id === 's' + item.id ? { ...i, qty: i.qty + 1 } : i);
    return [...prev, { ...item, id: 's' + item.id, qty: 1, color: '#4a6b4a' }];
  });

  return (
    <section style={{ minHeight: '100vh', padding: '7rem 2rem 4rem', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', letterSpacing: '0.2em', color: accent, textTransform: 'uppercase', marginBottom: '0.5rem' }}>The Bog Apothecary</p>
        <h1 style={{ fontFamily: hFont, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#e8d5b7' }}>Crochet Supplies</h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#8a8aaa', marginTop: '0.5rem', maxWidth: 500 }}>Everything you need to make your own frogs. Subscribers get up to 20% off, automatically applied.</p>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #1f1f38 0%, #252545 100%)',
        border: '1px solid #4a6b8a55', borderRadius: '14px', padding: '1.75rem 2rem',
        marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem',
      }}>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: accent, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Best Value</div>
          <h3 style={{ fontFamily: hFont, color: '#e8d5b7', fontSize: '1.3rem', marginBottom: '0.5rem' }}>The OnlyFrogs Starter Kit</h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#8a8aaa', fontSize: '0.85rem' }}>Everything to make your first talisman — yarn, hook, eyes, pattern, and one free worry.</p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: hFont, color: accent, fontSize: '2rem', fontWeight: 700 }}>$34.99</div>
          <button onClick={() => addToCart(items.find(i => i.name.includes('Starter')))} style={{
            background: accent, color: '#0d0d1a',
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.85rem',
            padding: '0.55rem 1.25rem', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '0.5rem',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >Add Kit →</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search supplies…"
          style={{
            flex: '0 0 220px', background: '#1f1f38', border: '1px solid #2e2e52',
            color: '#e8d5b7', fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem',
            padding: '0.5rem 0.85rem', borderRadius: '6px', outline: 'none',
          }} />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              background: cat === c ? `${accent}26` : 'transparent',
              border: `1px solid ${cat === c ? accent : '#2e2e52'}`,
              color: cat === c ? accent : '#8a8aaa',
              fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 500,
              padding: '0.3rem 0.8rem', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s',
            }}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {filtered.map(item => (
          <SupplyCard key={item.id} item={item} onAdd={addToCart} inCart={cart.some(c => c.id === 's' + item.id)} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#4a4a6a', fontFamily: "'DM Sans', sans-serif" }}>
          <FrogSvg size={60} color="#2e2e52" />
          <p style={{ marginTop: '1rem' }}>No supplies found. The bog is searching.</p>
        </div>
      )}
    </section>
  );
}
