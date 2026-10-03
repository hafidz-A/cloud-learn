import type { FC } from 'react'
import { label, quiet } from './styles'

const STATES = [
  ['Down', 'belum ada hello'],
  ['Init', 'hello diterima, ID saya belum ada'],
  ['2-Way', 'saling melihat; DR/BDR dipilih'],
  ['ExStart', 'tentukan siapa mulai tukar DBD'],
  ['Exchange', 'tukar ringkasan database (DBD)'],
  ['Loading', 'minta LSA yang kurang'],
  ['Full', 'database sama: adjacency penuh'],
]

/** OSPF neighbor states from Down to Full. */
export const OspfStates: FC = () => (
  <svg
    viewBox="0 0 300 226"
    role="img"
    aria-label="State tetangga OSPF. Down: belum ada hello. Init: hello diterima tapi router ID saya belum tercantum. 2-Way: saling melihat, dan DR serta BDR dipilih di jaringan broadcast. ExStart: menentukan siapa yang memulai pertukaran DBD. Exchange: bertukar ringkasan database. Loading: meminta LSA yang kurang. Full: database sama, adjacency penuh."
    className="w-full font-display"
  >
    {STATES.map(([s, t], i) => (
      <g key={s}>
        <rect x={4} y={4 + i * 30} width={292} height={26} rx={5} fill={i === 6 ? 'var(--color-mint-muda)' : i === 2 ? 'var(--color-matahari-muda)' : 'var(--color-biru-muda)'} />
        <text x={12} y={21 + i * 30} fontSize={12} {...label}>
          {s}
        </text>
        <text x={84} y={21 + i * 30} fontSize={12} {...quiet}>
          {t}
        </text>
      </g>
    ))}
    <text x={4} y={218} fontSize={12} {...quiet}>
      DROTHER dengan DROTHER berhenti di 2-Way
    </text>
  </svg>
)
