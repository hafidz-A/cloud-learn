import type { FC } from 'react'
import { label, quiet } from './styles'

const FIELDS = [
  { name: 'MAC tujuan', w: 52, fill: 'var(--color-kabut)' },
  { name: 'MAC sumber', w: 52, fill: 'var(--color-kabut)' },
  { name: 'Tag 4 byte', w: 62, fill: 'var(--color-koral-muda)' },
  { name: 'Type', w: 34, fill: 'var(--color-kabut)' },
  { name: 'Data', w: 50, fill: 'var(--color-biru-muda)' },
  { name: 'FCS', w: 36, fill: 'var(--color-kabut)' },
].map((f, i, all) => ({
  ...f,
  x: 4 + all.slice(0, i).reduce((sum, p) => sum + p.w, 0),
}))

/** 802.1Q inserts a 4-byte tag after the source MAC; the tag carries a 12-bit VLAN ID. */
export const Dot1qTag: FC = () => {
  return (
    <svg
      viewBox="0 0 300 190"
      role="img"
      aria-label="Frame dengan tag 802.1Q. Setelah MAC tujuan dan MAC sumber disisipkan tag 4 byte, lalu field type, data, dan FCS yang dihitung ulang. Tag berisi TPID 0x8100 sepanjang 16 bit, priority 3 bit, satu bit CFI, dan VLAN ID 12 bit, sehingga nomor VLAN bisa 0 sampai 4095."
      className="w-full font-display"
    >
      {FIELDS.map(({ x, ...f }) => (
        <g key={f.name}>
          <rect
            x={x}
            y={10}
            width={f.w - 2}
            height={44}
            rx={4}
            fill={f.fill}
            stroke="var(--color-kabut-dalam)"
          />
          <text
            x={x + f.w / 2 - 1}
            y={36}
            fontSize={12}
            textAnchor="middle"
            {...label}
          >
            {f.name.split(" ")[0]}
          </text>
          {f.name.includes(" ") && (
            <text
              x={x + f.w / 2 - 1}
              y={50}
              fontSize={12}
              textAnchor="middle"
              {...quiet}
            >
              {f.name.split(" ").slice(1).join(" ")}
            </text>
          )}
        </g>
      ))}
      <path
        d="M108 54 L20 86 M168 54 L280 86"
        stroke="var(--color-koral-dalam)"
        strokeWidth={1.2}
        fill="none"
      />
      <rect
        x={20}
        y={86}
        width={110}
        height={40}
        rx={4}
        fill="var(--color-koral-muda)"
      />
      <rect
        x={130}
        y={86}
        width={40}
        height={40}
        rx={4}
        fill="var(--color-matahari-muda)"
      />
      <rect
        x={170}
        y={86}
        width={110}
        height={40}
        rx={4}
        fill="var(--color-mint-muda)"
      />
      <text x={75} y={104} fontSize={12} textAnchor="middle" {...label}>
        TPID 0x8100
      </text>
      <text x={75} y={119} fontSize={12} textAnchor="middle" {...quiet}>
        16 bit
      </text>
      <text x={150} y={104} fontSize={12} textAnchor="middle" {...label}>
        PRI
      </text>
      <text x={150} y={119} fontSize={12} textAnchor="middle" {...quiet}>
        3 bit
      </text>
      <text x={225} y={104} fontSize={12} textAnchor="middle" {...label}>
        VLAN ID
      </text>
      <text x={225} y={119} fontSize={12} textAnchor="middle" {...quiet}>
        12 bit
      </text>
      <text x={4} y={156} fontSize={12} {...label}>
        FCS dihitung ulang setelah tag disisipkan
      </text>
      <text x={4} y={176} fontSize={12} {...quiet}>
        Satu bit CFI di antara PRI dan VLAN ID
      </text>
    </svg>
  )
}
