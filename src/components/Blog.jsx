import { useState } from 'react';
import FrogSvg from './FrogSvg';
import { useAccent } from '../context';
import OF from '../data';

function LevelBadge({ level }) {
  const colors = { Beginner: '#5a8a4a', Intermediate: '#c8956a', Advanced: '#b87aff' };
  const c = colors[level] || '#7ecac3';
  return (
    <span style={{
      background: c + '22', color: c, border: `1px solid ${c}44`,
      fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', fontWeight: 600,
      padding: '0.2rem 0.55rem', borderRadius: '20px',
    }}>{level}</span>
  );
}

function BlogPost({ post, onOpen }) {
  const { accent, hFont } = useAccent();
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => onOpen(post)}
      style={{
        background: hovered ? '#1f1f38' : '#161628',
        border: `1px solid ${hovered ? '#4a3f6b' : '#2e2e52'}`,
        borderRadius: '12px', padding: '1.5rem',
        cursor: 'pointer', transition: 'all 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'none',
      }}>
      <div style={{
        background: 'repeating-linear-gradient(45deg, #1f1f38 0px, #1f1f38 8px, #252545 8px, #252545 16px)',
        borderRadius: '8px', height: 140, marginBottom: '1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#3a3a5a', fontFamily: 'monospace', fontSize: '0.7rem',
        flexDirection: 'column', gap: '0.5rem',
      }}>
        <FrogSvg size={48} color="#2e2e52" />
        <span>tutorial thumbnail</span>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
        <LevelBadge level={post.level} />
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#6b6b8a' }}>{post.mins} min read</span>
      </div>
      <h3 style={{ fontFamily: hFont, color: '#e8d5b7', fontSize: '1rem', lineHeight: 1.35, marginBottom: '0.5rem' }}>{post.title}</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', color: '#6b6b8a', lineHeight: 1.6, marginBottom: '1rem' }}>{post.excerpt}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#4a4a6a' }}>by {post.author} · {post.date}</span>
        <span style={{ color: accent, fontSize: '0.8rem' }}>Read →</span>
      </div>
    </div>
  );
}

function PostModal({ post, onClose }) {
  const { accent, hFont } = useAccent();
  if (!post) return null;
  const lines = [
    `Welcome to this ${post.level.toLowerCase()}-level tutorial on "${post.title}".`,
    '', 'What you\'ll need:',
    '• Size D or G crochet hook', '• Yarn in your preferred bog-adjacent color',
    '• Safety eyes (6mm or 9mm)', '• Polyfill stuffing', '• Tapestry needle + scissors',
    '', 'This tutorial covers the full process from magic ring to finishing. If your frog comes out looking slightly evil, that\'s normal — it\'s a feature, not a bug.',
    '', 'Step 1: The Magic Ring',
    'Make an adjustable loop with your yarn, leaving a 6-inch tail. Insert hook, pull up a loop, chain 1. This is your starting ring. Do not question it.',
    '', 'Step 2: Round 1',
    'Work 6 single crochets into the ring. Pull the tail to close. You now have a tiny disc. The frog begins.',
    '', 'Step 3: Increasing',
    'Round 2: 2 sc in each st around. (12 sts). Round 3: *sc, 2sc in next st* repeat. (18 sts). Continue until desired circumference is achieved.',
    '', 'Continue following the pattern for body shaping, eye placement, and talisman activation ritual (optional but encouraged).',
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
      <div style={{
        position: 'relative', background: '#161628', border: '1px solid #2e2e52',
        borderRadius: '16px', width: 'min(720px, 92vw)', maxHeight: '80vh',
        overflowY: 'auto', padding: '2.5rem', zIndex: 1,
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#6b6b8a', cursor: 'pointer', fontSize: '1.4rem' }}>✕</button>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
          <LevelBadge level={post.level} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#6b6b8a' }}>{post.mins} min read · by {post.author} · {post.date}</span>
        </div>
        <h2 style={{ fontFamily: hFont, fontSize: '1.6rem', color: '#e8d5b7', marginBottom: '1.5rem', lineHeight: 1.3 }}>{post.title}</h2>
        <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#b8a98c', lineHeight: 1.9, fontSize: '0.9rem' }}>
          {lines.map((line, i) => line === '' ? <br key={i} /> :
            line.startsWith('•') ? <div key={i} style={{ paddingLeft: '1rem', color: '#8a8aaa' }}>{line}</div> :
            line.match(/^Step|^What/) ? <h4 key={i} style={{ color: accent, fontFamily: hFont, marginTop: '1.25rem', marginBottom: '0.4rem' }}>{line}</h4> :
            <p key={i} style={{ marginBottom: '0.5rem' }}>{line}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Blog() {
  const { accent, hFont } = useAccent();
  const [filter, setFilter] = useState('All');
  const [openPost, setOpenPost] = useState(null);
  const posts = OF.blogPosts;
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const filtered = posts.filter(p => filter === 'All' || p.level === filter);

  return (
    <section style={{ minHeight: '100vh', padding: '7rem 2rem 4rem', maxWidth: 1100, margin: '0 auto' }}>
      <PostModal post={openPost} onClose={() => setOpenPost(null)} />
      <div style={{ marginBottom: '3rem' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', letterSpacing: '0.2em', color: accent, textTransform: 'uppercase', marginBottom: '0.5rem' }}>The Craft</p>
        <h1 style={{ fontFamily: hFont, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#e8d5b7' }}>Tutorials & Lore</h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#8a8aaa', marginTop: '0.5rem', maxWidth: 500 }}>Learn to make your own talismans. Written by the community, for the community, about frogs.</p>
      </div>

      <div onClick={() => setOpenPost(posts[0])} style={{
        background: '#1f1f38', border: '1px solid #4a3f6b', borderRadius: '14px', padding: '2rem',
        marginBottom: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem',
        cursor: 'pointer', transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = accent}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#4a3f6b'}
      >
        <div style={{
          background: 'repeating-linear-gradient(45deg, #252545 0px, #252545 10px, #2a2a50 10px, #2a2a50 20px)',
          borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '0.75rem', minHeight: 180,
          color: '#3a3a6a', fontFamily: 'monospace', fontSize: '0.7rem',
        }}>
          <FrogSvg size={64} color="#3a3a6a" />
          <span>featured tutorial thumbnail</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}44`, fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.55rem', borderRadius: '20px' }}>Featured</span>
            <LevelBadge level={posts[0].level} />
          </div>
          <h2 style={{ fontFamily: hFont, color: '#e8d5b7', fontSize: '1.4rem', lineHeight: 1.3, marginBottom: '0.75rem' }}>{posts[0].title}</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#8a8aaa', lineHeight: 1.7, fontSize: '0.85rem', marginBottom: '1rem' }}>{posts[0].excerpt}</p>
          <span style={{ color: accent, fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem' }}>Read tutorial →</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {levels.map(l => (
          <button key={l} onClick={() => setFilter(l)} style={{
            background: filter === l ? `${accent}26` : 'transparent',
            border: `1px solid ${filter === l ? accent : '#2e2e52'}`,
            color: filter === l ? accent : '#8a8aaa',
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 500,
            padding: '0.35rem 0.9rem', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s',
          }}>{l}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {filtered.map(p => <BlogPost key={p.id} post={p} onOpen={setOpenPost} />)}
      </div>
    </section>
  );
}
