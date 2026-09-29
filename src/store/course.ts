import { useEffect } from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { courseOf } from '../content/course'
import type { CourseId } from '../lib/types'

// The course the app shows (LANGIT_AZ104_PLAN.md section 3): the path map,
// practice, stats, and exam page follow it. It is kept per device and not
// synced, like a screen setting, so each device opens the course last played on it.

type CourseState = {
  active: CourseId
  setActive: (course: CourseId) => void
}

export const useCourse = create<CourseState>()(
  persist((set) => ({ active: 'az900', setActive: (active) => set({ active }) }), {
    name: 'langit-course',
    version: 1,
    storage: createJSONStorage(() => localStorage),
    partialize: ({ active }) => ({ active }),
  }),
)

export function useActiveCourse(): CourseId {
  return useCourse((s) => s.active)
}

/**
 * Makes the course of a lesson or checkpoint the active one while it is played,
 * even when it was opened from a link. "Latihan untuk isi hearts" and "Latihan
 * dulu" then practice that course, and "Lanjut" returns to its path map.
 */
export function useFollowCourse(id: string) {
  useEffect(() => {
    useCourse.getState().setActive(courseOf(id))
  }, [id])
}
