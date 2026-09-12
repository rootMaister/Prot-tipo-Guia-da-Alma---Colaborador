/**
 * Single source of truth for the Match de terapia flow: order, URLs, progress and the
 * Figma node each screen was built from. Same shape as `flows/cadastro/steps.ts`.
 *
 * The flow continues directly from the last Cadastro screen (Perfil aprovado).
 */

export type StepSlug =
  | 'inicio'
  | 'o-que-te-traz'
  | 'preferencia-abordagem'
  | 'suas-sessoes'
  | 'buscando'
  | 'sessoes-recomendadas'

export type Step = {
  slug: StepSlug
  /** Screen name as it reads in Figma, for the index page and for re-finding the node. */
  title: string
  /** Figma node id for the mobile frame. */
  nodeMobile: string
  /** Figma node id for the desktop frame; null where the screen is mobile-only. */
  nodeDesktop: string | null
  /**
   * Drives both the header badge and the progress-bar fill, so the two cannot drift
   * apart. Null on screens with no header.
   *
   * These are NOT the percentages drawn in Figma. The badges there read 6 → 12 → 6 → 98
   * → 76: step 4's is a literal copy of step 2's, and step 5's 98% lands before step 7's
   * 76%. The bars corroborate nothing — every mobile bar in the section is 15.891px of
   * 279 (5.7%) and every desktop bar is 112.5px of 384 (29.3%), both stale values carried
   * over from the Cadastro file.
   *
   * So only 6 (step 2), 12 (step 3) and 76 (step 7) survive as stated intent, and steps 4
   * and 5 are interpolated evenly between 12 and 76. Confirmed with you before writing.
   * See the annex in DS-GAPS.md.
   */
  progress: number | null
  /**
   * Widens the desktop column from 450px to 1000px. Only step 7 needs it: its results grid
   * is why its desktop progress track is 934px where every other screen draws 384px.
   */
  wide?: boolean
  /**
   * Label beside the progress bar, taken from the rendered text — never the layer name,
   * which is "Progress Bar - Etapa 1 de 4: Empresa" on every screen here too.
   *
   * On steps 5 and 7 the *rendered* text is stale as well: both read "Temas para a
   * sessão", which belongs to step 2, on screens about schedules and results. Copy is the
   * designer's call, so it is reproduced verbatim and logged rather than rewritten.
   */
  stepLabel: string | null
}

export const MATCH_FILE_KEY = 'mHWlzkeyvbLscICaXIjkcG'

/**
 * The "Buscando profissionais" variant of step 6 (mobile 805:2472, desktop 861:3898).
 * Same screen as `buscando`, differing only in copy — Figma numbers both "6.", so they
 * are alternates rather than consecutive steps. Kept here so the node is not lost.
 */
export const BUSCANDO_PROFISSIONAIS_NODES = {
  mobile: '805:2472',
  desktop: '861:3898',
} as const

export const matchSteps: readonly Step[] = [
  {
    slug: 'inicio',
    title: '1. Início Match de terapias',
    nodeMobile: '478:6794',
    nodeDesktop: '861:4122',
    progress: null,
    stepLabel: null,
  },
  {
    slug: 'o-que-te-traz',
    title: '2. O que te traz aqui',
    nodeMobile: '1105:10872',
    nodeDesktop: '1133:1393',
    progress: 6,
    stepLabel: 'Temas para a sessão',
  },
  {
    slug: 'preferencia-abordagem',
    title: '4. Preferência de abordagem',
    nodeMobile: '1105:11678',
    nodeDesktop: '1134:2358',
    // Interpolated: the badge in Figma still reads 6%, copied from step 2.
    progress: 33,
    stepLabel: 'Escolha uma especialidade',
  },
  {
    slug: 'suas-sessoes',
    title: '5. Suas sessões',
    nodeMobile: '1119:12331',
    nodeDesktop: '1134:2636',
    // Interpolated: the badge in Figma reads 98%, which lands before step 7's 76%.
    progress: 55,
    stepLabel: 'Temas para a sessão',
  },
  {
    slug: 'buscando',
    title: '6. Buscando sessões',
    nodeMobile: '861:4096',
    nodeDesktop: '861:4072',
    progress: null,
    stepLabel: null,
  },
  {
    slug: 'sessoes-recomendadas',
    title: '7. Sessões recomendadas',
    nodeMobile: '1119:12688',
    nodeDesktop: '1134:2891',
    progress: 76,
    wide: true,
    stepLabel: 'Temas para a sessão',
  },
]

export const stepSlugs = matchSteps.map((step) => step.slug)

export const findStep = (slug: string): Step | undefined =>
  matchSteps.find((step) => step.slug === slug)

export const getStepIndex = (slug: StepSlug): number =>
  matchSteps.findIndex((step) => step.slug === slug)

export const getNextStep = (slug: StepSlug): Step | undefined =>
  matchSteps[getStepIndex(slug) + 1]

export const getPreviousStep = (slug: StepSlug): Step | undefined => {
  const index = getStepIndex(slug)
  return index > 0 ? matchSteps[index - 1] : undefined
}

export const figmaNodeUrl = (nodeId: string): string =>
  `https://www.figma.com/design/${MATCH_FILE_KEY}/Colaborador-UI?node-id=${nodeId.replace(':', '-')}`


/**
 * "Mais detalhes" (o passo 3, texto livre) foi **retirado do protótipo** a pedido da
 * revisão de 11/09/2026 — "por enquanto". Nada mais foi mexido: os nodes ficam aqui e a
 * tela volta recriando a entrada em `matchSteps` entre `o-que-te-traz` e
 * `preferencia-abordagem`, com `progress: 12` e `stepLabel: 'Opcional'`.
 */
export const PASSO_REMOVIDO_MAIS_DETALHES = {
  nodeMobile: '1105:11342',
  nodeDesktop: '1134:2179',
  nodePreenchido: '1105:11501',
} as const
