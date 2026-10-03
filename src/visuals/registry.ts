import type { FC } from 'react'
import type { VisualName } from '../content/visuals'
import { OsiTcpIp } from './OsiTcpIp'
import { Encapsulation } from './Encapsulation'
import { SwitchLearning } from './SwitchLearning'
import { ArpExchange } from './ArpExchange'
import { TcpHandshake } from './TcpHandshake'
import { CliModes } from './CliModes'
import { RunVsStartup } from './RunVsStartup'
import { StraightVsCrossover } from './StraightVsCrossover'
import { FiberTypes } from './FiberTypes'
import { DuplexMismatch } from './DuplexMismatch'
import { OctetBits } from './OctetBits'
import { SubnetMaskBits } from './SubnetMaskBits'
import { SubnetBlocks } from './SubnetBlocks'
import { VlsmPlan } from './VlsmPlan'
import { Ipv6Compression } from './Ipv6Compression'
import { Ipv6AddressTypes } from './Ipv6AddressTypes'
import { Eui64Steps } from './Eui64Steps'
import { SlaacFlow } from './SlaacFlow'
import { Channels24 } from './Channels24'
import { RfBehaviors } from './RfBehaviors'
import { WifiSecurity } from './WifiSecurity'
import { BssEss } from './BssEss'
import { HypervisorTypes } from './HypervisorTypes'
import { VmVsContainer } from './VmVsContainer'
import { VirtualSwitch } from './VirtualSwitch'
import { VrfTables } from './VrfTables'
import { ClientIpCommands } from './ClientIpCommands'
import { DhcpDora } from './DhcpDora'
import { DhcpRelay } from './DhcpRelay'
import { VlanDomains } from './VlanDomains'
import { VoiceVlan } from './VoiceVlan'
import { PoeClasses } from './PoeClasses'
import { Dot1qTag } from './Dot1qTag'
import { TrunkNative } from './TrunkNative'
import { RouterOnAStick } from './RouterOnAStick'
import { SviRouting } from './SviRouting'
import { EtherChannelBundle } from './EtherChannelBundle'
import { LacpModes } from './LacpModes'
import { CdpVsLldp } from './CdpVsLldp'
import { NeighborScope } from './NeighborScope'
import { StpLoop } from './StpLoop'
import { StpRoles } from './StpRoles'
import { StpStates } from './StpStates'
import { StpGuards } from './StpGuards'
import { TroubleshootLadder } from './TroubleshootLadder'
import { PingSymbols } from './PingSymbols'
import { TracerouteTtl } from './TracerouteTtl'
import { RouteEntry } from './RouteEntry'
import { LongestPrefix } from './LongestPrefix'
import { AdLadder } from './AdLadder'
import { StaticBothWays } from './StaticBothWays'
import { FloatingStatic } from './FloatingStatic'
import { OspfAreas } from './OspfAreas'
import { WildcardMask } from './WildcardMask'
import { OspfStates } from './OspfStates'
import { DrElection } from './DrElection'
import { OspfCost } from './OspfCost'
import { FhrpVirtual } from './FhrpVirtual'
import { FhrpCompare } from './FhrpCompare'
import { CryptoBasics } from './CryptoBasics'
import { SshSetup } from './SshSetup'
import { AaaFlow } from './AaaFlow'
import { TacacsRadius } from './TacacsRadius'
import { NatTerms } from './NatTerms'
import { NatTypes } from './NatTypes'
import { PatPorts } from './PatPorts'
import { AccountFailover } from './AccountFailover'
import { AciRestartPolicy } from './AciRestartPolicy'
import { AlertFlow } from './AlertFlow'
import { AppServiceTierLadder } from './AppServiceTierLadder'
import { ArmStructure } from './ArmStructure'
import { AsgTiers } from './AsgTiers'
import { AuthNvsAuthZ } from './AuthNvsAuthZ'
import { AvailabilityVsReliability } from './AvailabilityVsReliability'
import { AzureVsEntraRoles } from './AzureVsEntraRoles'
import { BastionArchitecture } from './BastionArchitecture'
import { BlobLifecycleTimeline } from './BlobLifecycleTimeline'
import { BlobTiers } from './BlobTiers'
import { CapexVsOpex } from './CapexVsOpex'
import { CloudModels } from './CloudModels'
import { ComputeOptions } from './ComputeOptions'
import { ConditionalAccessFlow } from './ConditionalAccessFlow'
import { ContainerAppsScale } from './ContainerAppsScale'
import { ContainerOptions } from './ContainerOptions'
import { DefenseInDepth } from './DefenseInDepth'
import { DnsDelegation } from './DnsDelegation'
import { EntraObjects } from './EntraObjects'
import { FaultUpdateDomains } from './FaultUpdateDomains'
import { FilesPermissionLayers } from './FilesPermissionLayers'
import { GroupTypes } from './GroupTypes'
import { HealthProbeBlocked } from './HealthProbeBlocked'
import { HybridConnectivity } from './HybridConnectivity'
import { IncrementalVsComplete } from './IncrementalVsComplete'
import { KqlPipe } from './KqlPipe'
import { LicenseFlow } from './LicenseFlow'
import { LoadBalancerAnatomy } from './LoadBalancerAnatomy'
import { ManagementTools } from './ManagementTools'
import { MonitorPipeline } from './MonitorPipeline'
import { NsgEvaluationOrder } from './NsgEvaluationOrder'
import { NsgRuleTable } from './NsgRuleTable'
import { ObjectReplication } from './ObjectReplication'
import { PeeringNonTransitive } from './PeeringNonTransitive'
import { PolicyFlow } from './PolicyFlow'
import { PolicyRbacLock } from './PolicyRbacLock'
import { PricingVsTco } from './PricingVsTco'
import { PrivateDnsAutoReg } from './PrivateDnsAutoReg'
import { RbacScope } from './RbacScope'
import { RegionPair } from './RegionPair'
import { ResourceHierarchy } from './ResourceHierarchy'
import { RoleScopeTree } from './RoleScopeTree'
import { SasTypes } from './SasTypes'
import { ScaleUpVsOut } from './ScaleUpVsOut'
import { ServiceHealthScopes } from './ServiceHealthScopes'
import { ServiceModelsStack } from './ServiceModelsStack'
import { ServiceVsPrivateEndpoint } from './ServiceVsPrivateEndpoint'
import { SharedResponsibility } from './SharedResponsibility'
import { SiteRecoveryFlow } from './SiteRecoveryFlow'
import { SlotSwap } from './SlotSwap'
import { SoftDeleteVsVersioning } from './SoftDeleteVsVersioning'
import { SsprLicensing } from './SsprLicensing'
import { StorageRedundancy } from './StorageRedundancy'
import { StorageServices } from './StorageServices'
import { StoredAccessPolicy } from './StoredAccessPolicy'
import { UdrNextHop } from './UdrNextHop'
import { VaultTypes } from './VaultTypes'
import { VmResizeFlow } from './VmResizeFlow'
import { VNetAddressPlan } from './VNetAddressPlan'
import { VnetIntegrationVsPrivateEndpoint } from './VnetIntegrationVsPrivateEndpoint'
import { VNetPeering } from './VNetPeering'
import { ZonesInRegion } from './ZonesInRegion'

/** Diagrams drawn so far. A catalog name without a component here renders nothing. */
export const VISUALS: Partial<Record<VisualName, FC>> = {
  PatPorts,
  NatTypes,
  NatTerms,
  TacacsRadius,
  AaaFlow,
  SshSetup,
  CryptoBasics,
  FhrpCompare,
  FhrpVirtual,
  OspfCost,
  DrElection,
  OspfStates,
  WildcardMask,
  OspfAreas,
  FloatingStatic,
  StaticBothWays,
  AdLadder,
  LongestPrefix,
  RouteEntry,
  TracerouteTtl,
  PingSymbols,
  TroubleshootLadder,
  StpGuards,
  StpStates,
  StpRoles,
  StpLoop,
  NeighborScope,
  CdpVsLldp,
  LacpModes,
  EtherChannelBundle,
  SviRouting,
  RouterOnAStick,
  TrunkNative,
  Dot1qTag,
  PoeClasses,
  VoiceVlan,
  VlanDomains,
  DhcpRelay,
  DhcpDora,
  ClientIpCommands,
  VrfTables,
  VirtualSwitch,
  VmVsContainer,
  HypervisorTypes,
  BssEss,
  WifiSecurity,
  RfBehaviors,
  Channels24,
  SlaacFlow,
  Eui64Steps,
  Ipv6AddressTypes,
  Ipv6Compression,
  VlsmPlan,
  SubnetBlocks,
  SubnetMaskBits,
  OctetBits,
  DuplexMismatch,
  FiberTypes,
  StraightVsCrossover,
  RunVsStartup,
  CliModes,
  TcpHandshake,
  ArpExchange,
  SwitchLearning,
  Encapsulation,
  OsiTcpIp,
  AccountFailover,
  AciRestartPolicy,
  AlertFlow,
  AppServiceTierLadder,
  ArmStructure,
  AsgTiers,
  AuthNvsAuthZ,
  AvailabilityVsReliability,
  AzureVsEntraRoles,
  BastionArchitecture,
  BlobLifecycleTimeline,
  BlobTiers,
  CapexVsOpex,
  CloudModels,
  ComputeOptions,
  ConditionalAccessFlow,
  ContainerAppsScale,
  ContainerOptions,
  DefenseInDepth,
  DnsDelegation,
  EntraObjects,
  FaultUpdateDomains,
  FilesPermissionLayers,
  GroupTypes,
  HealthProbeBlocked,
  HybridConnectivity,
  IncrementalVsComplete,
  KqlPipe,
  LicenseFlow,
  LoadBalancerAnatomy,
  ManagementTools,
  MonitorPipeline,
  NsgEvaluationOrder,
  NsgRuleTable,
  ObjectReplication,
  PeeringNonTransitive,
  PolicyFlow,
  PolicyRbacLock,
  PricingVsTco,
  PrivateDnsAutoReg,
  RbacScope,
  RegionPair,
  ResourceHierarchy,
  RoleScopeTree,
  SasTypes,
  ScaleUpVsOut,
  ServiceHealthScopes,
  ServiceModelsStack,
  ServiceVsPrivateEndpoint,
  SharedResponsibility,
  SiteRecoveryFlow,
  SlotSwap,
  SoftDeleteVsVersioning,
  SsprLicensing,
  StorageRedundancy,
  StorageServices,
  StoredAccessPolicy,
  UdrNextHop,
  VaultTypes,
  VmResizeFlow,
  VNetAddressPlan,
  VnetIntegrationVsPrivateEndpoint,
  VNetPeering,
  ZonesInRegion,
}
