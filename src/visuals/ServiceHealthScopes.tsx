import type { FC } from 'react'
import { label, quiet } from './styles'

/** Azure status covers everything, Service Health covers what you use, Resource Health covers each of your resources. */
export const ServiceHealthScopes: FC = () => (
  <svg
    viewBox="0 0 300 196"
    role="img"
    aria-label="Diagram cakupan kesehatan: Azure status paling luas untuk semua layanan di semua region, Service Health untuk layanan dan region yang kamu pakai, dan Resource Health untuk setiap resource milikmu."
    className="w-full font-display"
  >
    <rect x={1} y={1} width={298} height={194} rx={16} fill="#fff" stroke="var(--color-kabut-dalam)" strokeWidth={2} strokeDasharray="6 4" />
    <text x={14} y={24} fontSize={14} {...label}>
      Azure status
    </text>
    <text x={14} y={42} fontSize={12} {...quiet}>
      semua layanan, semua region
    </text>
    <rect x={20} y={54} width={260} height={128} rx={14} fill="var(--color-biru-muda)" stroke="var(--color-biru)" strokeWidth={2} />
    <text x={34} y={76} fontSize={14} {...label}>
      Service Health
    </text>
    <text x={34} y={94} fontSize={12} {...quiet}>
      layanan dan region yang kamu pakai
    </text>
    <rect x={40} y={106} width={220} height={62} rx={12} fill="var(--color-mint-muda)" stroke="var(--color-mint-dalam)" strokeWidth={2.5} />
    <text x={54} y={130} fontSize={14} {...label}>
      Resource Health
    </text>
    <text x={54} y={150} fontSize={12} {...quiet}>
      setiap resource milikmu
    </text>
  </svg>
)
