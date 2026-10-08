import { onboarding } from '@/analytics/posthog'

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
   * Abordagem e tema, nessa ordem — o bloco "Correspondência / especialidade e temas"
   * (2199:1610), que na revisão de 21/09/2026 desceu para **abaixo** do profissional e
   * ganhou descrição própria no componente: são os mesmos rótulos dos filtros e do
   * cadastro, informativos (sem seleção), até três visíveis.
   */
  tags?: string[]
}

/**
 * `card-profissional` (1124:13106) — one recommended session on Match step 7.
 *
 * Redesenhado em 21/09/2026: o título passou a ficar sobre uma caixa de degradê radial, o
 * retrato subiu para dentro dela — ele encosta na borda de baixo e transborda —, e os chips
 * de abordagem e tema desceram para depois do profissional, antes do rodapé.
 *
 * DS-GAP: the card is `radius/xxl` (24px), which the design system's radius scale tops
 * out below — `rounded-2xl` is 16px and there is nothing above it. See item 9 of
 * DS-GAPS.md.
 *
 * "Ver mais" is the seam into the Agendamento flow: the design opens the session detail
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
    <div className="bg-surface-faint border-outline-subtle relative flex w-full flex-col gap-4 rounded-2xl border p-2">
      {destaque ? (
        <span className="absolute -top-[15px] -left-px">
          <Badge variant="info">{destaque}</Badge>
        </span>
      ) : null}

      <div className="flex w-full flex-col gap-3">
        {/*
          O degradê fica atrás do título e termina no meio do retrato, que o atravessa. Por
          isso ele é uma camada própria, com altura fixa, e não o fundo do parágrafo.

          DS-GAP: as duas cores do degradê (#F7FBF6 e #ECEFED) existem no DS só como
          primitivas — `brand-dark-25` e `brand-dark-medium-50`, declaradas em
          `primitives.css` fora de um bloco `@theme`, sem utility para alcançá-las. Daí as
          variáveis pelo nome; o token continua sendo a fonte. Mesma situação da barra de
          navegação. Ver DS-GAPS.md.
        */}
        <div className="relative isolate flex flex-col">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 -z-10 h-[129px] rounded-2xl"
            style={{
              background:
                'radial-gradient(164px 129px at 50% 100%, var(--color-brand-dark-25) 27%, var(--color-brand-dark-medium-50) 100%)',
            }}
          />

          <p className="text-label-s text-fg-default px-4 py-3">{sessao}</p>

          <div className="px-3">
            <ProfissionalResumo {...profissional} />
          </div>
        </div>

        {tags && tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 px-3">
            {/* Até três, como a descrição do componente pede. */}
            {tags.slice(0, 3).map((tag) => (
              // DS-GAP: `Chip` é o mais próximo de uma etiqueta só de leitura; `Tag` carrega
              // estado de seleção que aqui não existe. Ver item 18 do DS-GAPS.md.
              <Chip key={tag} color="neutral">
                {tag}
              </Chip>
            ))}
          </div>
        ) : null}

        <div className="flex w-full items-center justify-between pt-1 pl-3">
          {/*
            DS-GAP: a disponibilidade é Inter Tight **Bold** 12/18 no arquivo — um peso
            avulso, não um estilo de texto nomeado (os estilos do card são Label S, Body S
            e Body Caption). `text-caption` traz o tamanho e a altura; o 700 vai explícito
            porque não há token que o carregue. Ver DS-GAPS.md.
          */}
          <p className="text-caption text-fg-brand-accent font-bold">{disponibilidade}</p>

          <Button
            variant="contained"
            onClick={() => {
              if (pathname === '/match/sessoes-recomendadas') onboarding.stepCompleted(pathname)
              navigate(comOrigem('/agendamento/detalhes', pathname, search), {
                state: { disponibilidade },
              })
            }}
          >
            Ver mais
          </Button>
        </div>
      </div>
    </div>
  )
}
