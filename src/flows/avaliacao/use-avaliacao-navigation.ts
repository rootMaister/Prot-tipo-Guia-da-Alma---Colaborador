import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'

import type { HorarioSugerido } from '@/components/local/proximos-horarios'
import { comOrigem, lerOrigem } from '@/lib/origem'

import type { StepSlug } from './steps'

/**
 * Where the flow hands the person back when nothing says otherwise: the desktop frames draw
 * it over Meus agendamentos, which is where a finished session lives.
 */
export const ORIGEM_PADRAO = '/app/agendamentos'

/**
 * The flow's ways out, in one place. Moving between steps carries the query string along —
 * which is how `origem` survives the hops (see `lib/origem.ts`).
 *
 * Booking the next session opens the Agendamento flow on the time step, with the origin of
 * *this* flow, so Agendamento returns the person to the app screen they started from rather
 * than to a finished evaluation.
 */
export function useAvaliacaoNavigation() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const origem = lerOrigem(search, ORIGEM_PADRAO)

  const irPara = useCallback(
    (slug: StepSlug) => navigate(`/avaliacao/${slug}${search}`),
    [navigate, search],
  )

  const sair = useCallback(() => navigate(origem), [navigate, origem])

  const agendar = useCallback(
    (horario?: HorarioSugerido) =>
      navigate(comOrigem('/agendamento/horario', origem), {
        // Router state is read once by `AgendamentoProvider`, on mount — which is exactly
        // when it is needed here.
        state: horario ? { slot: { data: horario.data, horario: horario.horario } } : null,
      }),
    [navigate, origem],
  )

  const buscarOutro = useCallback(() => navigate('/app/busca'), [navigate])

  return { irPara, sair, agendar, buscarOutro }
}
