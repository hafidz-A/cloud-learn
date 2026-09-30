import type { FC } from 'react'
import { Mark } from './parts'
import { label, quiet } from './styles'

const SEGMENTS = [
  { name: 'Hot', x: 1, w: 60, fill: 'var(--color-koral-muda)', stroke: 'var(--color-koral)' },
  { name: 'Cool', x: 61, w: 70, fill: 'var(--color-biru-muda)', stroke: 'var(--color-biru)' },
  { name: 'Archive', x: 131, w: 124, fill: 'var(--color-kabut)', stroke: 'var(--color-kabut-dalam)' },
]
const TICKS = [
  { x: 1, day: '0' },
  { x: 61, day: '30' },
  { x: 131, day: '90' },
  { x: 255, day: '365' },
]
const RULES = [
  ['tierToCool', '> 30 hari'],
  ['tierToArchive', '> 90 hari'],
  ['delete', '> 365 hari'],
]

/**
 * A lifecycle management rule on a timeline of days since a blob was last
 * modified: Cool after 30 days, Archive after 90, deleted after 365.
 */
export const BlobLifecycleTimeline: FC = () => (
  <svg
    viewBox="0 0 300 244"
    role="img"
    aria-label="Timeline lifecycle management berdasarkan hari sejak blob terakhir diubah. Hari 0 sampai 30 blob di tier Hot. Setelah 30 hari, aturan tierToCool memindahkannya ke Cool. Setelah 90 hari, tierToArchive memindahkannya ke Archive. Setelah 365 hari, aturan delete menghapusnya. Policy dijalankan sekali sehari, dan perubahan aturan bisa butuh sampai 24 jam untuk berlaku. Lifecycle management tidak bisa me-rehydrate blob dari Archive."
    className="w-full font-display"
  >
    <text x={0} y={14} fontSize={12} {...quiet}>
      Hari sejak blob terakhir diubah
    </text>
    {SEGMENTS.map((s) => (
      <g key={s.name}>
        <rect x={s.x} y={24} width={s.w} height={36} fill={s.fill} stroke={s.stroke} strokeWidth={1.5} />
        <text x={s.x + s.w / 2} y={47} fontSize={12} textAnchor="middle" {...label}>
          {s.name}
        </text>
      </g>
    ))}
    <Mark cx={276} cy={42} ok={false} />
    {TICKS.map((t) => (
      <g key={t.day}>
        <path d={`M${t.x} 60 V68`} stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
        <text x={Math.max(t.x, 6)} y={82} fontSize={12} textAnchor="middle" {...quiet}>
          {t.day}
        </text>
      </g>
    ))}
    {RULES.map(([action, when], i) => (
      <g key={action}>
        <rect x={1} y={94 + i * 30} width={298} height={26} rx={6} fill="#fff" stroke="var(--color-biru)" strokeWidth={1.5} />
        <text x={10} y={111 + i * 30} fontSize={12} className="font-mono" {...label}>
          {action}
        </text>
        <text x={290} y={111 + i * 30} fontSize={12} textAnchor="end" {...quiet}>
          {when}
        </text>
      </g>
    ))}
    <text x={0} y={206} fontSize={12} {...label}>
      Policy jalan sekali sehari; aturan baru
    </text>
    <text x={0} y={224} fontSize={12} {...label}>
      bisa butuh sampai 24 jam untuk berlaku.
    </text>
    <text x={0} y={242} fontSize={12} {...quiet}>
      Lifecycle tidak bisa me-rehydrate Archive.
    </text>
  </svg>
)
