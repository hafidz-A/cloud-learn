import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { COURSES } from '../content/course'
import { GLOSSARY } from '../content/glossary'

export function GlossaryScreen() {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const results = useMemo(
    () =>
      GLOSSARY.filter(
        (e) => !q || e.term.toLowerCase().includes(q) || e.expansion.toLowerCase().includes(q) || e.description.toLowerCase().includes(q),
      ),
    [q],
  )

  return (
    <main className="px-4 pb-32 pt-6">
      <h1 className="font-display text-28 font-bold">Glosarium</h1>
      <p className="mt-1 text-15 text-tinta-lembut">
        Semua singkatan di Langit. Di dalam soal, tahan tap pada singkatan yang bergaris titik untuk membuka kartunya.
      </p>
      <label className="mt-4 flex min-h-12 items-center gap-2 rounded-2xl border-2 border-kabut bg-white px-3 focus-within:border-biru">
        <Search size={20} className="text-tinta-lembut" aria-hidden="true" />
        <span className="sr-only">Cari singkatan</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari, misalnya NSG atau storage"
          className="min-w-0 flex-1 bg-transparent py-2 text-17 outline-none placeholder:text-tinta-lembut"
        />
      </label>
      <p className="mt-3 text-13 text-tinta-lembut" aria-live="polite">
        {results.length} dari {GLOSSARY.length} singkatan
      </p>
      <ul className="mt-2 space-y-3">
        {results.map((e) => (
          <li key={`${e.term}-${e.course ?? ''}`} className="rounded-2xl border-2 border-kabut bg-white p-4">
            <p className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-display text-20 font-bold">{e.term}</span>
              {e.course && (
                <span className="rounded-lg bg-biru-muda px-2 py-0.5 font-display text-13 font-semibold">di {COURSES[e.course].name}</span>
              )}
              <span lang="en" className="text-15 font-bold">
                {e.expansion}
              </span>
            </p>
            <p className="mt-1 text-15 text-tinta-lembut">{e.description}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
