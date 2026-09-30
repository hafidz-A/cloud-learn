import type { TemplateExercise } from '../../lib/types'

/** An ARM template or Bicep file with line numbers, so options can say "line 12". Long lines scroll inside the box. */
export function TemplateCode({ language, code }: Pick<TemplateExercise, 'language' | 'code'>) {
  const lines = code.replace(/\n$/, '').split('\n')
  return (
    <figure lang="en" className="overflow-hidden rounded-2xl border-2 border-tinta bg-tinta">
      <figcaption className="border-b border-white/15 px-4 py-2 text-13 font-semibold text-white">
        {language === 'json' ? 'azuredeploy.json (ARM template)' : 'main.bicep'}
      </figcaption>
      <div className="overflow-x-auto py-2" tabIndex={0} role="region" aria-label="Kode template">
        <pre className="font-mono text-13 leading-relaxed text-white">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="w-9 shrink-0 select-none pr-3 text-right text-white/70">
                {i + 1}
              </span>
              <code className="whitespace-pre pr-4">{line || ' '}</code>
            </div>
          ))}
        </pre>
      </div>
    </figure>
  )
}
