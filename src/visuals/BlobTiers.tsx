import type { FC } from 'react'
import { useSvgId } from './ids'
import { Hatch } from './parts'
import { label, quiet } from './styles'

const TIERS = [
  { name: 'Hot', min: 'sering', store: 78, access: 12 },
  { name: 'Cool', min: '30 hari', store: 56, access: 28 },
  { name: 'Cold', min: '90 hari', store: 38, access: 46 },
  { name: 'Archive', min: '180 hari', store: 16, access: 78, offline: true },
]

/** Storage cost falls and access cost rises from Hot to Archive. Bar heights are relative, not real prices. */
export const BlobTiers: FC = () => {
  const tierAccess = useSvgId('tier-access')
  const base = 124
  const gw = 75
  return (
    <svg
      viewBox="0 0 300 186"
      role="img"
      aria-label="Diagram access tier blob: dari Hot, Cool, Cold, sampai Archive, biaya simpan makin murah dan biaya akses makin mahal; masa simpan minimal Cool 30 hari, Cold 90 hari, Archive 180 hari, dan Archive offline."
      className="w-full font-display"
    >
      <defs>
        <Hatch id={tierAccess} color="var(--color-matahari-dalam)" background="var(--color-matahari-muda)" />
      </defs>
      <rect x={0} y={2} width={14} height={14} rx={3} fill="var(--color-biru)" stroke="var(--color-biru-dalam)" strokeWidth={1.5} />
      <text x={20} y={14} fontSize={12} {...label}>
        biaya simpan
      </text>
      <rect x={120} y={2} width={14} height={14} rx={3} fill={`url(#${tierAccess})`} stroke="var(--color-matahari-dalam)" strokeWidth={1.5} />
      <text x={140} y={14} fontSize={12} {...label}>
        biaya akses
      </text>
      <line x1={0} y1={base} x2={300} y2={base} stroke="var(--color-kabut-dalam)" strokeWidth={2} />
      {TIERS.map((t, i) => {
        const x = i * gw + 14
        return (
          <g key={t.name}>
            <rect x={x} y={base - t.store} width={20} height={t.store} rx={3} fill="var(--color-biru)" stroke="var(--color-biru-dalam)" strokeWidth={1.5} />
            <rect x={x + 24} y={base - t.access} width={20} height={t.access} rx={3} fill={`url(#${tierAccess})`} stroke="var(--color-matahari-dalam)" strokeWidth={1.5} />
            <text x={x + 22} y={base + 18} fontSize={13} textAnchor="middle" {...label}>
              {t.name}
            </text>
            <text x={x + 22} y={base + 34} fontSize={12} textAnchor="middle" {...quiet}>
              {t.min}
            </text>
            {t.offline && (
              <text x={x + 22} y={base + 50} fontSize={12} textAnchor="middle" {...label}>
                offline
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
