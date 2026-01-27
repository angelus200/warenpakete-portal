import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-3 group">
      <div className="relative">
        {/* Gold Box Icon */}
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform group-hover:scale-105"
        >
          {/* Outer box - dark gold */}
          <path
            d="M20 2L35 10V30L20 38L5 30V10L20 2Z"
            fill="url(#goldGradient)"
            stroke="#B8860B"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Inner diamond - light gold */}
          <path
            d="M20 12L28 16V24L20 28L12 24V16L20 12Z"
            fill="url(#lightGoldGradient)"
            stroke="#FFD700"
            strokeWidth="1"
          />

          {/* W letter */}
          <path
            d="M15 18L17 24L19 20L21 24L23 18"
            stroke="#0A0A0A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="goldGradient" x1="5" y1="2" x2="35" y2="38">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
            <linearGradient id="lightGoldGradient" x1="12" y1="12" x2="28" y2="28">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#F4E5B8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold-dark bg-clip-text text-transparent">
          Warenpakete Portal
        </span>
        <span className="text-xs text-gold-dark/70 font-medium tracking-wider">
          PREMIUM B2B
        </span>
      </div>
    </Link>
  );
}
