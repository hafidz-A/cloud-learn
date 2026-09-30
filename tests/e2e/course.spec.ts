import { expect, test } from '@playwright/test'
import { AZ104_UNITS, UNITS, isCard, main, play, skipCards } from './helpers'

// The final check of LANGIT_AZ900_PERBAIKAN_MATERI.md (Prompt D): one lesson
// from every unit, played at phone width, with its material and unit guide.
// ALL_LESSONS=1 plays every lesson of every unit instead of the first one.
// AZ-104 units are new, so every lesson of every written unit is played.

test.use({ reducedMotion: 'reduce' })

const COURSE_UNITS = [
  ...UNITS.map((unit, i) => ({ course: 'AZ-900', unit, n: i + 1, lessons: process.env.ALL_LESSONS ? unit.lessons : unit.lessons.slice(0, 1) })),
  ...AZ104_UNITS.map((unit, i) => ({ course: 'AZ-104', unit, n: i + 1, lessons: unit.lessons.filter((l) => l.items.some((it) => !isCard(it))) })),
]

for (const { course, unit, n, lessons } of COURSE_UNITS) {
  for (const [li, lesson] of lessons.entries()) {
    test(`${course} unit ${n} lesson ${li + 1} plays to the end, and its material and guide open`, async ({ page }) => {
      await page.goto(`/#/lesson/${lesson.id}`)

      const exercise = await skipCards(page)
      await page.getByRole('button', { name: 'Lihat materi' }).click()
      const sheet = page.getByRole('dialog', { name: 'Materi' })
      await expect(sheet.getByRole('heading').first()).toBeVisible()
      await sheet.getByRole('button', { name: 'Kembali ke soal' }).click()
      await expect(main(page)).toHaveAttribute('data-item-id', exercise.id)

      await play(page)

      await page.goto(`/#/guide/${unit.id}`)
      await expect(page.getByText(`Panduan unit ${n}`)).toBeVisible()
      const cards = unit.lessons.flatMap((l) => l.items.filter(isCard)) as unknown as { visual?: string }[]
      await expect(page.locator('article')).toHaveCount(cards.length)
      await expect(page.locator('article [data-visual] svg[role="img"]')).toHaveCount(cards.filter((c) => c.visual).length)
    })
  }
}
