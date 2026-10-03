import type { FC } from 'react'
import { DeviceIcon } from './NetDiagram'
import { label, quiet } from './styles'

/** DR and BDR on a LAN: highest priority wins, then highest router ID; priority 0 never becomes DR. */
export const DrElection: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="Empat router di satu LAN Ethernet. R1 priority 100 menjadi DR karena priority tertinggi. R2 priority 1 dengan router ID tertinggi di antara sisanya menjadi BDR. R3 priority 1 menjadi DROTHER. R4 priority 0 tidak pernah menjadi DR atau BDR. Router lain membentuk adjacency penuh hanya dengan DR dan BDR."
    className="w-full font-display"
  >
    <line x1={20} y1={100} x2={280} y2={100} stroke="var(--color-tinta-lembut)" strokeWidth={3} />
    {[
      { x: 40, n: 'R1', p: 'prio 100', r: 'DR' },
      { x: 113, n: 'R2', p: 'prio 1, RID 3.3.3.3', r: 'BDR' },
      { x: 186, n: 'R3', p: 'prio 1, RID 2.2.2.2', r: 'DROTHER' },
      { x: 259, n: 'R4', p: 'prio 0', r: 'DROTHER' },
    ].map((d) => (
      <g key={d.n}>
        <line x1={d.x} y1={66} x2={d.x} y2={100} stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
        <DeviceIcon kind="router" x={d.x} y={50} />
        <text x={d.x} y={24} fontSize={12} textAnchor="middle" {...label}>
          {d.n}
        </text>
        <text x={d.x} y={124} fontSize={12} textAnchor="middle" {...label}>
          {d.r}
        </text>
      </g>
    ))}
    <text x={4} y={150} fontSize={12} {...quiet}>
      Seri prio 1: RID 3.3.3.3 lebih tinggi
    </text>
    <text x={4} y={170} fontSize={12} {...label}>
      Priority tertinggi, lalu router ID tertinggi
    </text>
    <text x={4} y={190} fontSize={12} {...quiet}>
      Priority 0: tidak pernah DR atau BDR
    </text>
  </svg>
)
