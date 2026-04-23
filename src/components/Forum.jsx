import { useState } from 'react';
import { useAccent } from '../context';
import OF from '../data';

const TAG_COLORS = {
  Help: '#c8956a', Haul: '#5a8a4a', Testimonial: '#b87aff',
  Supplies: '#7ecac3', Challenge: '#4a6b8a', 'Off-Topic': '#6b4a4a', Shipping: '#4a4a6b',
};

function ForumTag({ tag }) {
  const c = TAG_COLORS[tag] || '#7ecac3';
  return (
    <span style={{
      background: c + '22', color: c, border: `1px solid ${c}44`,
      fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', fontWeight: 600,
      padding: '0.15rem 0.5rem', borderRadius: '20px',
    }}>{tag}</span>
  );
}

function ForumRow({ post, onClick }) {
  const { accent } = useAccent();
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = (e) => {
    e.stopPropagation();
    if (!liked) { setLikeCount(c => c + 1); setLiked(true); }
    else { setLikeCount(c => c - 1); setLiked(false); }
  };

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => onClick(post)}
      style={{
        background: hovered ? '#1a1a30' : 'transparent',
        border: 'none', borderBottom: '1px solid #1f1f38',
        padding: '1rem 1.25rem', cursor: 'pointer', transition: 'background 0.15s',
        display: 'grid', gridTemplateColumns: '44px 1fr auto', gap: '1rem', alignItems: 'center',
      }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: 'radial-gradient(circle, #2e2e52, #1a1a2e)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.3rem', flexShrink: 0, border: '1px solid #2e2e52',
      }}>{post.avatar}</div>
      <div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem' }}>
          <ForumTag tag={post.tag} />
          {post.hot && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', color: '#c8956a' }}>🔥 Hot</span>}
        </div>
        <h4 style={{ fontFamily: "'DM Sans', sans-serif", color: '#e8d5b7', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.2rem' }}>{post.title}</h4>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#4a4a6a' }}>by {post.user} · {post.time}</span>
      </div>
      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: '#6b6b8a' }}>{post.replies}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', color: '#4a4a6a' }}>replies</div>
        </div>
        <button onClick={handleLike} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem',
          color: liked ? accent : '#6b6b8a', transition: 'color 0.2s', padding: 0,
        }}>
          <span style={{ fontSize: '1rem' }}>{liked ? '♥' : '♡'}</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem' }}>{likeCount}</span>
        </button>
      </div>
    </div>
  );
}

const MOCK_REPLIES = [
  { user: 'CrochetProphet', avatar: '🔮', time: '1h ago', text: 'Yes, completely normal. The left leg always comes out stronger. It means the talisman has a dominant side — some believe this amplifies its primary power.' },
  { user: 'YarnHoarder', avatar: '🧶', time: '2h ago', text: 'Mine was lopsided on the first three attempts. I now stuff the weaker side slightly more and it evens out. Pro tip: do it BEFORE you sew the eyes.' },
  { user: 'BogWitch99', avatar: '🧙‍♀️', time: '3h ago', text: 'I embrace the lopsidedness. My first Grand Toad is extremely lumpy and she has protected my household for 8 months. Never underestimate a lumpy frog.' },
];

function ThreadModal({ post, onClose }) {
  const { accent, hFont } = useAccent();
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState(MOCK_REPLIES);
  const [submitted, setSubmitted] = useState(false);

  if (!post) return null;

  const submit = () => {
    if (!reply.trim()) return;
    setReplies(prev => [...prev, { user: 'You', avatar: '🐸', time: 'just now', text: reply }]);
    setReply(''); setSubmitted(true); setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
      <div style={{
        position: 'relative', background: '#161628', border: '1px solid #2e2e52',
        borderRadius: '16px', width: 'min(700px, 92vw)', maxHeight: '82vh',
        display: 'flex', flexDirection: 'column', zIndex: 1,
      }}>
        <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid #2e2e52', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <ForumTag tag={post.tag} />
              {post.hot && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', color: '#c8956a' }}>🔥 Hot</span>}
            </div>
            <h3 style={{ fontFamily: hFont, color: '#e8d5b7', fontSize: '1.15rem' }}>{post.title}</h3>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#4a4a6a' }}>by {post.user} · {post.time} · {post.replies} replies</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b6b8a', cursor: 'pointer', fontSize: '1.3rem', alignSelf: 'flex-start' }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.75rem' }}>
          {replies.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: i < replies.length - 1 ? '1px solid #1f1f38' : 'none' }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#1f1f38', border: '1px solid #2e2e52', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{r.avatar}</div>
              <div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", color: accent, fontSize: '0.82rem', fontWeight: 600 }}>{r.user}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", color: '#4a4a6a', fontSize: '0.72rem' }}>{r.time}</span>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#b8a98c', fontSize: '0.85rem', lineHeight: 1.65 }}>{r.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '1.25rem 1.75rem', borderTop: '1px solid #2e2e52' }}>
          <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Share your frog wisdom…" rows={3} style={{
            width: '100%', background: '#1f1f38', border: '1px solid #2e2e52',
            color: '#e8d5b7', fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem',
            padding: '0.75rem 1rem', borderRadius: '8px', resize: 'none',
            outline: 'none', boxSizing: 'border-box', lineHeight: 1.6,
          }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
            <button onClick={submit} style={{
              background: reply.trim() ? accent : '#2e2e52',
              color: reply.trim() ? '#0d0d1a' : '#6b6b8a',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.85rem',
              padding: '0.55rem 1.25rem', border: 'none', borderRadius: '6px',
              cursor: reply.trim() ? 'pointer' : 'default', transition: 'all 0.2s',
            }}>{submitted ? '✓ Posted!' : 'Post Reply'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Forum() {
  const { accent, hFont } = useAccent();
  const [filter, setFilter] = useState('All');
  const [openPost, setOpenPost] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [posts, setPosts] = useState(OF.forumPosts);
  const [showNew, setShowNew] = useState(false);
  const [newTag, setNewTag] = useState('Help');

  const tags = ['All', 'Help', 'Haul', 'Testimonial', 'Supplies', 'Challenge', 'Off-Topic', 'Shipping'];
  const filtered = posts.filter(p => filter === 'All' || p.tag === filter);

  const submit = () => {
    if (!newTitle.trim()) return;
    setPosts(prev => [{ id: Date.now(), user: 'You', avatar: '🐸', title: newTitle, replies: 0, likes: 0, tag: newTag, time: 'just now', hot: false }, ...prev]);
    setNewTitle(''); setShowNew(false);
  };

  return (
    <section style={{ minHeight: '100vh', padding: '7rem 2rem 4rem', maxWidth: 900, margin: '0 auto' }}>
      <ThreadModal post={openPost} onClose={() => setOpenPost(null)} />

      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', letterSpacing: '0.2em', color: accent, textTransform: 'uppercase', marginBottom: '0.5rem' }}>The Bog</p>
          <h1 style={{ fontFamily: hFont, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#e8d5b7' }}>Community Forum</h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#8a8aaa', marginTop: '0.5rem' }}>Argue about yarn. Share your frogs. Ask for help. We're all here.</p>
        </div>
        <button onClick={() => setShowNew(s => !s)} style={{
          background: `${accent}1f`, border: `1px solid ${accent}4d`,
          color: accent, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '0.85rem',
          padding: '0.65rem 1.25rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = `${accent}33`}
        onMouseLeave={e => e.currentTarget.style.background = `${accent}1f`}
        >+ New Thread</button>
      </div>

      {showNew && (
        <div style={{ background: '#1f1f38', border: '1px solid #4a3f6b', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
          <h4 style={{ fontFamily: hFont, color: '#e8d5b7', marginBottom: '1rem' }}>Start a Thread</h4>
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="What's on your mind? (frog-related, ideally)"
            style={{ width: '100%', background: '#161628', border: '1px solid #2e2e52', color: '#e8d5b7', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem', padding: '0.75rem 1rem', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', marginBottom: '1rem' }} />
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {tags.filter(t => t !== 'All').map(t => (
              <button key={t} onClick={() => setNewTag(t)} style={{
                background: newTag === t ? (TAG_COLORS[t] || accent) + '33' : 'transparent',
                border: `1px solid ${newTag === t ? (TAG_COLORS[t] || accent) : '#2e2e52'}`,
                color: newTag === t ? (TAG_COLORS[t] || accent) : '#6b6b8a',
                fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem',
                padding: '0.25rem 0.7rem', borderRadius: '20px', cursor: 'pointer',
              }}>{t}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setShowNew(false)} style={{ background: 'transparent', border: '1px solid #2e2e52', color: '#6b6b8a', fontFamily: "'DM Sans', sans-serif", padding: '0.55rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
            <button onClick={submit} style={{ background: accent, color: '#0d0d1a', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, padding: '0.55rem 1.25rem', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Post Thread</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[['1,240', 'Members'], ['8,900+', 'Posts'], ['47', 'Active Today']].map(([n, l]) => (
          <div key={l} style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
            <span style={{ fontFamily: hFont, color: accent, fontSize: '1.2rem' }}>{n}</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", color: '#4a4a6a', fontSize: '0.8rem' }}>{l}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {tags.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            background: filter === t ? `${accent}26` : 'transparent',
            border: `1px solid ${filter === t ? accent : '#2e2e52'}`,
            color: filter === t ? accent : '#8a8aaa',
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 500,
            padding: '0.3rem 0.8rem', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s',
          }}>{t}</button>
        ))}
      </div>

      <div style={{ background: '#161628', border: '1px solid #2e2e52', borderRadius: '12px', overflow: 'hidden' }}>
        {filtered.map(p => <ForumRow key={p.id} post={p} onClick={setOpenPost} />)}
      </div>
    </section>
  );
}
