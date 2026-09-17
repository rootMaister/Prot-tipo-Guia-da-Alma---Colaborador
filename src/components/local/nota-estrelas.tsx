import { useRef, type KeyboardEvent } from 'react'

const TOTAL = 5

type NotaEstrelasProps = {
  valor: number | null
  onChange: (nota: number) => void
}

/**
 * "Nota do terapeuta" (2288:16974) — five stars, filled up to the chosen one.
 *
 * The glyphs are text, ★ and ☆ in Calma Serif on `accent/rating`, which is how the file
 * draws them; `text-heading-s` is exactly that run (24/36, −0.24). Mobile spreads the five
 * across the width; the desktop modal keeps them in a 360px row, centred.
 *
 * A radio group for assistive tech, with the arrow keys moving the rating and only the
 * current star in the tab order.
 */
export function NotaEstrelas({ valor, onChange }: NotaEstrelasProps) {
  const botoes = useRef<(HTMLButtonElement | null)[]>([])

  const mover = (evento: KeyboardEvent, nota: number) => {
    const passo = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[evento.key]

    if (!passo) return

    evento.preventDefault()
    const proxima = Math.min(TOTAL, Math.max(1, nota + passo))
    onChange(proxima)
    botoes.current[proxima - 1]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label="Nota do atendimento"
      className="flex w-full gap-2 py-6 lg:mx-auto lg:w-90 lg:py-2"
    >
      {Array.from({ length: TOTAL }, (_, indice) => {
        const nota = indice + 1
        const cheia = valor !== null && nota <= valor

        return (
          <button
            key={nota}
            ref={(no) => {
              botoes.current[indice] = no
            }}
            type="button"
            role="radio"
            aria-checked={valor === nota}
            aria-label={`${nota} de ${TOTAL} estrelas`}
            tabIndex={(valor ?? 1) === nota ? 0 : -1}
            onClick={() => onChange(nota)}
            onKeyDown={(evento) => mover(evento, nota)}
            className={[
              'font-display text-heading-s text-accent-rating flex flex-1 items-center justify-center',
              'hover:bg-surface-subtle rounded-xl px-3 py-2 transition-colors',
              'focus-visible:ring-focus-ring focus-visible:ring-2 focus-visible:outline-none',
            ].join(' ')}
          >
            <span aria-hidden>{cheia ? '★' : '☆'}</span>
          </button>
        )
      })}
    </div>
  )
}
