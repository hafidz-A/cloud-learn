import type { FC } from 'react'
import type { VisualName } from '../content/visuals'

// Small diagrams for intro cards (plan section 11.1). Colors come from the
// palette tokens; labels use Tinta so they keep AA contrast on the light fills.

const label = { fill: 'var(--color-tinta)', fontWeight: 600 } as const

function ServerStack({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[0, 11, 22].map((dy) => (
        <g key={dy}>
          <rect x={x} y={y + dy} width={36} height={8} rx={2.5} fill="var(--color-kabut)" stroke="var(--color-tinta-lembut)" strokeWidth={1.5} />
          <circle cx={x + 6} cy={y + dy + 4} r={1.6} fill="var(--color-mint-dalam)" />
        </g>
      ))}
    </g>
  )
}

function Bolt({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x + 5} ${y} L${x} ${y + 9} H${x + 4} L${x + 2} ${y + 16} L${x + 9} ${y + 6} H${x + 5} L${x + 7} ${y} Z`}
      fill="var(--color-matahari)"
      stroke="var(--color-matahari-dalam)"
      strokeWidth={1}
      strokeLinejoin="round"
    />
  )
}

/** One region holding three separate availability zones, each with its own datacenter and power. */
const ZonesInRegion: FC = () => (
  <svg viewBox="0 0 300 128" role="img" aria-label="Diagram: satu region berisi tiga availability zone yang terpisah, masing-masing dengan datacenter dan listrik sendiri." className="w-full font-display">
    <rect x={3} y={3} width={294} height={122} rx={18} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} strokeDasharray="7 5" />
    <text x={18} y={25} fontSize={14} {...label}>
      Region
    </text>
    {[0, 1, 2].map((i) => {
      const x = 20 + i * 90
      return (
        <g key={i}>
          <rect x={x} y={36} width={80} height={76} rx={12} fill="#fff" stroke="var(--color-biru)" strokeWidth={2} />
          <ServerStack x={x + 14} y={46} />
          <Bolt x={x + 56} y={52} />
          <text x={x + 40} y={100} fontSize={13} textAnchor="middle" {...label}>
            Zone {i + 1}
          </text>
        </g>
      )
    })}
  </svg>
)

function MiniRegion({ x, name }: { x: number; name: string }) {
  return (
    <g>
      <rect x={x} y={44} width={96} height={80} rx={14} fill="var(--color-biru-muda)" stroke="var(--color-biru-dalam)" strokeWidth={2} />
      <text x={x + 48} y={66} fontSize={13} textAnchor="middle" {...label}>
        {name}
      </text>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={x + 15 + i * 24} y={80} width={18} height={26} rx={4} fill="#fff" stroke="var(--color-biru)" strokeWidth={1.5} />
      ))}
    </g>
  )
}

/** Two regions in one geography, far apart, backing each other up. */
const RegionPair: FC = () => (
  <svg viewBox="0 0 300 150" role="img" aria-label="Diagram: dua region dalam satu geografi, berjarak sekitar 480 kilometer, saling jadi cadangan." className="w-full font-display">
    <defs>
      <marker id="pair-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 Z" fill="var(--color-biru-dalam)" />
      </marker>
    </defs>
    <rect x={3} y={3} width={294} height={144} rx={18} fill="none" stroke="var(--color-kabut-dalam)" strokeWidth={2} strokeDasharray="7 5" />
    <text x={18} y={25} fontSize={14} {...label}>
      Geografi
    </text>
    <MiniRegion x={18} name="Region A" />
    <MiniRegion x={186} name="Region B" />
    <line x1={120} y1={92} x2={182} y2={92} stroke="var(--color-biru-dalam)" strokeWidth={2.5} markerStart="url(#pair-arrow)" markerEnd="url(#pair-arrow)" />
    <text x={151} y={82} fontSize={12} textAnchor="middle" {...label}>
      ≥480 km
    </text>
  </svg>
)

const CUSTOMER = 'var(--color-biru-muda)'
const MICROSOFT = 'var(--color-kabut)'

/** Who looks after each layer in each service type. Customer cells are blue, Microsoft cells gray. */
const SharedResponsibility: FC = () => {
  const cols = ['On-prem', 'IaaS', 'PaaS', 'SaaS']
  const rows: { label: string; customer: boolean[] }[] = [
    { label: 'Data, device, akun', customer: [true, true, true, true] },
    { label: 'Aplikasi', customer: [true, true, true, false] },
    { label: 'Sistem operasi', customer: [true, true, false, false] },
    { label: 'Hardware fisik', customer: [true, false, false, false] },
  ]
  const x0 = 104
  const cw = 47
  const rh = 26
  return (
    <svg viewBox="0 0 300 176" role="img" aria-label="Diagram shared responsibility: data, device, dan akun selalu milik customer; host, jaringan, dan gedung fisik milik Microsoft kecuali on-premises; aplikasi dan sistem operasi tergantung jenis layanan." className="w-full font-display">
      {cols.map((c, i) => (
        <text key={c} x={x0 + i * cw + cw / 2} y={16} fontSize={12} textAnchor="middle" {...label}>
          {c}
        </text>
      ))}
      {rows.map((r, ri) => (
        <g key={r.label}>
          <text x={0} y={30 + ri * rh + rh / 2 + 4} fontSize={11} {...label}>
            {r.label}
          </text>
          {r.customer.map((isCustomer, ci) => (
            <rect key={ci} x={x0 + ci * cw + 2} y={26 + ri * rh + 2} width={cw - 4} height={rh - 4} rx={5} fill={isCustomer ? CUSTOMER : MICROSOFT} stroke={isCustomer ? 'var(--color-biru)' : 'var(--color-kabut-dalam)'} strokeWidth={1.5} />
          ))}
        </g>
      ))}
      <g transform="translate(0 150)">
        <rect x={0} y={4} width={14} height={14} rx={3} fill={CUSTOMER} stroke="var(--color-biru)" strokeWidth={1.5} />
        <text x={20} y={16} fontSize={12} {...label}>
          Customer
        </text>
        <rect x={110} y={4} width={14} height={14} rx={3} fill={MICROSOFT} stroke="var(--color-kabut-dalam)" strokeWidth={1.5} />
        <text x={130} y={16} fontSize={12} {...label}>
          Microsoft
        </text>
      </g>
    </svg>
  )
}

function Box({ x, y, w, text, strong = false }: { x: number; y: number; w: number; text: string; strong?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={26} rx={8} fill={strong ? 'var(--color-biru-muda)' : '#fff'} stroke={strong ? 'var(--color-biru-dalam)' : 'var(--color-biru)'} strokeWidth={2} />
      <text x={x + w / 2} y={y + 17} fontSize={11} textAnchor="middle" {...label}>
        {text}
      </text>
    </g>
  )
}

/** Management group > subscriptions > resource groups > resources, as a small tree. */
const ResourceHierarchy: FC = () => {
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
      <text x={222} y={112} fontSize={11} textAnchor="middle" fill="var(--color-tinta-lembut)">
        Pengaturan diwariskan
      </text>
      <text x={222} y={128} fontSize={11} textAnchor="middle" fill="var(--color-tinta-lembut)">
        dari atas ke bawah
      </text>
    </svg>
  )
}

function Copies({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={x + i * 12} cy={y} r={4.5} fill="var(--color-biru)" />
      ))}
    </g>
  )
}

/** LRS, ZRS, and GRS side by side: where the copies of your data live. */
const StorageRedundancy: FC = () => {
  const box = { fill: '#fff', stroke: 'var(--color-biru)', strokeWidth: 1.5, rx: 6 }
  const region = { fill: 'var(--color-biru-muda)', stroke: 'var(--color-biru-dalam)', strokeWidth: 1.5, strokeDasharray: '5 4', rx: 10 }
  return (
    <svg viewBox="0 0 300 186" role="img" aria-label="Diagram redundancy: LRS tiga salinan di satu datacenter, ZRS satu salinan di tiap tiga zone, GRS tiga salinan di region utama dan tiga salinan di region kedua." className="w-full font-display">
      <text x={0} y={14} fontSize={12} {...label}>
        LRS · 11 nines
      </text>
      <rect x={0} y={20} width={120} height={36} {...region} />
      <rect x={30} y={27} width={60} height={22} {...box} />
      <Copies x={48} y={38} n={3} />

      <text x={0} y={76} fontSize={12} {...label}>
        ZRS · 12 nines
      </text>
      <rect x={0} y={82} width={170} height={36} {...region} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={10 + i * 53} y={89} width={44} height={22} {...box} />
          <Copies x={32 + i * 53} y={100} n={1} />
        </g>
      ))}

      <text x={0} y={138} fontSize={12} {...label}>
        GRS · 16 nines
      </text>
      <rect x={0} y={144} width={120} height={36} {...region} />
      <rect x={30} y={151} width={60} height={22} {...box} />
      <Copies x={48} y={162} n={3} />
      <path d="M126 162 H168" stroke="var(--color-biru-dalam)" strokeWidth={2} markerEnd="url(#copy-arrow)" />
      <rect x={176} y={144} width={120} height={36} {...region} />
      <rect x={206} y={151} width={60} height={22} {...box} />
      <Copies x={224} y={162} n={3} />
      <text x={236} y={138} fontSize={11} textAnchor="middle" fill="var(--color-tinta-lembut)">
        region kedua
      </text>
      <defs>
        <marker id="copy-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill="var(--color-biru-dalam)" />
        </marker>
      </defs>
    </svg>
  )
}

/** Seven defense-in-depth layers as nested boxes, from physical security outside to data at the core. */
const DefenseLayers: FC = () => {
  const layers = ['Physical security', 'Identity and access', 'Perimeter', 'Network', 'Compute', 'Application', 'Data']
  const step = 13
  return (
    <svg viewBox="0 0 300 206" role="img" aria-label="Diagram defense in depth, dari luar ke dalam: physical security, identity and access, perimeter, network, compute, application, data." className="w-full font-display">
      {layers.map((name, i) => {
        const inset = i * step
        const isData = i === layers.length - 1
        return (
          <g key={name}>
            <rect
              x={inset + 1}
              y={inset + 1}
              width={298 - inset * 2}
              height={204 - inset * 2}
              rx={14}
              fill={isData ? 'var(--color-matahari-muda)' : i % 2 === 0 ? 'var(--color-biru-muda)' : '#fff'}
              stroke={isData ? 'var(--color-matahari-dalam)' : 'var(--color-biru)'}
              strokeWidth={1.5}
            />
            <text x={isData ? 150 : inset + 10} y={isData ? 107 : inset + 11} fontSize={isData ? 14 : 10} textAnchor={isData ? 'middle' : 'start'} {...label}>
              {name}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

const VISUALS: Record<VisualName, FC> = {
  ZonesInRegion,
  RegionPair,
  SharedResponsibility,
  ResourceHierarchy,
  StorageRedundancy,
  DefenseLayers,
}

/** Renders the diagram an intro card names in its "visual" field. */
export function IntroVisual({ name }: { name: VisualName }) {
  const Diagram = VISUALS[name]
  return <Diagram />
}
