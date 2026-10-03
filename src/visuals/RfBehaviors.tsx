import type { FC } from 'react'
import { label, quiet } from './styles'

const ROWS = [
  { name: 'Absorption', text: 'diserap: tembok, air, tubuh', fill: 'var(--color-koral-muda)' },
  { name: 'Reflection', text: 'memantul: logam, kaca', fill: 'var(--color-biru-muda)' },
  { name: 'Refraction', text: 'berbelok saat lewat medium lain', fill: 'var(--color-mint-muda)' },
  { name: 'Scattering', text: 'tersebar oleh permukaan kasar', fill: 'var(--color-matahari-muda)' },
  { name: 'Diffraction', text: 'membelok di sekitar penghalang', fill: 'var(--color-kabut)' },
]

/** What objects do to an RF signal. */
export const RfBehaviors: FC = () => (
  <svg
    viewBox="0 0 300 200"
    role="img"
    aria-label="Perilaku sinyal RF. Absorption: sinyal diserap, misalnya oleh tembok, air, dan tubuh manusia. Reflection: sinyal memantul dari logam atau kaca. Refraction: sinyal berbelok saat masuk medium lain. Scattering: sinyal tersebar oleh permukaan kasar. Diffraction: sinyal membelok di sekitar penghalang."
    className="w-full font-display"
  >
    {ROWS.map((r, i) => (
      <g key={r.name}>
        <rect x={6} y={6 + i * 38} width={288} height={32} rx={6} fill={r.fill} />
        <text x={14} y={27 + i * 38} fontSize={13} {...label}>
          {r.name}
        </text>
        <text x={110} y={27 + i * 38} fontSize={12} {...quiet}>
          {r.text}
        </text>
      </g>
    ))}
  </svg>
)
