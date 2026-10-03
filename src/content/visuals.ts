// The visual catalog (LANGIT_AZ900_PERBAIKAN_MATERI.md section 5). Each entry is
// one diagram component in src/visuals/, with the concept tags it explains. A
// learn card about one of those concepts must show a visual (the validator
// checks this), because the concept is about position, structure, flow, or a
// comparison.

export const VISUAL_CATALOG = {
  // Unit 1
  SharedResponsibility: ['shared-responsibility'],
  CloudModels: ['public-cloud', 'private-cloud', 'hybrid-cloud', 'multi-cloud'],
  CapexVsOpex: ['capex-opex'],
  // Unit 2
  ScaleUpVsOut: ['scalability', 'elasticity'],
  AvailabilityVsReliability: ['high-availability', 'reliability'],
  // Unit 3
  ServiceModelsStack: ['iaas', 'paas', 'saas', 'serverless'],
  // Unit 4
  ZonesInRegion: ['availability-zones'],
  RegionPair: ['region-pairs'],
  ResourceHierarchy: ['resource-hierarchy', 'management-groups'],
  // Unit 5
  ComputeOptions: ['compute-options'],
  // Unit 6
  HybridConnectivity: ['vpn-gateway', 'expressroute'],
  VNetPeering: ['vnet-peering'],
  // Unit 7
  StorageRedundancy: ['primary-redundancy', 'geo-redundancy', 'storage-redundancy'],
  BlobTiers: ['blob-access-tiers', 'blob-tiers'],
  StorageServices: ['storage-services'],
  // Unit 8
  AuthNvsAuthZ: ['authentication-vs-authorization'],
  ConditionalAccessFlow: ['conditional-access'],
  DefenseInDepth: ['defense-in-depth'],
  RbacScope: ['rbac'],
  // Unit 9
  PricingVsTco: ['pricing-calculator', 'tco-calculator'],
  // Unit 10
  PolicyRbacLock: ['azure-policy', 'resource-locks'],
  // Unit 11
  ManagementTools: ['arm'],
  // Unit 12
  ServiceHealthScopes: ['service-health'],
  MonitorPipeline: ['azure-monitor', 'metrics-vs-logs'],

  // AZ-104 (LANGIT_AZ104_PLAN.md section 5, column "Visual")
  // Unit 1
  EntraObjects: ['member-vs-guest'],
  GroupTypes: ['security-vs-m365-group', 'assigned-vs-dynamic-membership'],
  LicenseFlow: ['group-based-licensing'],
  SsprLicensing: ['sspr-licensing'],
  // Unit 2
  RoleScopeTree: ['rbac-scope', 'rbac-inheritance'],
  AzureVsEntraRoles: ['azure-vs-entra-roles'],
  // Unit 3 (lock and hierarchy cards reuse PolicyRbacLock and ResourceHierarchy)
  PolicyFlow: ['policy-definition', 'initiative', 'policy-assignment'],
  // Unit 4 (the first peering card reuses VNetPeering)
  VNetAddressPlan: ['vnet-address-space', 'reserved-ips'],
  PeeringNonTransitive: ['peering-non-transitive'],
  UdrNextHop: ['udr', 'next-hop-types'],
  // Unit 5
  NsgRuleTable: ['nsg-rules', 'nsg-priority', 'nsg-default-rules'],
  NsgEvaluationOrder: ['nsg-subnet-vs-nic'],
  AsgTiers: ['asg'],
  BastionArchitecture: ['bastion', 'bastion-subnet'],
  ServiceVsPrivateEndpoint: ['service-endpoint', 'private-endpoint'],
  // Unit 6
  DnsDelegation: ['dns-delegation'],
  PrivateDnsAutoReg: ['auto-registration'],
  LoadBalancerAnatomy: ['lb-components'],
  HealthProbeBlocked: ['probe-blocked-by-nsg'],
  // Unit 7 (the redundancy card reuses StorageRedundancy)
  AccountFailover: ['storage-failover'],
  ObjectReplication: ['object-replication'],
  // Unit 8
  SasTypes: ['sas-types'],
  StoredAccessPolicy: ['stored-access-policy'],
  FilesPermissionLayers: ['share-vs-file-permissions'],
  // Unit 9 (the tier card reuses BlobTiers)
  BlobLifecycleTimeline: ['lifecycle-rules'],
  SoftDeleteVsVersioning: ['blob-versioning'],
  // Unit 10
  ArmStructure: ['arm-structure'],
  IncrementalVsComplete: ['incremental-vs-complete'],
  // Unit 11
  VmResizeFlow: ['vm-resize'],
  FaultUpdateDomains: ['availability-set'],
  // Unit 12
  AciRestartPolicy: ['restart-policy'],
  ContainerAppsScale: ['scale-to-zero'],
  ContainerOptions: ['container-scaling'],
  // Unit 13
  AppServiceTierLadder: ['plan-tiers'],
  VnetIntegrationVsPrivateEndpoint: ['vnet-integration'],
  SlotSwap: ['slot-settings'],
  // Unit 14 (the metrics card reuses MonitorPipeline)
  KqlPipe: ['kql-basics'],
  AlertFlow: ['alert-processing-rules'],
  // Unit 15
  VaultTypes: ['vault-types'],
  SiteRecoveryFlow: ['failover-commit-reprotect'],

  // CCNA (LANGIT_CCNA_PLAN.md section 6)
  // Unit 1
  OsiTcpIp: ['osi-model', 'tcpip-model'],
  Encapsulation: ['encapsulation'],
  SwitchLearning: ['mac-learning'],
  ArpExchange: ['arp'],
  TcpHandshake: ['tcp-handshake'],
  // Unit 2
  CliModes: ['ios-modes'],
  RunVsStartup: ['running-vs-startup'],
  // Unit 3
  StraightVsCrossover: ['straight-vs-crossover'],
  FiberTypes: ['smf-vs-mmf'],
  DuplexMismatch: ['duplex-mismatch'],
  // Unit 4
  OctetBits: ['binary-octet'],
  SubnetMaskBits: ['subnet-mask'],
  SubnetBlocks: ['subnet-calculation'],
  VlsmPlan: ['vlsm'],
  // Unit 5
  Ipv6Compression: ['ipv6-format'],
  Ipv6AddressTypes: ['ipv6-address-types'],
  Eui64Steps: ['eui-64'],
  SlaacFlow: ['slaac'],
  // Unit 6
  Channels24: ['wifi-channels'],
  RfBehaviors: ['rf-behavior'],
  WifiSecurity: ['wifi-security'],
  BssEss: ['bss-ess'],
  // Unit 7
  HypervisorTypes: ['hypervisor-types'],
  VmVsContainer: ['vm-vs-container'],
  VirtualSwitch: ['virtual-switch'],
  VrfTables: ['vrf'],
  // Unit 8
  ClientIpCommands: ['client-ip-settings'],
  DhcpDora: ['dhcp-dora'],
  DhcpRelay: ['dhcp-relay'],
  // Unit 9
  VlanDomains: ['vlan-concept'],
  VoiceVlan: ['voice-vlan'],
  PoeClasses: ['poe'],
  // Unit 10
  Dot1qTag: ['dot1q-tag'],
  TrunkNative: ['native-vlan'],
  RouterOnAStick: ['router-on-a-stick'],
  SviRouting: ['svi'],
  // Unit 11
  EtherChannelBundle: ['etherchannel'],
  LacpModes: ['lacp-modes'],
  // Unit 12
  CdpVsLldp: ['cdp-vs-lldp'],
  NeighborScope: ['neighbor-scope'],
  // Unit 13
  StpLoop: ['stp-loop'],
  StpRoles: ['stp-roles'],
  StpStates: ['stp-states'],
  StpGuards: ['stp-guards'],
  // Unit 14
  TroubleshootLadder: ['troubleshoot-flow'],
  PingSymbols: ['ping-output'],
  TracerouteTtl: ['traceroute'],
  // Unit 15
  RouteEntry: ['routing-table'],
  LongestPrefix: ['longest-prefix'],
  AdLadder: ['admin-distance'],
  // Unit 16
  StaticBothWays: ['static-route'],
  FloatingStatic: ['floating-static'],
  // Unit 17
  OspfAreas: ['ospf-areas'],
  WildcardMask: ['wildcard-mask'],
  OspfStates: ['ospf-states'],
  DrElection: ['ospf-dr'],
  OspfCost: ['ospf-cost'],
  // Unit 18
  FhrpVirtual: ['fhrp'],
  FhrpCompare: ['fhrp-compare'],
} as const satisfies Record<string, readonly string[]>

export type VisualName = keyof typeof VISUAL_CATALOG

export const VISUAL_NAMES = Object.keys(VISUAL_CATALOG) as VisualName[]

export function isVisualName(name: string): name is VisualName {
  return Object.hasOwn(VISUAL_CATALOG, name)
}

/** Concept tag -> the visuals that explain it. */
export const VISUALS_BY_CONCEPT: ReadonlyMap<string, VisualName[]> = (() => {
  const map = new Map<string, VisualName[]>()
  for (const name of VISUAL_NAMES) for (const concept of VISUAL_CATALOG[name]) map.set(concept, [...(map.get(concept) ?? []), name])
  return map
})()
