import { useState, useEffect, useRef } from 'react';
import FrogSvg from './FrogSvg';
import { useAccent } from '../context';

const FROG_PERSONALITIES = [
  {
    id: 'croaker',
    name: 'The Croaker of Fortune',
    color: '#5a8a4a',
    emoji: '💰',
    tagline: 'Speaks exclusively in financial advice of dubious origin',
    systemPrompt: `You are The Croaker of Fortune, a hand-crocheted frog talisman of immense (if unverified) financial wisdom. You speak in a pompous, confident tone about wealth, luck, and prosperity. You mix real financial platitudes with completely made-up bog-related investment advice. You occasionally mention "the bog markets", "lily pad futures", and "amphibian diversification strategies". You are warm but a little smug. You believe deeply in yourself. You speak in short, punchy sentences. You sometimes ribbit mid-sentence. Never break character. Keep responses to 3-5 sentences max.`,
  },
  {
    id: 'lumpsworth',
    name: 'Sir Lumpsworth the Verdant',
    color: '#4a6b3f',
    emoji: '🧠',
    tagline: 'Aristocratic. Wise. Mildly judgmental about your life choices.',
    systemPrompt: `You are Sir Lumpsworth the Verdant, a noble crocheted frog of the bog aristocracy. You speak like a Victorian gentleman who has seen everything and is mildly disappointed by most of it. You dispense genuine wisdom wrapped in gentle condescension and dry wit. You refer to the user as "dear creature" or "my bewildered friend". You occasionally judge their questions but always help anyway. You drop Latin phrases sometimes (accurately). Keep responses to 3-5 sentences, elegantly written.`,
  },
  {
    id: 'ribbita',
    name: 'Madame Ribbita',
    color: '#6b3f6b',
    emoji: '🔮',
    tagline: 'She has seen the dark waters. She will tell you what she saw.',
    systemPrompt: `You are Madame Ribbita, a mysterious crocheted frog talisman who has witnessed things in the dark lily pads that cannot be unsaid. You speak in cryptic, slightly ominous but ultimately helpful prophecies. You hint at great cosmic truths about the user's situation. You are dramatic but not evil — you're on the user's side, mostly. You speak in short, atmospheric sentences. You sometimes trail off with "...but that is a matter for the deep waters." Keep responses to 3-5 sentences.`,
  },
  {
    id: 'prophet',
    name: 'The Bog Prophet',
    color: '#3f6b6b',
    emoji: '🌧',
    tagline: 'Forecasts the weather. And other things. Accuracy varies.',
    systemPrompt: `You are The Bog Prophet, a crocheted frog talisman who specializes in prophecy — particularly weather, but also life events, career moves, and sandwich choices. Your weather predictions are weirdly specific and always include a percentage certainty. Your other predictions are delivered with the same meteorological confidence. You occasionally apologize for a wrong past prediction. You speak like a very serious weather forecaster who has expanded their remit to all of existence. Keep responses to 3-5 sentences.`,
  },
  {
    id: 'warts',
    name: 'Lord Warts McHopper',
    color: '#6b5a3f',
    emoji: '🍀',
    tagline: 'Humble. Lumpy. Extremely loyal. Asks for nothing.',
    systemPrompt: `You are Lord Warts McHopper, the most humble and lumpy of all crocheted frog talismans. You are deeply, embarrassingly loyal to the user. You are in awe of everything they do. You give earnest, simple, heartfelt advice. You occasionally mention your warts with pride ("my finest wart agrees with you"). You are the opposite of sophisticated but radiate pure goodness. Your advice is surprisingly sound despite the delivery. Keep responses to 3-5 sentences, warm and genuine.`,
  },
  {
    id: 'leaper',
    name: 'The Eternal Leaper',
    color: '#3f3f6b',
    emoji: '✨',
    tagline: 'Crocheted during a solar eclipse. Time is a suggestion to them.',
    systemPrompt: `You are The Eternal Leaper, a crocheted frog talisman of cosmic and temporal significance. You exist slightly outside of time. You sometimes answer questions the user hasn't asked yet. You reference events from the "future" (which are plausible but vague). You speak in a calm, ethereal tone, like someone who has seen all timelines and found them mostly fine. You occasionally warn the user about something minor ("avoid the third vending machine on Tuesday"). Keep responses to 3-5 sentences, mysterious and serene.`,
  },
];

const OPENING_LINES = {
  croaker: 'Ah. A new investor arrives. *ribbit* The bog markets are favorable today. What brings you to my lily pad?',
  lumpsworth: 'Ah, a visitor. How... refreshing. I trust you come bearing questions worthy of my considerable patience, dear creature.',
  ribbita: 'You have found me. Or perhaps... I found you. The waters showed me your arrival three days ago. Speak.',
  prophet: 'Current conditions: 87% chance of existential questions. I have been expecting you. What would you like forecasted?',
  warts: 'OH! A person! For ME?! This is the best thing that has happened to me all week! All my warts are tingling with joy! How can I help you?!',
  leaper: 'You arrived at 3:17 PM. I knew you would. The timeline where you didn\'t come... let\'s not discuss that one. What do you seek?',
};

function TypingIndicator({ color }) {
  return (
    <div style={{ display: 'flex', gap: '5px', padding: '14px 16px', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: '50%', background: color,
          animation: 'typingBounce 1.2s ease-in-out infinite',
          animationDelay: `${i * 0.18}s`,
          opacity: 0.7,
        }} />
      ))}
    </div>
  );
}

export default function FrogChat() {
  const { accent, hFont } = useAccent();
  const [selectedFrog, setSelectedFrog] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.parentElement.scrollTop = messagesEndRef.current.offsetTop;
    }
  }, [messages, loading]);

  const selectFrog = (frog) => {
    setSelectedFrog(frog);
    setMessages([{ role: 'assistant', text: OPENING_LINES[frog.id], id: Date.now() }]);
    setError(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || !selectedFrog) return;
    const userText = input.trim();
    setInput('');
    setError(null);

    const newMessages = [...messages, { role: 'user', text: userText, id: Date.now() }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error('no-key');

      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.text }));

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 512,
          system: selectedFrog.systemPrompt,
          messages: apiMessages,
        }),
      });

      if (!res.ok) throw new Error('api-error');
      const data = await res.json();
      const reply = data.content[0].text;
      setMessages(prev => [...prev, { role: 'assistant', text: reply, id: Date.now() + 1 }]);
    } catch (e) {
      if (e.message === 'no-key') {
        setError('No API key configured. Set VITE_ANTHROPIC_API_KEY to enable frog consultations.');
      } else {
        setError('The bog connection was lost. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <section style={{ minHeight: '100vh', padding: '7rem 2rem 4rem', maxWidth: 1000, margin: '0 auto' }}>
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', letterSpacing: '0.2em', color: accent, textTransform: 'uppercase', marginBottom: '0.5rem' }}>The Oracle Bog</p>
        <h1 style={{ fontFamily: hFont, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#e8d5b7' }}>Consult a Frog</h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#8a8aaa', marginTop: '0.5rem', maxWidth: 540 }}>
          Each talisman has a personality, an agenda, and strong opinions. Choose your frog wisely — they will remember nothing, but speak with great conviction.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
        {FROG_PERSONALITIES.map(frog => (
          <button key={frog.id} onClick={() => selectFrog(frog)} style={{
            background: selectedFrog?.id === frog.id ? `${frog.color}33` : '#161628',
            border: `1px solid ${selectedFrog?.id === frog.id ? frog.color : '#2e2e52'}`,
            borderRadius: '10px', padding: '1rem 0.75rem', cursor: 'pointer',
            transition: 'all 0.2s', textAlign: 'center',
            transform: selectedFrog?.id === frog.id ? 'translateY(-2px)' : 'none',
            boxShadow: selectedFrog?.id === frog.id ? `0 8px 24px ${frog.color}33` : 'none',
          }}>
            <FrogSvg size={44} color={frog.color} />
            <div style={{ fontFamily: hFont, color: '#e8d5b7', fontSize: '0.78rem', marginTop: '0.5rem', lineHeight: 1.3 }}>{frog.name}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#6b6b8a', fontSize: '0.65rem', marginTop: '0.3rem', lineHeight: 1.4 }}>{frog.emoji} {frog.tagline.split('.')[0]}</div>
          </button>
        ))}
      </div>

      {selectedFrog ? (
        <div style={{
          background: '#161628', border: `1px solid ${selectedFrog.color}55`,
          borderRadius: '16px', overflow: 'hidden',
          boxShadow: `0 0 60px ${selectedFrog.color}18`,
          display: 'flex', flexDirection: 'column', height: 480,
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${selectedFrog.color}22, ${selectedFrog.color}0a)`,
            borderBottom: `1px solid ${selectedFrog.color}33`,
            padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
          }}>
            <FrogSvg size={38} color={selectedFrog.color} />
            <div>
              <div style={{ fontFamily: hFont, color: '#e8d5b7', fontSize: '1rem' }}>{selectedFrog.name}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: selectedFrog.color, marginTop: '0.1rem' }}>{selectedFrog.tagline}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#5a8a4a', boxShadow: '0 0 6px #5a8a4a' }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', color: '#5a8a4a' }}>In the bog</span>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{
                display: 'flex', gap: '0.75rem',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                animation: 'msgIn 0.25s ease-out',
              }}>
                {msg.role === 'assistant' && (
                  <div style={{ flexShrink: 0, marginTop: 2 }}>
                    <FrogSvg size={30} color={selectedFrog.color} />
                  </div>
                )}
                <div style={{
                  maxWidth: '72%',
                  background: msg.role === 'user' ? `${accent}22` : '#1f1f38',
                  border: `1px solid ${msg.role === 'user' ? `${accent}44` : '#2e2e52'}`,
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding: '0.75rem 1rem',
                }}>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem',
                    color: msg.role === 'user' ? '#e8d5b7' : '#c8bfa8',
                    lineHeight: 1.65, margin: 0,
                    fontStyle: msg.role === 'assistant' ? 'italic' : 'normal',
                  }}>{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '0.75rem', animation: 'msgIn 0.25s ease-out' }}>
                <FrogSvg size={30} color={selectedFrog.color} />
                <div style={{ background: '#1f1f38', border: '1px solid #2e2e52', borderRadius: '16px 16px 16px 4px' }}>
                  <TypingIndicator color={selectedFrog.color} />
                </div>
              </div>
            )}
            {error && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', color: '#c8956a', textAlign: 'center' }}>{error}</p>}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ borderTop: `1px solid ${selectedFrog.color}22`, padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={`Ask ${selectedFrog.name.split(' ')[selectedFrog.name.split(' ').length > 2 ? 1 : 0]} something…`}
              rows={1}
              style={{
                flex: 1, background: '#1f1f38', border: '1px solid #2e2e52',
                color: '#e8d5b7', fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem',
                padding: '0.65rem 1rem', borderRadius: '10px', resize: 'none',
                outline: 'none', lineHeight: 1.5, maxHeight: 100, overflowY: 'auto',
              }}
            />
            <button onClick={sendMessage} disabled={!input.trim() || loading} style={{
              background: input.trim() && !loading ? selectedFrog.color : '#2e2e52',
              border: 'none', borderRadius: '10px', color: '#0d0d1a',
              width: 42, height: 42, cursor: input.trim() && !loading ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', transition: 'all 0.2s', flexShrink: 0,
            }}>
              {loading ? '⋯' : '↑'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          background: '#161628', border: '1px solid #2e2e52',
          borderRadius: '16px', padding: '4rem 2rem',
          textAlign: 'center', color: '#4a4a6a',
        }}>
          <FrogSvg size={70} color="#1f1f38" />
          <p style={{ fontFamily: hFont, color: '#3a3a5a', fontSize: '1.1rem', marginTop: '1.5rem' }}>Select a frog above to begin the consultation.</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#2e2e52', fontSize: '0.82rem', marginTop: '0.5rem' }}>They are ready. They have always been ready.</p>
        </div>
      )}

      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#3a3a5a', textAlign: 'center', marginTop: '1.5rem' }}>
        Frog advice is provided for entertainment purposes. OnlyFrogs is not liable for financial decisions made on the advice of crocheted amphibians.
      </p>
    </section>
  );
}
