import type { FC } from 'react'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** Traceroute: TTL 1, 2, 3... each router that drops a probe answers with time exceeded; the destination answers port unreachable. */
export const TracerouteTtl: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="Traceroute dari R1 ke server. Probe pertama dengan TTL 1 dibuang di R2, yang membalas ICMP time exceeded, jadi R2 tampil sebagai hop 1. Probe dengan TTL 2 dibuang di R3, hop 2. Probe dengan TTL 3 sampai ke server, yang membalas ICMP port unreachable, tanda traceroute selesai."
    className="w-full font-display"
  >
    {[
      { x: 30, kind: 'router' as const, name: 'R1' },
      { x: 110, kind: 'router' as const, name: 'R2' },
      { x: 190, kind: 'router' as const, name: 'R3' },
      { x: 270, kind: 'server' as const, name: 'Server' },
    ].map((d) => (
      <g key={d.name}>
        <DeviceIcon kind={d.kind} x={d.x} y={36} />
        <text x={d.x} y={66} fontSize={12} textAnchor="middle" {...label}>
          {d.name}
        </text>
      </g>
    ))}
    <line x1={50} y1={36} x2={250} y2={36} stroke="var(--color-tinta-lembut)" strokeWidth={1.2} />
    <rect x={4} y={82} width={292} height={30} rx={6} fill="var(--color-biru-muda)" />
    <text x={12} y={101} fontSize={12} {...label}>
      TTL 1: R2 membalas time exceeded
    </text>
    <rect x={4} y={118} width={292} height={30} rx={6} fill="var(--color-biru-muda)" />
    <text x={12} y={137} fontSize={12} {...label}>
      TTL 2: R3 membalas time exceeded
    </text>
    <rect x={4} y={154} width={292} height={30} rx={6} fill="var(--color-mint-muda)" />
    <text x={12} y={173} fontSize={12} {...label}>
      TTL 3: server membalas port unreachable
    </text>
    <text x={4} y={198} fontSize={12} {...quiet}>
      * berarti probe itu tidak dijawab
    </text>
  </svg>
)
