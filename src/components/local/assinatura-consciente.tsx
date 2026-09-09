import { motion } from 'motion/react'

import cartao from '@/assets/cadastro/analise-cartao.svg'
import mao from '@/assets/cadastro/analise-mao.svg'
import peca1 from '@/assets/cadastro/analise-peca-1.svg'
import peca2 from '@/assets/cadastro/analise-peca-2.svg'
import peca3 from '@/assets/cadastro/analise-peca-3.svg'

/**
 * "Guia da Alma_Assinatura consciente" — the illustration on the RH-approval screen
 * (inside node 1078:9292). Five vector layers: a static card, and a hand group that
 * slides 16px right and back on a 2s loop.
 *
 * Geometry and the keyframe track come from `get_design_context` / `get_motion_context`;
 * the offsets below are the Figma layout coordinates, not eyeballed from a screenshot.
 * The easing is Figma's damped-spring curve, expressed as the easing function the motion
 * context handed back.
 */

/** Figma's spring easing, sampled as a function of normalised time. */
const springEase = (t: number) =>
  1 - Math.exp(-t * 7.4426) * (Math.cos(t * 10.5254) + 0.7071 * Math.sin(t * 10.5254))

export function AssinaturaConsciente() {
  return (
    <div className="relative h-[213px] w-[252px] shrink-0" aria-hidden>
      <img src={cartao} alt="" className="absolute top-[95.58px] left-0 h-[117.42px] w-[170px]" />

      <motion.div
        className="absolute top-0 left-[86.1px] h-[156.68px] w-[165.45px]"
        initial={{ x: 0 }}
        animate={{ x: [0, 16, 0, 0] }}
        transition={{
          x: {
            duration: 2,
            times: [0, 0.4251, 0.9001, 1],
            ease: [springEase, springEase, 'linear'],
            repeat: Infinity,
          },
        }}
      >
        <img
          src={peca1}
          alt=""
          className="absolute top-[106.67px] left-[25.88px] h-[21.96px] w-[19.6px] rotate-[15.58deg]"
        />
        <img src={peca2} alt="" className="absolute top-[109.8px] left-[44.7px] h-[21.96px] w-[19.6px]" />
        <img src={peca3} alt="" className="absolute top-[109.8px] left-[61.95px] h-[18.82px] w-[16.8px]" />
        {/* Painted last in Figma, so the hand outline sits over the three smaller pieces. */}
        <img src={mao} alt="" className="absolute inset-0 h-full w-full" />
      </motion.div>
    </div>
  )
}
