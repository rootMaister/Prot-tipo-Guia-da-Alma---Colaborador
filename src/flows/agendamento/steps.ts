/**
 * Single source of truth for the Agendamento flow: order, URLs, progress and the Figma
 * node each screen was built from. Same shape as the other two flows.
 *
 * The flow continues from the Match results, where "Ver agenda" on a session card opens
 * the session detail.
 */

export type StepSlug = 'detalhes' | 'horario' | 'informacoes' | 'confirmar' | 'agendada'

export type Step = {
  slug: StepSlug
  /** Screen name as it reads in Figma, for the index page and for re-finding the node. */
  title: string
  /** Figma node id for the mobile frame. */
  nodeMobile: string
  /** Figma node id for the desktop frame; null where the screen is mobile-only. */
  nodeDesktop: string | null
  /**
   * Drives both the header badge and the progress-bar fill. Null on screens with no
   * header.
   *
   * Unlike the Match section, these are the values Figma actually draws and its bars
   * agree with them: 140/279 = 50.2% against a 50% badge, 209/279 = 74.9% against 75%.
   * Nothing needed recalculating here.
   *
   * `horario` is the exception, and not a drift: the badge moves 50% → 60% once a time is
   * picked (frames 1202:715 and 1203:1108). This field holds the base value and the screen
   * passes the live one.
   */
  progress: number | null
  /** Label beside the progress bar, taken from the rendered text. */
  stepLabel: string | null
  /**
   * Whether the desktop frame is the two-column layout: a 436px running summary of the
   * booking on the left, the step on the right. True for "Escolher data e horário" and
   * "Informações complementares" — and in *both* sets of desktop frames, the onboarding ones
   * (1279:14636, 1279:14976) and the "com menu" ones (1617:4660, 1617:4923). "Confirmar
   * informações" is a single 450px column in both, and `detalhes` splits differently and
   * draws its own.
   */
  split?: boolean
}

export const AGENDAMENTO_FILE_KEY = 'mHWlzkeyvbLscICaXIjkcG'

/**
 * Extra frames that are states of a screen rather than steps of their own, kept so the
 * nodes are not lost: the scrolled/selected/filled variants used while building.
 */
export const VARIANT_NODES = {
  detalhesAvaliacoes: '1184:5198',
  detalhesMaisSessoes: '1184:5259',
  detalhesDesktopScrolled: '1279:13740',
  horarioSelecionado: { mobile: '1203:1108', desktop: '1279:13985' },
  informacoesPreenchido: { mobile: '1236:10602', desktop: '1279:15398' },
} as const

export const agendamentoSteps: readonly Step[] = [
  {
    slug: 'detalhes',
    title: '1. Detalhes da sessão',
    nodeMobile: '1184:5171',
    nodeDesktop: '1236:12522',
    progress: null,
    stepLabel: null,
  },
  {
    slug: 'horario',
    title: '2. Escolher data e horário',
    nodeMobile: '1202:715',
    nodeDesktop: '1279:14636',
    progress: 50,
    stepLabel: 'Escolha a data e o horário',
    split: true,
  },
  {
    slug: 'informacoes',
    title: '3. Informações complementares',
    nodeMobile: '1204:997',
    nodeDesktop: '1279:14976',
    progress: 75,
    stepLabel: 'Informações complementares',
    split: true,
  },
  {
    slug: 'confirmar',
    title: '4. Confirmar informações da sessão',
    nodeMobile: '1236:10804',
    nodeDesktop: '1279:15578',
    progress: 95,
    stepLabel: 'Confirme suas informações',
  },
  {
    slug: 'agendada',
    title: '5. Sessão agendada',
    nodeMobile: '1236:11034',
    // Named "[Desktop] 3. Empresa encontrada" in Figma, a leftover from the Cadastro file;
    // it renders "Sessão Agendada". Same misnaming as Cadastro step 7. Verified by
    // screenshot and by its position on the canvas.
    nodeDesktop: '1279:15911',
    progress: null,
    stepLabel: null,
  },
]

export const stepSlugs = agendamentoSteps.map((step) => step.slug)

export const findStep = (slug: string): Step | undefined =>
  agendamentoSteps.find((step) => step.slug === slug)

export const getStepIndex = (slug: StepSlug): number =>
  agendamentoSteps.findIndex((step) => step.slug === slug)

export const getNextStep = (slug: StepSlug): Step | undefined =>
  agendamentoSteps[getStepIndex(slug) + 1]

export const getPreviousStep = (slug: StepSlug): Step | undefined => {
  const index = getStepIndex(slug)
  return index > 0 ? agendamentoSteps[index - 1] : undefined
}

export const figmaNodeUrl = (nodeId: string): string =>
  `https://www.figma.com/design/${AGENDAMENTO_FILE_KEY}/Colaborador-UI?node-id=${nodeId.replace(':', '-')}`
