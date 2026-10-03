import type { FC } from 'react'
import { label, quiet } from './styles'

const STEPS = [
  { layer: 'Layer 1', cmd: 'show interfaces, ip int brief', fill: 'var(--color-kabut)' },
  { layer: 'Layer 2', cmd: 'show vlan brief, int trunk', fill: 'var(--color-biru-muda)' },
  { layer: 'Layer 2', cmd: 'show mac address-table', fill: 'var(--color-biru-muda)' },
  { layer: 'Layer 3', cmd: 'ping, traceroute', fill: 'var(--color-mint-muda)' },
  { layer: 'Log', cmd: 'show logging', fill: 'var(--color-matahari-muda)' },
]

/** Bottom-up troubleshooting: which show commands answer which layer. */
export const TroubleshootLadder: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="Troubleshoot dari bawah ke atas. Layer 1: show ip interface brief dan show interfaces untuk status dan error. Layer 2: show vlan brief dan show interfaces trunk, lalu show mac address-table dan show cdp neighbors. Layer 3: alamat di show ip interface brief, lalu ping dan traceroute. Log: show logging untuk pesan %LINK dan %LINEPROTO."
    className="w-full font-display"
  >
    {STEPS.map((s, i) => (
      <g key={s.cmd}>
        <rect x={4} y={156 - i * 38} width={292} height={34} rx={6} fill={s.fill} />
        <text x={12} y={177 - i * 38} fontSize={12} {...label}>
          {s.layer}
        </text>
        <text x={70} y={177 - i * 38} fontSize={12} {...quiet}>
          {s.cmd}
        </text>
      </g>
    ))}
  </svg>
)
