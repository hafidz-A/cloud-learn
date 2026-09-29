import type { FC } from 'react'
import { label } from './styles'

function Box({ x, y, w, text, strong = false }: { x: number; y: number; w: number; text: string; strong?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={26} rx={8} fill={strong ? 'var(--color-biru-muda)' : '#fff'} stroke={strong ? 'var(--color-biru-dalam)' : 'var(--color-biru)'} strokeWidth={2} />
      <text x={x + w / 2} y={y + 17} fontSize={12} textAnchor="middle" {...label}>
        {text}
      </text>
    </g>
  )
}

/** Management group > subscriptions > resource groups > resources, as a small tree. */
export const ResourceHierarchy: FC = () => {
  const line = { stroke: 'var(--color-kabut-dalam)', strokeWidth: 2 }
  return (
    <svg viewBox="0 0 300 172" role="img" aria-label="Diagram hierarki: management group berisi subscription, subscription berisi resource group, resource group berisi resource." className="w-full font-display">
      <path d="M150 30 V42 M78 42 H222 M78 42 V52 M222 42 V52 M78 78 V92 M78 118 V124 M40 124 H116 M40 124 V134 M116 124 V134" fill="none" {...line} />
      <Box x={85} y={4} w={130} text="Management group" strong />
      <Box x={18} y={52} w={120} text="Subscription A" />
      <Box x={162} y={52} w={120} text="Subscription B" />
      <Box x={18} y={92} w={120} text="Resource group" />
      <Box x={2} y={134} w={76} text="VM" />
      <Box x={82} y={134} w={76} text="Storage" />
      <text x={222} y={112} fontSize={12} textAnchor="middle" fill="var(--color-tinta-lembut)">
        Pengaturan diwariskan
      </text>
      <text x={222} y={128} fontSize={12} textAnchor="middle" fill="var(--color-tinta-lembut)">
        dari atas ke bawah
      </text>
    </svg>
  )
}
