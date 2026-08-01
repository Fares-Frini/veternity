export const CHARACTER_COLORS = {
  horse: "#F1621F",
  cat: "#73B14C",
  cow: "#F3C917",
  dog: "#299CF1",
} as const;

function PawGlyph(props: { transform?: string; opacity?: number }) {
  return (
    <g {...props}>
      <path d="M442.8,361.82C434,336.72,413.49,324,393.69,311.7c-17.23-10.71-33.5-20.83-44.14-39C320.22,222.37,304.11,192,256.06,192s-64.21,30.38-93.61,80.69c-10.65,18.21-27,28.35-44.25,39.08-19.8,12.31-40.27,25-49.1,50.05A78.06,78.06,0,0,0,64,390.11C64,430.85,96.45,464,132.4,464s83.31-18.13,123.76-18.13S343.31,464,379.71,464,448,430.85,448,390.11A78.3,78.3,0,0,0,442.8,361.82Z" />
      <ellipse cx="72" cy="216" rx="56" ry="72" />
      <ellipse cx="184" cy="120" rx="56" ry="72" />
      <ellipse cx="328" cy="120" rx="56" ry="72" />
      <ellipse cx="440" cy="216" rx="56" ry="72" />
    </g>
  );
}

export function PawPattern({ className }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true">
      <defs>
        <pattern
          id="login-paw-pattern"
          width="150"
          height="150"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-14)"
        >
          <g fill="currentColor">
            <PawGlyph transform="translate(8 10) scale(0.072)" />
            <PawGlyph transform="translate(84 82) scale(0.052)" opacity={0.75} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#login-paw-pattern)" />
    </svg>
  );
}

export function GroundBack({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 260" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path
        d="M0 104C220 44 430 132 700 92C970 52 1190 128 1440 70L1440 260L0 260Z"
        fill="#e6f1dc"
      />
    </svg>
  );
}

export function GroundFront({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 240" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path
        d="M0 78C250 20 520 104 790 62C1060 20 1250 96 1440 50L1440 240L0 240Z"
        fill="#d3e8c0"
      />
      <path
        d="M0 78C250 20 520 104 790 62C1060 20 1250 96 1440 50"
        fill="none"
        stroke="#c2dfab"
        strokeWidth="10"
      />
      <g fill="#b9d79f">
        {[
          [120, 66],
          [318, 88],
          [505, 100],
          [700, 70],
          [905, 52],
          [1120, 76],
          [1330, 60],
        ].map(([x, y]) => (
          <path key={x} d={`M${x} ${y}c-3 -14 -9 -20 -16 -25c9 1 15 5 19 12c3 -9 9 -15 18 -19c-6 8 -9 18 -9 32Z`} />
        ))}
      </g>
    </svg>
  );
}

export function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 21s-7.5-4.6-10-9.1C.5 8.6 2.2 5 5.7 5c2 0 3.4 1 4.3 2.3C11 5.9 12.4 5 14.3 5c3.5 0 5.2 3.6 3.7 6.9C19.5 16.4 12 21 12 21Z" />
    </svg>
  );
}

export function BoneDoodle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 32" className={className} aria-hidden="true">
      <path
        d="M14 6a7 7 0 0 1 11 5h14a7 7 0 1 1 6 5 7 7 0 1 1-6 5H25a7 7 0 1 1-11 5 7 7 0 1 1 0-20Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PawMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" fill="currentColor" className={className} aria-hidden="true">
      <PawGlyph />
    </svg>
  );
}

export function PawTrail({ className }: { className?: string }) {
  const marks = [
    { x: 40, y: 96, r: -28, s: 0.9, o: 0.16 },
    { x: 150, y: 62, r: -18, s: 0.95, o: 0.22 },
    { x: 268, y: 40, r: -8, s: 1, o: 0.28 },
    { x: 392, y: 32, r: 4, s: 1, o: 0.32 },
    { x: 516, y: 44, r: 14, s: 0.95, o: 0.26 },
    { x: 634, y: 70, r: 24, s: 0.9, o: 0.2 },
    { x: 742, y: 108, r: 32, s: 0.85, o: 0.14 },
  ];

  return (
    <svg viewBox="0 0 800 170" className={className} fill="currentColor" aria-hidden="true">
      {marks.map(({ x, y, r, s, o }) => (
        <g key={x} transform={`translate(${x} ${y}) rotate(${r}) scale(${(s * 46) / 512})`} opacity={o}>
          <PawGlyph transform="translate(-256 -256)" />
        </g>
      ))}
    </svg>
  );
}
