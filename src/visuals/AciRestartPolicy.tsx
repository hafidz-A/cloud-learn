import type { FC } from 'react'
import { label, quiet } from './styles'

const POLICIES = [
  { name: 'Always', note: 'default', ok: 'restart', fail: 'restart' },
  { name: 'OnFailure', note: 'jalan minimal sekali', ok: 'berhenti', fail: 'restart' },
  { name: 'Never', note: '', ok: 'berhenti', fail: 'bisa restart*' },
]

/**
 * The three restart policies of an Azure Container Instances container group,
 * and what happens when the container exits with code 0 or a nonzero code.
 */
export const AciRestartPolicy: FC = () => (
  <svg
    viewBox="0 0 300 232"
    role="img"
    aria-label="Restart policy Azure Container Instances. Always adalah default: container selalu di-restart, baik selesai sukses dengan exit code 0 maupun gagal. OnFailure: container berjalan minimal sekali, berhenti kalau sukses, dan di-restart kalau gagal dengan exit code bukan nol. Never: container tidak di-restart kalau sukses, tapi kalau gagal platform masih mungkin me-restart-nya. Alamat IP container group bisa berubah saat di-restart."
    className="w-full font-display"
  >
    <text x={172} y={16} fontSize={12} textAnchor="middle" {...label}>
      exit 0
    </text>
    <text x={254} y={16} fontSize={12} textAnchor="middle" {...label}>
      exit bukan 0
    </text>
    {POLICIES.map((p, i) => {
      const y = 26 + i * 50
      return (
        <g key={p.name}>
          <rect x={1} y={y} width={298} height={44} rx={8} fill={i === 0 ? 'var(--color-matahari-muda)' : 'var(--color-biru-muda)'} />
          <text x={10} y={y + 19} fontSize={12} className="font-mono" {...label}>
            {p.name}
          </text>
          {p.note && (
            <text x={10} y={y + 36} fontSize={12} {...quiet}>
              {p.note}
            </text>
          )}
          <text x={172} y={y + 27} fontSize={12} textAnchor="middle" {...quiet}>
            {p.ok}
          </text>
          <text x={254} y={y + 27} fontSize={12} textAnchor="middle" {...quiet}>
            {p.fail}
          </text>
        </g>
      )
    })}
    <text x={0} y={192} fontSize={12} {...quiet}>
      * Never hanya menjamin tidak restart setelah sukses.
    </text>
    <text x={0} y={214} fontSize={12} {...label}>
      Restart bisa mengganti alamat IP container group.
    </text>
  </svg>
)
