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
   * Desde a revisão de 23/09/2026 são os valores do arquivo, e barra e badge concordam:
   * "Etapa N de 4", 25 → 50 → 75 → 100, com a trilha de 279px cheia em 70, 140, 209 e 279.
   * Até então o arquivo dizia 6 → 12 → 6 → 98 → 76 e as barras eram sobras do Cadastro, e
   * os passos 4 e 5 eram interpolados aqui — ver o anexo do DS-GAPS.md, agora resolvido.
   */
  progress: number | null
  /**
   * Widens the desktop column from 450px to 1000px. Only step 7 needs it: its results grid
   * is why its desktop progress track is 934px where every other screen draws 384px.
   */
  wide?: boolean
  /**
   * Prende a tela à altura da viewport e deixa só a lista rolar, com esmaecido nas bordas.
   * Decisão da revisão de 21/09/2026, estendida a **todos** os passos de lista longa deste
   * fluxo: além dos passos 2 e 4, os passos 5 e 7, para o "Pular match" ficar colado embaixo
   * em vez de rolar junto com o conteúdo. O frame do passo 7 desenha o esmaecido como um nó
   * próprio (`scroll-fade`), o que confirma a intenção. Ver `StepShell`.
   *
   * Nenhum dos quatro tem campo de texto, então a exceção ao `h-dvh overflow-hidden` que o
   * CLAUDE.md abre por causa do teclado do iOS continua valendo aqui.
   */
  alturaFixa?: boolean
  /**
   * Label beside the progress bar, taken from the rendered text — never the layer name.
   * Desde 23/09/2026 cada passo nomeia a própria etapa: Temas para a sessão, Especialidade,
   * Disponibilidade e Sessões recomendadas.
   */
  stepLabel: string | null
}

export const MATCH_FILE_KEY = 'mHWlzkeyvbLscICaXIjkcG'

/**
 * A tela "6. Buscando sessões" e as suas variantes "Buscando profissionais" (805:2472 /
 * 861:3898) foram **removidas do arquivo** na revisão de 21/09/2026 — o bilhete ao lado da
 * seção resume o porquê: "Redução de etapas e simplificação de perguntas". Com isso
 * "Buscar sessões" leva direto ao resultado, sem a espera no meio. Ver SYNC-FIGMA.md.
 */

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
    // Refeito em 23/09/2026; o frame antigo (1105:10872) saiu. 3283:16905 é o estado vazio.
    nodeMobile: '3283:16761',
    nodeDesktop: '1133:1393',
    progress: 25,
    stepLabel: 'Temas para a sessão',
    alturaFixa: true,
  },
  {
    slug: 'preferencia-abordagem',
    title: '4. Preferência de abordagem',
    nodeMobile: '1105:11678',
    nodeDesktop: '1134:2358',
    progress: 50,
    stepLabel: 'Especialidade',
    alturaFixa: true,
  },
  {
    slug: 'suas-sessoes',
    title: '5. Suas sessões',
    nodeMobile: '1119:12331',
    nodeDesktop: '1134:2636',
    progress: 75,
    stepLabel: 'Disponibilidade',
    alturaFixa: true,
  },
  {
    slug: 'sessoes-recomendadas',
    title: '7. Sessões recomendadas',
    nodeMobile: '1119:12688',
    nodeDesktop: '1134:2891',
    progress: 100,
    alturaFixa: true,
    wide: true,
    stepLabel: 'Sessões recomendadas',
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
