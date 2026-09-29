import { expect, test } from '@playwright/test'
import { UNITS, isCard, main, play, skipCards } from './helpers'

// The final check of LANGIT_AZ900_PERBAIKAN_MATERI.md (Prompt D): one lesson
// from every unit, played at phone width, with its material and unit guide.
// ALL_LESSONS=1 plays every lesson of every unit instead of the first one.

test.use({ reducedMotion: 'reduce' })

for (const [i, unit] of UNITS.entries()) {
  const lessons = process.env.ALL_LESSONS ? unit.lessons : unit.lessons.slice(0, 1)
  for (const [li, lesson] of lessons.entries()) {
    test(`unit ${i + 1} lesson ${li + 1} plays to the end, and its material and guide open`, async ({ page }) => {
      await page.goto(`/#/lesson/${lesson.id}`)

      const exercise = await skipCards(page)
      await page.getByRole('button', { name: 'Lihat materi' }).click()
      const sheet = page.getByRole('dialog', { name: 'Materi' })
      await expect(sheet.getByRole('heading').first()).toBeVisible()
      await sheet.getByRole('button', { name: 'Kembali ke soal' }).click()
      await expect(main(page)).toHaveAttribute('data-item-id', exercise.id)

      await play(page)

      await page.goto(`/#/guide/${unit.id}`)
      await expect(page.getByText(`Panduan unit ${i + 1}`)).toBeVisible()
      const cards = unit.lessons.flatMap((l) => l.items.filter(isCard)) as unknown as { visual?: string }[]
      await expect(page.locator('article')).toHaveCount(cards.length)
      await expect(page.locator('article [data-visual] svg[role="img"]')).toHaveCount(cards.filter((c) => c.visual).length)
    })
  }
}
