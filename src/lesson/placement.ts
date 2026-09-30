import type { PlacementResult } from '../lib/types'

/** Share of a unit's placement questions to answer right before it may be marked done (LANGIT_AZ104_PLAN.md section 3). */
export const PLACEMENT_PASS = 0.8

/** Units that may be marked done after the placement test. */
export function placementPassed(units: PlacementResult['units']): string[] {
  return Object.entries(units)
    .filter(([, s]) => s.total > 0 && s.right / s.total >= PLACEMENT_PASS)
    .map(([id]) => id)
}
