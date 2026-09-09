import type { ComponentType } from 'react'

import type { StepSlug } from '../steps'
import { AgendadaScreen } from './agendada-screen'
import { ConfirmarScreen } from './confirmar-screen'
import { DetalhesScreen } from './detalhes-screen'
import { HorarioScreen } from './horario-screen'
import { InformacoesScreen } from './informacoes-screen'

/** Maps each step to the component that renders it. */
export const screenComponents: Record<StepSlug, ComponentType> = {
  detalhes: DetalhesScreen,
  horario: HorarioScreen,
  informacoes: InformacoesScreen,
  confirmar: ConfirmarScreen,
  agendada: AgendadaScreen,
}
