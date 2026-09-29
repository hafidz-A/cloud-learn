// Shared pieces for the diagrams in this folder (text styles are in styles.ts).

export function ServerStack({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[0, 11, 22].map((dy) => (
        <g key={dy}>
          <rect x={x} y={y + dy} width={36} height={8} rx={2.5} fill="var(--color-kabut)" stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
          <circle cx={x + 6} cy={y + dy + 4} r={1.6} fill="var(--color-mint-dalam)" />
        </g>
      ))}
    </g>
  )
}

export function Bolt({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x + 5} ${y} L${x} ${y + 9} H${x + 4} L${x + 2} ${y + 16} L${x + 9} ${y + 6} H${x + 5} L${x + 7} ${y} Z`}
      fill="var(--color-matahari)"
      stroke="var(--color-matahari-dalam)"
      strokeWidth={1}
      strokeLinejoin="round"
    />
  )
}

/** An arrowhead marker. `id` must be unique on the page, so each diagram passes its own. */
export function ArrowMarker({ id, color = 'var(--color-biru-dalam)' }: { id: string; color?: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 Z" fill={color} />
    </marker>
  )
}
