import { Button } from '@guia-da-alma/ds'

export type OutraSessao = {
  titulo: string
  disponibilidade: string
}

/**
 * The stripped-down session card on the "Mais sessões" tab (1184:5259) — same surface and
 * border as `card-profissional`, but no portrait or rating, because every entry belongs to
 * the professional already shown at the top of the screen.
 *
 * DS-GAP: `radius/xxl` (24px) again, capped at `rounded-2xl` (16px). See item 9 of
 * DS-GAPS.md.
 */
export function CardOutraSessao({ titulo, disponibilidade }: OutraSessao) {
  return (
    <div className="bg-surface-faint border-outline-subtle flex w-full flex-col gap-4 rounded-2xl border p-3">
      <p className="text-label-s text-fg-default px-1 py-2">{titulo}</p>

      <div className="flex w-full items-center justify-between pl-1">
        <p className="text-caption text-fg-brand-accent">{disponibilidade}</p>

        <Button variant="outlined" size="small">
          Ver detalhes
        </Button>
      </div>
    </div>
  )
}
