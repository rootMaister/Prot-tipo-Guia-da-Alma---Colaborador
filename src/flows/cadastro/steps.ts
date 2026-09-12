/**
 * Single source of truth for the Cadastro flow: order, URLs, progress and the Figma
 * node each screen was built from.
 *
 * Adding another flow later means creating `src/flows/<name>/` with a file shaped like
 * this one — nothing here needs to change.
 */

export type StepSlug =
  | 'splash'
  | 'welcome'
  | 'empresa'
  | 'empresa-encontrada'
  | 'consentimento'
  | 'dados-pessoais'
  | 'senha'
  | 'analise'
  | 'aprovado'

export type Step = {
  slug: StepSlug
  /** Screen name as it reads in Figma, for the index page and for re-finding the node. */
  title: string
  /** Figma node id for the mobile frame. */
  nodeMobile: string
  /** Figma node id for the desktop frame; null where the screen is mobile-only. */
  nodeDesktop: string | null
  /**
   * Single source for both the header badge and the progress-bar fill, so the two can
   * never drift apart the way they have in Figma. Null on screens with no header.
   *
   * Values are the badge percentages actually rendered in Figma — 6 / 56 / 98 — with
   * step 4 recalculated. In the file, step 4's badge still reads 6%, a stale copy of
   * step 2's, while its mobile bar is also unchanged and its desktop bar shows 29.3%.
   * 31 is the midpoint between the neighbouring stated values (6 and 56), which the
   * desktop bar corroborates. See DS-GAPS.md.
   */
  progress: number | null
  /**
   * Label next to the progress bar, taken from the rendered text. The layer name is
   * "Progress Bar - Etapa 1 de 4: Empresa" on every one of these screens and the child
   * text node is named "Sua empresa" everywhere — both are copy-paste leftovers that
   * disagree with what the screen actually shows.
   */
  stepLabel: string | null
}

export const CADASTRO_FILE_KEY = 'mHWlzkeyvbLscICaXIjkcG'

export const cadastroSteps: readonly Step[] = [
  {
    slug: 'splash',
    title: 'Splash',
    nodeMobile: '783:487',
    nodeDesktop: null,
    progress: null,
    stepLabel: null,
  },
  {
    slug: 'welcome',
    title: '1. Welcome',
    // Redesenhada; os nodes antigos (779:415 / 826:3114) não existem mais no arquivo.
    nodeMobile: '2028:647',
    nodeDesktop: '2020:647',
    progress: null,
    stepLabel: null,
  },
  {
    slug: 'empresa',
    title: '2. Identificador da empresa',
    nodeMobile: '1069:7838',
    nodeDesktop: '1089:9796',
    progress: 6,
    stepLabel: 'Identifique sua empresa',
  },
  {
    slug: 'empresa-encontrada',
    title: '3. Empresa encontrada',
    nodeMobile: '670:606',
    nodeDesktop: '670:616',
    progress: null,
    stepLabel: null,
  },
  {
    slug: 'consentimento',
    title: '4. Contrato de confiança',
    nodeMobile: '1078:8851',
    nodeDesktop: '1089:9967',
    // Recalculated: the badge in Figma still reads 6%, copied from step 2. See the
    // `progress` field docs above.
    progress: 31,
    stepLabel: 'Termos de uso e privacidade',
  },
  {
    slug: 'dados-pessoais',
    title: '5. Dados pessoais',
    nodeMobile: '1078:8944',
    nodeDesktop: '1089:10089',
    progress: 56,
    stepLabel: 'Informações de contato',
  },
  {
    slug: 'senha',
    title: '6. Crie uma senha',
    nodeMobile: '1078:9101',
    nodeDesktop: '1089:10222',
    progress: 98,
    stepLabel: 'Configure sua senha',
  },
  {
    slug: 'analise',
    title: '7. Aguardando aprovação do RH',
    nodeMobile: '1078:9292',
    // This frame is named "[Desktop] 6. Crie uma senha" in Figma, but it renders
    // "Em análise" — it is the desktop of step 7. Verified by screenshot.
    nodeDesktop: '1089:10400',
    progress: null,
    stepLabel: null,
  },
  {
    slug: 'aprovado',
    title: '8. Perfil aprovado',
    nodeMobile: '275:2195',
    nodeDesktop: '346:108',
    progress: null,
    stepLabel: null,
  },
]

export const stepSlugs = cadastroSteps.map((step) => step.slug)

export const findStep = (slug: string): Step | undefined =>
  cadastroSteps.find((step) => step.slug === slug)

export const getStepIndex = (slug: StepSlug): number =>
  cadastroSteps.findIndex((step) => step.slug === slug)

export const getNextStep = (slug: StepSlug): Step | undefined =>
  cadastroSteps[getStepIndex(slug) + 1]

export const getPreviousStep = (slug: StepSlug): Step | undefined => {
  const index = getStepIndex(slug)
  return index > 0 ? cadastroSteps[index - 1] : undefined
}

export const figmaNodeUrl = (nodeId: string): string =>
  `https://www.figma.com/design/${CADASTRO_FILE_KEY}/Colaborador-UI?node-id=${nodeId.replace(':', '-')}`
