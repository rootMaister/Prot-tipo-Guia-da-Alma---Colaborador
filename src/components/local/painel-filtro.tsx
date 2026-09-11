import { useEffect, useState } from 'react'

import { Button, Chip, IconButton } from '@guia-da-alma/ds'
import { XIcon } from 'lucide-react'

import { OptionCard } from './option-card'

type PainelFiltroProps = {
  titulo: string
  opcoes: readonly string[]
  /** What is currently applied; the panel opens on a copy of it. */
  selecionados: string[]
  onAplicar: (selecionados: string[]) => void
  onFechar: () => void
}

/**
 * `modal-drawer / Temas` (1794:2449) — the filter panel of the Busca screen: a 4px-inset
 * sheet that covers the screen, with the group's name, a close button, the options as
 * `radio-group-item` rows and "Aplicar filtro" pinned below them.
 *
 * DS-GAP: the design system has a `Dialog`, and it cannot produce this. `DialogContent` is
 * a centred `max-w-lg` card at `rounded-lg` with its own small ✕ baked into the corner —
 * there is no sheet/full-screen variant and no way to replace that close control, so the
 * panel would have to be rebuilt through `className` overrides plus a duplicate ✕. Built
 * locally instead. See DS-GAPS.md.
 *
 * The picks are held locally and only handed over on "Aplicar filtro", which is what makes
 * the button mean something: closing the panel discards them. The design draws the button
 * disabled while nothing is ticked; here it stays enabled, because applying an empty
 * selection is how the group gets cleared — the same reasoning as the review decision that
 * a CTA should stay visible and let its label carry the message. See SYNC-FIGMA.md.
 */
export function PainelFiltro({
  titulo,
  opcoes,
  selecionados,
  onAplicar,
  onFechar,
}: PainelFiltroProps) {
  const [picks, setPicks] = useState<string[]>(selecionados)

  useEffect(() => {
    const onKey = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') onFechar()
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onFechar])

  const alternar = (opcao: string) =>
    setPicks((atual) =>
      atual.includes(opcao) ? atual.filter((item) => item !== opcao) : [...atual, opcao],
    )

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      className="pt-safe px-safe pb-safe fixed inset-0 z-30 flex flex-col p-1"
    >
      <div className="bg-surface-base border-outline-subtle flex min-h-0 flex-1 flex-col gap-6 rounded-2xl border p-4 lg:mx-auto lg:w-full lg:max-w-[480px]">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-label-l text-fg-default">{titulo}</h2>
          <IconButton
            icon={<XIcon className="size-[18px]" />}
            aria-label="Fechar"
            onClick={onFechar}
          />
        </div>

        {picks.length > 0 ? (
          <div className="flex w-full flex-col gap-2">
            <p className="text-label-s text-fg-muted">Selecionados</p>
            <div className="flex flex-wrap gap-2">
              {picks.map((pick) => (
                <Chip key={pick} color="green" onDismiss={() => alternar(pick)}>
                  {pick}
                </Chip>
              ))}
            </div>
          </div>
        ) : null}

        {/* The list scrolls; the action below it does not. */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
          {opcoes.map((opcao) => (
            <OptionCard
              key={opcao}
              id={`filtro-${titulo}-${opcao}`}
              label={opcao}
              checked={picks.includes(opcao)}
              onCheckedChange={() => alternar(opcao)}
            />
          ))}
        </div>

        <div className="flex w-full flex-col pt-3 pb-2">
          <Button variant="contained" className="w-full" onClick={() => onAplicar(picks)}>
            Aplicar filtro
          </Button>
        </div>
      </div>
    </div>
  )
}
