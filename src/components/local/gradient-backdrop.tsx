import { motion } from 'motion/react'

import { cn } from '@guia-da-alma/ds'

import blob1 from '@/assets/cadastro/welcome-blob-1.svg'
import blob2 from '@/assets/cadastro/welcome-blob-2.svg'

/**
 * The ambient gradient behind the Welcome screen (nodes 779:427–779:429 on mobile,
 * 826:3138–826:3146 on desktop).
 *
 * Two blurred radial-gradient ellipses, each rotating a full −360° over 8.011s on a
 * linear loop, offset 180° from one another — that counter-rotation is what makes the
 * colour field drift. Keyframes from `get_motion_context`.
 *
 * Exported as images rather than rebuilt in CSS: these are blurred mesh gradients and a
 * `radial-gradient()` approximation would not match.
 *
 * Both ellipses share one centre in Figma, on both breakpoints, so the geometry collapses
 * to a single anchor point plus a scale. Expressing the anchor as a percentage — rather
 * than transcribing Figma's absolute pixel offsets — keeps the backdrop right at widths
 * other than the 393px and 1536px the design was drawn at.
 */

const ROTATION_DURATION_S = 8.011

/** Natural sizes of the two exported SVGs, including the blur bleed. */
const BLOB_1 = { width: 1053, height: 1033 }
const BLOB_2 = { width: 1028.56, height: 1009.13 }

type Anchor = {
  /** Shared centre of both ellipses, as a percentage of the container. */
  x: string
  y: string
  /** Multiplier on the natural SVG size. */
  scale: number
}

/** Centre at 205.5,714.5 of the 393×852 frame; blobs at their exported size. */
const MOBILE: Anchor = { x: '52.3%', y: '83.9%', scale: 1 }

/** Centre at 85,488.9 of the 688×928 card; Figma exports these 1.186× larger. */
const DESKTOP: Anchor = { x: '12.4%', y: '52.7%', scale: 1.186 }

type GradientBackdropProps = {
  variant?: 'mobile' | 'desktop'
  className?: string
}

export function GradientBackdrop({ variant = 'mobile', className }: GradientBackdropProps) {
  const anchor = variant === 'desktop' ? DESKTOP : MOBILE

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden
    >
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: anchor.x, top: anchor.y }}
      >
        <motion.img
          src={blob1}
          alt=""
          className="block max-w-none"
          style={{ width: BLOB_1.width * anchor.scale, height: BLOB_1.height * anchor.scale }}
          initial={{ rotate: -90 }}
          animate={{ rotate: -450 }}
          transition={{ duration: ROTATION_DURATION_S, ease: 'linear', repeat: Infinity }}
        />
      </div>

      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: anchor.x, top: anchor.y }}
      >
        <motion.img
          src={blob2}
          alt=""
          className="block max-w-none"
          style={{ width: BLOB_2.width * anchor.scale, height: BLOB_2.height * anchor.scale }}
          initial={{ rotate: 90 }}
          animate={{ rotate: -270 }}
          transition={{ duration: ROTATION_DURATION_S, ease: 'linear', repeat: Infinity }}
        />
      </div>
    </div>
  )
}
