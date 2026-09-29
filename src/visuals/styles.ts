// Text styles for the diagrams in this folder. Colors come from the palette
// tokens; text uses Tinta so it keeps AA contrast on the light fills. Every
// diagram is drawn in a 300-wide viewBox, so a fontSize of 12 or more stays at
// least 12px on a 390px-wide phone.

export const label = { fill: 'var(--color-tinta)', fontWeight: 600 } as const
export const quiet = { fill: 'var(--color-tinta-lembut)', fontWeight: 600 } as const
