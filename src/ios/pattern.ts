// Command patterns for the IOS simulator (LANGIT_CCNA_PLAN.md section 7).
//
// A pattern is written as words separated by spaces:
//   sh[ow]          keyword "show", accepted from "sh" up to "show"
//   brief           keyword that must be typed in full
//   <ip>            a parameter (see ParamKind); <num:1-4094> carries a range
//   { a | b c }     one of the alternatives
//   ?( ... )        an optional group
// Matching is case-insensitive for keywords. Parameters keep what was typed,
// normalized (interface names spelled out, IPv6 in lowercase).

export type ParamKind =
  | 'ip' // 192.0.2.1
  | 'mask' // contiguous mask, 255.255.255.0
  | 'wild' // wildcard, 0.0.0.255
  | 'ipv6' // 2001:db8::1
  | 'ipv6p' // 2001:db8::/64
  | 'num' // integer, optional range
  | 'dec' // decimal such as 20.00
  | 'word' // one token, as typed
  | 'line' // the rest of the line, as typed
  | 'if' // one interface (one or two tokens)
  | 'ifrange' // interface range: the rest of the line
  | 'vlans' // 10,20,30-40
  | 'mac' // 0050.7966.6800
  | 'port' // TCP or UDP port number or name
  | 'level' // syslog level, name or 0-7

export type PatToken =
  | { t: 'kw'; full: string; min: number }
  | { t: 'param'; kind: ParamKind; lo?: number; hi?: number }
  | { t: 'alt'; options: PatToken[][] }
  | { t: 'opt'; seq: PatToken[] }

export function parsePattern(text: string): PatToken[] {
  const words = text.trim().split(/\s+/)
  let i = 0
  const seq = (end: string[]): PatToken[] => {
    const out: PatToken[] = []
    while (i < words.length && !end.includes(words[i])) {
      const w = words[i++]
      if (w === '{') {
        const options: PatToken[][] = [seq(['|', '}'])]
        while (words[i] === '|') {
          i++
          options.push(seq(['|', '}']))
        }
        if (words[i++] !== '}') throw new Error(`unclosed { in "${text}"`)
        out.push({ t: 'alt', options })
      } else if (w === '?(') {
        const inner = seq([')'])
        if (words[i++] !== ')') throw new Error(`unclosed ?( in "${text}"`)
        out.push({ t: 'opt', seq: inner })
      } else if (w.startsWith('<')) {
        const m = /^<([a-z0-9]+)(?::(\d+)-(\d+))?>$/.exec(w)
        if (!m) throw new Error(`bad parameter ${w} in "${text}"`)
        out.push({ t: 'param', kind: m[1] as ParamKind, ...(m[2] ? { lo: Number(m[2]), hi: Number(m[3]) } : {}) })
      } else {
        const m = /^([^[\]]+)(?:\[([^\]]+)\])?$/.exec(w)
        if (!m) throw new Error(`bad keyword ${w} in "${text}"`)
        out.push({ t: 'kw', full: (m[1] + (m[2] ?? '')).toLowerCase(), min: m[1].length })
      }
    }
    return out
  }
  const out = seq([])
  if (i !== words.length) throw new Error(`unexpected "${words[i]}" in "${text}"`)
  return out
}

// ---------------------------------------------------------------- values

export function parseIpv4(s: string): number[] | null {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(s)
  if (!m) return null
  const parts = m.slice(1).map(Number)
  return parts.every((p) => p <= 255) ? parts : null
}

export const ipToInt = (p: number[]) => ((p[0] << 24) >>> 0) + (p[1] << 16) + (p[2] << 8) + p[3]

/** Prefix length of a contiguous mask, or -1. */
export function maskLength(s: string): number {
  const p = parseIpv4(s)
  if (!p) return -1
  const n = ipToInt(p)
  const len = 32 - Math.log2((~n >>> 0) + 1)
  return Number.isInteger(len) ? len : -1
}

/** 128-bit IPv6 address as 8 groups, or null. */
export function parseIpv6(s: string): number[] | null {
  if (!/^[0-9a-fA-F:.]+$/.test(s) || s.includes(':::')) return null
  const halves = s.split('::')
  if (halves.length > 2) return null
  const groups = (part: string) => (part ? part.split(':') : [])
  const head = groups(halves[0])
  const tail = halves.length === 2 ? groups(halves[1]) : []
  if (head.concat(tail).some((g) => !/^[0-9a-fA-F]{1,4}$/.test(g))) return null
  const missing = 8 - head.length - tail.length
  if (halves.length === 1 ? missing !== 0 : missing < 1) return null
  return [...head, ...Array(halves.length === 2 ? missing : 0).fill('0'), ...tail].map((g) => parseInt(g, 16))
}

/** RFC 5952 text: lowercase, no leading zeros, the longest run of 2+ zero groups as "::". */
export function formatIpv6(groups: number[]): string {
  let best = -1
  let bestLen = 1
  for (let i = 0; i < 8; i++) {
    let j = i
    while (j < 8 && groups[j] === 0) j++
    if (j - i > bestLen) {
      best = i
      bestLen = j - i
    }
    i = j
  }
  const hex = groups.map((g) => g.toString(16))
  if (best < 0) return hex.join(':')
  return `${hex.slice(0, best).join(':')}::${hex.slice(best + bestLen).join(':')}`
}

const PORT_NAMES: Record<string, number> = {
  'ftp-data': 20,
  ftp: 21,
  telnet: 23,
  smtp: 25,
  domain: 53,
  bootps: 67,
  bootpc: 68,
  tftp: 69,
  www: 80,
  pop3: 110,
  ntp: 123,
  snmp: 161,
  snmptrap: 162,
}

/** Port names IOS prints instead of the number (TCP/UDP well-known ports). */
export const PORT_NAME_OF: Record<number, string> = Object.fromEntries(Object.entries(PORT_NAMES).map(([k, v]) => [v, k]))

export const LEVELS = ['emergencies', 'alerts', 'critical', 'errors', 'warnings', 'notifications', 'informational', 'debugging']

// ---------------------------------------------------------------- interfaces

type IfType = { full: string; min: number; virtual?: boolean }

/** Interface types and the shortest form the simulator accepts (see the plan: well-known abbreviations only). */
export const IF_TYPES: IfType[] = [
  { full: 'GigabitEthernet', min: 1 },
  { full: 'FastEthernet', min: 1 },
  { full: 'TenGigabitEthernet', min: 2 },
  { full: 'Loopback', min: 2, virtual: true },
  { full: 'Vlan', min: 2, virtual: true },
  { full: 'Port-channel', min: 2, virtual: true },
  { full: 'Tunnel', min: 2, virtual: true },
]

/** The short name IOS uses in show output columns: Gi0/0/0, Fa0/1, Po1. */
export function shortIf(name: string): string {
  return name
    .replace(/^GigabitEthernet/, 'Gi')
    .replace(/^FastEthernet/, 'Fa')
    .replace(/^TenGigabitEthernet/, 'Te')
    .replace(/^Port-channel/, 'Po')
    .replace(/^Loopback/, 'Lo')
}

/** "g0/0/0" or ("gigabitethernet", "0/0/0") -> "GigabitEthernet0/0/0". Null when the type is unknown or too short. */
export function parseInterface(typeText: string, numText = ''): { name: string; type: IfType } | null | 'short' {
  const m = /^([a-zA-Z-]+)([\d/.]*)$/.exec(typeText)
  if (!m) return null
  const t = m[1].toLowerCase()
  const num = m[2] || numText
  if (!num || !/^\d+(\/\d+)*(\.\d+)?$/.test(num)) return null
  const type = IF_TYPES.find((x) => x.full.toLowerCase().startsWith(t))
  if (!type) return null
  if (t.length < type.min) return 'short'
  return { name: type.full + num, type }
}
