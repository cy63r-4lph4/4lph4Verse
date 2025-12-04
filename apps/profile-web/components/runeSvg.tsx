export function RuneSVG({ size = 420 }: { size?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none select-none"
      style={{
        width: size,
        height: size,
        display: "flex",
      }}
    >
      <svg
        viewBox="0 0 200 200"
        className="mx-auto"
        style={{
          width: "100%",
          height: "100%",
          filter: "drop-shadow(0 6px 30px rgba(80,150,255,0.12))",
          transform: "translateZ(0)",
          animation: "spin-slow 40s linear infinite",
        }}
      >
        <defs>
          <radialGradient id="g1" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#8EE7FF" stopOpacity="0.18" />
            <stop offset="65%" stopColor="#6BB1FF" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#0a0f2a" stopOpacity="0.0" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="100" cy="100" r="80" fill="url(#g1)" />
        <g filter="url(#glow)">
          <path
            d="M100 36 L120 80 L100 124 L80 80 Z"
            fill="none"
            stroke="#5fd1ff"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />
          <circle
            cx="100"
            cy="100"
            r="44"
            stroke="#3fb0ff"
            strokeWidth="0.9"
            fill="none"
            opacity="0.75"
          />
          <g opacity="0.96" transform="translate(0,0) rotate(0 100 100)">
            <path
              d="M60 100 a40 40 0 0 0 80 0"
              fill="none"
              stroke="#66c9ff"
              strokeWidth="0.7"
              opacity="0.7"
            />
            <path
              d="M50 100 a50 70 0 0 1 100 0"
              fill="none"
              stroke="#2fb0ff"
              strokeWidth="0.4"
              opacity="0.5"
            />
          </g>
        </g>
      </svg>

      <style>{`
              @keyframes spin-slow {
                from {
                  transform: rotate(0deg);
                }
                to {
                  transform: rotate(360deg);
                }
              }
            `}</style>
    </div>
  );
}
