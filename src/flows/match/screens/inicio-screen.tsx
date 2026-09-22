import { onboarding } from '@/analytics/posthog'

import { Button } from '@guia-da-alma/ds'
import { useLocation, useNavigate } from 'react-router'

import escutaAtiva from '@/assets/match/escuta-ativa.svg'
import { lerOrigem } from '@/lib/origem'

import { useStepNavigation } from '../use-step-navigation'

import { useScreenSurface } from '@/lib/use-screen-surface'

/**
 * Opening screen of the Match flow — nodes 478:6794 (mobile) and 861:4122 (desktop).
 * Picks up straight from the last Cadastro screen, "Perfil aprovado".
 *
 * Both breakpoints are the same dark composition; desktop centres it in a 450px column
 * and wraps the orb in two counter-rotating halos the mobile frame does not have.
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
      {/*
        No desktop o conjunto inteiro — ilustração, texto e ações — é centrado na altura,
        e não esticado até as bordas: é assim que o frame compõe, com folga acima e abaixo.
        No mobile ele continua ocupando a tela toda, com as ações no rodapé.
      */}
      <div className="flex w-full flex-1 flex-col lg:max-w-[450px] lg:justify-center">
        {/*
          Os dois breakpoints passaram a ter a mesma montagem na revisão de 21/09/2026: a
          ilustração centralizada no espaço que sobra, e o título e o subtítulo descendo
          para junto dos botões. Antes o desktop centralizava ilustração e texto como um
          bloco só (`lg:justify-center`), o que abria um vão entre o texto e as ações.
        */}
        <div className="flex flex-1 flex-col items-center justify-end gap-6 px-6 py-12 lg:flex-none lg:gap-14 lg:px-0 lg:py-0">
          {/*
            A ilustração "Guia da Alma_Escuta ativa" (2395:24096) substituiu o orbe animado
            nesta tela, na revisão de 21/09/2026. O orbe continua no projeto — é ele que o
            banner do Match no Início desenha (`promo-match`).

            `flex-1` nos dois: é o que centraliza a ilustração na altura livre acima do
            texto, em vez de encostá-la nele.
          */}
          <div className="flex flex-1 items-center justify-center lg:flex-none">
            <img src={escutaAtiva} alt="" className="h-auto w-[229px] max-w-full" />
          </div>

          <div className="text-fg-on-action flex w-full flex-col gap-4">
            {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
            <h1 className="font-display text-heading-l">Vamos encontrar o profissional ideal</h1>
            <p className="text-body-s">
              Com base nas suas respostas, vamos indicar as sessões mais recomendadas
            </p>
          </div>
        </div>

        {/*
          No desktop o frame não desenha o filete: as ações são a continuação do texto, não
          uma barra à parte. Daí `lg:border-t-0` e o respiro maior embaixo.
        */}
        <div className="pb-safe flex w-full flex-col gap-3 border-t border-black/3 px-6 pt-3 [--pb-safe:1rem] lg:border-t-0 lg:px-0 lg:pt-8 lg:[--pb-safe:0px]">
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
