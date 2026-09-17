export type StepSlug = 'pontos' | 'calmas' | 'nivel'

export type Step = {
  slug: StepSlug
  /** Nome da tela como o frame a chama, para o índice. */
  title: string
  nodeMobile: string
  nodeDesktop: string | null
  /**
   * O fluxo não tem barra de porcentagem — são três segmentos. Fica como campo, sempre
   * nulo, para o índice ler todos os fluxos do mesmo jeito.
   */
  progress: null
}

export const FILE_KEY = 'mHWlzkeyvbLscICaXIjkcG'

/**
 * Introdução à gamificação — seção `2856:384` da página "Meus pontos".
 *
 * Três telas que explicam pontos, Calmas e nível para quem está chegando. Como nos outros
 * fluxos, este arquivo é a única fonte da ordem e do mapa passo→node.
 */
export const introducaoSteps: readonly Step[] = [
  {
    slug: 'pontos',
    title: '1. Pontos',
    nodeMobile: '2856:385',
    nodeDesktop: '2856:510',
    progress: null,
  },
  {
    slug: 'calmas',
    title: '2. Calmas',
    nodeMobile: '2856:429',
    nodeDesktop: '2856:612',
    progress: null,
  },
  {
    slug: 'nivel',
    title: '3. Nível',
    nodeMobile: '2856:468',
    nodeDesktop: '2856:713',
    progress: null,
  },
]

export const TOTAL_PASSOS = introducaoSteps.length

export const findStep = (slug: string): Step | undefined =>
  introducaoSteps.find((step) => step.slug === slug)

export const getStepIndex = (slug: StepSlug): number =>
  introducaoSteps.findIndex((step) => step.slug === slug)

export const getNextStep = (slug: StepSlug): Step | undefined =>
  introducaoSteps[getStepIndex(slug) + 1]

export const getPreviousStep = (slug: StepSlug): Step | undefined =>
  introducaoSteps[getStepIndex(slug) - 1]
