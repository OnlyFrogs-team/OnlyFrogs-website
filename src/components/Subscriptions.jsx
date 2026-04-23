import { useState } from 'react';
import FrogSvg from './FrogSvg';
import { useAccent } from '../context';
import OF from '../data';

export default function Subscriptions({ setPage }) {
  const { accent, hFont } = useAccent();
  const [billing, setBilling] = useState('monthly');
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const tiers = OF.subscriptions;

  const discount = billing === 'annual' ? 0.17 : 0;
  const price = (p) => billing === 'annual' ? (p * (1 - discount) * 12).toFixed(0) : p.toFixed(2);
  const priceSuffix = billing === 'annual' ? '/yr' : '/mo';

  const handleSelect = (id) => { setSelected(id); setTimeout(() => setConfirmed(true), 300); };

  if (confirmed) {
    const tier = tiers.find(t => t.id === selected);
    return (
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '7rem 2rem 4rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ marginBottom: '1.5rem' }}><FrogSvg size={100} color={tier.color} /></div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.2em', fontSize: '0.8rem', color: tier.color, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Welcome to the bog</p>
          <h2 style={{ fontFamily: hFont, fontSize: '2.5rem', color: '#e8d5b7', marginBottom: '1rem' }}>You are now a {tier.name}.</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#8a8aaa', lineHeight: 1.7, marginBottom: '2rem' }}>Your first box will ship within 3–5 bog days. The frogs already know you're coming.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => { setConfirmed(false); setSelected(null); }} style={{ background: 'transparent', border: '1px solid #2e2e52', color: '#b8a98c', fontFamily: "'DM Sans', sans-serif", padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>← Back</button>
            <button onClick={() => setPage('shop')} style={{ background: accent, color: '#0d0d1a', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, padding: '0.7rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Browse Talismans →</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ minHeight: '100vh', padding: '7rem 2rem 5rem', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', letterSpacing: '0.2em', color: accent, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Monthly Mystery</p>
        <h1 style={{ fontFamily: hFont, fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#e8d5b7', marginBottom: '1rem' }}>Choose Your Tier</h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#8a8aaa', maxWidth: 480, margin: '0 auto 2rem' }}>Monthly boxes of hand-crocheted talismans, delivered straight from the bog to your door.</p>

        <div style={{ display: 'inline-flex', background: '#1f1f38', border: '1px solid #2e2e52', borderRadius: '8px', padding: '0.25rem' }}>
          {['monthly', 'annual'].map(b => (
            <button key={b} onClick={() => setBilling(b)} style={{
              background: billing === b ? '#2e2e52' : 'transparent',
              border: 'none', color: billing === b ? '#e8d5b7' : '#6b6b8a',
              fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 600,
              padding: '0.45rem 1.2rem', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {b === 'monthly' ? 'Monthly' : 'Annual'}
              {b === 'annual' && <span style={{ marginLeft: 6, background: '#5a8a4a', color: '#e8d5b7', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Save 17%</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {tiers.map((tier) => (
          <div key={tier.id} style={{
            background: tier.popular ? '#1f1f38' : '#161628',
            border: `1px solid ${tier.popular ? tier.color + '66' : '#2e2e52'}`,
            borderRadius: '16px', padding: '2rem', position: 'relative',
            transform: tier.popular ? 'scale(1.03)' : 'none',
            boxShadow: tier.popular ? `0 20px 60px ${tier.color}22` : 'none',
            transition: 'box-shadow 0.3s',
          }}>
            {tier.popular && (
              <div style={{
                position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                background: tier.color, color: '#0d0d1a',
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.75rem',
                padding: '0.3rem 1rem', borderRadius: '20px', whiteSpace: 'nowrap',
              }}>🐸 Most Popular</div>
            )}
            <div style={{ marginBottom: '1rem' }}><FrogSvg size={52} color={tier.color} /></div>
            <h2 style={{ fontFamily: hFont, color: '#e8d5b7', fontSize: '1.6rem', marginBottom: '0.3rem' }}>{tier.name}</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#6b6b8a', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{tier.tagline}</p>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontFamily: hFont, fontSize: '2.5rem', color: tier.color, fontWeight: 700 }}>${price(tier.price)}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", color: '#6b6b8a', fontSize: '0.9rem' }}>{priceSuffix}</span>
              {billing === 'annual' && <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#5a8a4a', fontSize: '0.75rem', marginTop: '0.25rem' }}>= ${(tier.price * (1 - discount)).toFixed(2)}/mo • 2 months free</div>}
            </div>
            <ul style={{ listStyle: 'none', margin: '0 0 2rem', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {tier.perks.map((perk, j) => (
                <li key={j} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <span style={{ color: tier.color, fontSize: '0.9rem', marginTop: '0.05rem', flexShrink: 0 }}>✓</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", color: '#b8a98c', fontSize: '0.85rem', lineHeight: 1.4 }}>{perk}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => handleSelect(tier.id)} style={{
              width: '100%',
              background: tier.popular ? tier.color : 'transparent',
              border: `1px solid ${tier.color}`,
              color: tier.popular ? '#0d0d1a' : tier.color,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.95rem',
              padding: '0.85rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = tier.color; e.currentTarget.style.color = '#0d0d1a'; }}
            onMouseLeave={e => { if (!tier.popular) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = tier.color; } }}
            >Start as {tier.name} →</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {[
          ['Can I cancel anytime?', 'Yes. The frogs will be sad, but they understand. No lock-in.'],
          ['What if I already own a frog?', 'Every frog is unique. Duplicates are statistically improbable. Spiritually, however, welcome.'],
          ['Are the talismans actually magic?', 'We cannot legally confirm this. We can legally say: many customers report unexpected good fortune.'],
        ].map(([q, a]) => (
          <div key={q} style={{ background: '#161628', border: '1px solid #2e2e52', borderRadius: '10px', padding: '1.25rem' }}>
            <h4 style={{ fontFamily: hFont, color: '#e8d5b7', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{q}</h4>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#6b6b8a', fontSize: '0.82rem', lineHeight: 1.6 }}>{a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
