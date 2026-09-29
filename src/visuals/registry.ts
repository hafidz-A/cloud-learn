import type { FC } from 'react'
import type { VisualName } from '../content/visuals'
import { DefenseInDepth } from './DefenseInDepth'
import { RegionPair } from './RegionPair'
import { ResourceHierarchy } from './ResourceHierarchy'
import { SharedResponsibility } from './SharedResponsibility'
import { StorageRedundancy } from './StorageRedundancy'
import { ZonesInRegion } from './ZonesInRegion'

/** Diagrams drawn so far. A catalog name without a component here renders nothing. */
export const VISUALS: Partial<Record<VisualName, FC>> = {
  DefenseInDepth,
  RegionPair,
  ResourceHierarchy,
  SharedResponsibility,
  StorageRedundancy,
  ZonesInRegion,
}
