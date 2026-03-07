import { motion } from 'framer-motion';

interface TotemSvgProps {
  className?: string;
}

export const OasisSvg = ({ className }: TotemSvgProps) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Eye of wisdom — concentric organic arcs with a pupil */}
    <ellipse cx="32" cy="32" rx="26" ry="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.3" />
    <ellipse cx="32" cy="32" rx="19" ry="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <ellipse cx="32" cy="32" rx="11" ry="8" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
    <circle cx="32" cy="32" r="4.5" fill="currentColor" opacity="0.85" />
    <circle cx="33.5" cy="30.5" r="1.5" fill="hsl(var(--ceramic-white))" opacity="0.9" />
    {/* Subtle sun rays */}
    <line x1="32" y1="8" x2="32" y2="13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.2" />
    <line x1="48" y1="16" x2="44" y2="20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.15" />
    <line x1="16" y1="16" x2="20" y2="20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.15" />
  </svg>
);

export const GlossaSvg = ({ className }: TotemSvgProps) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Open book morphed into a neural web */}
    {/* Book spine */}
    <path d="M32 14 C32 14, 32 52, 32 52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    {/* Left page arc */}
    <path d="M32 14 C24 12, 12 14, 10 20 C8 26, 10 40, 14 46 C18 50, 28 52, 32 52" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.6" />
    {/* Right page arc */}
    <path d="M32 14 C40 12, 52 14, 54 20 C56 26, 54 40, 50 46 C46 50, 36 52, 32 52" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.6" />
    {/* Knowledge nodes — scattered dots connected */}
    <circle cx="20" cy="24" r="2" fill="currentColor" opacity="0.7" />
    <circle cx="15" cy="36" r="1.8" fill="currentColor" opacity="0.5" />
    <circle cx="24" cy="42" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="44" cy="24" r="2" fill="currentColor" opacity="0.7" />
    <circle cx="49" cy="36" r="1.8" fill="currentColor" opacity="0.5" />
    <circle cx="40" cy="42" r="1.5" fill="currentColor" opacity="0.6" />
    {/* Connecting threads */}
    <line x1="20" y1="24" x2="15" y2="36" stroke="currentColor" strokeWidth="0.7" opacity="0.25" />
    <line x1="15" y1="36" x2="24" y2="42" stroke="currentColor" strokeWidth="0.7" opacity="0.25" />
    <line x1="44" y1="24" x2="49" y2="36" stroke="currentColor" strokeWidth="0.7" opacity="0.25" />
    <line x1="49" y1="36" x2="40" y2="42" stroke="currentColor" strokeWidth="0.7" opacity="0.25" />
    <line x1="20" y1="24" x2="32" y2="20" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
    <line x1="44" y1="24" x2="32" y2="20" stroke="currentColor" strokeWidth="0.7" opacity="0.2" />
    <circle cx="32" cy="20" r="2.5" fill="currentColor" opacity="0.85" />
  </svg>
);

export const DeloresSvg = ({ className }: TotemSvgProps) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Organic heart form — soft, rounded, living */}
    <path
      d="M32 50 C32 50, 14 38, 12 26 C10 18, 16 12, 22 12 C26 12, 30 16, 32 20 C34 16, 38 12, 42 12 C48 12, 54 18, 52 26 C50 38, 32 50, 32 50Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.12"
    />
    {/* Inner pulse rings */}
    <circle cx="32" cy="30" r="7" stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none" />
    <circle cx="32" cy="30" r="3.5" stroke="currentColor" strokeWidth="1" opacity="0.5" fill="none" />
    <circle cx="32" cy="30" r="1.5" fill="currentColor" opacity="0.7" />
    {/* Subtle emanation lines */}
    <path d="M25 18 C27 20, 28 22, 28 24" stroke="currentColor" strokeWidth="0.8" opacity="0.2" strokeLinecap="round" />
    <path d="M39 18 C37 20, 36 22, 36 24" stroke="currentColor" strokeWidth="0.8" opacity="0.2" strokeLinecap="round" />
  </svg>
);

export const ForgeSvg = ({ className }: TotemSvgProps) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Anvil base — organic trapezoid */}
    <path
      d="M18 48 C18 48, 14 42, 16 40 L48 40 C50 42, 46 48, 46 48 Z"
      fill="currentColor"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M20 40 L20 36 C20 34, 22 32, 26 32 L38 32 C42 32, 44 34, 44 36 L44 40"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
      opacity="0.6"
    />
    {/* Hammer — tilted, dynamic */}
    <rect x="29" y="10" width="6" height="16" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.3" transform="rotate(-15 32 18)" />
    <rect x="26" y="8" width="12" height="7" rx="2" fill="currentColor" fillOpacity="0.35" stroke="currentColor" strokeWidth="1.3" transform="rotate(-15 32 11)" />
    {/* Sparks */}
    <circle cx="22" cy="28" r="1.2" fill="currentColor" opacity="0.6" />
    <circle cx="18" cy="24" r="0.8" fill="currentColor" opacity="0.4" />
    <circle cx="46" cy="26" r="1" fill="currentColor" opacity="0.5" />
    <circle cx="50" cy="22" r="0.7" fill="currentColor" opacity="0.3" />
    {/* Spark lines */}
    <line x1="24" y1="30" x2="20" y2="26" stroke="currentColor" strokeWidth="0.7" opacity="0.3" strokeLinecap="round" />
    <line x1="44" y1="28" x2="48" y2="24" stroke="currentColor" strokeWidth="0.7" opacity="0.3" strokeLinecap="round" />
  </svg>
);
