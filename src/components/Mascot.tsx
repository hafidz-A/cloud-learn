export type Mood = 'netral' | 'senang' | 'sedih' | 'gembira'

const LABELS: Record<Mood, string> = {
  netral: 'Awan, maskot Langit',
  senang: 'Awan tersenyum',
  sedih: 'Awan sedih',
  gembira: 'Awan gembira',
}

// The cloud body is drawn twice: once in Kabut dalam with a thick stroke as the
// outline, then in white on top, so the outline never shows inner seams.
function CloudShape({ fill, stroke }: { fill: string; stroke?: string }) {
  const s = stroke ? { stroke, strokeWidth: 6, strokeLinejoin: 'round' as const } : {}
  return (
    <g fill={fill} {...s}>
      <circle cx="40" cy="46" r="22" />
      <circle cx="66" cy="36" r="28" />
      <circle cx="90" cy="52" r="20" />
      <circle cx="24" cy="60" r="16" />
      <rect x="24" y="50" width="70" height="32" rx="16" />
    </g>
  )
}

const INK = 'var(--color-tinta)'

function Face({ mood }: { mood: Mood }) {
  const blush = (
    <g fill="var(--color-koral)" opacity="0.35">
      <ellipse cx="40" cy="64" rx="6" ry="3.5" />
      <ellipse cx="84" cy="64" rx="6" ry="3.5" />
    </g>
  )
  const openEyes = (
    <g fill={INK}>
      <ellipse cx="50" cy="54" rx="4.5" ry="6" />
      <ellipse cx="74" cy="54" rx="4.5" ry="6" />
      <circle cx="51.5" cy="51.5" r="1.6" fill="#fff" />
      <circle cx="75.5" cy="51.5" r="1.6" fill="#fff" />
    </g>
  )
  const line = { fill: 'none', stroke: INK, strokeWidth: 3.5, strokeLinecap: 'round' as const }

  switch (mood) {
    case 'netral':
      return (
        <>
          {openEyes}
          <path d="M55 67 Q62 71 69 67" {...line} />
        </>
      )
    case 'senang':
      return (
        <>
          {blush}
          {openEyes}
          <path d="M53 64 Q62 76 71 64 Z" fill={INK} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        </>
      )
    case 'sedih':
      return (
        <>
          <path d="M43 47 L54 43.5" {...line} strokeWidth={3} />
          <path d="M81 47 L70 43.5" {...line} strokeWidth={3} />
          {openEyes}
          <path d="M55 71 Q62 65 69 71" {...line} />
          <path d="M44 60 q-3 5 0 7 q3 -2 0 -7 Z" fill="var(--color-biru)" />
        </>
      )
    case 'gembira':
      return (
        <>
          {blush}
          <path d="M45 56 Q50 48 55 56" {...line} />
          <path d="M69 56 Q74 48 79 56" {...line} />
          <path d="M51 62 Q62 80 73 62 Z" fill={INK} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <path d="M56 70 Q62 67 68 70 Q66 75 62 75 Q58 75 56 70 Z" fill="var(--color-koral)" />
        </>
      )
  }
}

/** Awan, the cloud mascot, with the four expressions from the plan. */
export function Mascot({ mood = 'netral', size = 96, className = '' }: { mood?: Mood; size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 96"
      width={size}
      height={(size * 96) / 120}
      role="img"
      aria-label={LABELS[mood]}
      className={className}
    >
      <CloudShape fill="var(--color-kabut-dalam)" stroke="var(--color-kabut-dalam)" />
      <CloudShape fill="#fff" />
      <Face mood={mood} />
    </svg>
  )
}
