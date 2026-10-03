import { describe, expect, it } from 'vitest'
import { judgeSession, newDevice, parseGoalLine, promptOf, runSession, step, type IosSetup } from './engine'
import { formatIpv6, maskLength, parseInterface, parseIpv6 } from './pattern'

const R1: IosSetup = { hostname: 'R1', model: 'isr4331', cabled: ['GigabitEthernet0/0/0'] }
const SW1: IosSetup = { hostname: 'SW1', model: 'c2960' }
const text = (lines: ReturnType<typeof step>) => lines.map((l) => ('text' in l ? l.text : '')).join('\n')
const kinds = (lines: ReturnType<typeof step>) => lines.map((l) => l.kind)

describe('values', () => {
  it('reads masks, IPv6 addresses, and interface names', () => {
    expect(maskLength('255.255.255.0')).toBe(24)
    expect(maskLength('255.255.255.252')).toBe(30)
    expect(maskLength('255.0.255.0')).toBe(-1)
    expect(formatIpv6(parseIpv6('2001:0DB8:0000:0000:0000:0000:0000:0001')!)).toBe('2001:db8::1')
    expect(formatIpv6(parseIpv6('2001:db8:0:0:1:0:0:1')!)).toBe('2001:db8::1:0:0:1')
    expect(parseIpv6('2001::db8::1')).toBeNull()
    expect(parseInterface('g0/0/0')).toMatchObject({ name: 'GigabitEthernet0/0/0' })
    expect(parseInterface('Fa0/1')).toMatchObject({ name: 'FastEthernet0/1' })
    expect(parseInterface('vlan', '10')).toMatchObject({ name: 'Vlan10' })
    expect(parseInterface('po1')).toMatchObject({ name: 'Port-channel1' })
    expect(parseInterface('v10')).toBe('short')
  })
})

describe('modes and prompts', () => {
  it('moves through the modes like IOS, with the same prompts and messages', () => {
    const st = newDevice({ ...R1, start: 'user' })
    expect(promptOf(st)).toBe('R1>')
    step(st, 'en')
    expect(promptOf(st)).toBe('R1#')
    expect(text(step(st, 'conf t'))).toBe('Enter configuration commands, one per line.  End with CNTL/Z.')
    expect(promptOf(st)).toBe('R1(config)#')
    step(st, 'int g0/0/0')
    expect(promptOf(st)).toBe('R1(config-if)#')
    step(st, 'exit')
    expect(promptOf(st)).toBe('R1(config)#')
    step(st, 'router ospf 1')
    expect(promptOf(st)).toBe('R1(config-router)#')
    step(st, 'line vty 0 4')
    expect(promptOf(st)).toBe('R1(config-line)#')
    expect(text(step(st, 'end'))).toBe('%SYS-5-CONFIG_I: Configured from console by console')
    expect(promptOf(st)).toBe('R1#')
  })

  it('changes the prompt as soon as the hostname changes', () => {
    const st = newDevice({ ...R1, hostname: 'Router', start: 'config' })
    step(st, 'hostname HQ-R1')
    expect(promptOf(st)).toBe('HQ-R1(config)#')
  })

  it('runs global commands from a sub-mode and goes back to global config, as IOS does', () => {
    const st = newDevice({ ...R1, start: 'config' })
    step(st, 'interface g0/0/0')
    step(st, 'hostname R9')
    expect(promptOf(st)).toBe('R9(config)#')
    step(st, 'interface g0/0/1')
    step(st, 'interface g0/0/2')
    expect(st.contexts).toEqual(['interface GigabitEthernet0/0/2'])
  })

  it('asks for the enable secret, and gives up after three wrong tries', () => {
    const setup: IosSetup = { ...R1, start: 'user', given: [{ lines: ['enable secret Cisc0!'] }] }
    const ok = runSession(setup, ['enable', 'Cisc0!'])
    expect(promptOf(ok.state)).toBe('R1#')
    expect(ok.transcript.filter((l) => l.kind === 'in' && l.hidden)).toHaveLength(1)
    const bad = runSession(setup, ['enable', 'a', 'b', 'c'])
    expect(promptOf(bad.state)).toBe('R1>')
    expect(text(bad.transcript)).toContain('% Bad secrets')
  })
})

describe('abbreviations and errors (LANGIT_CCNA_PLAN.md section 7)', () => {
  it('accepts the well-known abbreviations', () => {
    const { state } = runSession(R1, ['conf t', 'int g0/0/0', 'ip add 192.168.1.1 255.255.255.0', 'no shut', 'end', 'sh ip int br', 'copy run start', ''])
    expect(state.config.get('interface GigabitEthernet0/0/0')?.get('ip address')).toBe('ip address 192.168.1.1 255.255.255.0')
    expect(state.config.get('interface GigabitEthernet0/0/0')?.get('shutdown')).toBe('no shutdown')
    expect(state.ran).toEqual(['show ip interface brief', 'copy running-config startup-config'])
    expect(state.saved).toContain('ip address 192.168.1.1 255.255.255.0')
  })

  it('answers a too-short abbreviation with a Langit message, not an IOS error', () => {
    const st = newDevice(R1)
    const lines = step(st, 's ip int br')
    expect(kinds(lines)).toEqual(['langit'])
    expect(text(lines)).toContain('"sh"')
    const conf = newDevice({ ...R1, start: 'config' })
    expect(text(step(conf, 'hostnam R2'))).toContain('Ketik "hostname"')
  })

  it('points at a bad value with the IOS caret, under the right column', () => {
    const st = newDevice({ ...R1, start: 'config' })
    step(st, 'interface g0/0/0')
    const lines = step(st, 'ip address 300.1.1.1 255.255.255.0')
    expect(text(lines)).toBe(`${' '.repeat('R1(config-if)#ip address '.length)}^\n% Invalid input detected at '^' marker.`)
    expect(text(step(st, 'ip address'))).toBe('% Incomplete command.')
  })

  it('never calls a word IOS might know invalid', () => {
    const st = newDevice({ ...R1, start: 'config' })
    const cef = step(st, 'ip cef')
    expect(kinds(cef)).toEqual(['langit'])
    expect(text(cef)).toContain('"cef"')
    expect(kinds(step(st, 'frobnicate'))).toEqual(['langit'])
    expect(kinds(step(newDevice(R1), 'ping 10.1.1.1 repeat 100'))).toEqual(['langit'])
  })

  it('rejects an exec command in config mode at its first word, and suggests do', () => {
    const st = newDevice({ ...R1, start: 'config' })
    const lines = step(st, 'show ip interface brief')
    expect(text(lines)).toContain("% Invalid input detected at '^' marker.")
    expect(lines.at(-1)).toMatchObject({ kind: 'langit' })
    expect(text(step(st, 'do show ip interface brief'))).toContain('Interface')
  })

  it('rejects show running-config in user EXEC', () => {
    const st = newDevice({ ...R1, start: 'user' })
    const lines = step(st, 'show running-config')
    expect(text(lines)).toContain(`${' '.repeat('R1>show '.length)}^`)
  })

  it('checks masks and overlaps like IOS', () => {
    const st = newDevice({ ...R1, start: 'config' })
    step(st, 'interface g0/0/0')
    expect(text(step(st, 'ip address 10.1.1.1 255.0.255.0'))).toBe('Bad mask 0xFF00FF00 for address 10.1.1.1')
    expect(text(step(st, 'ip address 192.168.1.0 255.255.255.0'))).toBe('Bad mask /24 for address 192.168.1.0')
    step(st, 'ip address 192.168.1.1 255.255.255.0')
    step(st, 'interface g0/0/1')
    expect(text(step(st, 'ip address 192.168.1.129 255.255.255.128'))).toBe('% 192.168.1.128 overlaps with GigabitEthernet0/0/0')
    expect(text(step(st, 'ip address 10.0.0.1 255.255.255.252'))).toBe('')
  })

  it('shows link messages only for a cabled interface', () => {
    const st = newDevice({ ...R1, start: 'config' })
    step(st, 'interface g0/0/0')
    expect(text(step(st, 'no shutdown'))).toBe(
      '%LINK-3-UPDOWN: Interface GigabitEthernet0/0/0, changed state to up\n%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/0/0, changed state to up',
    )
    step(st, 'interface g0/0/1')
    expect(text(step(st, 'no shutdown'))).toBe('')
  })

  it('says when a command does not exist on the model, without claiming an IOS error', () => {
    const st = newDevice({ ...R1, start: 'config' })
    step(st, 'interface g0/0/0')
    expect(kinds(step(st, 'switchport mode access'))).toEqual(['langit'])
  })
})

describe('configuration state', () => {
  it('replaces slots, removes with no, and keeps "no" lines IOS keeps', () => {
    const { state } = runSession({ ...SW1, start: 'config' }, [
      'interface fa0/5',
      'switchport mode access',
      'switchport access vlan 10',
      'switchport access vlan 20',
      'description PC Lantai 2',
      'no description',
      'exit',
      'no cdp run',
      'no ip domain lookup',
    ])
    const f05 = state.config.get('interface FastEthernet0/5')!
    expect(f05.get('switchport access vlan')).toBe('switchport access vlan 20')
    expect(f05.has('description')).toBe(false)
    expect(state.config.get('')?.get('cdp run')).toBe('no cdp run')
    expect(state.config.get('')?.get('ip domain lookup')).toBe('no ip domain lookup')
  })

  it('applies interface range commands to every interface', () => {
    const { state } = runSession({ ...SW1, start: 'config' }, ['interface range fa0/1 - 3', 'switchport mode access', 'switchport access vlan 10'])
    for (const n of [1, 2, 3]) expect(state.config.get(`interface FastEthernet0/${n}`)?.get('switchport access vlan')).toBe('switchport access vlan 10')
    expect(state.config.get('interface FastEthernet0/4')?.get('switchport access vlan')).toBeUndefined()
  })

  it('merges allowed VLAN changes into one line', () => {
    const { state } = runSession({ ...SW1, start: 'config' }, ['interface g0/1', 'switchport mode trunk', 'switchport trunk allowed vlan 10,20', 'switchport trunk allowed vlan add 30-32', 'switchport trunk allowed vlan remove 20'])
    expect(state.config.get('interface GigabitEthernet0/1')?.get('switchport trunk allowed vlan')).toBe('switchport trunk allowed vlan 10,30-32')
  })

  it('stores ACLs as IOS does: host forms, masked addresses, port names, and sequence numbers', () => {
    const { state } = runSession({ ...R1, start: 'config' }, [
      'access-list 10 permit host 192.168.1.10',
      'access-list 10 permit 192.168.2.77 0.0.0.255',
      'access-list 110 permit tcp 192.168.1.0 0.0.0.255 host 10.1.1.10 eq 80',
      'ip access-list extended WEB',
      'permit tcp any host 10.1.1.10 eq 443',
      '5 deny ip host 192.168.1.66 any',
      'remark blokir host uji',
    ])
    const global = [...state.config.get('')!.values()]
    expect(global).toContain('access-list 10 permit 192.168.1.10')
    expect(global).toContain('access-list 10 permit 192.168.2.0 0.0.0.255')
    expect(global).toContain('access-list 110 permit tcp 192.168.1.0 0.0.0.255 host 10.1.1.10 eq www')
    expect(state.acls.get('ip access-list extended WEB')?.map((e) => `${e.seq} ${e.line}`)).toEqual([
      '5 deny ip host 192.168.1.66 any',
      '10 permit tcp any host 10.1.1.10 eq 443',
      '20 remark blokir host uji',
    ])
    runSession({ ...R1, start: 'config' }, [])
  })

  it('needs a hostname and a domain name before RSA keys, as IOS does', () => {
    const st = newDevice({ ...R1, hostname: 'Router', start: 'config' })
    expect(text(step(st, 'crypto key generate rsa modulus 2048'))).toBe('% Please define a hostname other than Router.')
    step(st, 'hostname R1')
    expect(text(step(st, 'crypto key generate rsa modulus 2048'))).toBe('% Please define a domain-name first.')
    step(st, 'ip domain name lab.local')
    expect(text(step(st, 'crypto key generate rsa modulus 2048'))).toContain('The name for the keys will be: R1.lab.local')
  })

  it('takes a banner with its delimiter, on one line or several', () => {
    const one = runSession({ ...R1, start: 'config' }, ['banner motd #Hanya untuk yang berwenang#'])
    expect(one.state.config.get('')?.get('banner motd')).toBe('banner motd ^CHanya untuk yang berwenang^C')
    const many = runSession({ ...R1, start: 'config' }, ['banner motd $', 'Baris satu', 'Baris dua$'])
    expect(text(many.transcript)).toContain("Enter TEXT message.  End with the character '$'.")
    expect(many.state.config.get('')?.get('banner motd')).toBe('banner motd ^CBaris satu\nBaris dua^C')
  })
})

describe('generated output', () => {
  it('builds show ip interface brief from the configuration', () => {
    const { transcript } = runSession(R1, ['conf t', 'int g0/0/0', 'ip address 192.168.1.1 255.255.255.0', 'no shutdown', 'end', 'show ip interface brief'])
    const out = text(transcript)
    expect(out).toContain('Interface              IP-Address      OK? Method Status                Protocol')
    expect(out).toContain('GigabitEthernet0/0/0   192.168.1.1     YES manual up                    up')
    expect(out).toContain('GigabitEthernet0/0/1   unassigned      YES unset  administratively down down')
  })

  it('builds show vlan brief from the configuration', () => {
    const { transcript } = runSession({ ...SW1, start: 'config' }, ['vlan 10', 'name SALES', 'interface fa0/5', 'switchport mode access', 'switchport access vlan 10', 'end', 'show vlan brief'])
    const out = text(transcript)
    expect(out).toContain('10   SALES                            active    Fa0/5')
    expect(out).toContain('1    default                          active    Fa0/1, Fa0/2, Fa0/3, Fa0/4')
    expect(out).toContain('1002 fddi-default                     act/unsup')
  })

  it('marks show running-config as partial, and hides secrets', () => {
    const { transcript } = runSession({ ...R1, given: [{ lines: ['enable secret Rahasia1'] }] }, ['show running-config'])
    const out = text(transcript)
    expect(out).toContain('Langit: hanya bagian yang dipakai')
    expect(out).toContain('enable secret 9 <hash>')
    expect(out).not.toContain('Rahasia1')
    expect(out).toContain('interface GigabitEthernet0/0/1\n no ip address\n shutdown')
  })

  it('uses the output a question provides, and filters it with include', () => {
    const setup: IosSetup = { ...R1, outputs: { 'show ip route': 'Gateway of last resort is not set\n\nC        192.168.1.0/24 is directly connected, GigabitEthernet0/0/0' } }
    const { transcript } = runSession(setup, ['sh ip ro | include connected'])
    expect(text(transcript.filter((l) => l.kind === 'out'))).toBe('C        192.168.1.0/24 is directly connected, GigabitEthernet0/0/0')
    expect(kinds(runSession(setup, ['show ip ospf neighbor']).transcript).at(-1)).toBe('langit')
  })
})

describe('judging (goals)', () => {
  it('passes when the goal holds, whatever way it was typed', () => {
    const goal = {
      config: [{ context: 'interface GigabitEthernet0/0/0', line: 'ip address 192.168.1.1 255.255.255.0' }, { context: 'interface GigabitEthernet0/0/0', line: 'no shutdown' }],
      run: ['show ip interface brief'],
    }
    const typed = runSession(R1, ['conf t', 'interface GigabitEthernet 0/0/0', 'ip address 192.168.1.1 255.255.255.0', 'no shutdown', 'do sh ip int br'])
    expect(judgeSession(typed.state, goal)).toEqual({ correct: true, missing: [] })
    const half = runSession(R1, ['conf t', 'int g0/0/0', 'ip add 192.168.1.1 255.255.255.0'])
    expect(judgeSession(half.state, goal).missing).toEqual(['no shutdown (di interface GigabitEthernet0/0/0)', 'jalankan show ip interface brief'])
  })

  it('accepts either of two ways to do something, and checks order and absence', () => {
    const goal = {
      config: [
        {
          anyOf: [
            [{ context: 'router ospf 1', line: 'network 10.0.12.0 0.0.0.3 area 0' }],
            [{ context: 'interface GigabitEthernet0/0/1', line: 'ip ospf 1 area 0' }],
          ],
        },
        { context: 'ip access-list extended WEB', sequence: ['deny ip host 192.168.1.66 any', 'permit tcp any any eq 443'] },
      ],
      absent: [{ line: 'ip route 0.0.0.0 0.0.0.0 10.0.12.2' }],
    }
    const a = runSession({ ...R1, start: 'config' }, ['interface g0/0/1', 'ip ospf 1 area 0', 'ip access-list extended WEB', 'deny ip host 192.168.1.66 any', 'permit tcp any any eq 443'])
    expect(judgeSession(a.state, goal).correct).toBe(true)
    const b = runSession({ ...R1, start: 'config' }, ['router ospf 1', 'network 10.0.12.0 0.0.0.3 area 0', 'ip access-list extended WEB', 'permit tcp any any eq 443', 'deny ip host 192.168.1.66 any', 'exit', 'ip route 0.0.0.0 0.0.0.0 10.0.12.2'])
    const missing = judgeSession(b.state, goal).missing
    expect(missing).toHaveLength(2)
    expect(missing[1]).toBe('hapus ip route 0.0.0.0 0.0.0.0 10.0.12.2')
  })

  it('reads goal lines through the grammar, and refuses ones it does not know', () => {
    expect(parseGoalLine('c2960', { context: 'interface FastEthernet0/1', line: 'switchport mode access' })).toMatchObject({ slot: 'switchport mode' })
    expect(parseGoalLine('isr4331', { line: 'no ip domain lookup' }).line).toBe('no ip domain lookup')
    expect(() => parseGoalLine('isr4331', { line: 'ip cef' })).toThrow()
    expect(() => parseGoalLine('isr4331', { context: 'interface GigabitEthernet0/0/0', line: 'no ip address' })).toThrow(/absent/)
  })
})

describe('the saved goal', () => {
  it('needs the final configuration saved, by copy or by write memory', () => {
    const goal = { config: [{ line: 'hostname R7' }], saved: true }
    expect(judgeSession(runSession(R1, ['conf t', 'hostname R7', 'end', 'copy run start', '']).state, goal).correct).toBe(true)
    expect(judgeSession(runSession(R1, ['conf t', 'hostname R7', 'end', 'wr']).state, goal).correct).toBe(true)
    // Saved first, changed after: the change is not in startup-config.
    expect(judgeSession(runSession(R1, ['wr', 'conf t', 'hostname R7', 'end']).state, goal).correct).toBe(false)
  })
})

describe('show ipv6 interface brief', () => {
  it('lists the link-local address (EUI-64 or manual) and the global addresses, in upper case', () => {
    const run = runSession({ hostname: 'R1', model: 'isr4331' }, [
      'configure terminal',
      'interface g0/0/0',
      'ipv6 address 2001:db8:acad:1::1/64',
      'interface g0/0/1',
      'ipv6 address 2001:db8:acad:2::/64 eui-64',
      'ipv6 address fe80::1 link-local',
      'end',
      'show ipv6 interface brief',
      'show running-config',
    ])
    const text = run.transcript.map((l) => l.text).join('\n')
    expect(text).toContain('GigabitEthernet0/0/0   [administratively down/down]\n    FE80::250:79FF:FE66:6800\n    2001:DB8:ACAD:1::1')
    expect(text).toContain('    FE80::1\n    2001:DB8:ACAD:2:250:79FF:FE66:6801')
    expect(text).toContain(' ipv6 address 2001:DB8:ACAD:2::/64 eui-64')
  })
})

describe('access and voice VLANs', () => {
  it('creates a missing VLAN when a port is put in it, as IOS does', () => {
    const run = runSession({ hostname: 'SW1', model: 'c2960' }, ['configure terminal', 'interface fa0/5', 'switchport mode access', 'switchport access vlan 30', 'switchport voice vlan 150', 'end', 'show vlan brief'])
    const text = run.transcript.map((l) => l.text).join('\n')
    expect(text).toContain('% Access VLAN does not exist. Creating vlan 30')
    expect(text).toContain('% Voice VLAN does not exist. Creating vlan 150')
    expect(text).toMatch(/30 {2,}VLAN0030 +active +Fa0\/5/)
  })
})
