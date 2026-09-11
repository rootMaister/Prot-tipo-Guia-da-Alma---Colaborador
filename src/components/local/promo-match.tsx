import { Button } from '@guia-da-alma/ds'
import { ArrowRightIcon } from 'lucide-react'
import { useNavigate } from 'react-router'

import { comOrigem } from '@/lib/origem'

import { GuiaOrb } from './guia-orb'

/**
 * `banner` (1448:7652) — the dark card that offers the Match on the Home of someone who
 * has not booked a session yet. Once there is a session the Home swaps it for
 * "Sua próxima sessão", so this is a state of the screen, not a separate destination.
 *
 * The Guia orb sits behind the copy, blurred to 19.5px and mostly outside the card's
 * top-right corner; the card clips it. Its offsets are Figma's own, relative to the card's
 * centre, so they hold as the card grows on desktop.
 *
 * DS-GAP: the card's drop shadow is `0 2px 2px rgba(0,0,0,0.04)`, which no shadow token
 * matches — `shadow-xs` (`0 1px 2px rgba(16,24,40,0.05)`) is the nearest and is used here
 * rather than an arbitrary value. See DS-GAPS.md.
 */
export function PromoMatch() {
  const navigate = useNavigate()

  return (
    <div className="bg-action-primary shadow-xs relative isolate flex w-full flex-col gap-3 overflow-hidden rounded-2xl p-3">
      <GuiaOrb
        size={497}
        className="absolute top-[calc(50%-131.5px)] left-[calc(50%+244px)] z-[1] -translate-x-1/2 -translate-y-1/2 blur-[19.5px]"
      />

      <div className="z-[3] flex w-full flex-col gap-2">
        {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
        <h2 className="font-display text-heading-s text-fg-on-action">
          Descubra a melhor
          {/* The line break is the design's, on both breakpoints. */}
          <br />
          sessão para você
        </h2>

        <p className="text-body-s text-fg-on-action max-w-[305px] py-2">
          Com base nas suas respostas, vamos indicar o melhor profissional para te atender
        </p>
      </div>

      <div className="z-[2] flex w-full flex-col pt-4">
        <Button
          variant="lime"
          className="w-full"
          trailingIcon={<ArrowRightIcon className="size-[18px]" />}
          onClick={() => navigate(comOrigem('/match/inicio', '/app/inicio'))}
        >
          Match de terapia
        </Button>
      </div>
    </div>
  )
}
