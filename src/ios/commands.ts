import { parsePattern, type PatToken } from './pattern'

// Every command the IOS simulator knows (LANGIT_CCNA_PLAN.md section 7), by mode.
// Only what the CCNA exam topics ask to configure or verify is here. Keywords in
// brackets may be abbreviated down to the part before the bracket, which keeps to
// abbreviations that are widely used in Cisco documentation; IOS itself accepts
// any unique prefix, and the simulator says so instead of rejecting other forms.

export type Mode =
  | 'user'
  | 'priv'
  | 'config'
  | 'if'
  | 'subif'
  | 'ifrange'
  | 'vlan'
  | 'router'
  | 'rtr6'
  | 'line'
  | 'dhcp'
  | 'stdacl'
  | 'extacl'
  | 'tacacs'
  | 'radius'
  | 'sgroup'
  | 'raguard'

export type Model = 'isr4331' | 'c2960' | 'c3650'

export type Nav = 'enable' | 'disable' | 'conft' | 'end' | 'exit' | 'do'

export type Special = 'allowed-vlan' | 'rsa' | 'banner' | 'copy-run-start' | 'write' | 'acl-entry' | 'save-nothing'

export type CmdDef = {
  pattern: string
  tokens: PatToken[]
  modes: Mode[]
  /** exec: run and remember; config: store a line; enter: open a sub-mode; nav: move between modes. */
  kind: 'exec' | 'config' | 'enter' | 'nav'
  /** Lines with the same slot replace each other; $1, $2... are words of the canonical line (0 is the first). Default: the line itself. */
  slot?: string
  /** Rewrites the canonical words, for commands IOS stores in another form ("ip domain-name" as "ip domain name"). */
  rewrite?: (words: string[]) => string[]
  /** The "no" form is kept as a line of its own ("no shutdown", "no switchport"). */
  noStore?: boolean
  /** The command has no "no" form here. */
  noNo?: boolean
  enter?: Mode
  nav?: Nav
  /** Models that have the command. Default: all. */
  only?: Model[]
  /** Exec commands that IOS does not offer in user EXEC mode. */
  privOnly?: boolean
  special?: Special
}

const SWITCHES: Model[] = ['c2960', 'c3650']
const ROUTING: Model[] = ['isr4331', 'c3650']
const ROUTER: Model[] = ['isr4331']
const L3SWITCH: Model[] = ['c3650']
const IFS: Mode[] = ['if', 'subif', 'ifrange']
const PHYS: Mode[] = ['if', 'ifrange']

const defs: Omit<CmdDef, 'tokens'>[] = []
const exec = (pattern: string, extra: Partial<CmdDef> = {}) => defs.push({ pattern, modes: ['user', 'priv'], kind: 'exec', noNo: true, ...extra })
const cfg = (modes: Mode[], pattern: string, extra: Partial<CmdDef> = {}) => defs.push({ pattern, modes, kind: 'config', ...extra })
const enter = (modes: Mode[], pattern: string, to: Mode, extra: Partial<CmdDef> = {}) => defs.push({ pattern, modes, kind: 'enter', enter: to, ...extra })

// ---------------------------------------------------------------- EXEC
defs.push({ pattern: 'en[able]', modes: ['user', 'priv'], kind: 'nav', nav: 'enable', noNo: true })
defs.push({ pattern: 'disable', modes: ['priv'], kind: 'nav', nav: 'disable', noNo: true })
defs.push({ pattern: 'conf[igure] t[erminal]', modes: ['priv'], kind: 'nav', nav: 'conft', noNo: true, privOnly: true })
exec('sh[ow] run[ning-config]', { privOnly: true })
exec('sh[ow] run[ning-config] int[erface] <if>', { privOnly: true })
exec('sh[ow] start[up-config]', { privOnly: true })
exec('sh[ow] ver[sion]')
exec('sh[ow] clock')
exec('sh[ow] users')
exec('sh[ow] flash:')
exec('dir ?( flash: )', { privOnly: true })
exec('sh[ow] ip int[erface] br[ief]')
exec('sh[ow] ip int[erface]')
exec('sh[ow] ip int[erface] <if>')
exec('sh[ow] int[erfaces]')
exec('sh[ow] int[erfaces] <if>')
exec('sh[ow] int[erfaces] status')
exec('sh[ow] int[erfaces] trunk')
exec('sh[ow] int[erfaces] <if> switchport')
exec('sh[ow] int[erfaces] <if> transceiver ?( detail )')
exec('sh[ow] int[erfaces] counters errors')
exec('sh[ow] vl[an] ?( br[ief] )')
exec('sh[ow] mac address-table ?( dynamic )')
exec('sh[ow] cdp')
exec('sh[ow] cdp nei[ghbors] ?( det[ail] )')
exec('sh[ow] lldp')
exec('sh[ow] lldp nei[ghbors] ?( det[ail] )')
exec('sh[ow] span[ning-tree] ?( vlan <num:1-4094> )')
exec('sh[ow] span[ning-tree] summary')
exec('sh[ow] etherchannel summary')
exec('sh[ow] etherchannel port-channel')
exec('sh[ow] ip ro[ute] ?( { ospf | static | connected } )')
exec('sh[ow] ip ro[ute] <ip>')
exec('sh[ow] ipv6 ro[ute] ?( { ospf | static | connected } )')
exec('sh[ow] ipv6 int[erface] br[ief]')
exec('sh[ow] ipv6 int[erface] <if>')
exec('sh[ow] ipv6 nei[ghbors]')
exec('sh[ow] ip ospf')
exec('sh[ow] ip ospf nei[ghbor] ?( det[ail] )')
exec('sh[ow] ip ospf int[erface] ?( br[ief] )')
exec('sh[ow] ip ospf int[erface] <if>')
exec('sh[ow] ip ospf database')
exec('sh[ow] ip protocols')
exec('sh[ow] ipv6 ospf nei[ghbor]')
exec('sh[ow] ipv6 ospf int[erface] ?( br[ief] )')
exec('sh[ow] standby ?( br[ief] )')
exec('sh[ow] vrrp ?( br[ief] )')
exec('sh[ow] ip nat translations ?( verbose )')
exec('sh[ow] ip nat statistics')
exec('sh[ow] access-lists ?( <word> )')
exec('sh[ow] ip access-lists ?( <word> )')
exec('sh[ow] ip dhcp binding')
exec('sh[ow] ip dhcp pool')
exec('sh[ow] ip dhcp conflict')
exec('sh[ow] ip dhcp snooping ?( binding )')
exec('sh[ow] ip arp inspection ?( vlan <vlans> )')
exec('sh[ow] port-security ?( int[erface] <if> )')
exec('sh[ow] storm-control ?( <if> )')
exec('sh[ow] power inline ?( <if> )')
exec('sh[ow] logging', { privOnly: true })
exec('sh[ow] ip ssh')
exec('sh[ow] ssh')
exec('sh[ow] arp')
exec('sh[ow] ip arp')
exec('sh[ow] snmp')
exec('sh[ow] ntp associations')
exec('sh[ow] ntp status')
exec('sh[ow] aaa servers', { privOnly: true })
exec('ping <ip> ?( source <if> )')
exec('ping <ipv6>')
exec('traceroute <ip>')
exec('traceroute <ipv6>')
exec('copy run[ning-config] start[up-config]', { privOnly: true, special: 'copy-run-start' })
exec('copy <word> <word>', { privOnly: true })
exec('wr[ite] ?( mem[ory] )', { privOnly: true, special: 'write' })
exec('clear ip nat translation *', { privOnly: true })
exec('clear mac address-table dynamic', { privOnly: true })
exec('clear ip ospf process', { privOnly: true })

// ---------------------------------------------------------------- navigation in config modes
const ALL_CONFIG: Mode[] = ['config', 'if', 'subif', 'ifrange', 'vlan', 'router', 'rtr6', 'line', 'dhcp', 'stdacl', 'extacl', 'tacacs', 'radius', 'sgroup', 'raguard']
defs.push({ pattern: 'end', modes: ALL_CONFIG, kind: 'nav', nav: 'end', noNo: true })
defs.push({ pattern: 'exit', modes: ['user', 'priv', ...ALL_CONFIG], kind: 'nav', nav: 'exit', noNo: true })
defs.push({ pattern: 'do <line>', modes: ALL_CONFIG, kind: 'nav', nav: 'do', noNo: true })

// ---------------------------------------------------------------- global configuration
const G: Mode[] = ['config']
cfg(G, 'hostname <word>', { slot: 'hostname' })
cfg(G, 'enable secret <word>', { slot: 'enable secret' })
cfg(G, 'enable password <word>', { slot: 'enable password' })
cfg(G, 'service password-encryption', { slot: 'service password-encryption', noStore: true })
cfg(G, 'banner motd <line>', { slot: 'banner motd', special: 'banner' })
cfg(G, 'username <word> ?( privilege <num:0-15> ) { secret | password } <word>', { slot: 'username $1' })
cfg(G, 'ip domain name <word>', { slot: 'ip domain name' })
cfg(G, 'ip domain-name <word>', { slot: 'ip domain name', rewrite: (w) => ['ip', 'domain', 'name', w[2]] })
cfg(G, 'ip domain lookup', { slot: 'ip domain lookup', noStore: true })
cfg(G, 'ip name-server <ip>')
cfg(G, 'ip host <word> <ip>', { slot: 'ip host $2' })
cfg(G, 'crypto key generate rsa ?( modulus <num:360-4096> )', { special: 'rsa', noNo: true })
cfg(G, 'ip ssh version <num:1-2>', { slot: 'ip ssh version' })
cfg(G, 'ip default-gateway <ip>', { slot: 'ip default-gateway', only: SWITCHES })
cfg(G, 'ip routing', { slot: 'ip routing', noStore: true, only: ROUTING })
cfg(G, 'ipv6 unicast-routing', { slot: 'ipv6 unicast-routing', noStore: true, only: ROUTING })
cfg(G, 'ip route <ip> <mask> { <ip> | <if> | <if> <ip> } ?( <num:1-255> )', { only: ROUTING })
cfg(G, 'ipv6 route <ipv6p> { <ipv6> | <if> | <if> <ipv6> } ?( <num:1-254> )', { only: ROUTING })
cfg(G, 'ip dhcp excluded-address <ip> ?( <ip> )')
cfg(G, 'ip dhcp snooping', { slot: 'ip dhcp snooping', only: SWITCHES })
cfg(G, 'ip dhcp snooping vlan <vlans>', { slot: 'ip dhcp snooping vlan', only: SWITCHES })
cfg(G, 'ip dhcp snooping information option', { slot: 'ip dhcp snooping information option', noStore: true, only: SWITCHES })
cfg(G, 'ip arp inspection vlan <vlans>', { slot: 'ip arp inspection vlan', only: SWITCHES })
cfg(G, 'ip nat inside source static <ip> <ip>', { only: ROUTER })
cfg(G, 'ip nat inside source list <word> interface <if> overload', { only: ROUTER })
cfg(G, 'ip nat inside source list <word> pool <word> ?( overload )', { only: ROUTER })
cfg(G, 'ip nat pool <word> <ip> <ip> { netmask <mask> | prefix-length <num:1-32> }', { slot: 'ip nat pool $3', only: ROUTER })
cfg(G, 'access-list <num:1-99> { permit | deny } { any | host <ip> | <ip> ?( <wild> ) }', { special: 'acl-entry' })
cfg(G, 'access-list <num:1300-1999> { permit | deny } { any | host <ip> | <ip> ?( <wild> ) }', { special: 'acl-entry' })
cfg(G, 'access-list <num:1-199> remark <line>', { special: 'acl-entry' })
cfg(G, 'access-list <num:100-199> { permit | deny } { ip | tcp | udp | icmp | ospf | esp | ahp | gre } { any | host <ip> | <ip> <wild> } ?( { eq <port> | gt <port> | lt <port> | neq <port> | range <port> <port> } ) { any | host <ip> | <ip> <wild> } ?( { eq <port> | gt <port> | lt <port> | neq <port> | range <port> <port> } ) ?( established ) ?( log )', { special: 'acl-entry' })
cfg(G, 'access-list <num:2000-2699> { permit | deny } { ip | tcp | udp | icmp | ospf | esp | ahp | gre } { any | host <ip> | <ip> <wild> } ?( { eq <port> | gt <port> | lt <port> | neq <port> | range <port> <port> } ) { any | host <ip> | <ip> <wild> } ?( { eq <port> | gt <port> | lt <port> | neq <port> | range <port> <port> } ) ?( established ) ?( log )', { special: 'acl-entry' })
enter(G, 'ip access-list standard <word>', 'stdacl')
enter(G, 'ip access-list extended <word>', 'extacl')
cfg(G, 'spanning-tree mode { rapid-pvst | pvst | mst }', { slot: 'spanning-tree mode', only: SWITCHES })
cfg(G, 'spanning-tree vlan <vlans> root { primary | secondary }', { slot: 'spanning-tree vlan $2 priority', only: SWITCHES })
cfg(G, 'spanning-tree vlan <vlans> priority <num:0-61440>', { slot: 'spanning-tree vlan $2 priority', only: SWITCHES })
cfg(G, 'spanning-tree portfast default', { slot: 'spanning-tree portfast default', only: SWITCHES })
cfg(G, 'spanning-tree portfast bpduguard default', { slot: 'spanning-tree portfast bpduguard default', only: SWITCHES })
cfg(G, 'spanning-tree loopguard default', { slot: 'spanning-tree loopguard default', only: SWITCHES })
cfg(G, 'cdp run', { slot: 'cdp run', noStore: true })
cfg(G, 'lldp run', { slot: 'lldp run', noStore: true })
cfg(G, 'port-channel load-balance { src-mac | dst-mac | src-dst-mac | src-ip | dst-ip | src-dst-ip }', { slot: 'port-channel load-balance', only: SWITCHES })
cfg(G, 'aaa new-model', { slot: 'aaa new-model' })
cfg(G, 'aaa authentication login default { local | group { tacacs+ | radius | <word> } ?( local ) }', { slot: 'aaa authentication login default' })
cfg(G, 'aaa authorization exec default { local | group { tacacs+ | radius | <word> } ?( local ) }', { slot: 'aaa authorization exec default' })
enter(G, 'tacacs server <word>', 'tacacs')
enter(G, 'radius server <word>', 'radius')
enter(G, 'aaa group server { tacacs+ | radius } <word>', 'sgroup')
cfg(G, 'ip scp server enable', { slot: 'ip scp server enable' })
cfg(G, 'ntp server <ip>')
cfg(G, 'logging host <ip>')
cfg(G, 'logging <ip>', { rewrite: (w) => ['logging', 'host', w[1]] })
cfg(G, 'logging trap <level>', { slot: 'logging trap' })
cfg(G, 'logging buffered <level>', { slot: 'logging buffered' })
cfg(G, 'logging console <level>', { slot: 'logging console' })
cfg(G, 'service timestamps log datetime msec', { slot: 'service timestamps log' })
cfg(G, 'snmp-server community <word> { ro | rw } ?( <word> )', { slot: 'snmp-server community $2' })
cfg(G, 'snmp-server location <line>', { slot: 'snmp-server location' })
cfg(G, 'snmp-server contact <line>', { slot: 'snmp-server contact' })
cfg(G, 'snmp-server host <ip> version { 1 | 2c } <word>', { slot: 'snmp-server host $2' })
cfg(G, 'snmp-server enable traps', { slot: 'snmp-server enable traps' })
enter(G, 'int[erface] <if>', 'if')
enter(G, 'int[erface] range <ifrange>', 'ifrange', { noNo: true })
enter(G, 'vlan <vlans>', 'vlan', { only: SWITCHES })
enter(G, 'router ospf <num:1-65535>', 'router', { only: ROUTING })
enter(G, 'ipv6 router ospf <num:1-65535>', 'rtr6', { only: ROUTING })
enter(G, 'line con[sole] 0', 'line', { noNo: true, rewrite: () => ['line', 'con', '0'] })
enter(G, 'line vty <num:0-15> <num:0-15>', 'line', { noNo: true })
enter(G, 'ip dhcp pool <word>', 'dhcp')
enter(G, 'ipv6 nd raguard policy <word>', 'raguard', { only: SWITCHES })

// ---------------------------------------------------------------- interface configuration
cfg(IFS, 'ip add[ress] <ip> <mask>', { slot: 'ip address' })
cfg(IFS, 'ip add[ress] <ip> <mask> secondary')
cfg(PHYS, 'ip add[ress] dhcp', { slot: 'ip address' })
cfg(IFS, 'ipv6 add[ress] <ipv6p> ?( eui-64 )')
cfg(IFS, 'ipv6 add[ress] <ipv6> link-local', { slot: 'ipv6 address link-local' })
cfg(IFS, 'ipv6 enable', { slot: 'ipv6 enable' })
cfg(IFS, 'shut[down]', { slot: 'shutdown', noStore: true })
cfg(IFS, 'desc[ription] <line>', { slot: 'description' })
cfg(PHYS, 'speed { 10 | 100 | 1000 | auto }', { slot: 'speed' })
cfg(PHYS, 'duplex { full | half | auto }', { slot: 'duplex' })
cfg(PHYS, 'mdix auto', { slot: 'mdix auto', noStore: true, only: SWITCHES })
cfg(PHYS, 'sw[itchport]', { slot: 'switchport', noStore: true, only: L3SWITCH })
cfg(PHYS, 'sw[itchport] mo[de] { acc[ess] | tr[unk] | dynamic auto | dynamic desirable }', { slot: 'switchport mode', only: SWITCHES })
cfg(PHYS, 'sw[itchport] acc[ess] vl[an] <num:1-4094>', { slot: 'switchport access vlan', only: SWITCHES })
cfg(PHYS, 'sw[itchport] voice vl[an] <num:1-4094>', { slot: 'switchport voice vlan', only: SWITCHES })
cfg(PHYS, 'sw[itchport] tr[unk] native vl[an] <num:1-4094>', { slot: 'switchport trunk native vlan', only: SWITCHES })
cfg(PHYS, 'sw[itchport] tr[unk] allowed vl[an] { <vlans> | add <vlans> | remove <vlans> | all | none | except <vlans> }', { slot: 'switchport trunk allowed vlan', special: 'allowed-vlan', only: SWITCHES })
cfg(PHYS, 'sw[itchport] tr[unk] encapsulation dot1q', { slot: 'switchport trunk encapsulation', only: L3SWITCH })
cfg(PHYS, 'sw[itchport] nonegotiate', { slot: 'switchport nonegotiate', only: SWITCHES })
cfg(PHYS, 'sw[itchport] port-security', { slot: 'switchport port-security', only: SWITCHES })
cfg(PHYS, 'sw[itchport] port-security maximum <num:1-8192>', { slot: 'switchport port-security maximum', only: SWITCHES })
cfg(PHYS, 'sw[itchport] port-security violation { protect | restrict | shutdown }', { slot: 'switchport port-security violation', only: SWITCHES })
cfg(PHYS, 'sw[itchport] port-security mac-address sticky', { slot: 'switchport port-security mac-address sticky', only: SWITCHES })
cfg(PHYS, 'sw[itchport] port-security mac-address <mac>', { only: SWITCHES })
cfg(PHYS, 'channel-group <num:1-48> mode { active | passive | on | desirable | auto }', { slot: 'channel-group', only: SWITCHES })
cfg(PHYS, 'spanning-tree portfast', { slot: 'spanning-tree portfast', only: SWITCHES })
cfg(PHYS, 'spanning-tree bpduguard { enable | disable }', { slot: 'spanning-tree bpduguard', only: SWITCHES })
cfg(PHYS, 'spanning-tree guard { root | loop | none }', { slot: 'spanning-tree guard', only: SWITCHES })
cfg(PHYS, 'spanning-tree cost <num:1-200000000>', { slot: 'spanning-tree cost', only: SWITCHES })
cfg(IFS, 'ip ospf <num:1-65535> area <word>', { slot: 'ip ospf area', only: ROUTING })
cfg(IFS, 'ip ospf priority <num:0-255>', { slot: 'ip ospf priority', only: ROUTING })
cfg(IFS, 'ip ospf network { point-to-point | broadcast }', { slot: 'ip ospf network', only: ROUTING })
cfg(IFS, 'ip ospf cost <num:1-65535>', { slot: 'ip ospf cost', only: ROUTING })
cfg(IFS, 'ip ospf hello-interval <num:1-65535>', { slot: 'ip ospf hello-interval', only: ROUTING })
cfg(IFS, 'ip ospf dead-interval <num:1-65535>', { slot: 'ip ospf dead-interval', only: ROUTING })
cfg(IFS, 'ipv6 ospf <num:1-65535> area <word>', { slot: 'ipv6 ospf area', only: ROUTING })
cfg(IFS, 'ip nat { inside | outside }', { slot: 'ip nat', only: ROUTER })
cfg(IFS, 'ip access-group <word> { in | out }', { slot: 'ip access-group $3' })
cfg(IFS, 'ip helper-address <ip>', { only: ROUTING })
cfg(IFS, 'standby version { 1 | 2 }', { slot: 'standby version', only: ROUTING })
cfg(IFS, 'standby <num:0-4095> ip <ip>', { slot: 'standby $1 ip', only: ROUTING })
cfg(IFS, 'standby <num:0-4095> priority <num:0-255>', { slot: 'standby $1 priority', only: ROUTING })
cfg(IFS, 'standby <num:0-4095> preempt', { slot: 'standby $1 preempt', only: ROUTING })
cfg(PHYS, 'ip dhcp snooping trust', { slot: 'ip dhcp snooping trust', only: SWITCHES })
cfg(PHYS, 'ip dhcp snooping limit rate <num:1-2048>', { slot: 'ip dhcp snooping limit rate', only: SWITCHES })
cfg(PHYS, 'ip arp inspection trust', { slot: 'ip arp inspection trust', only: SWITCHES })
cfg(PHYS, 'storm-control { broadcast | multicast | unicast } level <dec>', { slot: 'storm-control $1 level', only: SWITCHES })
cfg(PHYS, 'storm-control action { shutdown | trap }', { slot: 'storm-control action', only: SWITCHES })
cfg(PHYS, 'ipv6 nd raguard attach-policy <word>', { slot: 'ipv6 nd raguard attach-policy', only: SWITCHES })
cfg(PHYS, 'power inline { auto | never }', { slot: 'power inline', only: L3SWITCH })
cfg(PHYS, 'cdp enable', { slot: 'cdp enable', noStore: true })
cfg(PHYS, 'lldp transmit', { slot: 'lldp transmit', noStore: true })
cfg(PHYS, 'lldp receive', { slot: 'lldp receive', noStore: true })
cfg(['subif'], 'encapsulation dot1Q <num:1-4094> ?( native )', { slot: 'encapsulation', only: ROUTER })

// ---------------------------------------------------------------- sub-modes
cfg(['vlan'], 'name <word>', { slot: 'name' })
cfg(['router', 'rtr6'], 'router-id <ip>', { slot: 'router-id' })
cfg(['router'], 'network <ip> <wild> area <word>')
cfg(['router', 'rtr6'], 'passive-interface <if>')
cfg(['router', 'rtr6'], 'passive-interface default', { slot: 'passive-interface default' })
cfg(['router', 'rtr6'], 'default-information originate', { slot: 'default-information originate' })
cfg(['router'], 'auto-cost reference-bandwidth <num:1-4294967>', { slot: 'auto-cost reference-bandwidth' })
cfg(['line'], 'password <word>', { slot: 'password' })
cfg(['line'], 'login', { slot: 'login' })
cfg(['line'], 'login local', { slot: 'login' })
cfg(['line'], 'transport input { ssh | telnet | all | none | telnet ssh | ssh telnet }', { slot: 'transport input' })
cfg(['line'], 'exec-timeout <num:0-35791> ?( <num:0-2147483> )', { slot: 'exec-timeout' })
cfg(['line'], 'logging synchronous', { slot: 'logging synchronous' })
cfg(['line'], 'access-class <word> in', { slot: 'access-class' })
cfg(['dhcp'], 'network <ip> <mask>', { slot: 'network' })
cfg(['dhcp'], 'default-router <ip>', { slot: 'default-router' })
cfg(['dhcp'], 'dns-server <ip>', { slot: 'dns-server' })
cfg(['dhcp'], 'domain-name <word>', { slot: 'domain-name' })
cfg(['dhcp'], 'lease <num:0-365> ?( <num:0-23> )', { slot: 'lease' })
cfg(['stdacl'], '{ permit | deny } { any | host <ip> | <ip> ?( <wild> ) }', { special: 'acl-entry' })
cfg(['stdacl', 'extacl'], 'remark <line>', { special: 'acl-entry' })
cfg(['extacl'], '{ permit | deny } { ip | tcp | udp | icmp | ospf | esp | ahp | gre } { any | host <ip> | <ip> <wild> } ?( { eq <port> | gt <port> | lt <port> | neq <port> | range <port> <port> } ) { any | host <ip> | <ip> <wild> } ?( { eq <port> | gt <port> | lt <port> | neq <port> | range <port> <port> } ) ?( established ) ?( log )', { special: 'acl-entry' })
cfg(['tacacs'], 'address ipv4 <ip>', { slot: 'address ipv4' })
cfg(['tacacs', 'radius'], 'key <word>', { slot: 'key' })
cfg(['radius'], 'address ipv4 <ip> ?( auth-port <num:0-65535> acct-port <num:0-65535> )', { slot: 'address ipv4' })
cfg(['sgroup'], 'server name <word>')
cfg(['raguard'], 'device-role { host | router }', { slot: 'device-role' })

export const COMMANDS: CmdDef[] = defs.map((d) => ({ ...d, tokens: parsePattern(d.pattern) }))

/** The prompt suffix of every mode. */
export const PROMPTS: Record<Mode, string> = {
  user: '>',
  priv: '#',
  config: '(config)#',
  if: '(config-if)#',
  subif: '(config-subif)#',
  ifrange: '(config-if-range)#',
  vlan: '(config-vlan)#',
  router: '(config-router)#',
  rtr6: '(config-rtr)#',
  line: '(config-line)#',
  dhcp: '(dhcp-config)#',
  stdacl: '(config-std-nacl)#',
  extacl: '(config-ext-nacl)#',
  tacacs: '(config-server-tacacs)#',
  radius: '(config-radius-server)#',
  // aaa group server: "(config-sg-tacacs+)#" or "(config-sg-radius)#", picked from the context by promptOf.
  sgroup: '(config-sg-radius)#',
  raguard: '(config-ra-guard)#',
}

/** The sub-mode a stored context belongs to, from its first words. */
export function modeOfContext(context: string): Mode {
  if (!context) return 'config'
  if (context.startsWith('interface ')) return context.includes('.') ? 'subif' : 'if'
  if (context.startsWith('vlan ')) return 'vlan'
  if (context.startsWith('router ospf')) return 'router'
  if (context.startsWith('ipv6 router ospf')) return 'rtr6'
  if (context.startsWith('line ')) return 'line'
  if (context.startsWith('ip dhcp pool')) return 'dhcp'
  if (context.startsWith('ip access-list standard')) return 'stdacl'
  if (context.startsWith('ip access-list extended')) return 'extacl'
  if (context.startsWith('tacacs server')) return 'tacacs'
  if (context.startsWith('radius server')) return 'radius'
  if (context.startsWith('aaa group server')) return 'sgroup'
  if (context.startsWith('ipv6 nd raguard policy')) return 'raguard'
  return 'config'
}
