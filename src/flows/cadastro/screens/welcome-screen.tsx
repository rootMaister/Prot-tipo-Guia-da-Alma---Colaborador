import { Button } from '@guia-da-alma/ds'
import { ArrowRightIcon } from 'lucide-react'

import { GuiaLockup } from '@/components/local/guia-lockup'
import { useScreenSurface } from '@/lib/use-screen-surface'

import atmosferaDesktop from '@/assets/cadastro/welcome-atmosfera-desktop.svg'
import atmosferaMobile from '@/assets/cadastro/welcome-atmosfera-mobile.svg'

import { useStepNavigation } from '../use-step-navigation'

const TITULO_MOBILE = ['Agora você tem', 'terapia online', 'quando precisar.']
const SUBTITULO = 'Encontre sua empresa para acessar seu benefício'

/**
 * Entry screen — nodes 2028:647 ("[Mobile] Welcome — A / Imersiva") e 2020:647
 * ("[Desktop] 1. Welcome").
 *
 * Redesenhada no Figma: os nodes antigos (779:415 / 826:3114) não existem mais, e com eles
 * foi embora o painel escuro invertido do desktop — que era a única exceção aberta à regra de
 * não mascarar cor do DS com `className` (item 12 do DS-GAPS.md). Agora as duas telas são
 * claras, sobre `surface/subtle`.
 *
 * Continuam sendo desenhos diferentes, não um reflow: no mobile a manchete e o subtítulo
 * ficam juntos no rodapé, sobre a atmosfera que cobre a tela inteira; no desktop a atmosfera
 * vira um painel editorial de 688px à esquerda com só a manchete dentro, e o subtítulo vai
 * para a coluna de ações à direita. A manchete também muda de tamanho e de quebra: Heading L
 * em três linhas no mobile, Heading M em duas no desktop.
 *
 * A "atmosfera" são duas elipses desfocadas girando — exportadas como SVG pelo mesmo motivo
 * que `gradient-backdrop` e `guia-orb`: `radial-gradient()` não reproduz uma malha borrada.
 * Cada arquivo já traz a opacidade do seu breakpoint (42% no mobile, 68% no desktop). O Figma
 * marca os nós como animados mas não define timeline nenhuma, então aqui elas estão paradas —
 * ver SYNC-FIGMA.md.
 *
 * "Entrar" é renderizado e inerte: não existe fluxo de Login no protótipo.
 */
export function WelcomeScreen() {
  useScreenSurface('surface-subtle')

  const { goNext } = useStepNavigation('welcome')

  const acoes = (
    <div className="flex w-full flex-col gap-4">
      <Button
        variant="contained"
        className="w-full"
        onClick={goNext}
        trailingIcon={<ArrowRightIcon className="size-[18px]" />}
      >
        Identifique a sua empresa
      </Button>

      <div className="flex w-full items-center justify-center gap-1">
        <p className="text-body-s text-action-tertiary">Já tem uma conta?</p>
        <Button variant="text" aria-disabled="true">
          Entrar
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile */}
      {/*
        Os 96px do topo e os 24 das laterais vão nas variáveis das utilities de área segura,
        não em `pt-24`/`px-6`: elas são CSS escrito depois do Tailwind e ganhariam desses.
        Ver a nota em `styles/index.css` e em CLAUDE.md.
      */}
      <div className="bg-surface-subtle pt-safe px-safe pb-safe relative isolate flex min-h-dvh flex-col gap-8 overflow-hidden lg:hidden [--pb-safe:1.5rem] [--pt-safe:6rem] [--px-safe:1.5rem]">
        <img
          src={atmosferaMobile}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -top-[179px] -left-[495px] z-0 h-[1173px] w-[1224px] max-w-none"
        />

        <GuiaLockup height={25} className="text-action-tertiary relative z-10" />

        <div className="relative z-10 flex flex-1 flex-col justify-end gap-5 pb-2">
          {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
          <h1 className="font-display text-heading-l text-action-tertiary">
            {TITULO_MOBILE.map((linha) => (
              <span key={linha} className="block">
                {linha}
              </span>
            ))}
          </h1>

          <p className="text-body-s text-action-tertiary">{SUBTITULO}</p>
        </div>

        <div className="relative z-10">{acoes}</div>
      </div>

      {/* Desktop */}
      <div className="bg-surface-subtle pt-safe px-safe hidden min-h-dvh items-start justify-between lg:flex">
        <div className="flex h-dvh min-w-0 flex-1 items-center p-4">
          {/* Painel editorial: 688px, cantos de 16, e a atmosfera recortada por ele. */}
          <div className="relative flex h-full max-h-[928px] w-[688px] shrink-0 flex-col justify-end gap-5 overflow-hidden rounded-2xl px-16 pt-24 pb-[72px]">
            <img
              src={atmosferaDesktop}
              alt=""
              aria-hidden
              className="pointer-events-none absolute -top-[342px] -left-[726px] z-0 h-[1661px] w-[1622px] max-w-none"
            />

            <h1 className="font-display text-heading-m text-action-tertiary relative z-10">
              Agora você tem terapia online quando precisar.
            </h1>
          </div>
        </div>

        <div className="flex h-dvh min-w-0 flex-1 flex-col items-center justify-center gap-12 px-8 py-16">
          <div className="flex w-[400px] max-w-full flex-col gap-8">
            <GuiaLockup height={25} className="text-action-tertiary" />

            <div className="flex w-full flex-col gap-8">
              <p className="text-body-s text-action-tertiary">{SUBTITULO}</p>
              {acoes}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
