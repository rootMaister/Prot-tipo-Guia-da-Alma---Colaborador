import { useEffect } from 'react'

import { Button } from '@guia-da-alma/ds'
import { CheckIcon } from 'lucide-react'
import { useNavigate } from 'react-router'

import { FeatureShell } from '@/components/layout/feature-shell'
import { SESSAO_DEMO, useConta } from '@/state/conta-provider'

import { HOJE, useAgendamento } from '../agendamento-provider'

/**
 * Step 5 — nodes 1236:11034 (mobile) and 1279:15911 (desktop).
 *
 * The same celebratory shell as "Empresa encontrada" and "Perfil aprovado" in Cadastro —
 * which is literally where the desktop frame's name comes from, since it is still called
 * "[Desktop] 3. Empresa encontrada" in Figma. This one drops the eyebrow line.
 *
 * Reaching it is also what books the session on the account, and that is what flips the
 * Home from the Match banner to "Sua próxima sessão" and fills Meus agendamentos.
 * Registering here rather than on the confirm button ties it to the flow actually
 * finishing; `agendar` ignores a repeat of the same slot, so re-walking does not stack
 * duplicates.
 */
export function AgendadaScreen() {
  const navigate = useNavigate()
  const { data } = useAgendamento()
  const { agendar } = useConta()

  // The provider always holds a slot — the card's availability, or `SLOT_PADRAO` on a cold
  // deep-link — so these fallbacks only guard the types.
  const dia = data.data ?? HOJE
  const horario = data.horario ?? '19:00'

  useEffect(() => {
    agendar({ ...SESSAO_DEMO, data: dia, horario })
  }, [agendar, dia, horario])

  return (
    <FeatureShell
      icon={CheckIcon}
      title={
        <>
          Sessão
          <br />
          Agendada
        </>
      }
      footer={
        <Button
          variant="contained"
          className="w-full"
          // Ends on Meus agendamentos, where the session it just booked is now listed —
          // review decision of 11/09/2026, whichever door the booking came in through.
          onClick={() => navigate('/app/agendamentos')}
        >
          Continuar
        </Button>
      }
    />
  )
}
