import type { ConfigValue, Exercise } from '../lib/types'
import type { Response } from './logic'
import { ChoiceInput } from './inputs/ChoiceInput'
import { ConfigInput } from './inputs/ConfigInput'
import { FillInput } from './inputs/FillInput'
import { KqlInput } from './inputs/KqlInput'
import { MatchInput } from './inputs/MatchInput'
import { MultiInput } from './inputs/MultiInput'
import { OrderInput } from './inputs/OrderInput'
import { PlaceInput } from './inputs/PlaceInput'
import { ShellInput } from './inputs/ShellInput'
import { SortInput } from './inputs/SortInput'
import { TrueFalseInput } from './inputs/TrueFalseInput'
import { YesNoInput } from './inputs/YesNoInput'

type Props = {
  exercise: Exercise
  response: Response
  onChange: (r: Response) => void
  layout: number[]
  reveal: boolean
  locked?: boolean
}

/** Renders the answer input for any exercise type. */
export function ExerciseInput({ exercise, response, onChange, ...rest }: Props) {
  // Each input only ever receives the response shape of its own type (see logic.ts).
  const change = onChange
  switch (exercise.type) {
    case 'choice':
    case 'fix':
    case 'rules':
    case 'template':
    case 'topology':
      return <ChoiceInput exercise={exercise} response={response as number | null} onChange={change} {...rest} />
    case 'multi':
      return <MultiInput exercise={exercise} response={response as number[]} onChange={change} {...rest} />
    case 'truefalse':
      return <TrueFalseInput exercise={exercise} response={response as boolean | null} onChange={change} {...rest} />
    case 'yesno':
      return <YesNoInput exercise={exercise} response={response as (boolean | null)[]} onChange={change} {...rest} />
    case 'match':
      return <MatchInput exercise={exercise} response={response as (number | null)[]} onChange={change} {...rest} />
    case 'order':
      return <OrderInput exercise={exercise} response={response as number[]} onChange={change} {...rest} />
    case 'sort':
      return <SortInput exercise={exercise} response={response as (number | null)[]} onChange={change} {...rest} />
    case 'fill':
      return <FillInput exercise={exercise} response={response as (number | null)[]} onChange={change} {...rest} />
    case 'place':
      return <PlaceInput exercise={exercise} response={response as (number | null)[]} onChange={change} {...rest} />
    case 'shell':
      return <ShellInput exercise={exercise} response={response as number[]} onChange={change} {...rest} />
    case 'config':
      return <ConfigInput exercise={exercise} response={response as (ConfigValue | null)[]} onChange={change} {...rest} />
    case 'kql':
      return <KqlInput exercise={exercise} response={response as number[]} onChange={change} {...rest} />
  }
}
