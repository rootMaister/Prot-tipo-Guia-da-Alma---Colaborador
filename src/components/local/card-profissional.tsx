import { Badge, Button, Chip } from '@guia-da-alma/ds'
import { useLocation, useNavigate } from 'react-router'

import { comOrigem } from '@/lib/origem'

import { ProfissionalResumo, type Profissional } from './profissional-resumo'

export type SessaoRecomendada = Profissional & {
  /** Session title — the long line at the top of the card. */
  sessao: string
  disponibilidade: string
  /** The indigo "Mais recomendada" pill, on the first card only. */
  destaque?: string
  /**
   * Especialidade e tipo de abordagem, nessa ordem. Não existem no desenho do card
   * (1124:13061) — entraram na revisão de 11/09/2026, que pediu que o card dissesse o que o
   * profissional atende e por qual escola. Os valores saem do próprio título da sessão que o
   * arquivo já escreve, não de invenção. Ver SYNC-FIGMA.md.
   */
  tags?: string[]
}

/**
 * `card-profissional` (1124:13061) — one recommended session on Match step 7.
 *
 * DS-GAP: the card is `radius/xxl` (24px), which the design system's radius scale tops
 * out below — `rounded-2xl` is 16px and there is nothing above it. See item 9 of
 * DS-GAPS.md.
 *
 * "Ver agenda" is the seam into the Agendamento flow: the design opens the session detail
 * from here, so every card leads to the one session that flow is drawn around. The card's
 * availability rides along in router state, so the scheduling step opens on the slot this
 * card advertises rather than a fixed one.
 *
 * The card is drawn on two screens that are not in the same place — the Match results, a
 * step of onboarding, and Busca, a destination of the app — so it also tells the flow where
 * it was clicked. Without that, backing out of the booking always landed on the Match
 * results, which from Busca means being dropped into the middle of onboarding.
 * See `lib/origem.ts`.
 */
export function CardProfissional({
  sessao,
  disponibilidade,
  destaque,
  tags,
  ...profissional
}: SessaoRecomendada) {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  return (
    <div className="bg-surface-faint border-outline-subtle relative flex w-full flex-col gap-4 rounded-2xl border p-3">
      {destaque ? (
        <span className="absolute -top-[15px] -left-px">
          <Badge variant="info">{destaque}</Badge>
        </span>
      ) : null}

      <div className="flex w-full flex-col gap-2">
        <p className="text-label-s text-fg-default px-1 py-2">{sessao}</p>

        {tags && tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 px-1">
            {tags.map((tag) => (
              // DS-GAP: `Chip` é o mais próximo de uma etiqueta só de leitura; `Tag` carrega
              // estado de seleção que aqui não existe. Ver item 18 do DS-GAPS.md.
              <Chip key={tag} color="neutral">
                {tag}
              </Chip>
            ))}
          </div>
        ) : null}

        <ProfissionalResumo {...profissional} />

        <div className="flex w-full items-center justify-between pl-3">
          <p className="text-caption text-fg-brand-accent">{disponibilidade}</p>

          <Button
            variant="contained"
            onClick={() =>
              navigate(comOrigem('/agendamento/detalhes', pathname, search), {
                state: { disponibilidade },
              })
            }
          >
            Ver agenda
          </Button>
        </div>
      </div>
    </div>
  )
}
