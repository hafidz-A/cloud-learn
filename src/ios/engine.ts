import { COMMANDS, PROMPTS, type CmdDef, type Mode, type Model } from './commands'
import {
  IF_TYPES,
  LEVELS,
  PORT_NAME_OF,
  formatIpv6,
  ipToInt,
  maskLength,
  parseInterface,
  parseIpv4,
  parseIpv6,
  shortIf,
  type PatToken,
} from './pattern'

// The IOS simulator (LANGIT_CCNA_PLAN.md section 7). A session is replayed from
// the lines the player typed, so the same function draws the terminal, judges
// the answer, and checks the answer key in the validator.
//
// Honesty rules: IOS messages (% Invalid input, % Incomplete command, Bad mask)
// only come for commands the simulator knows. Anything else gets a message
// marked as Langit's, because on a real device it may well be valid.

export type { Mode, Model }

export type IosSetup = {
  hostname: string
  model: Model
  /** Where the session starts. Default: privileged EXEC. */
  start?: 'user' | 'priv' | 'config'
  /** Configuration already on the device, as commands per context ("" or omitted: global). */
  given?: { context?: string; lines: string[] }[]
  /** Output of exec commands, keyed by the full command ("show ip route", "ping 192.0.2.1"). */
  outputs?: Record<string, string>
  /** Physical interfaces with a cable to a powered device: they come up after "no shutdown". */
  cabled?: string[]
}

export type TermLine =
  /** A typed line. `hidden`: not shown, like a password or the Enter that answers a question. */
  | { kind: 'in'; prompt: string; text: string; hidden?: boolean }
  | { kind: 'out'; text: string }
  | { kind: 'langit'; text: string }

type Pending =
  | { kind: 'password'; tries: number }
  | { kind: 'confirm-save' }
  | { kind: 'return' }
  | { kind: 'banner'; delim: string; text: string[] }

type AclEntry = { seq: number; line: string }

export type DeviceState = {
  model: Model
  hostname: string
  mode: Mode
  /** Where config lines go: [""] for global, several interfaces for "interface range". */
  contexts: string[]
  /** Context -> slot -> line. Insertion order is kept. */
  config: Map<string, Map<string, string>>
  /** Named access lists, with sequence numbers. */
  acls: Map<string, AclEntry[]>
  /** Exec commands that ran, in full form. */
  ran: string[]
  pending: Pending | null
  saved: string | null
  rsa: boolean
  cabled: Set<string>
  outputs: Record<string, string>
}

// ---------------------------------------------------------------- the device

export const PHYSICAL: Record<Model, string[]> = {
  isr4331: ['GigabitEthernet0/0/0', 'GigabitEthernet0/0/1', 'GigabitEthernet0/0/2'],
  c2960: [...Array.from({ length: 24 }, (_, i) => `FastEthernet0/${i + 1}`), 'GigabitEthernet0/1', 'GigabitEthernet0/2'],
  c3650: [...Array.from({ length: 24 }, (_, i) => `GigabitEthernet1/0/${i + 1}`), ...Array.from({ length: 4 }, (_, i) => `GigabitEthernet1/1/${i + 1}`)],
}

const isSwitch = (m: Model) => m !== 'isr4331'
const ifName = (context: string) => context.replace(/^interface /, '')
const isPhysical = (st: DeviceState, name: string) => PHYSICAL[st.model].includes(name)

/** The value a slot has when nothing was configured (LANGIT_CCNA_PLAN.md section 7: platform defaults). */
function defaultLine(st: Pick<DeviceState, 'model'>, context: string, slot: string): string | undefined {
  if (context.startsWith('interface ')) {
    const name = ifName(context)
    if (slot === 'shutdown') return (st.model === 'isr4331' && PHYSICAL.isr4331.includes(name)) || name === 'Vlan1' ? 'shutdown' : 'no shutdown'
    if (slot === 'switchport' && st.model === 'c3650' && PHYSICAL.c3650.includes(name)) return 'switchport'
    if (slot === 'cdp enable') return 'cdp enable'
    if (slot === 'lldp transmit') return 'lldp transmit'
    if (slot === 'lldp receive') return 'lldp receive'
    if (slot === 'mdix auto' && isSwitch(st.model)) return 'mdix auto'
    return undefined
  }
  if (context) return undefined
  switch (slot) {
    case 'cdp run':
      return 'cdp run'
    case 'lldp run':
      return 'no lldp run'
    case 'ip domain lookup':
      return 'ip domain lookup'
    case 'ip routing':
      return st.model === 'isr4331' ? 'ip routing' : 'no ip routing'
    case 'ipv6 unicast-routing':
      return 'no ipv6 unicast-routing'
    case 'service password-encryption':
      return 'no service password-encryption'
    case 'ip dhcp snooping information option':
      return 'ip dhcp snooping information option'
  }
  return undefined
}

function effective(st: DeviceState, context: string, slot: string): string | undefined {
  return st.config.get(context)?.get(slot) ?? defaultLine(st, context, slot)
}

function ensure(st: DeviceState, context: string): Map<string, string> {
  let c = st.config.get(context)
  if (!c) st.config.set(context, (c = new Map()))
  return c
}

export function promptOf(st: Pick<DeviceState, 'hostname' | 'mode' | 'contexts'>): string {
  if (st.mode === 'sgroup') return `${st.hostname}${st.contexts[0]?.includes('tacacs+') ? '(config-sg-tacacs+)#' : '(config-sg-radius)#'}`
  return st.hostname + PROMPTS[st.mode]
}

// ---------------------------------------------------------------- matching

type InTok = { text: string; start: number }

function tokenize(raw: string): InTok[] {
  const out: InTok[] = []
  const re = /\S+/g
  for (let m = re.exec(raw); m; m = re.exec(raw)) out.push({ text: m[0], start: m.index })
  return out
}

type Value = string
type Partial = { ii: number; words: Value[] }

type Trace = {
  /** Furthest input token where a keyword did not fit, or a word was left over. */
  failAt: number
  /** Furthest input token where a value (address, number, interface) was not valid. */
  valueFailAt: number
  /** The input ran out while a pattern wanted more. */
  incomplete: boolean
  /** A keyword typed shorter than the simulator accepts: token index and the keyword. */
  short?: { at: number; full: string; min: number }
}

function matchParam(st: Pick<DeviceState, 'model'>, kind: PatToken & { t: 'param' }, toks: InTok[], ii: number, raw: string): { n: number; value: string } | null | 'short' {
  const tok = toks[ii]
  if (!tok) return null
  const text = tok.text
  switch (kind.kind) {
    case 'ip':
      return parseIpv4(text) ? { n: 1, value: parseIpv4(text)!.join('.') } : null
    case 'mask':
    case 'wild':
      return parseIpv4(text) ? { n: 1, value: parseIpv4(text)!.join('.') } : null
    case 'ipv6': {
      const g = parseIpv6(text)
      return g ? { n: 1, value: formatIpv6(g) } : null
    }
    case 'ipv6p': {
      const [addr, len, extra] = text.split('/')
      const g = parseIpv6(addr)
      if (!g || extra !== undefined || !/^\d{1,3}$/.test(len ?? '') || Number(len) > 128) return null
      return { n: 1, value: `${formatIpv6(g)}/${Number(len)}` }
    }
    case 'num': {
      if (!/^\d+$/.test(text)) return null
      const n = Number(text)
      if (kind.lo !== undefined && (n < kind.lo || n > kind.hi!)) return null
      return { n: 1, value: String(n) }
    }
    case 'dec':
      return /^\d{1,3}(\.\d{1,2})?$/.test(text) && Number(text) <= 100 ? { n: 1, value: Number(text).toFixed(2) } : null
    case 'word':
      return { n: 1, value: text }
    case 'line':
      return { n: toks.length - ii, value: raw.slice(tok.start).trim() }
    case 'mac':
      return /^[0-9a-fA-F]{4}\.[0-9a-fA-F]{4}\.[0-9a-fA-F]{4}$/.test(text) ? { n: 1, value: text.toLowerCase() } : null
    case 'port': {
      if (/^\d+$/.test(text) && Number(text) <= 65535) return { n: 1, value: PORT_NAME_OF[Number(text)] ?? String(Number(text)) }
      const named = Object.values(PORT_NAME_OF).includes(text.toLowerCase())
      return named ? { n: 1, value: text.toLowerCase() } : null
    }
    case 'level': {
      if (/^[0-7]$/.test(text)) return { n: 1, value: LEVELS[Number(text)] }
      const lvl = LEVELS.find((l) => l.startsWith(text.toLowerCase()) && text.length >= 3)
      return lvl ? { n: 1, value: lvl } : null
    }
    case 'vlans': {
      if (!/^\d+(-\d+)?(,\d+(-\d+)?)*$/.test(text)) return null
      const ok = text.split(/[,-]/).every((v) => Number(v) >= 1 && Number(v) <= 4094)
      return ok ? { n: 1, value: text } : null
    }
    case 'if': {
      const two = toks[ii + 1]
      let parsed = parseInterface(text)
      let n = 1
      if (parsed === null && /^[a-zA-Z-]+$/.test(text) && two) {
        parsed = parseInterface(text, two.text)
        n = 2
      }
      if (parsed === 'short') return 'short'
      if (!parsed) return null
      return validInterface(st, parsed.name) ? { n, value: parsed.name } : null
    }
    case 'ifrange': {
      const names = parseRange(st, raw.slice(tok.start))
      return names ? { n: toks.length - ii, value: names.join(',') } : null
    }
  }
}

function validInterface(st: Pick<DeviceState, 'model'>, name: string): boolean {
  const sub = /^(.*?)\.(\d+)$/.exec(name)
  if (sub) return st.model === 'isr4331' && PHYSICAL.isr4331.includes(sub[1]) && Number(sub[2]) >= 1 && Number(sub[2]) <= 4294967295
  if (PHYSICAL[st.model].includes(name)) return true
  const type = IF_TYPES.find((t) => name.startsWith(t.full) && /^\d+$/.test(name.slice(t.full.length)))
  if (!type?.virtual) return false
  const num = Number(name.slice(type.full.length))
  if (type.full === 'Vlan') return isSwitch(st.model) && num >= 1 && num <= 4094
  if (type.full === 'Port-channel') return num >= 1 && num <= 48
  return num >= 0 && num <= 2147483647
}

/** "f0/1 - 12, f0/20" -> the interfaces it covers, or null. */
function parseRange(st: Pick<DeviceState, 'model'>, text: string): string[] | null {
  const out: string[] = []
  for (const part of text.split(',').map((p) => p.trim())) {
    const m = /^([a-zA-Z-]+)\s*([\d/]+?)(\d+)\s*(?:-\s*(\d+))?$/.exec(part)
    if (!m) return null
    const parsed = parseInterface(m[1], `${m[2]}${m[3]}`)
    if (!parsed || parsed === 'short') return null
    const prefix = parsed.name.slice(0, parsed.name.length - m[3].length)
    const from = Number(m[3])
    const to = m[4] ? Number(m[4]) : from
    if (to < from) return null
    for (let n = from; n <= to; n++) {
      if (!validInterface(st, prefix + n)) return null
      out.push(prefix + n)
    }
  }
  return out.length ? out : null
}

/** Every way `pat` (from `pi`) can match the input (from `ii`), with what failed along the way. */
function matchSeq(st: Pick<DeviceState, 'model'>, pat: PatToken[], pi: number, toks: InTok[], ii: number, raw: string, trace: Trace): Partial[] {
  if (pi === pat.length) {
    // Words left over after a complete pattern: the simulator does not know them.
    if (ii < toks.length) trace.failAt = Math.max(trace.failAt, ii)
    return [{ ii, words: [] }]
  }
  const p = pat[pi]
  const rest = (n: number, word: string | null): Partial[] =>
    matchSeq(st, pat, pi + 1, toks, ii + n, raw, trace).map((r) => ({ ii: r.ii, words: word === null ? r.words : [word, ...r.words] }))

  if (ii >= toks.length) {
    // Optional groups may be skipped at the end; anything else is missing.
    if (p.t === 'opt') return rest(0, null)
    trace.incomplete = true
    return []
  }
  const fail = () => {
    trace.failAt = Math.max(trace.failAt, ii)
    return []
  }
  switch (p.t) {
    case 'kw': {
      const t = toks[ii].text.toLowerCase()
      if (p.full.startsWith(t) && t.length >= p.min) return rest(1, p.full)
      if (p.full.startsWith(t) && t.length < p.min && (!trace.short || ii >= trace.short.at)) trace.short = { at: ii, full: p.full, min: p.min }
      return fail()
    }
    case 'param': {
      const m = matchParam(st, p, toks, ii, raw)
      if (m === 'short') {
        if (!trace.short || ii >= trace.short.at) trace.short = { at: ii, full: 'interface name', min: 0 }
        return fail()
      }
      if (!m) {
        trace.valueFailAt = Math.max(trace.valueFailAt, ii)
        return []
      }
      return rest(m.n, m.value)
    }
    case 'alt':
      return p.options.flatMap((opt) => matchSeq(st, [...opt, ...pat.slice(pi + 1)], 0, toks, ii, raw, trace))
    case 'opt':
      return [...matchSeq(st, [...p.seq, ...pat.slice(pi + 1)], 0, toks, ii, raw, trace), ...rest(0, null)]
  }
}

type Found = { def: CmdDef; words: string[] }

type Lookup =
  | { ok: Found }
  /** A value the IOS parser would reject: the simulator is sure. */
  | { err: 'invalid'; at: number }
  /** A word the simulator does not know at this point: IOS may know it. */
  | { err: 'unsupported'; at: number }
  | { err: 'incomplete'; def: CmdDef; words: string[] }
  | { err: 'short'; at: number; full: string; min: number }
  | { err: 'unknown' }

/** The command `toks` is, among `defs`; or what went wrong, IOS style where the simulator is sure. */
function lookup(st: Pick<DeviceState, 'model'>, defs: CmdDef[], toks: InTok[], raw: string, { allowPrefix = false } = {}): Lookup {
  let failAt = -1
  let valueFailAt = -1
  let incomplete: CmdDef | undefined
  let short: Trace['short']
  for (const def of defs) {
    const trace: Trace = { failAt: -1, valueFailAt: -1, incomplete: false }
    const full = matchSeq(st, def.tokens, 0, toks, 0, raw, trace).find((r) => r.ii === toks.length)
    if (full) return { ok: { def, words: full.words } }
    failAt = Math.max(failAt, trace.failAt)
    valueFailAt = Math.max(valueFailAt, trace.valueFailAt)
    if (trace.incomplete && !incomplete) incomplete = def
    if (trace.short && (!short || trace.short.at > short.at)) short = trace.short
  }
  // Everything typed fits the start of a command: IOS calls that incomplete.
  if (incomplete) return { err: 'incomplete', def: incomplete, words: allowPrefix ? prefixWords(incomplete, toks) : [] }
  if (short && short.at >= Math.max(failAt, valueFailAt)) return { err: 'short', ...short }
  if (valueFailAt > 0 && valueFailAt >= failAt) return { err: 'invalid', at: valueFailAt }
  if (failAt > 0) return { err: 'unsupported', at: failAt }
  return { err: 'unknown' }
}

/** The canonical words of the part of a "no" command that was typed (keywords spelled out). */
function prefixWords(def: CmdDef, toks: InTok[]): string[] {
  const words: string[] = []
  let ti = 0
  for (const p of def.tokens) {
    if (ti >= toks.length) break
    if (p.t !== 'kw') {
      words.push(toks[ti].text)
      ti++
      continue
    }
    words.push(p.full)
    ti++
  }
  return words
}

// ---------------------------------------------------------------- canonical lines

function slotOf(def: CmdDef, words: string[]): string | undefined {
  return def.slot?.replace(/\$(\d+)/g, (_, n: string) => words[Number(n)] ?? '')
}

/** Standard ACLs drop "host" and a zero wildcard; addresses are masked by their wildcard, as IOS stores them. */
function canonAcl(words: string[], standard: boolean): string[] {
  const out: string[] = []
  for (let i = 0; i < words.length; i++) {
    const w = words[i]
    const next = words[i + 1]
    const ip = parseIpv4(w)
    if (w === 'host' && next && parseIpv4(next)) {
      out.push(...(standard ? [next] : ['host', next]))
      i++
    } else if (ip && next && parseIpv4(next) && i > 0 && words[i - 1] !== 'host') {
      const wild = ipToInt(parseIpv4(next)!)
      if (wild === 0) out.push(...(standard ? [w] : ['host', w]))
      else if (wild === 0xffffffff) out.push('any')
      else {
        const masked = (ipToInt(ip) & ~wild) >>> 0
        out.push([masked >>> 24, (masked >>> 16) & 255, (masked >>> 8) & 255, masked & 255].join('.'), next)
      }
      i++
    } else out.push(w)
  }
  return out
}

function canonical(def: CmdDef, words: string[]): string {
  let w = def.rewrite ? def.rewrite(words) : words
  if (def.special === 'acl-entry' && !w.includes('remark')) {
    const standard = w[0] === 'access-list' ? Number(w[1]) < 100 || (Number(w[1]) >= 1300 && Number(w[1]) <= 1999) : def.modes.includes('stdacl')
    w = canonAcl(w, standard)
  }
  return w.join(' ')
}

// ---------------------------------------------------------------- running a session

const out = (text: string): TermLine => ({ kind: 'out', text })
const langit = (text: string): TermLine => ({ kind: 'langit', text })

function invalid(raw: string, prompt: string, at: number, toks: InTok[]): TermLine[] {
  const col = prompt.length + (toks[at]?.start ?? raw.length)
  return [out(`${' '.repeat(col)}^`), out("% Invalid input detected at '^' marker.")]
}

const EXEC_DEFS = COMMANDS.filter((d) => d.modes.includes('priv') || d.modes.includes('user'))
const configDefs = (mode: Mode) => COMMANDS.filter((d) => d.modes.includes(mode))

export function newDevice(setup: IosSetup): DeviceState {
  const st: DeviceState = {
    model: setup.model,
    hostname: setup.hostname,
    mode: 'config',
    contexts: [''],
    config: new Map([['', new Map()]]),
    acls: new Map(),
    ran: [],
    pending: null,
    saved: null,
    rsa: false,
    cabled: new Set(setup.cabled ?? []),
    outputs: setup.outputs ?? {},
  }
  for (const name of PHYSICAL[setup.model]) ensure(st, `interface ${name}`)
  if (isSwitch(setup.model)) ensure(st, 'interface Vlan1')
  // The given configuration goes in quietly, through the same rules as typed commands.
  for (const block of setup.given ?? []) {
    st.mode = 'config'
    st.contexts = ['']
    if (block.context) step(st, block.context)
    for (const line of block.lines) step(st, line)
  }
  st.mode = setup.start === 'user' ? 'user' : setup.start === 'config' ? 'config' : 'priv'
  st.contexts = ['']
  st.ran = []
  return st
}

const leaveConfig = (st: DeviceState) => {
  st.mode = 'priv'
  st.contexts = ['']
}

/** Runs one typed line; returns what the terminal prints after it. */
export function step(st: DeviceState, raw: string): TermLine[] {
  const pending = st.pending
  if (pending) return answerPending(st, pending, raw)
  const text = raw.trim()
  if (!text) return []
  if (/\?\s*$/.test(text)) return [langit('Langit: bantuan "?" tidak ada di simulator ini. Buka "Lihat materi" untuk daftar perintahnya.')]

  // Output filters: "show running-config | include ospf".
  const pipe = /\s\|\s*(\S+)\s+(.+)$/.exec(raw)
  const line = pipe ? raw.slice(0, pipe.index) : raw
  const toks = tokenize(line)
  const prompt = promptOf(st)

  if (st.mode === 'user' || st.mode === 'priv') {
    const found = lookup(st, EXEC_DEFS, toks, line)
    if (!('ok' in found)) return reportError(found, line, prompt, toks, st)
    const { def, words } = found.ok
    if (st.mode === 'user' && def.privOnly) {
      // These need privileged EXEC on a real device too.
      return [...invalid(line, prompt, toks[0].text.toLowerCase().startsWith('sh') ? 1 : 0, toks), langit('Langit: perintah ini butuh privileged EXEC. Ketik enable dulu.')]
    }
    if (def.kind === 'nav') return nav(st, def, words)
    return runExec(st, def, words, pipe ? { op: pipe[1], text: pipe[2] } : null)
  }

  // Configuration modes: "no" first, then the current mode, then global config (as IOS does).
  let negate = false
  let body = toks
  if (toks[0].text.toLowerCase() === 'no' && toks.length > 1) {
    negate = true
    body = toks.slice(1)
  }
  const tryModes: Mode[] = st.mode === 'config' ? ['config'] : [st.mode, 'config']
  let lastError: Lookup | undefined
  // Named ACLs take an optional sequence number first ("15 permit ..."), and "no 15" deletes it.
  if ((st.mode === 'stdacl' || st.mode === 'extacl') && /^\d+$/.test(body[0]?.text ?? '')) {
    const seq = Number(body[0].text)
    if (negate && body.length === 1) {
      const list = st.acls.get(st.contexts[0]) ?? []
      st.acls.set(st.contexts[0], list.filter((e) => e.seq !== seq))
      return []
    }
    const found = lookup(st, configDefs(st.mode).filter((d) => d.special === 'acl-entry'), body.slice(1), line)
    if ('ok' in found) return addAcl(st, canonical(found.ok.def, found.ok.words), seq)
    return reportError(found, line, prompt, toks, st, 1 + (negate ? 1 : 0))
  }
  for (const mode of tryModes) {
    const defs = configDefs(mode)
    const found = lookup(st, negate ? defs.filter((d) => !d.noNo) : defs, body, line, { allowPrefix: negate })
    if ('ok' in found) {
      const { def } = found.ok
      if (def.only && !def.only.includes(st.model)) return [notOnModel(st)]
      if (mode === 'config' && st.mode !== 'config' && def.kind !== 'nav') {
        st.mode = 'config'
        st.contexts = ['']
      }
      return apply(st, def, found.ok.words, negate)
    }
    if ('err' in found && found.err === 'incomplete' && negate && found.words.length) {
      if (found.def.only && !found.def.only.includes(st.model)) return [notOnModel(st)]
      if (mode === 'config' && st.mode !== 'config') {
        st.mode = 'config'
        st.contexts = ['']
      }
      return removeByPrefix(st, found.def, found.words)
    }
    if (!lastError || rank(found) > rank(lastError)) lastError = found
  }
  // An exec command typed in config mode: IOS rejects it at its first word.
  if (lookup(st, EXEC_DEFS, toks, line).hasOwnProperty('ok')) {
    return [...invalid(line, prompt, 0, toks), langit(`Langit: di mode konfigurasi, jalankan perintah EXEC dengan awalan do, misalnya "do ${text}".`)]
  }
  return reportError(lastError!, line, prompt, toks, st, negate ? 1 : 0)
}

const MODEL_NAMES: Record<Model, string> = { isr4331: 'router ISR4331', c2960: 'switch 2960', c3650: 'switch 3650' }
const notOnModel = (st: DeviceState) => langit(`Langit: perintah ini tidak tersedia untuk ${MODEL_NAMES[st.model]} di simulator ini.`)

const rank = (l: Lookup) => ('ok' in l ? 9 : l.err === 'short' ? 4 : l.err === 'incomplete' ? 3 : l.err === 'invalid' || l.err === 'unsupported' ? 1 + l.at / 1000 : 0)

function reportError(found: Lookup, raw: string, prompt: string, toks: InTok[], _st: DeviceState, offset = 0): TermLine[] {
  if ('ok' in found) return []
  switch (found.err) {
    case 'invalid':
      return invalid(raw, prompt, found.at + offset, toks)
    case 'incomplete':
      return [out('% Incomplete command.')]
    case 'unsupported':
      return [langit(`Langit: kata "${toks[found.at + offset]?.text}" tidak dikenal simulator di perintah ini. Di perangkat asli bisa saja valid, tapi latihan ini tidak membutuhkannya.`)]
    case 'short':
      return [
        langit(
          found.full === 'interface name'
            ? 'Langit: tulis nama interface minimal seperti g0/0/0, fa0/1, gi1/0/1, lo0, vl10, atau po1.'
            : `Langit: singkatan "${toks[found.at + offset]?.text}" mungkin diterima IOS asli kalau unik, tapi simulator ini hanya menerima mulai dari "${found.full.slice(0, found.min)}". Ketik "${found.full}".`,
        ),
      ]
    case 'unknown':
      return [langit('Langit: perintah ini tidak dikenal simulator. Di perangkat asli bisa saja valid, tapi latihan ini tidak membutuhkannya.')]
  }
}

function nav(st: DeviceState, def: CmdDef, words: string[]): TermLine[] {
  switch (def.nav) {
    case 'enable': {
      if (st.mode === 'priv') return []
      const secret = effective(st, '', 'enable secret') ?? effective(st, '', 'enable password')
      if (secret) {
        st.pending = { kind: 'password', tries: 0 }
        return [out('Password: ')]
      }
      st.mode = 'priv'
      return []
    }
    case 'disable':
      st.mode = 'user'
      return []
    case 'conft':
      st.mode = 'config'
      st.contexts = ['']
      return [out('Enter configuration commands, one per line.  End with CNTL/Z.')]
    case 'end':
      leaveConfig(st)
      return [out('%SYS-5-CONFIG_I: Configured from console by console')]
    case 'exit':
      if (st.mode === 'user' || st.mode === 'priv') {
        st.pending = { kind: 'return' }
        st.mode = 'user'
        return [out(`${st.hostname} con0 is now available`), out(''), out('Press RETURN to get started.')]
      }
      if (st.mode === 'config') {
        leaveConfig(st)
        return [out('%SYS-5-CONFIG_I: Configured from console by console')]
      }
      st.mode = 'config'
      st.contexts = ['']
      return []
    case 'do': {
      const mode = st.mode
      const contexts = st.contexts
      st.mode = 'priv'
      const lines = step(st, words[1])
      st.mode = mode
      st.contexts = contexts
      return lines
    }
  }
  return []
}

function answerPending(st: DeviceState, pending: Pending, raw: string): TermLine[] {
  switch (pending.kind) {
    case 'password': {
      const secret = effective(st, '', 'enable secret')?.replace(/^enable secret /, '') ?? effective(st, '', 'enable password')?.replace(/^enable password /, '')
      if (raw === secret) {
        st.pending = null
        st.mode = 'priv'
        return []
      }
      if (pending.tries >= 2) {
        st.pending = null
        return [out('% Bad secrets')]
      }
      st.pending = { kind: 'password', tries: pending.tries + 1 }
      return [out('Password: ')]
    }
    case 'confirm-save':
      st.pending = null
      if (raw.trim() && raw.trim() !== 'startup-config') return [langit('Langit: simulator ini hanya menyimpan ke startup-config. Tekan Enter untuk menerima nama bawaannya.')]
      st.saved = runningConfig(st)
      return [out('Building configuration...'), out('[OK]')]
    case 'return':
      st.pending = null
      return []
    case 'banner': {
      const at = raw.indexOf(pending.delim)
      if (at < 0) {
        st.pending = { ...pending, text: [...pending.text, raw] }
        return []
      }
      st.pending = null
      setBanner(st, [...pending.text, raw.slice(0, at)].join('\n'))
      return []
    }
  }
}

function setBanner(st: DeviceState, text: string) {
  ensure(st, '').set('banner motd', `banner motd ^C${text}^C`)
}

function addAcl(st: DeviceState, line: string, seq?: number): TermLine[] {
  const list = st.acls.get(st.contexts[0]) ?? []
  const next = seq ?? (list.length ? Math.max(...list.map((e) => e.seq)) + 10 : 10)
  if (list.some((e) => e.seq === next)) return [out(`% Duplicate sequence number`)]
  st.acls.set(st.contexts[0], [...list, { seq: next, line }].sort((a, b) => a.seq - b.seq))
  return []
}

function ifNetworks(st: DeviceState, except: string): { name: string; net: number; len: number }[] {
  const nets: { name: string; net: number; len: number }[] = []
  for (const [context, lines] of st.config) {
    if (!context.startsWith('interface ') || context === except) continue
    const m = /^ip address (\S+) (\S+)$/.exec(lines.get('ip address') ?? '')
    if (!m) continue
    const len = maskLength(m[2])
    const ip = ipToInt(parseIpv4(m[1])!)
    nets.push({ name: ifName(context), net: len === 0 ? 0 : (ip & ~((1 << (32 - len)) - 1)) >>> 0, len })
  }
  return nets
}

function linkMessages(st: DeviceState, context: string, before: string | undefined, after: string): TermLine[] {
  const name = ifName(context)
  if (before === after || !isPhysical(st, name)) return []
  if (after === 'shutdown')
    return [out(`%LINK-5-CHANGED: Interface ${name}, changed state to administratively down`), ...(st.cabled.has(name) ? [out(`%LINEPROTO-5-UPDOWN: Line protocol on Interface ${name}, changed state to down`)] : [])]
  if (!st.cabled.has(name)) return []
  return [out(`%LINK-3-UPDOWN: Interface ${name}, changed state to up`), out(`%LINEPROTO-5-UPDOWN: Line protocol on Interface ${name}, changed state to up`)]
}

/** Stores, replaces, or removes a config line, or opens a sub-mode. */
function apply(st: DeviceState, def: CmdDef, words: string[], negate: boolean): TermLine[] {
  if (def.kind === 'nav') return nav(st, def, words)
  const line = canonical(def, words)

  if (def.kind === 'enter') {
    const to = def.enter!
    if (to === 'ifrange') {
      st.mode = 'ifrange'
      st.contexts = words[words.length - 1].split(',').map((n) => `interface ${n}`)
      st.contexts.forEach((c) => ensure(st, c))
      return []
    }
    const contexts = to === 'vlan' ? expandVlans(words[1]).map((v) => `vlan ${v}`) : [line]
    if (negate) {
      for (const c of contexts) {
        const name = ifName(c)
        if (c.startsWith('interface ') && isPhysical(st, name)) return [langit('Langit: interface fisik tidak bisa dihapus dengan "no interface".')]
        st.config.delete(c)
        st.acls.delete(c)
      }
      return []
    }
    contexts.forEach((c) => ensure(st, c))
    st.mode = to === 'if' && line.includes('.') ? 'subif' : to
    st.contexts = contexts
    return []
  }

  if (def.special === 'rsa') {
    if (/^(Router|Switch)$/.test(st.hostname)) return [out(`% Please define a hostname other than ${st.hostname}.`)]
    const domain = effective(st, '', 'ip domain name')?.split(' ')[3]
    if (!domain) return [out('% Please define a domain-name first.')]
    if (!words.includes('modulus')) return [langit('Langit: tulis ukuran kuncinya langsung, misalnya "crypto key generate rsa modulus 2048". IOS asli akan menanyakannya.')]
    const bits = words[words.indexOf('modulus') + 1]
    st.rsa = true
    return [
      out(`The name for the keys will be: ${st.hostname}.${domain}`),
      out(''),
      out(`% The key modulus size is ${bits} bits`),
      out(`% Generating ${bits} bit RSA keys, keys will be non-exportable...`),
      out('[OK] (elapsed time was 1 seconds)'),
    ]
  }

  if (def.special === 'banner') {
    const text = line.slice('banner motd '.length)
    const delim = text[0]
    const close = text.indexOf(delim, 1)
    if (close > 0) {
      setBanner(st, text.slice(1, close))
      return []
    }
    st.pending = { kind: 'banner', delim, text: text.length > 1 ? [text.slice(1)] : [] }
    return [out(`Enter TEXT message.  End with the character '${delim}'.`)]
  }

  const messages: TermLine[] = []
  for (const context of st.contexts) {
    if (def.special === 'acl-entry' && (st.mode === 'stdacl' || st.mode === 'extacl')) {
      if (negate) st.acls.set(context, (st.acls.get(context) ?? []).filter((e) => e.line !== line))
      else messages.push(...addAcl(st, line))
      continue
    }
    const lines = ensure(st, context)
    const slot = slotOf(def, words) ?? line
    const before = effective(st, context, slot)

    if (def.special === 'allowed-vlan' && !negate) {
      lines.set(slot, `switchport trunk allowed vlan ${allowedVlans(lines.get(slot), words.slice(4))}`)
      continue
    }
    if (!negate && def.slot === 'ip address' && words[2] !== 'dhcp') {
      const ip = parseIpv4(words[2])!
      const len = maskLength(words[3])
      if (len < 0) return [out(`Bad mask 0x${ipToInt(parseIpv4(words[3])!).toString(16).toUpperCase()} for address ${words[2]}`)]
      const host = ipToInt(ip) & ((2 ** (32 - len) - 1) >>> 0)
      if (len < 31 && (host === 0 || host === (2 ** (32 - len) - 1) >>> 0)) return [out(`Bad mask /${len} for address ${words[2]}`)]
      const net = len === 0 ? 0 : (ipToInt(ip) & ~((1 << (32 - len)) - 1)) >>> 0
      const clash = ifNetworks(st, context).find((n) => {
        const short = Math.min(n.len, len)
        const m = short === 0 ? 0 : ~((1 << (32 - short)) - 1) >>> 0
        return ((n.net & m) >>> 0) === ((net & m) >>> 0)
      })
      if (clash) {
        const shown = [net >>> 24, (net >>> 16) & 255, (net >>> 8) & 255, net & 255].join('.')
        return [out(`% ${shown} overlaps with ${clash.name}`)]
      }
    }
    if (def.special === 'acl-entry' && negate && /^access-list \d+$/.test(line)) {
      for (const key of [...lines.keys()]) if (key.startsWith(`${line} `)) lines.delete(key)
      continue
    }

    if (def.slot === 'hostname') st.hostname = negate ? (st.model === 'isr4331' ? 'Router' : 'Switch') : words[1]
    let after: string | undefined
    if (negate) {
      if (def.noStore) lines.set(slot, `no ${line}`)
      else if (def.slot) lines.delete(slot)
      else lines.delete(line)
      after = def.noStore ? `no ${line}` : undefined
    } else {
      lines.set(slot, line)
      after = line
    }
    if (def.slot === 'shutdown') messages.push(...linkMessages(st, context, before, after ?? ''))
    if (def.slot === 'channel-group' && !negate) {
      const po = `interface Port-channel${words[1]}`
      if (!st.config.has(po)) {
        ensure(st, po)
        messages.push(out(`Creating a port-channel interface Port-channel ${words[1]}`))
      }
    }
  }
  return messages
}

/** "no <command>" typed without its values: removes the slot, as IOS does for "no ip address" or "no description". */
function removeByPrefix(st: DeviceState, def: CmdDef, words: string[]): TermLine[] {
  if (def.kind === 'enter' || !def.slot) {
    if (def.special === 'acl-entry' && words[0] === 'access-list' && words.length === 2) {
      const lines = ensure(st, '')
      for (const key of [...lines.keys()]) if (key.startsWith(`access-list ${words[1]} `)) lines.delete(key)
      return []
    }
    return [out('% Incomplete command.')]
  }
  const slot = slotOf(def, words)!
  if (/\$\d/.test(def.slot) && slot.includes('undefined')) return [out('% Incomplete command.')]
  for (const context of st.contexts) {
    const lines = ensure(st, context)
    if (def.noStore) lines.set(slot, `no ${words.join(' ')}`)
    else lines.delete(slot)
  }
  return []
}

function expandVlans(list: string): number[] {
  const out: number[] = []
  for (const part of list.split(',')) {
    const [a, b] = part.split('-').map(Number)
    for (let v = a; v <= (b ?? a); v++) out.push(v)
  }
  return out
}

/** "switchport trunk allowed vlan add 30" on top of what is there: IOS keeps one merged line. */
function allowedVlans(current: string | undefined, args: string[]): string {
  const now = current ? current.replace('switchport trunk allowed vlan ', '') : 'all'
  const set = new Set(now === 'all' ? [] : now === 'none' ? [] : expandVlans(now))
  const [op, list] = args
  if (op === 'all' || op === 'none') return op
  if (op === 'add') {
    if (now === 'all') return 'all'
    expandVlans(list).forEach((v) => set.add(v))
  } else if (op === 'remove') {
    const base = now === 'all' ? new Set(Array.from({ length: 4094 }, (_, i) => i + 1)) : set
    expandVlans(list).forEach((v) => base.delete(v))
    return compressVlans([...base])
  } else if (op === 'except') {
    const skip = new Set(expandVlans(list))
    return compressVlans(Array.from({ length: 4094 }, (_, i) => i + 1).filter((v) => !skip.has(v)))
  } else {
    return compressVlans(expandVlans(op))
  }
  return compressVlans([...set])
}

function compressVlans(vs: number[]): string {
  const sorted = [...new Set(vs)].sort((a, b) => a - b)
  if (!sorted.length) return 'none'
  const parts: string[] = []
  for (let i = 0; i < sorted.length; i++) {
    let j = i
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j++
    parts.push(j - i >= 2 ? `${sorted[i]}-${sorted[j]}` : j > i ? `${sorted[i]},${sorted[j]}` : `${sorted[i]}`)
    i = j
  }
  return parts.join(',')
}

// ---------------------------------------------------------------- exec commands and their output

function runExec(st: DeviceState, def: CmdDef, words: string[], filter: { op: string; text: string } | null): TermLine[] {
  const command = canonical(def, words)
  st.ran.push(command)
  if (def.special === 'copy-run-start') {
    st.pending = { kind: 'confirm-save' }
    return [out('Destination filename [startup-config]? ')]
  }
  if (def.special === 'write') {
    st.saved = runningConfig(st)
    return [out('Building configuration...'), out('[OK]')]
  }
  const text = st.outputs[command] ?? generated(st, command)
  if (text === undefined) return [langit(`Langit: output "${command}" tidak disiapkan untuk latihan ini.`)]
  let lines = text.split('\n')
  if (filter) {
    const op = filter.op.toLowerCase()
    const re = new RegExp(filter.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    if ('include'.startsWith(op)) lines = lines.filter((l) => re.test(l))
    else if ('exclude'.startsWith(op)) lines = lines.filter((l) => !re.test(l))
    else if ('begin'.startsWith(op)) lines = lines.slice(Math.max(0, lines.findIndex((l) => re.test(l))))
    else if ('section'.startsWith(op)) {
      const keep: string[] = []
      let inside = false
      for (const l of lines) {
        if (!l.startsWith(' ')) inside = re.test(l)
        if (inside) keep.push(l)
      }
      lines = keep
    } else return [langit('Langit: filter yang dikenal simulator hanya include, exclude, begin, dan section.')]
  }
  return lines.map(out)
}

function generated(st: DeviceState, command: string): string | undefined {
  if (command === 'show running-config') return runningConfig(st)
  if (command === 'show startup-config') return st.saved ?? 'startup-config is not present'
  if (command === 'show ip interface brief') return ipInterfaceBrief(st)
  if (command === 'show vlan brief') return vlanBrief(st)
  return undefined
}

const ORDER_LATE = /^(ip route|ipv6 route|ip nat|access-list|logging|snmp-server|ntp|ip access-list)/

/** The running configuration, only the parts the simulator keeps, marked as such. */
export function runningConfig(st: DeviceState): string {
  const lines: string[] = ['Building configuration...', '', '! Langit: hanya bagian yang dipakai latihan ini yang ditampilkan.', '!']
  const global = [...(st.config.get('')?.entries() ?? [])].map(([slot, line]) => ({ slot, line })).filter(({ slot, line }) => shown(st, '', slot, line))
  const early = global.filter((g) => !ORDER_LATE.test(g.line))
  const late = global.filter((g) => ORDER_LATE.test(g.line))
  for (const { line } of early) lines.push(display(line))
  lines.push('!')
  const contexts = [...st.config.keys()].filter((c) => c && !c.startsWith('vlan ') && !c.startsWith('line '))
  const block = (context: string) => {
    lines.push(context)
    const name = ifName(context)
    const routed =
      context.startsWith('interface ') &&
      (st.model === 'isr4331' || !isPhysical(st, name) || effective(st, context, 'switchport') === 'no switchport') &&
      !name.startsWith('Port-channel')
    if (routed && !st.config.get(context)?.has('ip address')) lines.push(' no ip address')
    for (const [slot, line] of st.config.get(context) ?? []) if (shown(st, context, slot, line)) lines.push(` ${display(line)}`)
    if (context.startsWith('interface ') && !st.config.get(context)?.has('shutdown') && effective(st, context, 'shutdown') === 'shutdown') lines.push(' shutdown')
    for (const e of st.acls.get(context) ?? []) lines.push(` ${display(e.line)}`)
    lines.push('!')
  }
  contexts.filter((c) => c.startsWith('interface ')).forEach(block)
  contexts.filter((c) => !c.startsWith('interface ')).forEach(block)
  for (const { line } of late) lines.push(display(line))
  if (late.length) lines.push('!')
  ;[...st.config.keys()].filter((c) => c.startsWith('line ')).forEach(block)
  lines.push('end')
  return lines.join('\n')
}

/** Default lines are not printed, and neither is "no shutdown". */
function shown(st: DeviceState, context: string, slot: string, line: string): boolean {
  if (line === defaultLine(st, context, slot)) return false
  return line !== 'no shutdown'
}

/** Secrets as IOS shows them: hashed, which the simulator does not compute. */
function display(line: string): string {
  return line
    .replace(/^(enable secret|username \S+ (?:privilege \d+ )?secret) \S+$/, '$1 9 <hash>')
    .replace(/^(key) \S+$/, '$1 <tersembunyi>')
}

function ipInterfaceBrief(st: DeviceState): string {
  const rows = [...st.config.keys()].filter((c) => c.startsWith('interface '))
  const pad = (s: string, n: number) => (s.length >= n ? `${s} ` : s.padEnd(n))
  const out = [`${pad('Interface', 23)}${pad('IP-Address', 16)}${pad('OK?', 4)}${pad('Method', 7)}${pad('Status', 22)}Protocol`]
  for (const context of rows) {
    const name = ifName(context)
    const addr = /^ip address (\S+)/.exec(effective(st, context, 'ip address') ?? '')?.[1]
    const dhcp = effective(st, context, 'ip address') === 'ip address dhcp'
    const shut = effective(st, context, 'shutdown') === 'shutdown'
    const parent = name.includes('.') ? name.split('.')[0] : null
    const parentShut = parent ? effective(st, `interface ${parent}`, 'shutdown') === 'shutdown' : false
    const linkUp = st.cabled.has(parent ?? name) || /^(Loopback)/.test(name)
    const status = shut ? 'administratively down' : parentShut ? 'down' : linkUp ? 'up' : 'down'
    const proto = status === 'up' ? 'up' : 'down'
    out.push(`${pad(name, 23)}${pad(dhcp ? 'unassigned' : (addr ?? 'unassigned'), 16)}${pad('YES', 4)}${pad(dhcp ? 'DHCP' : addr ? 'manual' : 'unset', 7)}${pad(status, 22)}${proto}`)
  }
  return out.join('\n')
}

function vlanBrief(st: DeviceState): string {
  const vlans = new Map<number, string>([[1, 'default']])
  for (const [context, lines] of st.config) {
    const m = /^vlan (\d+)$/.exec(context)
    if (m) vlans.set(Number(m[1]), lines.get('name')?.replace(/^name /, '') ?? `VLAN${m[1].padStart(4, '0')}`)
  }
  const ports = new Map<number, string[]>()
  for (const name of PHYSICAL[st.model]) {
    const context = `interface ${name}`
    const mode = effective(st, context, 'switchport mode')
    if (mode === 'switchport mode trunk' || effective(st, context, 'switchport') === 'no switchport') continue
    const vlan = Number(/(\d+)$/.exec(effective(st, context, 'switchport access vlan') ?? '')?.[1] ?? 1)
    if (!vlans.has(vlan)) continue
    ports.set(vlan, [...(ports.get(vlan) ?? []), shortIf(name)])
  }
  const lines = ['VLAN Name                             Status    Ports', '---- -------------------------------- --------- -------------------------------']
  const row = (id: number, name: string, status: string) => {
    const list = ports.get(id) ?? []
    const chunks: string[] = []
    for (let i = 0; i < list.length; i += 4) chunks.push(list.slice(i, i + 4).join(', '))
    lines.push(`${String(id).padEnd(5)}${name.padEnd(33)}${status.padEnd(10)}${chunks[0] ?? ''}`.trimEnd())
    for (const more of chunks.slice(1)) lines.push(`${' '.repeat(48)}${more}`)
  }
  for (const [id, name] of [...vlans].sort((a, b) => a[0] - b[0])) row(id, name, 'active')
  for (const [id, name] of [
    [1002, 'fddi-default'],
    [1003, 'token-ring-default'],
    [1004, 'fddinet-default'],
    [1005, 'trnet-default'],
  ] as const)
    row(id, name, 'act/unsup')
  return lines.join('\n')
}

// ---------------------------------------------------------------- sessions and judging

export type Session = { state: DeviceState; transcript: TermLine[] }

/** Replays everything the player typed. */
export function runSession(setup: IosSetup, inputs: string[]): Session {
  const state = newDevice(setup)
  const transcript: TermLine[] = []
  for (const raw of inputs) {
    const pending = state.pending?.kind
    if (pending === 'banner') transcript.push({ kind: 'in', prompt: '', text: raw })
    else transcript.push({ kind: 'in', prompt: pending ? '' : promptOf(state), text: pending ? '' : raw, hidden: !!pending })
    transcript.push(...step(state, raw))
  }
  return { state, transcript }
}

export type IosLineReq = { context?: string; line: string }
export type IosReq = IosLineReq | { anyOf: IosLineReq[][] } | { context?: string; sequence: string[] }
export type IosGoal = { config?: IosReq[]; run?: string[]; absent?: IosLineReq[] }

/** What a goal line means in the simulator: its context, slot, and canonical line. Throws when the line is not a valid command there. */
export function parseGoalLine(model: Model, req: IosLineReq): { context: string; slot: string; line: string; acl: boolean } {
  const st = newDevice({ hostname: 'R1', model, start: 'config' })
  const context = req.context ?? ''
  if (context) {
    const before = st.contexts
    step(st, context)
    if (st.contexts === before || st.mode === 'config') throw new Error(`"${context}" is not a context the simulator knows`)
  }
  const mode = st.mode
  const toks = tokenize(req.line)
  let negate = false
  let body = toks
  if (toks[0]?.text === 'no') {
    negate = true
    body = toks.slice(1)
  }
  const found = lookup(st, configDefs(mode), body, req.line, { allowPrefix: negate })
  if ('err' in found && found.err === 'incomplete' && negate && !found.def.noStore)
    throw new Error(`"${req.line}": a "no" goal only works for lines IOS keeps as "no ..."; use "absent" instead`)
  if (!('ok' in found)) throw new Error(`"${req.line}" is not a command the simulator knows in "${context || 'global configuration'}"`)
  const { def, words } = found.ok
  if (def.only && !def.only.includes(model)) throw new Error(`"${req.line}" does not exist on ${model}`)
  if (negate && !def.noStore) throw new Error(`"${req.line}": a "no" goal only works for lines IOS keeps as "no ..."; use "absent" instead`)
  const line = canonical(def, words)
  const acl = def.special === 'acl-entry' && (mode === 'stdacl' || mode === 'extacl')
  const ctx = st.contexts[0]
  if (def.special === 'banner') {
    const text = line.slice('banner motd '.length)
    return { context: ctx, slot: 'banner motd', line: `banner motd ^C${text.slice(1, text.indexOf(text[0], 1))}^C`, acl }
  }
  if (def.special === 'allowed-vlan') return { context: ctx, slot: 'switchport trunk allowed vlan', line: `switchport trunk allowed vlan ${allowedVlans(undefined, words.slice(4))}`, acl }
  return { context: ctx, slot: slotOf(def, words) ?? line, line: negate ? `no ${line}` : line, acl }
}

function has(st: DeviceState, req: IosLineReq): boolean {
  const g = parseGoalLine(st.model, req)
  if (g.acl) return (st.acls.get(g.context) ?? []).some((e) => e.line === g.line)
  return effective(st, g.context, g.slot) === g.line
}

/** Parses an exec goal ("show ip interface brief") into the full form that runExec records. */
export function parseGoalRun(model: Model, command: string): string {
  const st = newDevice({ hostname: 'R1', model })
  const found = lookup(st, EXEC_DEFS, tokenize(command), command)
  if (!('ok' in found)) throw new Error(`"${command}" is not an exec command the simulator knows`)
  return canonical(found.ok.def, found.ok.words)
}

/** Words for a requirement that is not met yet, for the feedback after "Periksa". */
function describe(req: IosLineReq): string {
  return req.context ? `${req.line} (di ${req.context})` : req.line
}

/** Which goals the session meets. `missing` lists the unmet ones in words. */
export function judgeSession(state: DeviceState, goal: IosGoal): { correct: boolean; missing: string[] } {
  const missing: string[] = []
  for (const req of goal.config ?? []) {
    if ('anyOf' in req) {
      if (!req.anyOf.some((group) => group.every((r) => has(state, r)))) missing.push(req.anyOf[0].map(describe).join(', '))
    } else if ('sequence' in req) {
      const lines = req.sequence.map((line) => parseGoalLine(state.model, { context: req.context, line }))
      const ctx = lines[0]?.context ?? ''
      const actual = lines[0]?.acl ? (state.acls.get(ctx) ?? []).map((e) => e.line) : [...(state.config.get(ctx)?.values() ?? [])]
      let at = -1
      const inOrder = lines.every((l) => {
        const i = actual.indexOf(l.line, at + 1)
        if (i < 0) return false
        at = i
        return true
      })
      if (!inOrder) missing.push(`${req.sequence.join(' → ')}${req.context ? ` (di ${req.context}, urutannya harus sama)` : ' (urutannya harus sama)'}`)
    } else if (!has(state, req)) missing.push(describe(req))
  }
  for (const cmd of goal.run ?? []) {
    const full = parseGoalRun(state.model, cmd)
    if (!state.ran.includes(full)) missing.push(`jalankan ${full}`)
  }
  for (const req of goal.absent ?? []) if (has(state, req)) missing.push(`hapus ${describe(req)}`)
  return { correct: missing.length === 0, missing }
}

/** Lines that mean a typed command went wrong: IOS errors and Langit notes (not the routine % log messages). */
export function errorLines(transcript: TermLine[]): string[] {
  return transcript
    .filter((l) => l.kind === 'langit' || (l.kind === 'out' && /^(% (Invalid input|Incomplete command|Please define|Bad secrets|Duplicate)|Bad mask|% .* overlaps with)/.test(l.text)))
    .map((l) => ('text' in l ? l.text : ''))
}

/** Problems with a question's starting configuration: every given line must be a command the simulator accepts. */
export function givenProblems(setup: IosSetup): string[] {
  const st = newDevice({ ...setup, given: [] })
  const problems: string[] = []
  for (const block of setup.given ?? []) {
    st.mode = 'config'
    st.contexts = ['']
    for (const raw of [...(block.context ? [block.context] : []), ...block.lines]) {
      const errors = errorLines(step(st, raw))
      if (errors.length) problems.push(`given "${raw}": ${errors.join(' ')}`)
    }
  }
  return problems
}
