import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

import { cn } from '@guia-da-alma/ds'

/**
 * Uma lista que rola sozinha dentro de uma tela de altura fixa, com o esmaecido nas bordas
 * que indica que há mais conteúdo — o mesmo recurso do `ScrollArea` do shadcn.
 *
 * O esmaecido **aparece só quando há o que revelar**: some ao chegar no topo e no fim. Um
 * degradê fixo enganaria, apagando a última linha mesmo quando ela já é a última.
 *
 * Quem dá altura a isto é o `alturaFixa` do `StepShell`: sem ele, `flex-1` não tem contra o
 * que se medir e a lista cresce em vez de rolar.
 *
 * DS-GAP: o design system não tem `ScrollArea` nem equivalente. Ver DS-GAPS.md.
 */
export function ListaRolavel({
  children,
  className,
  semBarra,
}: {
  children: ReactNode
  className?: string
  /**
   * Esconde a barra de rolagem, deixando só o esmaecido como indicação. Usado no "Detalhes
   * da sessão" do Agendamento, onde a barra competia com o desenho. A rolagem continua
   * inteira — roda, arrasto, teclado e leitor de tela.
   */
  semBarra?: boolean
}) {
  const area = useRef<HTMLDivElement>(null)
  const [noTopo, setNoTopo] = useState(true)
  const [noFim, setNoFim] = useState(true)

  const medir = useCallback(() => {
    const no = area.current
    if (!no) return

    const folga = 2 // arredondamento de subpixel em telas com zoom
    setNoTopo(no.scrollTop <= folga)
    setNoFim(no.scrollTop + no.clientHeight >= no.scrollHeight - folga)
  }, [])

  useEffect(() => {
    const no = area.current
    if (!no) return

    medir()

    // Observa o tamanho também: marcar um item pode mudar a altura da lista, e o teclado
    // ou o giro da tela mudam a do contêiner.
    const observador = new ResizeObserver(medir)
    observador.observe(no)
    for (const filho of Array.from(no.children)) observador.observe(filho)

    return () => observador.disconnect()
  }, [medir])

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={area}
        onScroll={medir}
        className={cn(
          'min-h-0 flex-1 overflow-y-auto overscroll-contain',
          semBarra && 'sem-barra-de-rolagem',
          className,
        )}
      >
        {children}
      </div>

      <Esmaecido posicao="topo" visivel={!noTopo} />
      <Esmaecido posicao="fim" visivel={!noFim} />
    </div>
  )
}

function Esmaecido({ posicao, visivel }: { posicao: 'topo' | 'fim'; visivel: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        'from-surface-base pointer-events-none absolute inset-x-0 h-8 to-transparent',
        'transition-opacity duration-200 ease-out',
        posicao === 'topo' ? 'top-0 bg-gradient-to-b' : 'bottom-0 bg-gradient-to-t',
        visivel ? 'opacity-100' : 'opacity-0',
      )}
    />
  )
}
