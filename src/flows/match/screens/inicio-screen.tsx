import { onboarding } from '@/analytics/posthog'

import { Button } from '@guia-da-alma/ds'
import { useLocation, useNavigate } from 'react-router'

import escutaAtiva from '@/assets/match/escuta-ativa.svg'
import { GuiaLockup } from '@/components/local/guia-lockup'
import { lerOrigem } from '@/lib/origem'

import { useStepNavigation } from '../use-step-navigation'

import { useScreenSurface } from '@/lib/use-screen-surface'

/**
 * Opening screen of the Match flow — nodes 478:6794 (mobile) and 861:4122 (desktop).
 * Picks up straight from the last Cadastro screen, "Perfil aprovado".
 *
 * Both breakpoints are the same dark composition, lockup on top and actions at the
 * bottom; desktop centres it in a 450px column.
 *
 * A cópia diverge entre os frames: o mobile agora diz "vamos indicar as sessões mais
 * recomendadas" e "Agora não", e o desktop, "iremos indicar o melhor profissional" e "Quero
 * explorar a plataforma". Vale o mobile nos dois, como já era a regra aqui.
 *
 * "Quero explorar a plataforma" is `action/primary` on an `action/primary` ground, so the
 * button reads as a bare lime label. That is what the file draws, and `variant="contained"`
 * reproduces it exactly — not a gap, just an unusual pairing.
 */
export function InicioScreen() {
  useScreenSurface('surface-brand-strong')

  const { goNext } = useStepNavigation('inicio')
  const navigate = useNavigate()
  const { search } = useLocation()

  // Where the app is, for someone who opened the Match from it; the Home otherwise.
  const explorar = () => {
    onboarding.exit('explore_app')
    navigate(lerOrigem(search, '/app/inicio'))
  }

  return (
    <div className="bg-surface-brand-strong pt-safe px-safe flex min-h-dvh flex-col lg:items-center lg:[--px-safe:2.25rem]">
      <div className="flex w-full flex-1 flex-col lg:max-w-[450px]">
        {/*
          O lockup no topo e as ações no rodapé, nos dois breakpoints (2395:24125 e
          2395:24196). O que muda é o meio: no mobile a ilustração ocupa o espaço livre e o
          texto desce para junto dos botões; no desktop ilustração e texto são um bloco só,
          centralizado no espaço livre e com o texto centrado — o frame 3237:16419, que entrou
          na revisão de 23/09/2026.
        */}
        <div className="flex flex-1 flex-col items-center gap-6 px-6 py-12 lg:gap-0 lg:px-0 lg:pb-0">
          <GuiaLockup height={20} className="text-fg-on-action" />

          <div className="flex w-full flex-1 flex-col gap-6 lg:justify-center lg:gap-0">
            {/*
              A ilustração "Guia da Alma_Escuta ativa" (2395:24096) substituiu o orbe animado
              nesta tela, na revisão de 21/09/2026. O orbe continua no projeto — é ele que o
              banner do Match no Início desenha (`promo-match`).
            */}
            <div className="flex flex-1 items-center justify-center lg:flex-none lg:py-8">
              <img src={escutaAtiva} alt="" className="h-auto w-[229px] max-w-full" />
            </div>

            <div className="text-fg-on-action flex w-full flex-col gap-4 lg:text-center">
              {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
              {/* A quebra é do arquivo, nos dois breakpoints: "Vamos encontrar / o profissional ideal". */}
              <h1 className="font-display text-heading-l">
                Vamos encontrar <br />o profissional ideal
              </h1>
              <p className="text-body-s">
                Com base nas suas respostas, vamos indicar as sessões mais recomendadas
              </p>
            </div>
          </div>
        </div>

        <div className="pb-safe flex w-full flex-col gap-3 border-t border-black/3 px-6 pt-3 [--pb-safe:1rem] lg:[--pb-safe:2rem]">
          <Button variant="lime" className="w-full" onClick={goNext}>
            Continuar
          </Button>
          {/*
            Desenhado sem destino, porque quando esta tela nasceu não havia para onde ir.
            Agora há: é a porta de "pular o match e ir para o app", onde "Pular match"
            também cai.

            A cópia mudou só no mobile — lá agora é "Agora não", e o desktop mantém "Quero
            explorar a plataforma". Vale o mobile, como no resto desta tela. Ver SYNC-FIGMA.md.
          */}
          <Button variant="contained" className="w-full" onClick={explorar}>
            Agora não
          </Button>
        </div>
      </div>
    </div>
  )
}
