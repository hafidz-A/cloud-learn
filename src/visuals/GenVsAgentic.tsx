import type { FC } from 'react'
import { label, quiet } from './styles'

/** Generative AI answers once; agentic AI loops through perceive, plan, act, and check. */
export const GenVsAgentic: FC = () => (
  <svg
    viewBox="0 0 300 170"
    role="img"
    aria-label="Kiri, AI generatif: prompt masuk, jawaban keluar, selesai; manusia yang memutuskan dan bertindak. Kanan, AI agentic: berputar dalam siklus mengamati, merencanakan, bertindak lewat alat atau API, lalu memeriksa hasil, sampai tujuan tercapai."
    className="w-full font-display"
  >
    <text x={70} y={16} fontSize={12} textAnchor="middle" {...label}>
      Generatif
    </text>
    <rect x={20} y={28} width={100} height={28} rx={6} fill="var(--color-kabut)" />
    <text x={70} y={47} fontSize={12} textAnchor="middle" {...quiet}>
      prompt
    </text>
    <path d="M70 56 V76" stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
    <rect x={20} y={76} width={100} height={28} rx={6} fill="var(--color-biru-muda)" />
    <text x={70} y={95} fontSize={12} textAnchor="middle" {...quiet}>
      jawaban
    </text>
    <text x={70} y={128} fontSize={12} textAnchor="middle" {...quiet}>
      manusia bertindak
    </text>
    <text x={220} y={16} fontSize={12} textAnchor="middle" {...label}>
      Agentic
    </text>
    {[
      ['amati', 220, 36],
      ['rencanakan', 262, 86],
      ['bertindak', 220, 136],
      ['periksa', 178, 86],
    ].map(([t, x, y]) => (
      <g key={t as string}>
        <rect x={(x as number) - 35} y={(y as number) - 14} width={70} height={26} rx={6} fill="var(--color-matahari-muda)" />
        <text x={x as number} y={(y as number) + 4} fontSize={12} textAnchor="middle" {...quiet}>
          {t}
        </text>
      </g>
    ))}
    <circle cx={220} cy={86} r={34} stroke="var(--color-tinta-lembut)" strokeWidth={1.2} fill="none" strokeDasharray="4 3" />
  </svg>
)
