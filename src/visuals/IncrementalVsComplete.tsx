import type { FC } from 'react'
import { label, quiet } from './styles'

function Box({ x, y, name, gone = false, added = false }: { x: number; y: number; name: string; gone?: boolean; added?: boolean }) {
  return (
    <g opacity={gone ? 0.55 : 1}>
      <rect
        x={x}
        y={y}
        width={40}
        height={30}
        rx={6}
        fill={gone ? 'var(--color-koral-muda)' : added ? 'var(--color-mint-muda)' : '#fff'}
        stroke={gone ? 'var(--color-koral)' : added ? 'var(--color-mint-dalam)' : 'var(--color-biru)'}
        strokeWidth={2}
        strokeDasharray={gone ? '4 3' : undefined}
      />
      <text x={x + 20} y={y + 20} fontSize={12} textAnchor="middle" {...label}>
        {name}
      </text>
    </g>
  )
}

/**
 * The same template (A, B, D) deployed to a resource group that holds A, B,
 * and C: incremental mode keeps C, complete mode deletes it.
 */
export const IncrementalVsComplete: FC = () => (
  <svg
    viewBox="0 0 300 244"
    role="img"
    aria-label="Resource group berisi resource A, B, dan C. Template berisi A, B, dan D. Dengan mode incremental, hasilnya A, B, C, dan D: C yang tidak ada di template dibiarkan. Dengan mode complete, hasilnya A, B, dan D: C dihapus. Mode default adalah incremental. Jalankan what-if sebelum mode complete. Microsoft tidak lagi merekomendasikan mode complete; untuk menghapus lewat template, pakai deployment stacks."
    className="w-full font-display"
  >
    <text x={0} y={16} fontSize={12} {...label}>
      Resource group: A B C
    </text>
    <text x={170} y={16} fontSize={12} {...label}>
      Template: A B D
    </text>
    {[
      { y: 30, name: 'Incremental (default)', note: 'C dibiarkan', boxes: [['A'], ['B'], ['C'], ['D', 'added']] },
      { y: 112, name: 'Complete', note: 'C dihapus', boxes: [['A'], ['B'], ['C', 'gone'], ['D', 'added']] },
    ].map((m) => (
      <g key={m.name}>
        <rect x={1} y={m.y} width={298} height={74} rx={12} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
        <text x={12} y={m.y + 20} fontSize={12} {...label}>
          {m.name}
        </text>
        <text x={288} y={m.y + 20} fontSize={12} textAnchor="end" {...quiet}>
          {m.note}
        </text>
        {m.boxes.map(([n, state], i) => (
          <Box key={n} x={12 + i * 50} y={m.y + 32} name={n} gone={state === 'gone'} added={state === 'added'} />
        ))}
      </g>
    ))}
    <text x={0} y={208} fontSize={12} {...label}>
      Sebelum complete: jalankan what-if.
    </text>
    <text x={0} y={226} fontSize={12} {...quiet}>
      Complete tidak lagi direkomendasikan;
    </text>
    <text x={0} y={242} fontSize={12} {...quiet}>
      untuk menghapus, pakai deployment stacks.
    </text>
  </svg>
)
