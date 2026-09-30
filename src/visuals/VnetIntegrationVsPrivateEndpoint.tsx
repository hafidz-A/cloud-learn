import type { FC } from 'react'
import { useSvgId } from './ids'
import { ArrowMarker } from './parts'
import { label, quiet } from './styles'

function Box({ x, y, w, lines, fill }: { x: number; y: number; w: number; lines: string[]; fill: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={44} rx={8} fill={fill} stroke="var(--color-biru-dalam)" strokeWidth={1.5} />
      {lines.map((l, i) => (
        <text key={l} x={x + w / 2} y={y + (lines.length === 1 ? 26 : 19 + i * 15)} fontSize={12} textAnchor="middle" {...label}>
          {l}
        </text>
      ))}
    </g>
  )
}

/**
 * Private endpoint carries inbound traffic from the virtual network to the
 * app; VNet integration carries outbound traffic from the app into the
 * virtual network. Each handles one direction only.
 */
export const VnetIntegrationVsPrivateEndpoint: FC = () => {
  const arrow = useSvgId('vnet-app-arrow')
  const line = { stroke: 'var(--color-biru-dalam)', strokeWidth: 2, fill: 'none', markerEnd: `url(#${arrow})` }
  return (
    <svg
      viewBox="0 0 300 214"
      role="img"
      aria-label="Dua fitur jaringan App Service dengan arah berbeda. Trafik masuk: klien di virtual network menjangkau web app lewat private endpoint, yang memberi app alamat IP privat. Trafik keluar: web app menjangkau VM atau database di virtual network lewat VNet integration, yang memakai subnet khusus. VNet integration tidak memberi akses masuk, dan private endpoint tidak dipakai untuk panggilan keluar."
      className="w-full font-display"
    >
      <defs>
        <ArrowMarker id={arrow} />
      </defs>
      <text x={0} y={14} fontSize={12} {...label}>
        Masuk ke app
      </text>
      <Box x={1} y={22} w={80} lines={['Klien', 'di VNet']} fill="#fff" />
      <path d="M82 44 H104" {...line} />
      <Box x={108} y={22} w={96} lines={['Private', 'endpoint']} fill="var(--color-mint-muda)" />
      <path d="M205 44 H227" {...line} />
      <Box x={231} y={22} w={68} lines={['Web app']} fill="var(--color-biru-muda)" />
      <text x={0} y={104} fontSize={12} {...label}>
        Keluar dari app
      </text>
      <Box x={1} y={112} w={68} lines={['Web app']} fill="var(--color-biru-muda)" />
      <path d="M70 134 H92" {...line} />
      <Box x={96} y={112} w={108} lines={['VNet', 'integration']} fill="var(--color-matahari-muda)" />
      <path d="M205 134 H227" {...line} />
      <Box x={231} y={112} w={68} lines={['VM atau', 'database']} fill="#fff" />
      <text x={0} y={186} fontSize={12} {...quiet}>
        Private endpoint: hanya trafik masuk.
      </text>
      <text x={0} y={204} fontSize={12} {...quiet}>
        VNet integration: hanya trafik keluar.
      </text>
    </svg>
  )
}
