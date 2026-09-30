import type { FC } from 'react'
import type { VisualName } from '../content/visuals'
import { AsgTiers } from './AsgTiers'
import { AuthNvsAuthZ } from './AuthNvsAuthZ'
import { AvailabilityVsReliability } from './AvailabilityVsReliability'
import { AzureVsEntraRoles } from './AzureVsEntraRoles'
import { BastionArchitecture } from './BastionArchitecture'
import { BlobTiers } from './BlobTiers'
import { CapexVsOpex } from './CapexVsOpex'
import { CloudModels } from './CloudModels'
import { ComputeOptions } from './ComputeOptions'
import { ConditionalAccessFlow } from './ConditionalAccessFlow'
import { DefenseInDepth } from './DefenseInDepth'
import { EntraObjects } from './EntraObjects'
import { GroupTypes } from './GroupTypes'
import { HybridConnectivity } from './HybridConnectivity'
import { LicenseFlow } from './LicenseFlow'
import { ManagementTools } from './ManagementTools'
import { MonitorPipeline } from './MonitorPipeline'
import { NsgEvaluationOrder } from './NsgEvaluationOrder'
import { NsgRuleTable } from './NsgRuleTable'
import { PeeringNonTransitive } from './PeeringNonTransitive'
import { PolicyFlow } from './PolicyFlow'
import { PolicyRbacLock } from './PolicyRbacLock'
import { PricingVsTco } from './PricingVsTco'
import { RbacScope } from './RbacScope'
import { RegionPair } from './RegionPair'
import { ResourceHierarchy } from './ResourceHierarchy'
import { RoleScopeTree } from './RoleScopeTree'
import { ScaleUpVsOut } from './ScaleUpVsOut'
import { ServiceHealthScopes } from './ServiceHealthScopes'
import { ServiceModelsStack } from './ServiceModelsStack'
import { ServiceVsPrivateEndpoint } from './ServiceVsPrivateEndpoint'
import { SharedResponsibility } from './SharedResponsibility'
import { SsprLicensing } from './SsprLicensing'
import { StorageRedundancy } from './StorageRedundancy'
import { StorageServices } from './StorageServices'
import { UdrNextHop } from './UdrNextHop'
import { VNetAddressPlan } from './VNetAddressPlan'
import { VNetPeering } from './VNetPeering'
import { ZonesInRegion } from './ZonesInRegion'

/** Diagrams drawn so far. A catalog name without a component here renders nothing. */
export const VISUALS: Partial<Record<VisualName, FC>> = {
  AsgTiers,
  AuthNvsAuthZ,
  AvailabilityVsReliability,
  AzureVsEntraRoles,
  BastionArchitecture,
  BlobTiers,
  CapexVsOpex,
  CloudModels,
  ComputeOptions,
  ConditionalAccessFlow,
  DefenseInDepth,
  EntraObjects,
  GroupTypes,
  HybridConnectivity,
  LicenseFlow,
  ManagementTools,
  MonitorPipeline,
  NsgEvaluationOrder,
  NsgRuleTable,
  PeeringNonTransitive,
  PolicyFlow,
  PolicyRbacLock,
  PricingVsTco,
  RbacScope,
  RegionPair,
  ResourceHierarchy,
  RoleScopeTree,
  ScaleUpVsOut,
  ServiceHealthScopes,
  ServiceModelsStack,
  ServiceVsPrivateEndpoint,
  SharedResponsibility,
  SsprLicensing,
  StorageRedundancy,
  StorageServices,
  UdrNextHop,
  VNetAddressPlan,
  VNetPeering,
  ZonesInRegion,
}
