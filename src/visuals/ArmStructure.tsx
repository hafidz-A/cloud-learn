import type { FC } from 'react'
import { label, quiet } from './styles'

const SECTIONS = [
  { key: '"$schema"', note: 'versi bahasa template', required: true },
  { key: '"contentVersion"', note: 'versi template, misalnya 1.0.0.0', required: true },
  { key: '"parameters"', note: 'nilai yang diisi saat deploy', required: false },
  { key: '"variables"', note: 'nilai bantu di dalam template', required: false },
  { key: '"resources"', note: 'resource yang dibuat atau diubah', required: true },
  { key: '"outputs"', note: 'nilai yang dikembalikan', required: false },
]

/**
 * The sections of an ARM template, top to bottom. $schema, contentVersion,
 * and resources are required; the rest are optional.
 */
export const ArmStructure: FC = () => (
  <svg
    viewBox="0 0 300 250"
    role="img"
    aria-label="Bagian ARM template dari atas ke bawah. $schema berisi versi bahasa template dan wajib. contentVersion berisi versi template, misalnya 1.0.0.0, dan wajib. parameters berisi nilai yang diisi saat deploy. variables berisi nilai bantu di dalam template. resources berisi resource yang dibuat atau diubah, dan wajib. outputs berisi nilai yang dikembalikan setelah deploy. Bagian yang tidak wajib boleh dihilangkan."
    className="w-full font-display"
  >
    <rect x={1} y={1} width={298} height={220} rx={12} fill="var(--color-tinta)" />
    <text x={12} y={21} fontSize={12} className="font-mono" fill="#fff" fontWeight={600}>
      {'{'}
    </text>
    {SECTIONS.map((s, i) => {
      const y = 30 + i * 30
      return (
        <g key={s.key}>
          <rect x={16} y={y} width={272} height={26} rx={6} fill={s.required ? 'var(--color-matahari-muda)' : 'var(--color-biru-muda)'} />
          <text x={24} y={y + 17} fontSize={12} className="font-mono" {...label}>
            {s.key}
          </text>
          <text x={280} y={y + 17} fontSize={12} textAnchor="end" {...quiet}>
            {s.required ? 'wajib' : 'opsional'}
          </text>
        </g>
      )
    })}
    <text x={12} y={214} fontSize={12} className="font-mono" fill="#fff" fontWeight={600}>
      {'}'}
    </text>
    <text x={0} y={242} fontSize={12} {...label}>
      Wajib: $schema, contentVersion, resources.
    </text>
  </svg>
)
