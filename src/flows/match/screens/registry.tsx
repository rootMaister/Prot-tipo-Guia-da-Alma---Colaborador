import type { ComponentType } from 'react'

import type { StepSlug } from '../steps'
import { InicioScreen } from './inicio-screen'
import { OQueTeTrazScreen } from './o-que-te-traz-screen'
import { PreferenciaAbordagemScreen } from './preferencia-abordagem-screen'
import { SessoesRecomendadasScreen } from './sessoes-recomendadas-screen'
import { SuasSessoesScreen } from './suas-sessoes-screen'

/** Maps each step to the component that renders it. */
export const screenComponents: Record<StepSlug, ComponentType> = {
  inicio: InicioScreen,
  'o-que-te-traz': OQueTeTrazScreen,
  'preferencia-abordagem': PreferenciaAbordagemScreen,
  'suas-sessoes': SuasSessoesScreen,
  'sessoes-recomendadas': SessoesRecomendadasScreen,
}
