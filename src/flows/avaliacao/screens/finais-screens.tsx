import type { ComponentProps, ElementType, ReactNode } from 'react'

import { Button, FeaturedIcon } from '@guia-da-alma/ds'
import { CalendarIcon, CheckIcon } from 'lucide-react'

import { StepFooter } from '@/components/layout/step-chrome'
import { ProximosHorarios } from '@/components/local/proximos-horarios'
import { SESSAO_DEMO } from '@/state/conta-provider'

import { useAvaliacaoNavigation } from '../use-avaliacao-navigation'

/**
 * The three endings. Same bones in all of them: a featured icon, the headline, the next
 * slots of the same professional, and two quiet ways out — "Decidir depois" back to the app
 * and "Buscar outro profissional".
 *
 * Neither way out is a primary action. Mobile stacks "Decidir depois" on top; the desktop
 * modal puts it on the right, which is what the shell's reversed row does with the DOM order.
 */

const primeiroNome = SESSAO_DEMO.profissionalNome.split(' ')[0]

type FinalProps = {
  icone: ElementType
  corIcone: ComponentProps<typeof FeaturedIcon>['color']
  titulo: ReactNode
  subtitulo?: string
  cabecalhoHorarios: ReactNode
  /** 3b draws "Buscar outro profissional" as an outlined button on mobile. */
  buscarDestacado?: boolean
}

function Final({
  icone,
  corIcone,
  titulo,
  subtitulo,
  cabecalhoHorarios,
  buscarDestacado = false,
}: FinalProps) {
  const { sair, agendar, buscarOutro } = useAvaliacaoNavigation()

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 px-6 pt-6 pb-6 lg:gap-6 lg:p-0">
        <div className="flex flex-col items-start gap-6 lg:gap-4">
          {/*
            O ícone é centralizado na tela, e não alinhado à esquerda junto do texto —
            decisão da revisão de 21/09/2026, válida para toda tela de feedback. É o mesmo
            arranjo que o `StatusShell` ("Em análise") e a Introdução já usam: ilustração
            centrada, cópia alinhada à esquerda embaixo dela.
          */}
          <div className="flex w-full justify-center">
            <FeaturedIcon icon={icone} size="xl" color={corIcone} />
          </div>

          <div className="flex flex-col gap-4">
            {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
            <h1 className="font-display text-heading-l text-fg-default">{titulo}</h1>
            {subtitulo ? <p className="text-body-s text-fg-muted">{subtitulo}</p> : null}
          </div>
        </div>

        {/* Mobile centres the slots in whatever height the headline leaves. */}
        <div className="flex flex-1 flex-col justify-center pt-4 lg:flex-none lg:pt-0">
          <ProximosHorarios
            cabecalho={cabecalhoHorarios}
            onEscolher={agendar}
            onVerOutros={() => agendar()}
          />
        </div>
      </div>

      <StepFooter>
        <Button variant="text-neutral" className="w-full lg:flex-1" onClick={sair}>
          Decidir depois
        </Button>

        {buscarDestacado ? (
          <>
            <Button variant="outlined" className="w-full lg:hidden" onClick={buscarOutro}>
              Buscar outro profissional
            </Button>
            <Button
              variant="text-neutral"
              className="hidden w-full lg:inline-flex lg:flex-1"
              onClick={buscarOutro}
            >
              Buscar outro profissional
            </Button>
          </>
        ) : (
          <Button variant="text-neutral" className="w-full lg:flex-1" onClick={buscarOutro}>
            Buscar outro profissional
          </Button>
        )}
      </StepFooter>
    </>
  )
}

const tituloHorarios = (
  <p className="text-label-m text-fg-default font-semibold">Próximos horários disponíveis de {primeiroNome}</p>
)

/** Ending 3a, after a good evaluation — nodes 2288:12305 (mobile) and 2296:11072 (desktop). */
export function AgradecimentoScreen() {
  return (
    <Final
      icone={CheckIcon}
      corIcone="positive-accent"
      titulo="Obrigada por compartilhar sua experiência"
      cabecalhoHorarios={tituloHorarios}
    />
  )
}

/**
 * Ending 3b, after a low rating or a broken call — nodes 2288:17077 (mobile) and 2296:12290
 * (desktop). It asks before assuming: "Quer continuar com Daniele?", with searching for
 * someone else given more weight than in 3a.
 */
export function ApoioScreen() {
  return (
    <Final
      icone={CheckIcon}
      corIcone="positive-accent"
      titulo="Obrigada por nos contar"
      subtitulo="Sua experiência importa. Você pode escolher como deseja continuar."
      buscarDestacado
      cabecalhoHorarios={
        <div className="flex flex-col gap-3">
          <h2 className="text-label-l text-fg-default font-semibold">Quer continuar com {primeiroNome}?</h2>
          <p className="text-body-s text-fg-muted">Próximos horários disponíveis</p>
        </div>
      }
    />
  )
}

/**
 * Ending 4, when the evaluation is skipped — nodes 2288:16602 (mobile) and 2296:11269
 * (desktop). Reached from "Agora não" on step 1 and "Prefiro não avaliar" on the rating.
 */
export function ProximaScreen() {
  return (
    <Final
      icone={CalendarIcon}
      corIcone="neutral"
      titulo={
        <>
          Agende <br className="lg:hidden" />
          sua próxima <br className="lg:hidden" />
          sessão
        </>
      }
      cabecalhoHorarios={tituloHorarios}
    />
  )
}
