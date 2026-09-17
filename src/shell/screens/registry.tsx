import type { ComponentType } from 'react'

import type { DestinoSlug } from '../destinos'

import { AgendamentosScreen } from './agendamentos-screen'
import { AvisoEscalaScreen } from './aviso-escala-screen'
import { BuscaScreen } from './busca-screen'
import { DiarioMesScreen } from './diario-mes-screen'
import { DiarioScreen } from './diario-screen'
import { InicioScreen } from './inicio-screen'
import { MeusDadosScreen } from './meus-dados-screen'
import { PontosScreen } from './pontos-screen'

/**
 * Slug → screen, the counterpart to each flow's `screens/registry.tsx`. Only the
 * destinations marked `disponivel` in `destinos.ts` appear here.
 */
export const screenComponents: Partial<Record<DestinoSlug, ComponentType>> = {
  inicio: InicioScreen,
  busca: BuscaScreen,
  agendamentos: AgendamentosScreen,
  diario: DiarioScreen,
  'diario-mes': DiarioMesScreen,
  'diario-aviso': AvisoEscalaScreen,
  pontos: PontosScreen,
  'meus-dados': MeusDadosScreen,
}
