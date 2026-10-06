import type { FC } from 'react'
import { ArrowMarker } from './parts'
import { useSvgId } from './ids'
import { label, quiet } from './styles'

const MODES = [
  { prompt: 'R1>', name: 'User EXEC', to: 'enable' },
  { prompt: 'R1#', name: 'Privileged EXEC', to: 'configure terminal' },
  { prompt: 'R1(config)#', name: 'Global configuration', to: 'interface g0/0/0' },
  { prompt: 'R1(config-if)#', name: 'Interface configuration', to: '' },
]

/** The IOS mode ladder: each prompt, and the command that goes one step deeper; exit goes back one step, end back to privileged EXEC. */
export const CliModes: FC = () => {
  const down = useSvgId('modes-down')
  return (
    <svg
      viewBox="0 0 300 232"
      role="img"
      aria-label="Tangga mode Cisco IOS. User EXEC dengan prompt R1>, lalu enable ke privileged EXEC dengan prompt R1#, lalu configure terminal ke global configuration dengan prompt R1(config)#, lalu interface g0/0/0 ke interface configuration dengan prompt R1(config-if)#. Perintah exit naik satu mode, dan end langsung kembali ke privileged EXEC."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={down} />
      </defs>
      {MODES.map((m, i) => {
        const y = 6 + i * 56
        const x = 6 + i * 16
        return (
          <g key={m.prompt}>
            <rect x={x} y={y} width={180} height={34} rx={8} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={1.5} />
            <text x={x + 10} y={y + 15} fontSize={12} fontFamily="monospace" {...label}>
              {m.prompt}
            </text>
            <text x={x + 10} y={y + 29} fontSize={12} {...quiet}>
              {m.name}
            </text>
            {m.to && (
              <g>
                <path d={`M${x + 20} ${y + 34} V${y + 54}`} stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd={`url(#${down})`} />
                <text x={x + 28} y={y + 48} fontSize={12} fontFamily="monospace" {...label}>
                  {m.to}
                </text>
              </g>
            )}
          </g>
        )
      })}
      <rect x={212} y={60} width={84} height={84} rx={8} fill="var(--color-matahari-muda)" />
      <text x={220} y={80} fontSize={12} fontFamily="monospace" {...label}>
        exit
      </text>
      <text x={220} y={96} fontSize={12} {...quiet}>
        naik satu
      </text>
      <text x={220} y={118} fontSize={12} fontFamily="monospace" {...label}>
        end
      </text>
      <text x={220} y={134} fontSize={12} {...quiet}>
        ke R1#
      </text>
    </svg>
  )
}
