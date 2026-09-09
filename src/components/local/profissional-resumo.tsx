export type Profissional = {
  /** Abbreviated title as drawn: "Psi." on some cards, "Psic." on others. */
  titulo: string
  nome: string
  avatar: string
  /** 0–5, drawn as filled and hollow star glyphs. */
  estrelas: number
  avaliacoes: number
  sessoesRealizadas: number
}

const MAX_ESTRELAS = 5

/**
 * The 88px portrait plus name, rating and session count — the block shared by
 * `card-profissional` (1124:13065) on the Match results, the header of "Detalhes da
 * sessão" (1635:3030) and the review step (1236:10804). One component so the three cannot
 * drift apart.
 *
 * DS-GAP: the avatar is an 88px rounded square at `radius/xxl` (24px); `Avatar` is
 * hard-coded `rounded-full` with a fixed size scale, and the radius scale stops at
 * `rounded-2xl` (16px), so this is a plain `img` at 16px. See items 9 and 19 of
 * DS-GAPS.md.
 *
 * The rating is literal star glyphs in the file, not an icon set — copied as such.
 */
export function ProfissionalResumo({
  titulo,
  nome,
  avatar,
  estrelas,
  avaliacoes,
  sessoesRealizadas,
}: Profissional) {
  return (
    <div className="flex w-full items-center gap-4 py-2">
      <img
        src={avatar}
        alt=""
        className="border-outline-avatar size-[88px] shrink-0 rounded-2xl border object-cover"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="text-label-s flex flex-col">
          <span className="text-fg-subtle">{titulo}</span>
          <span className="text-fg-muted">{nome}</span>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-accent-rating text-label-s flex items-center gap-2.5">
            <span aria-hidden>
              {'★ '.repeat(estrelas).trim()}
              {estrelas < MAX_ESTRELAS ? ` ${'☆ '.repeat(MAX_ESTRELAS - estrelas).trim()}` : ''}
            </span>
            <span className="font-normal">({avaliacoes})</span>
            <span className="sr-only">
              {estrelas} de {MAX_ESTRELAS} estrelas, {avaliacoes} avaliações
            </span>
          </p>

          <p className="text-caption text-fg-subtle">{sessoesRealizadas} sessões realizadas</p>
        </div>
      </div>
    </div>
  )
}
