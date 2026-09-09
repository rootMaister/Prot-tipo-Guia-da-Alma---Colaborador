import { motion, type TargetAndTransition, type Transition } from 'motion/react'

import { cn } from '@guia-da-alma/ds'

import halo1 from '@/assets/match/guia-orb-halo-1.svg'
import halo2 from '@/assets/match/guia-orb-halo-2.svg'
import layer1 from '@/assets/match/guia-orb-1.svg'
import layer2 from '@/assets/match/guia-orb-2.svg'
import layer3 from '@/assets/match/guia-orb-3.svg'
import layer4 from '@/assets/match/guia-orb-4.svg'
import layer5 from '@/assets/match/guia-orb-5.svg'
import orbMask from '@/assets/match/guia-orb-mask.svg'
import wordmark from '@/assets/match/guia-orb-wordmark.svg'

/**
 * The "Guia" assistant orb — the `Guia_Assistente` symbol (288:3302), which opens the
 * Match flow and reappears on both "Buscando…" screens.
 *
 * Five blurred gradient ellipses rotate at different rates inside one circular alpha
 * mask, and the whole mask group breathes 1 → 1.1 → 1. Every track is a 10s loop, so the
 * composition realigns each cycle. Keyframes from `get_motion_context`.
 *
 * Exported as images rather than rebuilt in CSS, for the same reason as
 * `gradient-backdrop`: these are blurred mesh gradients that `radial-gradient()` cannot
 * reproduce.
 *
 * The desktop frame (861:4122) wraps the orb in two counter-rotating halos that the
 * mobile frame (478:6794) does not have — hence `halo`, rather than two components.
 *
 * Note the layer names disagree with the exported asset names: Figma's "Ellipse 1536"
 * carries the asset exported as Ellipse1537, and so on down the stack. The order is what
 * matches, so the tracks below follow paint order, not name.
 */

const LOOP_S = 10

/** Intrinsic size of the symbol on the canvas; `size` scales everything from it. */
const BASE_SIZE = 247.343

/** Halo diameters as a multiple of the orb, including each one's blur bleed. */
const HALO_1_RATIO = 449 / BASE_SIZE
const HALO_2_RATIO = 441.865 / BASE_SIZE

/** Shared sample points for the two hand-keyed ellipse tracks. */
const KEYED_TIMES = [
  0, 0.0207, 0.0707, 0.1207, 0.1707, 0.2207, 0.2707, 0.3207, 0.3707, 0.4207, 0.4707, 0.5207,
  0.5707, 0.6207, 0.6707, 0.7207, 0.7707, 0.8207, 0.8707, 0.9207, 0.9707, 0.9999, 1,
]

/** Ellipse 2: eases backwards through a full turn, then holds. */
const KEYED_ROTATE_A = [
  360, 360, 330.416, 302.24, 275.154, 249.076, 223.978, 199.86, 176.739, 154.646, 133.623,
  113.724, 95.015, 77.574, 61.497, 46.897, 33.906, 22.69, 13.443, 6.411, 1.896, 0.572, 0.286,
]

/** Ellipse 4: drifts forward ~33°, then unwinds the long way round. */
const KEYED_ROTATE_B = [
  360, 360, 363.689, 368.776, 374.512, 380.261, 385.467, 389.621, 392.248, 392.884, 391.068,
  386.328, 378.168, 366.057, 349.415, 327.593, 299.854, 265.345, 223.061, 171.791, 110.049,
  68.333, 35.963,
]

const loop = { duration: LOOP_S, repeat: Infinity } as const

/**
 * Figma applies a NOISE effect to the gradient group — read off the node as
 * `{ noiseType: 'MONOTONE', noiseSize: 0.493, color: #fff at 0.208, density: 0.9 }`.
 * Nothing in CSS maps to it, and the per-layer SVG export does not carry it, so it is
 * rebuilt with `feTurbulence`: sub-pixel grain (`baseFrequency` near 1), turned monotone
 * white by a colour matrix that discards RGB and takes alpha from the red channel.
 *
 * Alpha then averages ~0.5 across the tile, so the layer opacity below is set to bring the
 * mean to Figma's 0.208 × 0.9 ≈ 0.187 rather than being eyeballed.
 */
const NOISE_TILE = 120
const NOISE_OPACITY = 0.37

const noiseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${NOISE_TILE}" height="${NOISE_TILE}">
<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1 0 0 0 0"/></filter>
<rect width="${NOISE_TILE}" height="${NOISE_TILE}" filter="url(#n)"/></svg>`

const NOISE_URL = `url("data:image/svg+xml,${encodeURIComponent(noiseSvg)}")`

/** Paint order, each with its own track. Layers 1 and 3 share one animation. */
const LAYERS: { src: string; animate: TargetAndTransition; transition: Transition }[] = [
  { src: layer1, animate: { rotate: [-360, 0] }, transition: { ...loop, ease: 'easeOut' } },
  {
    src: layer2,
    animate: { rotate: KEYED_ROTATE_A },
    transition: { ...loop, ease: 'linear', times: KEYED_TIMES },
  },
  { src: layer3, animate: { rotate: [-360, 0] }, transition: { ...loop, ease: 'easeOut' } },
  {
    src: layer4,
    animate: { rotate: KEYED_ROTATE_B },
    transition: { ...loop, ease: 'linear', times: KEYED_TIMES },
  },
  { src: layer5, animate: { rotate: [-360, 0] }, transition: { ...loop, ease: 'easeIn' } },
]

type GuiaOrbProps = {
  /** Rendered diameter in px. Defaults to the size the symbol is drawn at in Figma. */
  size?: number
  /** The two outer rings the desktop frames add around the orb. */
  halo?: boolean
  className?: string
}

export function GuiaOrb({ size = BASE_SIZE, halo = false, className }: GuiaOrbProps) {
  return (
    <div
      className={cn('relative shrink-0', className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {halo ? (
        <>
          <Halo src={halo1} size={size * HALO_1_RATIO} from={-90} to={-450} />
          <Halo src={halo2} size={size * HALO_2_RATIO} from={90} to={-270} />
        </>
      ) : null}

      {/* The breathing group: the mask scales with its contents, so the orb pulses. */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: [1, 1.1, 1, 1] }}
        transition={{ ...loop, times: [0, 0.4942, 0.9885, 1], ease: 'easeInOut' }}
      >
        {LAYERS.map((layer, index) => (
          <div
            key={index}
            className="absolute inset-0"
            style={{
              maskImage: `url("${orbMask}")`,
              maskSize: '100% 100%',
              maskRepeat: 'no-repeat',
            }}
          >
            <motion.img
              src={layer.src}
              alt=""
              className="block size-full max-w-none"
              animate={layer.animate}
              transition={layer.transition}
            />
          </div>
        ))}

        {/* Grain, clipped to the same circle as the gradients it sits over. */}
        <div
          className="absolute inset-0"
          style={{
            maskImage: `url("${orbMask}")`,
            maskSize: '100% 100%',
            maskRepeat: 'no-repeat',
            backgroundImage: NOISE_URL,
            backgroundRepeat: 'repeat',
            opacity: NOISE_OPACITY,
          }}
        />
      </motion.div>

      <img
        src={wordmark}
        alt=""
        className="absolute block max-w-none"
        style={{ left: '26.13%', top: '41.18%', width: '46.54%', height: '16.85%' }}
      />
    </div>
  )
}

type HaloProps = {
  src: string
  size: number
  from: number
  to: number
}

function Halo({ src, size, from, to }: HaloProps) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <motion.img
        src={src}
        alt=""
        className="block max-w-none"
        style={{ width: size, height: size }}
        initial={{ rotate: from }}
        animate={{ rotate: to }}
        transition={{ ...loop, ease: 'linear' }}
      />
    </div>
  )
}
