/**
 * As listas de opções do questionário do Match, num arquivo só.
 *
 * Estavam em cada tela até 21/09/2026, quando a revisão pediu que o fluxo abrisse com
 * escolhas já marcadas: o provider precisa das listas para semear os padrões, e duas cópias
 * da mesma lista sairiam do lugar na primeira edição. As telas continuam sendo quem desenha.
 */

/**
 * Passo 2, "Seu momento" — nove temas, na ordem do frame rolado (1105:10969). O arquivo
 * lista "Vícios" duas vezes; aqui aparece uma vez só. Ver SYNC-FIGMA.md.
 */
export const TEMAS = [
  'Autoconhecimento',
  'Equilíbrio',
  'Família',
  'Saúde mental',
  'Ansiedade',
  'Estresse',
  'Vícios',
  'Espiritualidade',
  'Físico',
] as const

/** Passo 4, "Especialidade" (1105:11680) — o desktop oferece outra lista. Ver SYNC-FIGMA.md. */
export const ESPECIALIDADES = [
  'Psicologia tradicional',
  'Psicanálise',
  'EFT (técnica de liberação emocional)',
  'Hipnose',
  'Meditação',
  'PNL (programação neurolinguística)',
  'Reiki',
  'ThetaHealing',
  'Yoga',
] as const

/** Passo 5, "Suas sessões". */
export const DIAS_SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] as const
export const HORARIOS = ['Manhã (6h – 12h)', 'Tarde (12h – 18h)', 'Noite (18h – 23h59)'] as const

/** Os dias úteis, que é o que o fluxo já traz marcado. */
export const DIAS_UTEIS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'] as const
