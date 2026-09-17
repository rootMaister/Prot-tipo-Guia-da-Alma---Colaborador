import type { ComponentType } from 'react'

import type { StepSlug } from '../steps'

import { CalmasScreen, NivelScreen, PontosScreen } from './introducao-screens'

/** Slug → tela, como nos outros fluxos. O layout resolve por aqui, não por `<Outlet/>`. */
export const screenComponents: Record<StepSlug, ComponentType> = {
  pontos: PontosScreen,
  calmas: CalmasScreen,
  nivel: NivelScreen,
}
