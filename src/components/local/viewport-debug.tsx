import { useEffect, useState } from 'react'

type Medidas = {
  innerHeight: number
  vvHeight: number
  vvOffsetTop: number
  vvPageTop: number
  scrollY: number
  htmlOverflow: string
  bodyOverflow: string
  docScrollHeight: number
  appHeight: string
  appOffset: string
  raizTop: number
  raizAltura: number
  rodapeTop: number
  rodapeAltura: number
}

const ler = (): Medidas => {
  const vv = window.visualViewport
  const html = document.documentElement
  const raiz = document.querySelector<HTMLElement>('.h-app, .min-h-app')
  const rodape = document.querySelector<HTMLElement>('footer')

  const r = raiz?.getBoundingClientRect()
  const f = rodape?.getBoundingClientRect()

  return {
    innerHeight: Math.round(window.innerHeight),
    vvHeight: Math.round(vv?.height ?? 0),
    vvOffsetTop: Math.round(vv?.offsetTop ?? 0),
    vvPageTop: Math.round(vv?.pageTop ?? 0),
    scrollY: Math.round(window.scrollY),
    htmlOverflow: getComputedStyle(html).overflowY,
    bodyOverflow: getComputedStyle(document.body).overflowY,
    docScrollHeight: Math.round(html.scrollHeight),
    appHeight: html.style.getPropertyValue('--app-height') || '—',
    appOffset: html.style.getPropertyValue('--app-offset') || '—',
    raizTop: Math.round(r?.top ?? 0),
    raizAltura: Math.round(r?.height ?? 0),
    rodapeTop: Math.round(f?.top ?? 0),
    rodapeAltura: Math.round(f?.height ?? 0),
  }
}

/**
 * Live viewport numbers, for diagnosing keyboard behaviour on a real handset — the one
 * thing that cannot be reproduced on a desktop browser.
 *
 * Off unless the URL carries `?debug=viewport`, so it never shows up in a normal
 * walkthrough. Temporary: delete once the keyboard layout is settled.
 */
export function ViewportDebug() {
  // Read from `window` rather than the router: this sits above the RouterProvider.
  const ligado = new URLSearchParams(window.location.search).get('debug') === 'viewport'
  const [medidas, setMedidas] = useState<Medidas | null>(null)

  useEffect(() => {
    if (!ligado) {
      return
    }

    const atualizar = () => setMedidas(ler())

    atualizar()
    const timer = window.setInterval(atualizar, 250)
    window.visualViewport?.addEventListener('resize', atualizar)
    window.visualViewport?.addEventListener('scroll', atualizar)

    return () => {
      window.clearInterval(timer)
      window.visualViewport?.removeEventListener('resize', atualizar)
      window.visualViewport?.removeEventListener('scroll', atualizar)
    }
  }, [ligado])

  if (!ligado || !medidas) {
    return null
  }

  const linhas: [string, string | number][] = [
    ['innerH', medidas.innerHeight],
    ['vv.h', medidas.vvHeight],
    ['vv.offTop', medidas.vvOffsetTop],
    ['vv.pageTop', medidas.vvPageTop],
    ['scrollY', medidas.scrollY],
    ['doc.scrollH', medidas.docScrollHeight],
    ['--app-height', medidas.appHeight],
    ['--app-offset', medidas.appOffset],
    ['html/body ovf', `${medidas.htmlOverflow}/${medidas.bodyOverflow}`],
    ['raiz top/alt', `${medidas.raizTop}/${medidas.raizAltura}`],
    ['rodapé top/alt', `${medidas.rodapeTop}/${medidas.rodapeAltura}`],
  ]

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.82)',
        color: '#9cff57',
        font: '10px/1.35 ui-monospace, monospace',
        padding: '6px 8px',
        pointerEvents: 'none',
        maxWidth: '62vw',
      }}
    >
      {linhas.map(([rotulo, valor]) => (
        <div key={rotulo}>
          {rotulo}: {valor}
        </div>
      ))}
    </div>
  )
}
