import { motion } from 'framer-motion';

const AmbientCircle = ({ size = 200 }: { size?: number }) => {
  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Outer glow rings */}
      <div className="absolute inset-0 rounded-full" style={{ animation: 'pulse-ring 4s ease-out infinite' }}>
        <div className="w-full h-full rounded-full border border-jade/20" />
      </div>
      <div className="absolute inset-0 rounded-full" style={{ animation: 'pulse-ring 4s ease-out 1.5s infinite' }}>
        <div className="w-full h-full rounded-full border border-petal/15" />
      </div>

      {/* Morphing blob background */}
      <div
        className="absolute inset-2"
        style={{
          animation: 'morph 10s ease-in-out infinite',
          background: `
            radial-gradient(ellipse at 30% 30%, hsl(260 30% 85% / 0.4), transparent 60%),
            radial-gradient(ellipse at 70% 60%, hsl(190 45% 65% / 0.25), transparent 55%),
            radial-gradient(ellipse at 50% 50%, hsl(108 18% 69% / 0.3), transparent 70%)
          `,
          filter: 'blur(8px)',
        }}
      />

      {/* Main SVG orb */}
      <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
        <defs>
          <radialGradient id="ambient-glow" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="hsl(260, 30%, 88%)" stopOpacity="0.7">
              <animate attributeName="stop-color" values="hsl(260,30%,88%);hsl(190,45%,80%);hsl(108,18%,75%);hsl(330,25%,80%);hsl(260,30%,88%)" dur="12s" repeatCount="indefinite" />
            </stop>
            <stop offset="45%" stopColor="hsl(220, 40%, 82%)" stopOpacity="0.4">
              <animate attributeName="stop-color" values="hsl(220,40%,82%);hsl(330,25%,78%);hsl(43,47%,70%);hsl(108,18%,72%);hsl(220,40%,82%)" dur="12s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="hsl(34, 33%, 93%)" stopOpacity="0.05" />
          </radialGradient>
          <filter id="orb-glow">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="inner-light">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* Main orb */}
        <circle cx="100" cy="100" r="88" fill="url(#ambient-glow)" filter="url(#orb-glow)" opacity="0.9">
          <animate attributeName="r" values="85;90;85" dur="6s" repeatCount="indefinite" />
        </circle>

        {/* Inner light caustics */}
        <ellipse cx="80" cy="75" rx="25" ry="18" fill="hsl(0 0% 100% / 0.15)" filter="url(#inner-light)">
          <animate attributeName="cx" values="80;90;80" dur="8s" repeatCount="indefinite" />
          <animate attributeName="cy" values="75;80;75" dur="10s" repeatCount="indefinite" />
        </ellipse>

        {/* Orbiting ring 1 */}
        <circle cx="100" cy="100" r="75" fill="none" stroke="hsl(260,30%,85%)" strokeWidth="0.6" strokeOpacity="0.25" strokeDasharray="8 12">
          <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="30s" repeatCount="indefinite" />
        </circle>

        {/* Orbiting ring 2 */}
        <circle cx="100" cy="100" r="60" fill="none" stroke="hsl(190,45%,70%)" strokeWidth="0.4" strokeOpacity="0.2" strokeDasharray="4 16">
          <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="25s" repeatCount="indefinite" />
        </circle>

        {/* Floating sparkle dots */}
        {[
          { cx: 65, cy: 55, r: 1.5, dur: '7s', delay: '0s' },
          { cx: 130, cy: 80, r: 1, dur: '9s', delay: '2s' },
          { cx: 90, cy: 135, r: 1.2, dur: '8s', delay: '4s' },
          { cx: 120, cy: 50, r: 0.8, dur: '11s', delay: '1s' },
        ].map((dot, i) => (
          <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill="hsl(0 0% 100% / 0.5)">
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur={dot.dur} begin={dot.delay} repeatCount="indefinite" />
            <animate attributeName="r" values={`${dot.r};${dot.r * 1.5};${dot.r}`} dur={dot.dur} begin={dot.delay} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    </motion.div>
  );
};

export default AmbientCircle;
