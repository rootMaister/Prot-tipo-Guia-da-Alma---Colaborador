import { cn } from '@guia-da-alma/ds'

type ProgressoPerguntasProps = {
  atual: number
  total: number
}

/**
 * "Pergunta 1 de 4" over one 4px segment per question — the `Progresso` group of the
 * Avaliação screens (2775:18022).
 *
 * DS-GAP: `ProgressBar` is a single continuous track with no segmented form, and the file
 * draws discrete steps here, not a percentage. See DS-GAPS.md, item 36.
 */
export function ProgressoPerguntas({ atual, total }: ProgressoPerguntasProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-body-s text-fg-muted">
        Pergunta {atual} de {total}
      </p>

      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={atual}
        aria-valuetext={`Pergunta ${atual} de ${total}`}
        className="flex h-1 w-full gap-1.5"
      >
        {Array.from({ length: total }, (_, indice) => (
          <span
            key={indice}
            className={cn(
              'bg-action-primary h-1 flex-1 rounded-full transition-opacity duration-300 ease-out',
              indice < atual ? 'opacity-100' : 'opacity-15',
            )}
          />
        ))}
      </div>
    </div>
  )
}
