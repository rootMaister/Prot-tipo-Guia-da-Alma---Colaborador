import { useEffect, useRef } from 'react'
import blend from '@/assets/diario/blend.json'

const SIZE = 260
const clamp = (value: number) => Math.max(0, Math.min(1, value))
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t) }
// Artwork palette, sampled from the Figma orb; not interface color tokens.
const dark = [43, 73, 55]
const light = [245, 247, 246]
const luminance = (rgb: number[]) => (rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722) / 255
const levels = blend.stops.map(stop => luminance(stop.rgb))
const minimum = Math.min(...levels)
const span = Math.max(...levels) - minimum || 1

/** O JSON é uma receita de fluxo, não código de animação. Interpret its stops,
 * dividers, soften, noise and speed as a moving field. Remap its luminance to the
 * Figma green palette so mood still progresses from dark to light. */
function MoodFlow({ value, speed = 1, className }: { value: number; speed?: number; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const mood = useRef(value)
  const redraw = useRef<(() => void) | null>(null)

  useEffect(() => {
    mood.current = value
    redraw.current?.()
  }, [value])

  useEffect(() => {
    const context = canvas.current?.getContext('2d')
    if (!context) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pixels = context.createImageData(SIZE, SIZE)
    // Stable, centered grain: the texture moves without flickering noise.
    const grain = Float32Array.from({ length: SIZE * SIZE }, (_, i) => {
      const seed = Math.sin(i * 127.1 + 311.7) * 43758.5453
      return (seed - Math.floor(seed) - .5) * blend.noise
    })
    const palette = Float32Array.from({ length: 256 }, (_, index) => {
      const position = index / 255
      let color = levels[0]
      for (let stop = 0; stop < blend.stops.length - 1; stop++) {
        const start = blend.stops[stop].position
        const end = blend.stops[stop + 1].position
        const divider = blend.dividers[stop] ?? (start + end) / 2
        const width = (end - start) * (1 + blend.soften / 100)
        const weight = smooth((position - divider) / width + .5)
        color += (levels[stop + 1] - color) * weight
      }
      return clamp((color - minimum) / span)
    })
    let phase = 0
    let previous = 0
    let frame = 0
    let disposed = false

    function paint() {
      const tone = clamp(mood.current / 4)
      const position = tone * 4
      const lower = Math.floor(position)
      const upper = Math.min(4, lower + 1)
      const fraction = position - lower
      const bases = [.02, .38, .72, .78, .83]
      const contrasts = [.4, .3, .19, .17, .16]
      const base = bases[lower] + (bases[upper] - bases[lower]) * fraction
      const contrast = contrasts[lower] + (contrasts[upper] - contrasts[lower]) * fraction
      for (let y = 0; y < SIZE; y++) {
        const ny = y / SIZE
        for (let x = 0; x < SIZE; x++) {
          const nx = x / SIZE
          const wave = Math.sin(nx * 4.2 + Math.cos(ny * 3.2 + phase) * 1.5 + phase) * .55
            + Math.cos(ny * 4.8 - nx * 1.8 + phase) * .45
          const field = palette[Math.round(clamp(wave * .5 + .5) * 255)]
          const brightness = base + contrast * field
          const pixel = (y * SIZE + x) * 4
          for (let channel = 0; channel < 3; channel++) {
            pixels.data[pixel + channel] = dark[channel] + (light[channel] - dark[channel]) * brightness + grain[y * SIZE + x]
          }
          pixels.data[pixel + 3] = 255
        }
      }
      context!.putImageData(pixels, 0, 0)
    }

    function animate(now: number) {
      frame = 0
      if (disposed || reduced.matches || document.hidden) return
      if (!previous) previous = now
      if (now - previous >= 1000 / 30) {
        phase += Math.min(now - previous, 100) / 1000 * blend.speed / 100 * speed
        previous = now
        paint()
      }
      frame = requestAnimationFrame(animate)
    }

    function syncMotion() {
      cancelAnimationFrame(frame)
      previous = 0
      paint()
      if (!reduced.matches && !document.hidden) frame = requestAnimationFrame(animate)
    }

    redraw.current = paint
    syncMotion()
    reduced.addEventListener('change', syncMotion)
    document.addEventListener('visibilitychange', syncMotion)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      redraw.current = null
      reduced.removeEventListener('change', syncMotion)
      document.removeEventListener('visibilitychange', syncMotion)
    }
  }, [speed])

  return <canvas ref={canvas} width={SIZE} height={SIZE} className={className} aria-hidden="true" />
}

/**
 * O orbe do Registro de humor, nos tamanhos em que os frames o desenham: 260px na tela do
 * humor, e pequeno (56px) quando ele vira o resumo do humor escolhido nos passos seguintes.
 */
export function OrbeHumor({ valor, tamanho = 260 }: { valor: number; tamanho?: number }) {
  return (
    <div
      aria-hidden
      className="relative shrink-0 overflow-hidden rounded-full"
      style={{ width: tamanho, height: tamanho }}
    >
      <MoodFlow value={valor} className="absolute inset-0 h-full w-full object-cover" />
    </div>
  )
}
