import { useState } from 'react'

import { Button } from '@guia-da-alma/ds'
import { useNavigate } from 'react-router'

import { CardSessao } from '@/components/local/card-sessao'
import { DetalhesSessao } from '@/components/local/detalhes-sessao'
import { chaveSessao, useConta, type SessaoAgendada } from '@/state/conta-provider'

/**
 * Meus agendamentos — `1562:2156` (mobile) and `1558:1876` (desktop).
 *
 * Both frames draw two booked sessions; here the list is whatever the Agendamento flow has
 * actually booked, so walking that flow is what fills this screen. The empty state is not
 * drawn anywhere in the file — see SYNC-FIGMA.md.
 *
 * The title is Heading XXL on `fg/muted`, not `fg/default` — unusual for a page title, but
 * that is what the file binds on both breakpoints.
 */
export function AgendamentosScreen() {
  const navigate = useNavigate()
  const { conta } = useConta()
  const [detalhe, setDetalhe] = useState<SessaoAgendada | null>(null)

  return (
    <div className="flex flex-col gap-8 px-4 py-6 lg:px-0 lg:pt-20">
      <header className="flex w-full flex-col items-start justify-center gap-4">
        {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
        <h1 className="font-display text-heading-xxl text-fg-muted">Meus agendamentos</h1>

        <Button variant="outlined" onClick={() => navigate('/app/busca')}>
          Agendar nova sessão
        </Button>
      </header>

      <section className="flex w-full flex-col gap-4">
        <h2 className="text-label-m text-fg-muted">Próximas sessões</h2>

        {conta.sessoes.length === 0 ? (
          <p className="text-body-s text-fg-subtle">
            Nenhuma sessão agendada ainda. Busque um profissional para marcar a primeira.
          </p>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {conta.sessoes.map((sessao) => (
              <CardSessao
                key={chaveSessao(sessao)}
                sessao={sessao}
                acao="Ver detalhes"
                onAcao={() => setDetalhe(sessao)}
              />
            ))}
          </div>
        )}
      </section>

      {/* On desktop this is the drawer the frame draws over this very screen (1784:30). */}
      {detalhe ? (
        <DetalhesSessao
          sessao={detalhe}
          origem="/app/agendamentos"
          onFechar={() => setDetalhe(null)}
        />
      ) : null}
    </div>
  )
}
