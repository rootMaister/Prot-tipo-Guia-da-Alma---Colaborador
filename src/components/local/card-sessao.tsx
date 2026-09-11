import { Badge, Button } from '@guia-da-alma/ds'

import { badgeSessao } from '@/lib/sessao-formato'

import type { SessaoAgendada } from '@/state/conta-provider'

type CardSessaoProps = {
  sessao: SessaoAgendada
  /** The CTA's copy — "Acessar detalhes" on the Home, "Ver detalhes" on Meus agendamentos. */
  acao: string
  onAcao?: () => void
}

/**
 * A session already booked: the lime date badge, the portrait, the professional and the
 * session title, with the action pinned bottom-right. It is `card-profissional` in Figma
 * too (1429:6320 on the Home, 1568:2128 on Meus agendamentos), but a different composition
 * of it from the one on the Match results — that one leads with the session title and
 * carries the rating, the availability line and "Ver agenda"; this one leads with the date
 * and carries neither rating nor availability.
 *
 * Hence a sibling of `card-profissional.tsx` rather than a variant of it: the two share a
 * name in Figma and almost no content. Named for what it shows.
 *
 * DS-GAP: the card is `radius/xxl` (24px) and the portrait an 84px rounded square at the
 * same radius; the design system's scale stops at `rounded-2xl` (16px). Same gap as
 * `card-profissional` and `profissional-resumo` — items 9 and 19 of DS-GAPS.md.
 */
export function CardSessao({ sessao, acao, onAcao }: CardSessaoProps) {
  return (
    <div className="bg-surface-base border-outline-subtle flex w-full flex-col justify-center gap-4 rounded-2xl border p-3">
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <Badge variant="success">{badgeSessao(sessao.data, sessao.horario)}</Badge>
        </div>

        <div className="flex w-full items-start gap-4 py-2">
          <img
            src={sessao.avatar}
            alt=""
            className="border-outline-avatar size-[84px] shrink-0 rounded-2xl border object-cover"
          />

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="text-label-s text-fg-muted flex flex-wrap gap-2">
              <span>{sessao.profissionalTitulo}</span>
              <span>{sessao.profissionalNome}</span>
            </p>

            <p className="text-body-s text-fg-subtle">{sessao.titulo}</p>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-end">
        <Button variant="contained" onClick={onAcao}>
          {acao}
        </Button>
      </div>
    </div>
  )
}
