import type { ComponentType } from 'react'

import type { StepSlug } from '../steps'
import { AgradecimentoScreen, ApoioScreen, ProximaScreen } from './finais-screens'
import {
  AcolhimentoScreen,
  ChamadaScreen,
  NotaScreen,
  ReflexaoScreen,
} from './perguntas-screens'
import { RealizadaScreen } from './realizada-screen'

/** Maps each step to the component that renders it. */
export const screenComponents: Record<StepSlug, ComponentType> = {
  realizada: RealizadaScreen,
  acolhimento: AcolhimentoScreen,
  reflexao: ReflexaoScreen,
  chamada: ChamadaScreen,
  nota: NotaScreen,
  agradecimento: AgradecimentoScreen,
  apoio: ApoioScreen,
  proxima: ProximaScreen,
}
