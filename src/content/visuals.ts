/** Diagram names an intro card may use in its "visual" field. Drawn in src/lesson/visuals.tsx. */
export const VISUAL_NAMES = ['ZonesInRegion', 'RegionPair'] as const

export type VisualName = (typeof VISUAL_NAMES)[number]
