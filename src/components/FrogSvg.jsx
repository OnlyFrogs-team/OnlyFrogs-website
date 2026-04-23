export default function FrogSvg({ size = 80, color = '#5a8a4a' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="62" rx="30" ry="26" fill={color} />
      <ellipse cx="50" cy="42" rx="26" ry="22" fill={color} />
      <circle cx="34" cy="28" r="10" fill={color} />
      <circle cx="66" cy="28" r="10" fill={color} />
      <circle cx="34" cy="27" r="7" fill="#e8d5b7" />
      <circle cx="66" cy="27" r="7" fill="#e8d5b7" />
      <circle cx="35" cy="27" r="4" fill="#1a1a2e" />
      <circle cx="67" cy="27" r="4" fill="#1a1a2e" />
      <circle cx="36" cy="25" r="1.5" fill="white" />
      <circle cx="68" cy="25" r="1.5" fill="white" />
      <circle cx="45" cy="40" r="2" fill="rgba(0,0,0,0.3)" />
      <circle cx="55" cy="40" r="2" fill="rgba(0,0,0,0.3)" />
      <path d="M 38 50 Q 50 58 62 50" stroke="rgba(0,0,0,0.3)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="24" cy="72" rx="9" ry="6" fill={color} transform="rotate(-20 24 72)" />
      <ellipse cx="76" cy="72" rx="9" ry="6" fill={color} transform="rotate(20 76 72)" />
      <ellipse cx="50" cy="60" rx="16" ry="14" fill="rgba(255,255,255,0.08)" />
      <circle cx="78" cy="20" r="3" fill="#7ecac3" opacity="0.8" />
      <circle cx="20" cy="35" r="2" fill="#c8956a" opacity="0.6" />
      <circle cx="85" cy="50" r="2" fill="#b87aff" opacity="0.6" />
    </svg>
  );
}
