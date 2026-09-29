import { MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'

/**
 * Mouse drags start after a small move; touch drags start after a short press,
 * so a quick swipe still scrolls the page and a tap stays a tap (tap-to-place).
 */
export function useDragSensors() {
  return useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } }),
  )
}
