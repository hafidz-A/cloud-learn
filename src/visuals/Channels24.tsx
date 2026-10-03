import type { FC } from 'react'
import { label, quiet } from './styles'

/** 2.4 GHz: 22 MHz-wide channels 5 MHz apart, so only 1, 6, and 11 do not overlap. */
export const Channels24: FC = () => {
  const x = (ch: number) => 14 + (ch - 1) * 21.5
  const arc = (ch: number) => `M${x(ch) - 47} 120 Q${x(ch)} 10 ${x(ch) + 47} 120`
  return (
    <svg
      viewBox="0 0 300 190"
      role="img"
      aria-label="Band 2,4 GHz. Setiap channel lebarnya sekitar 22 MHz, tapi jarak antar channel hanya 5 MHz, jadi channel yang berdekatan saling tumpang tindih. Hanya channel 1, 6, dan 11 yang tidak saling tumpang tindih, ditandai dengan warna tebal. Channel lain, misalnya 3, menimpa channel 1 dan 6."
      className="w-full font-display"
    >
      <path d={arc(3)} fill="none" stroke="var(--color-kabut-dalam)" strokeWidth={1.5} strokeDasharray="4 3" />
      <path d={arc(9)} fill="none" stroke="var(--color-kabut-dalam)" strokeWidth={1.5} strokeDasharray="4 3" />
      {[1, 6, 11].map((ch, i) => (
        <path key={ch} d={arc(ch)} fill={['var(--color-biru-muda)', 'var(--color-mint-muda)', 'var(--color-matahari-muda)'][i]} fillOpacity={0.8} stroke={['var(--color-biru-dalam)', 'var(--color-mint-dalam)', 'var(--color-matahari-dalam)'][i]} strokeWidth={2} />
      ))}
      <line x1={4} y1={120} x2={296} y2={120} stroke="var(--color-tinta-lembut)" strokeWidth={1.2} />
      {Array.from({ length: 11 }, (_, i) => i + 1).map((ch) => (
        <text key={ch} x={x(ch)} y={137} fontSize={12} textAnchor="middle" {...([1, 6, 11].includes(ch) ? label : quiet)}>
          {ch}
        </text>
      ))}
      <text x={4} y={160} fontSize={12} {...label}>
        Tidak tumpang tindih: 1, 6, 11
      </text>
      <text x={4} y={180} fontSize={12} {...quiet}>
        Garis putus-putus: channel 3 dan 9
      </text>
    </svg>
  )
}
