import type { ComponentType } from 'react'

import type { StepSlug } from '../steps'

import {
  ComplementoScreen,
  DetalhesScreen,
  FeedbackScreen,
  HumorScreen,
  MotivosScreen,
} from './registro-screens'

/** Slug → tela, como nos outros fluxos. O layout resolve por aqui, não por `<Outlet/>`. */
export const screenComponents: Record<StepSlug, ComponentType> = {
  humor: HumorScreen,
  motivos: MotivosScreen,
  complemento: ComplementoScreen,
  feedback: FeedbackScreen,
  detalhes: DetalhesScreen,
}
