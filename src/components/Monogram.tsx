interface MonogramProps {
  size?: number
  className?: string
  strokeWidth?: number
}

export default function Monogram({ size = 40, className = '', strokeWidth = 1 }: MonogramProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="oilo-mono-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A96E" />
          <stop offset="50%" stopColor="#e8d5a8" />
          <stop offset="100%" stopColor="#a8883f" />
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="32" cy="32" r="29" stroke="url(#oilo-mono-g)" strokeWidth={strokeWidth} />
      {/* Inner ring — thinner */}
      <circle cx="32" cy="32" r="24" stroke="url(#oilo-mono-g)" strokeWidth={strokeWidth * 0.4} opacity="0.4" />
      {/* Central O — the Oilo mark */}
      <ellipse cx="32" cy="32" rx="13" ry="16" stroke="url(#oilo-mono-g)" strokeWidth={strokeWidth * 1.4} />
      {/* Four ornamental notches — arabic/moroccan motif */}
      <path d="M32 3 L32 7" stroke="url(#oilo-mono-g)" strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
      <path d="M32 57 L32 61" stroke="url(#oilo-mono-g)" strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
      <path d="M3 32 L7 32" stroke="url(#oilo-mono-g)" strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
      <path d="M57 32 L61 32" stroke="url(#oilo-mono-g)" strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
      {/* Center dot */}
      <circle cx="32" cy="32" r="1.5" fill="#C9A96E" />
    </svg>
  )
}

export function OrnamentDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="block h-px w-16 md:w-24" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.5))' }} />
      <Monogram size={28} strokeWidth={0.8} />
      <span className="block h-px w-16 md:w-24" style={{ background: 'linear-gradient(270deg, transparent, rgba(201,169,110,0.5))' }} />
    </div>
  )
}
