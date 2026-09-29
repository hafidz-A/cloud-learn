import type { FC } from 'react'
import { label, quiet } from './styles'

const MONTHS = 6

function Chart({ x, title, caption, heights, fill, stroke }: { x: number; title: string; caption: string; heights: number[]; fill: string; stroke: string }) {
  const base = 118
  return (
    <g>
      <text x={x} y={16} fontSize={14} {...label}>
        {title}
      </text>
      <line x1={x} y1={base} x2={x + 136} y2={base} stroke="var(--color-kabut-dalam)" strokeWidth={2} />
      {heights.map((h, i) => (
        <rect key={i} x={x + 4 + i * 22} y={base - h} width={16} height={Math.max(h, 0)} rx={3} fill={fill} stroke={stroke} strokeWidth={1.5} />
      ))}
      <text x={x + 68} y={base + 16} fontSize={12} textAnchor="middle" {...quiet}>
        bulan 1 sampai {MONTHS}
      </text>
      <text x={x + 68} y={base + 34} fontSize={12} textAnchor="middle" {...label}>
        {caption}
      </text>
    </g>
  )
}

/** Monthly spending: one big purchase up front (CapEx) versus smaller bills that follow use (OpEx). */
export const CapexVsOpex: FC = () => (
  <svg
    viewBox="0 0 300 160"
    role="img"
    aria-label="Diagram pengeluaran per bulan: CapEx berupa satu pembelian besar di bulan pertama, sedangkan OpEx berupa tagihan lebih kecil tiap bulan yang naik-turun sesuai pemakaian."
    className="w-full font-display"
  >
    <Chart x={2} title="CapEx" caption="beli besar di depan" heights={[88, 4, 4, 4, 4, 4]} fill="var(--color-matahari)" stroke="var(--color-matahari-dalam)" />
    <Chart x={160} title="OpEx" caption="bayar sesuai pakai" heights={[22, 30, 18, 40, 26, 34]} fill="var(--color-biru)" stroke="var(--color-biru-dalam)" />
  </svg>
)
