import type { TemplateExercise } from '../../lib/types'

/**
 * An ARM template, Bicep file, or other JSON with line numbers, so options can say "line 12".
 * Long lines wrap instead of scrolling: on a phone, a value past the edge of the box is easy to miss, and it is often the answer.
 */
export function TemplateCode({ language, code, fileName }: Pick<TemplateExercise, 'language' | 'code' | 'fileName'>) {
  const lines = code.replace(/\n$/, '').split('\n')
  return (
    <figure lang="en" className="overflow-hidden rounded-2xl border-2 border-tinta bg-tinta">
      <figcaption className="border-b border-white/15 px-4 py-2 text-13 font-semibold text-white">
        {fileName ?? (language === 'json' ? 'azuredeploy.json (ARM template)' : language === 'yaml' ? 'playbook.yml' : 'main.bicep')}
      </figcaption>
      <div className="py-2" role="region" aria-label="Kode template">
        <pre className="font-mono text-13 leading-relaxed text-white">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="w-9 shrink-0 select-none pr-3 text-right text-white/70">
                {i + 1}
              </span>
              <code className="min-w-0 whitespace-pre-wrap pr-4 wrap-anywhere">{line || ' '}</code>
            </div>
          ))}
        </pre>
      </div>
    </figure>
  )
}
