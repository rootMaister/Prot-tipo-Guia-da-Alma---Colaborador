import type { ComponentType } from 'react'

import type { StepSlug } from '../steps'
import { AnaliseScreen } from './analise-screen'
import { AprovadoScreen } from './aprovado-screen'
import { ConsentimentoScreen } from './consentimento-screen'
import { ReprovadoScreen } from './reprovado-screen'
import { DadosPessoaisScreen } from './dados-pessoais-screen'
import { EmpresaEncontradaScreen } from './empresa-encontrada-screen'
import { EmpresaScreen } from './empresa-screen'
import { SenhaScreen } from './senha-screen'
import { SplashScreen } from './splash-screen'
import { WelcomeScreen } from './welcome-screen'

/** Maps each step to the component that renders it. */
export const screenComponents: Record<StepSlug, ComponentType> = {
  splash: SplashScreen,
  welcome: WelcomeScreen,
  empresa: EmpresaScreen,
  'empresa-encontrada': EmpresaEncontradaScreen,
  consentimento: ConsentimentoScreen,
  'dados-pessoais': DadosPessoaisScreen,
  senha: SenhaScreen,
  analise: AnaliseScreen,
  aprovado: AprovadoScreen,
  reprovado: ReprovadoScreen,
}
