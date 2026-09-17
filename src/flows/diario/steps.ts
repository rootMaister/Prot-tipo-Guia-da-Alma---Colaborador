export type StepSlug = 'humor' | 'motivos' | 'complemento' | 'feedback' | 'detalhes'

export type Step = {
  slug: StepSlug
  /** Nome da tela como o frame a chama, para o índice. */
  title: string
  nodeMobile: string
  nodeDesktop: string | null
  /** O fluxo não tem barra de porcentagem; o campo existe para o índice ler todos igual. */
  progress: null
  /**
   * O token de superfície da tela. Só o passo do humor foge do branco: ele é desenhado sobre
   * `surface/muted`, para o orbe não flutuar num fundo da mesma cor.
   */
  superficie: string
}

export const FILE_KEY = 'mHWlzkeyvbLscICaXIjkcG'

/**
 * Registro de humor — seção `2823:20978` da página "Meu diário".
 *
 * Cinco passos: escolher o humor, marcar os motivos, complementar com um texto, a
 * confirmação e os detalhes do registro recém-salvo. Como nos outros fluxos, este arquivo é a
 * única fonte da ordem e do mapa passo→node.
 *
 * Os nodes do passo 1 são os do estado "Difícil"; os outros quatro humores são estados do
 * mesmo frame e estão em `humores.ts`.
 */
export const diarioSteps: readonly Step[] = [
  {
    slug: 'humor',
    title: '1. Humor',
    nodeMobile: '2823:20823',
    nodeDesktop: '2826:2554',
    progress: null,
    superficie: 'surface-muted',
  },
  {
    slug: 'motivos',
    title: '2. Motivos',
    nodeMobile: '2831:1296',
    nodeDesktop: '2831:2227',
    progress: null,
    superficie: 'surface-base',
  },
  {
    slug: 'complemento',
    title: '3. Complemento',
    nodeMobile: '2831:1511',
    nodeDesktop: '2831:2825',
    progress: null,
    superficie: 'surface-base',
  },
  {
    slug: 'feedback',
    title: '4. Feedback',
    nodeMobile: '2833:1948',
    nodeDesktop: '2833:1997',
    progress: null,
    superficie: 'surface-base',
  },
  {
    slug: 'detalhes',
    title: '5. Detalhes do registro',
    nodeMobile: '2834:2098',
    nodeDesktop: '2836:12307',
    progress: null,
    superficie: 'surface-base',
  },
]

export const findStep = (slug: string): Step | undefined =>
  diarioSteps.find((step) => step.slug === slug)

export const getStepIndex = (slug: StepSlug): number =>
  diarioSteps.findIndex((step) => step.slug === slug)

export const getNextStep = (slug: StepSlug): Step | undefined =>
  diarioSteps[getStepIndex(slug) + 1]

export const getPreviousStep = (slug: StepSlug): Step | undefined =>
  diarioSteps[getStepIndex(slug) - 1]
