/**
 * Single source of truth for the Avaliação flow: order, URLs, question number and the Figma
 * node each screen was built from. Same shape as the other three flows.
 *
 * Page "Avaliação" (1769:9713), section "Avaliação pós-sessão" (2288:12017). The flow is the
 * post-session one: it opens on "Sessão realizada", asks four questions and ends on one of
 * three screens.
 *
 * Unlike the other flows it is **not linear at the end**. Order here only drives the slide
 * direction and the index page; which ending the person reaches is decided by the answers,
 * in `avaliacao-provider.tsx`, and the skip buttons jump straight to `proxima`.
 */

export type StepSlug =
  | 'realizada'
  | 'acolhimento'
  | 'reflexao'
  | 'chamada'
  | 'nota'
  | 'agradecimento'
  | 'apoio'
  | 'proxima'

export type Step = {
  slug: StepSlug
  /** Screen name as it reads in Figma, for the index page and for re-finding the node. */
  title: string
  /** Figma node id for the mobile frame. */
  nodeMobile: string
  /** Figma node id for the desktop frame — every desktop frame is a modal over the app. */
  nodeDesktop: string | null
  /**
   * The flow has no percentage bar: its header is "Pergunta 1 de 4" over four segments. Kept
   * as a field, always null, so the index page reads every flow the same way.
   */
  progress: null
  /** Which of the four questions this is, or null on the screens without the header. */
  pergunta: number | null
}

export const AVALIACAO_FILE_KEY = 'mHWlzkeyvbLscICaXIjkcG'

export const TOTAL_PERGUNTAS = 4

/**
 * Frames that are states of a screen rather than steps of their own. The names in Figma
 * number them differently from the screen order — "02 · Acolhimento" is question 1, "2a.
 * Avaliação" is question 4 — so the nodes are kept here to be found again.
 */
export const VARIANT_NODES = {
  chamadaSemProblemas: { mobile: '2775:18593', desktop: '2792:2558' },
  chamadaProblemaReportado: { mobile: '2775:18532', desktop: '2792:2783' },
  notaComentarioOpcional: { mobile: '2288:16787', desktop: '2296:11663' },
  notaComentarioObrigatorio: { mobile: '2288:16960', desktop: '2296:11872' },
  notaComentarioPreenchido: { mobile: '2288:17020', desktop: '2296:12081' },
} as const

export const avaliacaoSteps: readonly Step[] = [
  {
    slug: 'realizada',
    title: '1. Sessão realizada',
    nodeMobile: '2288:12031',
    nodeDesktop: '2296:10831',
    progress: null,
    pergunta: null,
  },
  {
    slug: 'acolhimento',
    title: '02 · Acolhimento',
    nodeMobile: '2775:18010',
    nodeDesktop: '2791:1400',
    progress: null,
    pergunta: 1,
  },
  {
    slug: 'reflexao',
    title: '03 · Reflexão',
    nodeMobile: '2775:18039',
    nodeDesktop: '2792:1779',
    progress: null,
    pergunta: 2,
  },
  {
    slug: 'chamada',
    title: '04 · Qualidade da chamada',
    nodeMobile: '2775:18069',
    nodeDesktop: '2792:2017',
    progress: null,
    pergunta: 3,
  },
  {
    slug: 'nota',
    title: '2a. Avaliação — sem nota',
    nodeMobile: '2288:12265',
    nodeDesktop: '2296:10625',
    progress: null,
    pergunta: 4,
  },
  {
    slug: 'agradecimento',
    title: '3a. Agradecimento',
    nodeMobile: '2288:12305',
    nodeDesktop: '2296:11072',
    progress: null,
    pergunta: null,
  },
  {
    slug: 'apoio',
    title: '3b. Acolhimento após dificuldades',
    nodeMobile: '2288:17077',
    nodeDesktop: '2296:12290',
    progress: null,
    pergunta: null,
  },
  {
    slug: 'proxima',
    title: '4. Agendar próxima sessão',
    nodeMobile: '2288:16602',
    nodeDesktop: '2296:11269',
    progress: null,
    pergunta: null,
  },
]

export const findStep = (slug: string): Step | undefined =>
  avaliacaoSteps.find((step) => step.slug === slug)

export const getStepIndex = (slug: StepSlug): number =>
  avaliacaoSteps.findIndex((step) => step.slug === slug)

/** The question before this one, for the back button. Only questions have one. */
export const getPreviousStep = (slug: StepSlug): Step | undefined => {
  const index = getStepIndex(slug)
  return index > 0 ? avaliacaoSteps[index - 1] : undefined
}
