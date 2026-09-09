import { Avatar } from '@guia-da-alma/ds'

export type Review = {
  nome: string
  /** Two-letter monogram, as drawn — not derived, so it stays what the file shows. */
  iniciais: string
  estrelas: number
  texto: string
}

const MAX_ESTRELAS = 5

/**
 * `card-review` (1170:3959) — one testimonial on the "Avaliações" tab of the session
 * detail.
 *
 * The 40px monogram is one of the few places the design system's `Avatar` fits as-is:
 * `size="md"` is 40px with `text-label-s` and `fg/muted`, matching the design. Two small
 * divergences left as the DS renders them — it fills with `surface/muted` where Figma uses
 * `surface/subtle`, and it draws no `outline/avatar` border.
 *
 * The rating here is a separate star run from the one in `profissional-resumo`: Figma
 * types it in DM Sans at 18.379px, a font this project does not ship. Rendered in the body
 * face instead. See DS-GAPS.md.
 */
export function CardReview({ nome, iniciais, estrelas, texto }: Review) {
  return (
    <div className="border-outline-subtle flex w-full flex-col gap-4 border-b py-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar size="md" fallback={iniciais} />
          <p className="text-label-s text-fg-muted">{nome}</p>
        </div>

        <p className="text-accent-rating text-label-m">
          <span aria-hidden>
            {'★ '.repeat(estrelas).trim()}
            {estrelas < MAX_ESTRELAS ? ` ${'☆ '.repeat(MAX_ESTRELAS - estrelas).trim()}` : ''}
          </span>
          <span className="sr-only">
            {estrelas} de {MAX_ESTRELAS} estrelas
          </span>
        </p>
      </div>

      <p className="text-body-s text-fg-subtle">{texto}</p>
    </div>
  )
}
