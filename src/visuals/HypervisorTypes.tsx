import type { FC } from 'react'
import { label, quiet } from './styles'

type Layer = { text: string; fill: string }
const Stack: FC<{ x: number; title: string; layers: Layer[] }> = ({ x, title, layers }) => (
  <g>
    <text x={x + 67} y={16} fontSize={13} textAnchor="middle" {...label}>
      {title}
    </text>
    {layers.map((l, i) => (
      <g key={l.text}>
        <rect x={x} y={26 + i * 34} width={134} height={30} rx={6} fill={l.fill} />
        <text x={x + 67} y={46 + i * 34} fontSize={12} textAnchor="middle" {...label}>
          {l.text}
        </text>
      </g>
    ))}
  </g>
)

const VM: Layer = { text: 'VM: guest OS + app', fill: 'var(--color-mint-muda)' }
const HYP: Layer = { text: 'Hypervisor', fill: 'var(--color-biru-muda)' }
const HW: Layer = { text: 'Hardware', fill: 'var(--color-kabut)' }

/** Type 1 runs on the hardware; type 2 runs as an application on a host OS. */
export const HypervisorTypes: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="Dua tipe hypervisor. Type 1, bare metal: hypervisor langsung di atas hardware, lalu VM di atasnya. Type 2, hosted: di atas hardware ada sistem operasi host, hypervisor berjalan sebagai aplikasi di sistem operasi itu, lalu VM di atasnya. Type 1 punya akses langsung ke hardware, jadi performanya lebih baik."
    className="w-full font-display"
  >
    <Stack x={4} title="Type 1 (bare metal)" layers={[VM, HYP, HW]} />
    <Stack x={162} title="Type 2 (hosted)" layers={[VM, HYP, { text: 'Host OS', fill: 'var(--color-matahari-muda)' }, HW]} />
    <text x={4} y={192} fontSize={12} {...quiet}>
      Type 1: langsung ke hardware, lebih cepat
    </text>
  </svg>
)
