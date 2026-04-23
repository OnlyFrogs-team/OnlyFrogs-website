import { useState } from 'react';
import FrogSvg from './FrogSvg';
import { useAccent } from '../context';
import OF from '../data';

function StarRating({ rating }) {
  return <span style={{ color: '#c8956a', fontSize: '0.8rem' }}>{'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}</span>;
}

function TagBadge({ tag }) {
  const colors = { Rare: '#b87aff', 'Void-touched': '#7ecac3', Powerful: '#c8956a', Luck: '#5a8a4a', Wealth: '#c8956a', Wisdom: '#4a8a8a', Protection: '#6b3f8a', Mystery: '#6b3f8a', Prophecy: '#4a6b8a', Weather: '#4a6b8a', Everyday: '#6b6b4a', Love: '#8a3f6b', Harmony: '#6b8a4a', Sleep: '#4a4a8a', Peace: '#4a6b8a' };
  const bg = colors[tag] || '#3f3f6b';
  return (
    <span style={{
      background: bg + '33', color: bg,
      border: `1px solid ${bg}55`,
      fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', fontWeight: 600,
      padding: '0.2rem 0.55rem', borderRadius: '20px', letterSpacing: '0.03em',
    }}>{tag}</span>
  );
}

function TalismanCard({ talisman, onAdd, inCart }) {
  const { accent, hFont } = useAccent();
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => { onAdd(talisman); setAdded(true); setTimeout(() => setAdded(false), 1400); };

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      background: hovered ? '#1f1f38' : '#161628',
      border: `1px solid ${hovered ? '#4a3f6b' : '#2e2e52'}`,
      borderRadius: '12px', padding: '1.5rem', transition: 'all 0.25s',
      transform: hovered ? 'translateY(-4px)' : 'none',
      boxShadow: hovered ? '0 12px 40px rgba(74,63,107,0.3)' : 'none',
      display: 'flex', flexDirection: 'column', gap: '0.75rem',
    }}>
      <div style={{
        background: `radial-gradient(circle at 40% 40%, ${talisman.color}44, ${talisman.color}11)`,
        borderRadius: '10px', padding: '1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '0.5rem', position: 'relative',
      }}>
        <FrogSvg size={72} color={talisman.color} />
        {talisman.stock <= 2 && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: '#c8956a', color: '#0d0d1a', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', fontFamily: "'DM Sans', sans-serif" }}>ONLY {talisman.stock} LEFT</div>
        )}
      </div>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {talisman.tags.map(t => <TagBadge key={t} tag={t} />)}
      </div>
      <div>
        <h3 style={{ fontFamily: hFont, color: '#e8d5b7', fontSize: '1.05rem', marginBottom: '0.3rem' }}>{talisman.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <StarRating rating={talisman.rating} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#6b6b8a' }}>{talisman.rating} ({talisman.reviews})</span>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: '#8a8aaa', lineHeight: 1.55 }}>{talisman.desc}</p>
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: hFont, fontSize: '1.4rem', color: accent, fontWeight: 700 }}>${talisman.price}</span>
        <button onClick={handleAdd} style={{
          background: added ? '#5a8a4a' : `${accent}1f`,
          border: `1px solid ${added ? '#5a8a4a' : `${accent}4d`}`,
          color: added ? '#e8d5b7' : accent,
          fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', fontWeight: 600,
          padding: '0.45rem 1rem', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s',
        }}>{added ? '✓ Added!' : inCart ? 'Add Another' : 'Add to Cart'}</button>
      </div>
    </div>
  );
}

function CartDrawer({ cart, setCart, onClose }) {
  const { accent, hFont } = useAccent();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const update = (id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));

  return (
    <div style={{
      position: 'fixed', right: 0, top: 0, bottom: 0, width: 380,
      background: '#161628', borderLeft: '1px solid #2e2e52',
      zIndex: 200, display: 'flex', flexDirection: 'column',
      boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
    }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #2e2e52', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontFamily: hFont, color: '#e8d5b7', fontSize: '1.2rem' }}>Your Bag of Frogs</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b6b8a', cursor: 'pointer', fontSize: '1.4rem' }}>✕</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#6b6b8a', fontFamily: "'DM Sans', sans-serif" }}>
            <FrogSvg size={60} color="#2e2e52" />
            <p style={{ marginTop: '1rem' }}>Your bag is empty.<br />The frogs are waiting.</p>
          </div>
        ) : cart.map(item => (
          <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #1f1f38' }}>
            <div style={{ background: `${item.color}22`, borderRadius: '8px', padding: '0.5rem' }}>
              <FrogSvg size={44} color={item.color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: hFont, color: '#e8d5b7', fontSize: '0.9rem' }}>{item.name}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", color: accent, fontSize: '0.85rem', marginTop: '0.2rem' }}>${item.price}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={() => update(item.id, -1)} style={{ background: '#1f1f38', border: '1px solid #2e2e52', color: '#e8d5b7', width: 26, height: 26, borderRadius: '4px', cursor: 'pointer' }}>−</button>
              <span style={{ color: '#e8d5b7', fontFamily: "'DM Sans', sans-serif", width: 16, textAlign: 'center' }}>{item.qty}</span>
              <button onClick={() => update(item.id, 1)} style={{ background: '#1f1f38', border: '1px solid #2e2e52', color: '#e8d5b7', width: 26, height: 26, borderRadius: '4px', cursor: 'pointer' }}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '1.5rem', borderTop: '1px solid #2e2e52' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", color: '#b8a98c' }}>Total</span>
          <span style={{ fontFamily: hFont, color: accent, fontSize: '1.3rem', fontWeight: 700 }}>${total.toFixed(2)}</span>
        </div>
        <button style={{
          width: '100%', background: accent, color: '#0d0d1a',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1rem',
          padding: '0.9rem', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >Proceed to Checkout →</button>
        <p style={{ textAlign: 'center', color: '#6b6b8a', fontSize: '0.75rem', fontFamily: "'DM Sans', sans-serif", marginTop: '0.75rem' }}>All frogs are ritually inspected before shipping.</p>
      </div>
    </div>
  );
}

export default function Shop({ cart, setCart }) {
  const { accent, hFont } = useAccent();
  const [filter, setFilter] = useState('All');
  const [cartOpen, setCartOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const talismans = OF.talismans;
  const allTags = ['All', 'Luck', 'Wisdom', 'Protection', 'Mystery', 'Prophecy', 'Rare', 'Love', 'Peace'];

  const filtered = talismans
    .filter(t => filter === 'All' || t.tags.includes(filter))
    .sort((a, b) => sortBy === 'price-asc' ? a.price - b.price : sortBy === 'price-desc' ? b.price - a.price : sortBy === 'rating' ? b.rating - a.rating : 0);

  const addToCart = (item) => setCart(prev => {
    const existing = prev.find(i => i.id === item.id);
    if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
    return [...prev, { ...item, qty: 1 }];
  });

  return (
    <section style={{ minHeight: '100vh', padding: '7rem 2rem 4rem', maxWidth: 1200, margin: '0 auto' }}>
      {cartOpen && <CartDrawer cart={cart} setCart={setCart} onClose={() => setCartOpen(false)} />}
      {cartOpen && <div onClick={() => setCartOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 199 }} />}

      <div style={{ marginBottom: '3rem' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', letterSpacing: '0.2em', color: accent, textTransform: 'uppercase', marginBottom: '0.5rem' }}>The Collection</p>
        <h1 style={{ fontFamily: hFont, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#e8d5b7' }}>Talisman Shop</h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#8a8aaa', marginTop: '0.5rem', maxWidth: 500 }}>Each frog is hand-crocheted and imbued with ambiguous magical intent. No refunds on prophecies.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {allTags.map(tag => (
            <button key={tag} onClick={() => setFilter(tag)} style={{
              background: filter === tag ? `${accent}26` : 'transparent',
              border: `1px solid ${filter === tag ? accent : '#2e2e52'}`,
              color: filter === tag ? accent : '#8a8aaa',
              fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 500,
              padding: '0.35rem 0.9rem', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s',
            }}>{tag}</button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
          background: '#1f1f38', border: '1px solid #2e2e52', color: '#b8a98c',
          fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem',
          padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer',
        }}>
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {filtered.map(t => <TalismanCard key={t.id} talisman={t} onAdd={addToCart} inCart={cart.some(c => c.id === t.id)} />)}
      </div>

      {cart.length > 0 && (
        <button onClick={() => setCartOpen(true)} style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          background: accent, color: '#0d0d1a',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1rem',
          padding: '0.85rem 1.5rem', border: 'none', borderRadius: '50px',
          cursor: 'pointer', boxShadow: `0 8px 30px ${accent}66`,
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          zIndex: 50, transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >🛒 {cart.reduce((s, i) => s + i.qty, 0)} frogs — View Bag</button>
      )}
    </section>
  );
}
