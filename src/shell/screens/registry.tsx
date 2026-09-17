import type { ComponentType } from 'react'

import type { DestinoSlug } from '../destinos'

import { AgendamentosScreen } from './agendamentos-screen'
import { BuscaScreen } from './busca-screen'
import { InicioScreen } from './inicio-screen'
import { MeusDadosScreen } from './meus-dados-screen'

/**
 * Slug → screen, the counterpart to each flow's `screens/registry.tsx`. Only the
 * destinations marked `disponivel` in `destinos.ts` appear here.
 */
export const screenComponents: Partial<Record<DestinoSlug, ComponentType>> = {
  inicio: InicioScreen,
  busca: BuscaScreen,
  agendamentos: AgendamentosScreen,
  'meus-dados': MeusDadosScreen,
}
