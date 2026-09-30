import type { RuleTable } from '../../lib/types'

/**
 * Rule tables as the portal lists them (NSG rules, storage firewall entries,
 * role assignments). A wide table scrolls inside its own box, never the page.
 */
export function RuleTables({ tables }: { tables: RuleTable[] }) {
  return (
    <div className="space-y-4" lang="en">
      {tables.map((table) => (
        <figure key={table.title} className="overflow-hidden rounded-2xl border-2 border-kabut bg-white">
          <figcaption className="bg-tinta px-4 py-2 text-13 font-semibold text-white">{table.title}</figcaption>
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={`Tabel ${table.title}`}>
            <table className="w-full border-collapse text-left text-13">
              <thead>
                <tr className="bg-biru-muda">
                  {table.columns.map((c) => (
                    <th key={c} scope="col" className="whitespace-nowrap px-3 py-2 font-semibold">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, r) => (
                  <tr key={r} className="border-t border-kabut">
                    {row.map((cell, c) => (
                      <td key={c} className={`px-3 py-2 ${c === 0 ? 'font-semibold' : ''} ${/^(Allow|Deny)$/.test(cell) ? 'font-bold' : ''}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      ))}
    </div>
  )
}
