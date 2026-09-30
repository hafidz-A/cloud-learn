import type { FC } from 'react'
import { Padlock } from './parts'
import { label, quiet } from './styles'

const TYPES = [
  { name: 'User delegation SAS', signed: 'kredensial Microsoft Entra', scope: 'Blob, Queue, Table, Files', best: true },
  { name: 'Service SAS', signed: 'account key', scope: 'satu layanan; bisa stored policy', best: false },
  { name: 'Account SAS', signed: 'account key', scope: 'satu atau lebih layanan', best: false },
]

/**
 * The three kinds of shared access signature: what signs each one and how far
 * it reaches. A user delegation SAS is the recommended one, because it doesn't
 * need the account key.
 */
export const SasTypes: FC = () => (
  <svg
    viewBox="0 0 300 268"
    role="img"
    aria-label="Tiga jenis SAS. User delegation SAS ditandatangani dengan kredensial Microsoft Entra, berlaku untuk Blob, Queue, Table, dan Azure Files, dan paling disarankan. Service SAS ditandatangani dengan account key, hanya untuk satu layanan, dan satu-satunya yang bisa memakai stored access policy. Account SAS juga ditandatangani dengan account key, dan bisa untuk satu atau lebih layanan. Merotasi account key membatalkan service SAS dan account SAS yang ditandatangani dengan key itu."
    className="w-full font-display"
  >
    {TYPES.map((t, i) => {
      const y = 1 + i * 76
      return (
        <g key={t.name}>
          <rect
            x={1}
            y={y}
            width={298}
            height={68}
            rx={12}
            fill={t.best ? 'var(--color-mint-muda)' : '#fff'}
            stroke={t.best ? 'var(--color-mint-dalam)' : 'var(--color-biru)'}
            strokeWidth={2}
          />
          <text x={12} y={y + 20} fontSize={12} {...label}>
            {t.name}
          </text>
          {t.best && (
            <text x={288} y={y + 20} fontSize={12} textAnchor="end" {...label}>
              disarankan
            </text>
          )}
          <Padlock x={12} y={y + 30} color={t.best ? 'var(--color-mint-dalam)' : 'var(--color-matahari-dalam)'} />
          <text x={34} y={y + 43} fontSize={12} {...quiet}>
            ditandatangani {t.signed}
          </text>
          <text x={34} y={y + 60} fontSize={12} {...quiet}>
            {t.scope}
          </text>
        </g>
      )
    })}
    <text x={0} y={246} fontSize={12} {...label}>
      Rotasi account key membatalkan
    </text>
    <text x={0} y={264} fontSize={12} {...label}>
      service SAS dan account SAS dari key itu.
    </text>
  </svg>
)
