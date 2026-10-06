import type { FC } from 'react'
import { label, quiet } from './styles'

/** Single-mode fiber has a thin core and one light path, so it reaches far; multimode has a wide core and many paths, so it reaches less. */
export const FiberTypes: FC = () => (
  <svg
    viewBox="0 0 300 190"
    role="img"
    aria-label="Perbandingan fiber. Single-mode fiber (SMF) punya inti sangat tipis sehingga cahaya laser berjalan satu jalur dan bisa menjangkau sekitar 10 km dengan SFP 1000BASE-LX/LH. Multimode fiber (MMF) punya inti lebar sehingga cahaya memantul dalam banyak jalur dan jangkauannya lebih pendek, sekitar 550 m dengan SFP 1000BASE-SX."
    className="w-full font-display"
  >
    <text x={6} y={18} fontSize={13} {...label}>
      Single-mode (SMF)
    </text>
    <rect x={6} y={28} width={288} height={34} rx={17} fill="var(--color-kabut)" />
    <rect x={6} y={41} width={288} height={8} rx={4} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={1} />
    <path d="M14 45 H286" stroke="var(--color-biru-dalam)" strokeWidth={2} />
    <text x={6} y={80} fontSize={12} {...quiet}>
      Inti tipis, satu jalur cahaya, jarak jauh (LX/LH: 10 km)
    </text>
    <text x={6} y={110} fontSize={13} {...label}>
      Multimode (MMF)
    </text>
    <rect x={6} y={120} width={288} height={34} rx={17} fill="var(--color-kabut)" />
    <rect x={6} y={126} width={288} height={22} rx={11} fill="var(--color-mint-muda)" stroke="var(--color-mint-dalam)" strokeWidth={1} />
    <path d="M14 137 L60 128 L106 146 L152 128 L198 146 L244 128 L286 137" fill="none" stroke="var(--color-mint-dalam)" strokeWidth={2} />
    <path d="M14 137 L90 146 L166 128 L242 146 L286 140" fill="none" stroke="var(--color-mint-dalam)" strokeWidth={1.5} strokeDasharray="4 3" />
    <text x={6} y={172} fontSize={12} {...quiet}>
      Inti lebar, banyak jalur, lebih pendek (SX: 550 m)
    </text>
  </svg>
)
