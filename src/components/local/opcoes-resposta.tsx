import type { ReactNode } from 'react'

import { RadioGroup, RadioGroupItem, cn } from '@guia-da-alma/ds'

export type OpcaoResposta = {
  valor: string
  rotulo: ReactNode
}

type OpcoesRespostaProps = {
  /** Unique per screen: the item ids are built from it. */
  nome: string
  rotuloGrupo: string
  opcoes: readonly OpcaoResposta[]
  valor: string | null
  onChange: (valor: string) => void
}

/**
 * The single-choice answer list of the Avaliação questions — full-width cards with the
 * `radio` control on the right (2775:18031).
 *
 * A sibling of `option-card`, not a reuse: that one is the Match's multi-select card, with a
 * checkbox, a faint surface and a lime fill when checked. These sit on `surface/base` and
 * mark the choice only with a 2px `action/accent-hover` border (2775:18557). The second pixel
 * is an inset ring rather than a thicker border, so choosing does not shift the text.
 *
 * DS-GAP: `RadioGroupItem` is fixed at 16px; the file draws it at 24px. Left as the DS
 * renders it — same gap as the checkbox in `option-card`. See DS-GAPS.md, item 36.
 */
export function OpcoesResposta({ nome, rotuloGrupo, opcoes, valor, onChange }: OpcoesRespostaProps) {
  return (
    <RadioGroup
      aria-label={rotuloGrupo}
      value={valor ?? ''}
      onValueChange={onChange}
      className="w-full gap-2"
    >
      {opcoes.map((opcao) => {
        const id = `${nome}-${opcao.valor}`
        const marcada = valor === opcao.valor

        return (
          <label
            key={opcao.valor}
            htmlFor={id}
            className={cn(
              'bg-surface-base flex min-h-14 w-full cursor-pointer items-center gap-4 rounded-2xl border py-4 pr-6 pl-4',
              'transition-colors duration-150 ease-out',
              marcada
                ? 'border-action-accent-hover ring-action-accent-hover ring-1 ring-inset'
                : 'border-outline-subtle hover:border-outline-default',
            )}
          >
            <span className="text-label-s text-fg-muted min-w-0 flex-1 font-semibold whitespace-pre-wrap">
              {opcao.rotulo}
            </span>
            <RadioGroupItem id={id} value={opcao.valor} />
          </label>
        )
      })}
    </RadioGroup>
  )
}
