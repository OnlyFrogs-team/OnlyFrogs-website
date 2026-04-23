import { createContext, useContext } from 'react';

export const TweaksCtx = createContext({ accentColor: '#5a8a4a', fontStyle: 'classic', bgColor: '#0d0d1a' });

export function useAccent() {
  const { accentColor: accent = '#5a8a4a', fontStyle = 'classic' } = useContext(TweaksCtx);
  const hFont = fontStyle === 'classic' ? "'Playfair Display', serif" : "'DM Sans', sans-serif";
  return { accent, hFont };
}
