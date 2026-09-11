import { Badge, FeaturedIcon, IconButton } from '@guia-da-alma/ds'
import { ArrowUpRightIcon, NotebookPenIcon } from 'lucide-react'
import { useNavigate } from 'react-router'

import { BarraConta } from '@/components/local/barra-conta'
import { CardSessao } from '@/components/local/card-sessao'
import { PromoMatch } from '@/components/local/promo-match'
import { agendamentosRestantes, useConta } from '@/state/conta-provider'

/**
 * Início — `1429:6283` / `590:9086` with a session booked, `1448:7654` / `1448:8740`
 * without. The two frames are the same screen in two states, picked by the account rather
 * than by the route: book a session in the Agendamento flow and the Match banner gives way
 * to "Sua próxima sessão".
 *
 * The desktop frame is the one grid in the file whose content is genuinely centred on the
 * frame, and it is the grid the whole app follows — the rail is out of flow and the column
 * centres on the viewport. That lives in `nav-shell`; here the frame's hand-built 406px nav
 * column is replaced by the `desktop-navigation` instance the other screens use, which also
 * widens the two shortcut cards to the measure every other card in the app gets.
 * See SYNC-FIGMA.md.
 */
export function InicioScreen() {
  const navigate = useNavigate()
  const { conta } = useConta()

  const proxima = conta.sessoes[0]

  return (
    <div className="flex flex-col gap-12 pt-3 lg:gap-8 lg:pt-12">
      <BarraConta className="px-4 lg:px-0" />

      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2 pr-6 pl-4 lg:px-0">
          {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
          <h1 className="font-display text-display-s text-fg-default">
            {/* Mobile breaks the greeting over two lines; desktop sets it on one. */}
            Bom dia,
            <br className="lg:hidden" /> {conta.nome}
          </h1>
          <p className="text-body-m text-fg-subtle">Como você está se sentindo hoje?</p>
        </header>

        <div className="flex flex-col gap-6 lg:gap-8">
          <div className="grid grid-cols-2 items-stretch gap-4 px-4 lg:px-0">
            <CardAtalho>
              <div className="flex w-full items-center justify-between">
                <FeaturedIcon icon={NotebookPenIcon} size="md" color="positive" />
                {/*
                  Diário has no screens in this prototype. Drawn as the design draws it and
                  simply not navigating — the same choice the menu makes for it, rather than
                  the disabled grey, which would be a state the file never shows.
                  See `shell/destinos.ts`.
                */}
                <IconButton
                  icon={<ArrowUpRightIcon className="size-[18px]" />}
                  aria-label="Abrir o Diário"
                  aria-disabled="true"
                  onClick={(evento) => evento.preventDefault()}
                />
              </div>

              <div className="flex w-full flex-col pl-1">
                <p className="text-label-m text-fg-default">Diário</p>
                <p className="text-body-s text-fg-subtle">Registre seu dia</p>
              </div>
            </CardAtalho>

            <CardAtalho>
              <div className="flex w-full flex-col px-1">
                <p className="text-label-m text-fg-default">Seu plano</p>
                {/* "agendamentos /mês" — the space is where the file puts it. */}
                <p className="text-body-s text-fg-subtle">
                  {conta.agendamentosPorMes} agendamentos /mês
                </p>
              </div>

              {/*
                DS-GAP: the badge is drawn as an outline pill — transparent, `outline/subtle`
                border. `Badge` has no outlined variant; `neutral` is the nearest.
                See DS-GAPS.md.
              */}
              <Badge variant="neutral">{agendamentosRestantes(conta)} restantes</Badge>
            </CardAtalho>
          </div>

          {proxima ? (
            <section className="flex w-full flex-col gap-4 px-4 lg:px-0">
              <h2 className="text-label-m text-fg-muted">Sua próxima sessão</h2>
              <CardSessao
                sessao={proxima}
                acao="Acessar detalhes"
                onAcao={() => navigate('/agendamento/detalhes')}
              />
            </section>
          ) : (
            <div className="flex w-full flex-col items-center px-4 lg:px-0">
              <PromoMatch />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * "Card - Cupons" (1448:7572) — the two equal-height cards under the greeting. Both are a
 * bordered 24px card with 12px of padding whose content is pushed to the top and bottom
 * edges; what goes in each is the screen's business, so this is only the frame.
 *
 * DS-GAP: `radius/xxl` is 24px and the design system's scale stops at `rounded-2xl` (16px).
 * Item 9 of DS-GAPS.md.
 */
function CardAtalho({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-base border-outline-subtle flex flex-col items-start justify-between gap-3 self-stretch overflow-hidden rounded-2xl border p-3">
      {children}
    </div>
  )
}
