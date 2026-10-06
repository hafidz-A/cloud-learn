import type { ChoiceExercise, ExhibitExercise, FixExercise, RulesExercise, TemplateExercise, TopologyExercise } from '../../lib/types'
import type { Look, InputProps } from '../looks'
import { ExhibitScene } from './ExhibitScene'
import { FixScene } from './FixScene'
import { OptionList } from './OptionList'
import { RuleTables } from './RuleTables'
import { TemplateCode } from './TemplateCode'
import { TopologyDiagram } from './TopologyDiagram'

type OneAnswer = ChoiceExercise | FixExercise | RulesExercise | TemplateExercise | TopologyExercise | ExhibitExercise

/** What the player reads before picking: a portal or error scene, rule tables, template code, or a network diagram. */
function Scene({ exercise }: { exercise: OneAnswer }) {
  switch (exercise.type) {
    case 'fix':
      return <FixScene scene={exercise.scene} />
    case 'rules':
      return <RuleTables tables={exercise.tables} />
    case 'template':
      return <TemplateCode language={exercise.language} code={exercise.code} fileName={exercise.fileName} />
    case 'topology':
      return <TopologyDiagram nodes={exercise.nodes} links={exercise.links} />
    case 'exhibit':
      return <ExhibitScene exercise={exercise} />
    default:
      return null
  }
}

/** Pick one of four, optionally under something to read first (fix, rules, template, topology). */
export function ChoiceInput({ exercise, response, onChange, layout, reveal, locked }: InputProps<OneAnswer, number | null>) {
  const lookFor = (option: number): Look => {
    if (!reveal) return option === response ? 'selected' : 'idle'
    if (option === exercise.answer) return 'right'
    return option === response ? 'wrong' : 'dim'
  }
  return (
    <div className="space-y-5">
      <Scene exercise={exercise} />
      <OptionList
        options={exercise.options}
        layout={layout}
        selected={response === null ? [] : [response]}
        onToggle={(o) => onChange(o)}
        lookFor={lookFor}
        locked={reveal || !!locked}
      />
    </div>
  )
}
