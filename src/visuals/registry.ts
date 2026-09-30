import type { FC } from 'react'
import type { VisualName } from '../content/visuals'
import { AccountFailover } from './AccountFailover'
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
import { DefenseInDepth } from './DefenseInDepth'
import { DnsDelegation } from './DnsDelegation'
import { EntraObjects } from './EntraObjects'
import { FaultUpdateDomains } from './FaultUpdateDomains'
import { FilesPermissionLayers } from './FilesPermissionLayers'
import { GroupTypes } from './GroupTypes'
import { HealthProbeBlocked } from './HealthProbeBlocked'
import { HybridConnectivity } from './HybridConnectivity'
import { IncrementalVsComplete } from './IncrementalVsComplete'
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
import { SoftDeleteVsVersioning } from './SoftDeleteVsVersioning'
import { SsprLicensing } from './SsprLicensing'
import { StorageRedundancy } from './StorageRedundancy'
import { StorageServices } from './StorageServices'
import { StoredAccessPolicy } from './StoredAccessPolicy'
import { UdrNextHop } from './UdrNextHop'
import { VmResizeFlow } from './VmResizeFlow'
import { VNetAddressPlan } from './VNetAddressPlan'
import { VNetPeering } from './VNetPeering'
import { ZonesInRegion } from './ZonesInRegion'

/** Diagrams drawn so far. A catalog name without a component here renders nothing. */
export const VISUALS: Partial<Record<VisualName, FC>> = {
  AccountFailover,
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
  DefenseInDepth,
  DnsDelegation,
  EntraObjects,
  FaultUpdateDomains,
  FilesPermissionLayers,
  GroupTypes,
  HealthProbeBlocked,
  HybridConnectivity,
  IncrementalVsComplete,
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
  SoftDeleteVsVersioning,
  SsprLicensing,
  StorageRedundancy,
  StorageServices,
  StoredAccessPolicy,
  UdrNextHop,
  VmResizeFlow,
  VNetAddressPlan,
  VNetPeering,
  ZonesInRegion,
}
