import type { SessaoRecomendada } from '@/components/local/card-profissional'

import avatar1 from '@/assets/match/profissional-1.jpg'
import avatar2 from '@/assets/match/profissional-2.jpg'
import avatar3 from '@/assets/match/profissional-3.jpg'

/**
 * What the Busca screen searches over.
 *
 * The professionals, their ratings and their availability lines are the ones drawn across
 * the Busca frames (1316:1891, 1324:16170), read from the rendered text rather than the
 * layer names. The Match flow mocks its own results separately, in
 * `flows/match/screens/sessoes-recomendadas-screen.tsx`: those are the four cards that
 * screen draws, and they are a different set — kept apart rather than merged, so each
 * screen keeps matching its own frame.
 *
 * The **tags** are the part the design does not state. The frames show the filtered
 * outcome (Temas "Ansiedade" + "Estresse" and Especialidade "Psicanálise" leave Lucas,
 * Mariana and Carlos, and drop Daniele) but never say which professional carries which
 * tag. They are assigned here so that exact result reproduces; see SYNC-FIGMA.md.
 */
export type Profissional = SessaoRecomendada & {
  temas: string[]
  especialidades: string[]
}

/**
 * The Temas list of the filter panel (1324:16928), in order. The frame draws "Vícios"
 * twice — once in place and once again at the end; the duplicate is dropped here and
 * logged in SYNC-FIGMA.md.
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
]

/**
 * Especialidades has a filter button and an applied chip ("Psicanálise") but **no panel**
 * anywhere in the file, so this list has no design behind it. Drawn from the approaches
 * the session titles name, so the filter has something to filter on. See SYNC-FIGMA.md.
 */
export const ESPECIALIDADES = [
  'Psicanálise',
  'Junguiana',
  'Cognitivo-comportamental',
  'Terapia familiar',
  'Terapia de casal',
  'Humanista',
]

export const profissionais: readonly Profissional[] = [
  {
    sessao:
      'Sessão de Psicoterapia Analítica/Junguiana | atendimento exclusivo para mulheres e pessoas LGBT+',
    titulo: 'Psi.',
    nome: 'Daniele Tramontina',
    crp: 'CRP 06/123456',
    tags: ['Mulheres e LGBT+', 'Junguiana'],
    avatar: avatar1,
    estrelas: 4,
    avaliacoes: 67,
    sessoesRealizadas: 980,
    disponibilidade: 'Disponível hoje às • 18:00',
    temas: ['Autoconhecimento', 'Equilíbrio', 'Espiritualidade'],
    especialidades: ['Junguiana'],
  },
  {
    sessao: 'Sessão de Terapia Cognitivo-Comportamental | foco na ansiedade e depressão',
    titulo: 'Psic.',
    nome: 'Lucas Mendes',
    crp: 'CRP 06/187342',
    tags: ['Ansiedade e depressão', 'Cognitivo-comportamental'],
    avatar: avatar2,
    estrelas: 5,
    avaliacoes: 21,
    sessoesRealizadas: 150,
    disponibilidade: 'Disponível amanhã às • 14:00',
    temas: ['Ansiedade', 'Estresse', 'Saúde mental'],
    especialidades: ['Psicanálise', 'Cognitivo-comportamental'],
  },
  {
    sessao: 'Sessão de Terapia Familiar | foco na comunicação e resolução de conflitos',
    titulo: 'Psic.',
    nome: 'Mariana Santos',
    crp: 'CRP 06/162218',
    tags: ['Conflitos familiares', 'Terapia familiar'],
    avatar: avatar3,
    estrelas: 4,
    avaliacoes: 22,
    sessoesRealizadas: 85,
    disponibilidade: 'Disponível amanhã às • 16:00',
    temas: ['Família', 'Estresse'],
    especialidades: ['Psicanálise', 'Terapia familiar'],
  },
  {
    sessao: 'Sessão de Terapia de Casal | foco na intimidade e confiança',
    titulo: 'Psic.',
    nome: 'Carlos Silva',
    crp: 'CRP 06/171063',
    tags: ['Relacionamentos', 'Terapia de casal'],
    avatar: avatar2,
    estrelas: 5,
    avaliacoes: 23,
    sessoesRealizadas: 120,
    disponibilidade: 'Disponível amanhã às • 18:00',
    temas: ['Ansiedade', 'Família'],
    especialidades: ['Psicanálise', 'Terapia de casal'],
  },
]

const normalizar = (texto: string) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export type FiltrosBusca = {
  termo: string
  temas: string[]
  especialidades: string[]
}

export const FILTROS_VAZIOS: FiltrosBusca = { termo: '', temas: [], especialidades: [] }

/**
 * A professional passes when it carries at least one of each selected group — an empty
 * group filters nothing. The text box matches the name and the session title.
 */
export function filtrar(filtros: FiltrosBusca): Profissional[] {
  const termo = normalizar(filtros.termo.trim())

  return profissionais.filter((profissional) => {
    if (
      termo &&
      !normalizar(profissional.nome).includes(termo) &&
      !normalizar(profissional.sessao).includes(termo)
    ) {
      return false
    }

    if (
      filtros.temas.length > 0 &&
      !filtros.temas.some((tema) => profissional.temas.includes(tema))
    ) {
      return false
    }

    return (
      filtros.especialidades.length === 0 ||
      filtros.especialidades.some((especialidade) =>
        profissional.especialidades.includes(especialidade),
      )
    )
  })
}
