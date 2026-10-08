import { cn } from '@guia-da-alma/ds'

export type Profissional = {
  /** Abbreviated title as drawn: "Psi." on some cards, "Psic." on others. */
  titulo: string
  nome: string
  avatar: string
  /**
   * O registro no conselho, "CRP 06/123456" — a linha que o `card-profissional` passou a
   * trazer "fixa abaixo do nome" (1173:4573) e que o cabeçalho do Detalhes da sessão ganhou
   * junto, em 23/09/2026.
   */
  crp?: string
  /** 0–5, drawn as filled and hollow star glyphs. */
  estrelas: number
  avaliacoes: number
  sessoesRealizadas: number
}

const MAX_ESTRELAS = 5

type ProfissionalResumoProps = Profissional & {
  /**
   * A foto de 56px e raio 12 do `Foto profissional / Size=Small` (2694:12403), que o card
   * de "Mais sessões" usa, no lugar do retrato de 88px.
   */
  compacto?: boolean
  /**
   * Esconde o CRP onde o arquivo não o desenha: o "Confirmar informações" (1236:10804) e a
   * coluna de resumo das telas de duas colunas continuam sem ele.
   */
  semCrp?: boolean
}

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
  crp,
  estrelas,
  avaliacoes,
  sessoesRealizadas,
  compacto,
  semCrp,
}: ProfissionalResumoProps) {
  return (
    <div className={cn('flex w-full items-center', compacto ? 'gap-2.5' : 'gap-4 py-2')}>
      <img
        src={avatar}
        alt=""
        className={cn(
          'border-outline-avatar shrink-0 border object-cover',
          compacto ? 'size-14 rounded-xl' : 'size-[88px] rounded-2xl',
        )}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="text-label-s flex flex-col">
          <span className="text-fg-subtle">{titulo}</span>
          <span className="text-fg-muted">{nome}</span>
        </div>

        {crp && !semCrp ? <p className="text-caption text-fg-subtle">{crp}</p> : null}

        <div className="flex flex-col gap-1">
          <p className="text-accent-rating text-label-s flex items-center gap-2.5">
            <span aria-hidden>
              {'★ '.repeat(estrelas).trim()}
              {estrelas < MAX_ESTRELAS ? ` ${'☆ '.repeat(MAX_ESTRELAS - estrelas).trim()}` : ''}
            </span>
            {/* O contador é Body S no arquivo, não Label S: mesmos 14/20, peso 400. */}
            <span className="text-body-s">({avaliacoes})</span>
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
