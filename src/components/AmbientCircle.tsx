import { motion } from 'framer-motion';

const AmbientCircle = ({ size = 180 }: { size?: number }) => {
  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <radialGradient id="ambient-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(108, 18%, 69%)" stopOpacity="0.4">
              <animate attributeName="stop-color" values="hsl(108,18%,69%);hsl(330,25%,75%);hsl(22,30%,74%);hsl(43,47%,54%);hsl(108,18%,69%)" dur="12s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="hsl(330, 25%, 75%)" stopOpacity="0.25">
              <animate attributeName="stop-color" values="hsl(330,25%,75%);hsl(43,47%,54%);hsl(108,18%,69%);hsl(22,30%,74%);hsl(330,25%,75%)" dur="12s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="hsl(34, 33%, 93%)" stopOpacity="0.1" />
          </radialGradient>
          <filter id="ambient-blur">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        <circle cx="100" cy="100" r="90" fill="url(#ambient-glow)" filter="url(#ambient-blur)">
          <animate attributeName="r" values="88;92;88" dur="6s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="100" r="80" fill="none" stroke="hsl(108,18%,69%)" strokeWidth="0.5" strokeOpacity="0.3">
          <animate attributeName="r" values="78;82;78" dur="8s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="100" r="60" fill="none" stroke="hsl(330,25%,75%)" strokeWidth="0.3" strokeOpacity="0.2">
          <animate attributeName="r" values="58;63;58" dur="10s" repeatCount="indefinite" />
        </circle>
      </svg>
    </motion.div>
  );
};

export default AmbientCircle;
