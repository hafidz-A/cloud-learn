import type { FC } from 'react'
import { label, quiet } from './styles'

const STEPS = [
  { x: 210, y: 8, name: 'Root', note: '2. rujukan' },
  { x: 210, y: 62, name: 'TLD .id', note: '3. rujukan' },
  { x: 210, y: 116, name: 'Authoritative', note: '4. alamat' },
]

/** A client asks its resolver once; the resolver walks root, TLD, and authoritative servers. */
export const DnsResolve: FC = () => (
  <svg
    viewBox="0 0 300 170"
    role="img"
    aria-label="Resolusi DNS. Satu: PC mengirim query rekursif ke resolver, misalnya www.contoh.id. Dua: resolver bertanya ke server root, yang memberi rujukan ke server TLD .id. Tiga: resolver bertanya ke server TLD, yang memberi rujukan ke server authoritative contoh.id. Empat: server authoritative menjawab alamatnya. Lima: resolver menyimpan jawaban di cache selama TTL dan mengirimkannya ke PC."
    className="w-full font-display"
  >
    <rect x={4} y={62} width={56} height={40} rx={6} fill="var(--color-kabut)" />
    <text x={32} y={86} fontSize={12} textAnchor="middle" {...label}>
      PC
    </text>
    <rect x={92} y={62} width={76} height={40} rx={6} fill="var(--color-matahari-muda)" />
    <text x={130} y={86} fontSize={12} textAnchor="middle" {...label}>
      Resolver
    </text>
    <path d="M60 76 H92 M92 90 H60" stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
    <text x={4} y={124} fontSize={12} {...quiet}>
      1. rekursif
    </text>
    <text x={4} y={140} fontSize={12} {...quiet}>
      5. jawaban
    </text>
    <text x={92} y={124} fontSize={12} {...quiet}>
      cache TTL
    </text>
    {STEPS.map((s) => (
      <g key={s.name}>
        <path d={`M168 82 L${s.x} ${s.y + 22}`} stroke="var(--color-tinta-lembut)" strokeWidth={1} />
        <rect x={s.x} y={s.y} width={86} height={44} rx={6} fill="var(--color-biru-muda)" />
        <text x={s.x + 43} y={s.y + 18} fontSize={12} textAnchor="middle" {...label}>
          {s.name}
        </text>
        <text x={s.x + 43} y={s.y + 34} fontSize={12} textAnchor="middle" {...quiet}>
          {s.note}
        </text>
      </g>
    ))}
  </svg>
)
