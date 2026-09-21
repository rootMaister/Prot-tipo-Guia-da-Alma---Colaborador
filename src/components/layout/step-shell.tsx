import type { ReactNode } from 'react'

import { Badge, IconButton, ProgressBar, cn } from '@guia-da-alma/ds'
import { ArrowLeftIcon } from 'lucide-react'
import { useLocation } from 'react-router'

import { GuiaLockup } from '@/components/local/guia-lockup'
import { ListaRolavel } from '@/components/local/lista-rolavel'
import { useAdvancingProgress } from '@/lib/use-advancing-progress'

import { StepFooter, useChromeProgress, useFooterSlot, usePublishProgress } from './step-chrome'

import { useScreenSurface } from '@/lib/use-screen-surface'

type StepShellProps = {
  /** Text beside the progress bar. Taken from the rendered copy, not the layer name. */
  stepLabel: string
  /** The step's own percentage; a screen can override it through `StepBody`. */
  progress: number
  onBack?: () => void
  /**
   * Widens the desktop column from 450px to the container's full 1000px. Only the Match
   * results screen uses it: its grid needs the room, which is why its desktop progress
   * track is 934px where every other screen draws 384px.
   */
  wide?: boolean
  /**
   * Turns the desktop into the two-column layout the Agendamento flow is drawn in: a 436px
   * summary on the left and the step itself on the right, 80px apart inside the 1000px
   * container. Mobile is untouched — there is no second column there.
   *
   * The back button moves with it. On desktop the frames put it at the top of the **left**
   * column, above the session title, not beside the progress bar, so the shell draws it
   * there and hides the one in the header row.
   */
  aside?: ReactNode
  /**
   * Abre os 280px da régua lateral à esquerda, para quando o fluxo é aberto de dentro do
   * app. O conteúdo deixa de centralizar na viewport e passa a centralizar no que sobra —
   * que a 1440 dá exatamente os 80/1000/80 do frame 1617:4660.
   */
  comMenu?: boolean
  /**
   * Prende a tela à altura da viewport: o cabeçalho e o rodapé ficam parados e só o corpo
   * rola, com o esmaecido do `ListaRolavel`. Vale nos dois breakpoints.
   *
   * **Só para passos sem campo de texto.** A rolagem solta do documento, que é o padrão
   * aqui, existe porque travar a altura em `dvh` briga com o teclado do iOS — a nota em
   * CLAUDE.md conta as tentativas. Os passos que usam isto (temas e especialidade) só têm
   * cartões de escolha: sem campo, não há teclado, e a objeção não se aplica.
   */
  alturaFixa?: boolean
  /** The part that transitions between steps. */
  children?: ReactNode
}

/**
 * Progress-header chrome — the `mobile-match` (1105:10742) and `desktop-match`
 * (1130:1263) symbols in Figma, whose inner `[mobile]-reference-screen` (1105:10666) is
 * shared by the Match questionnaire (steps 2–5, 7) and the Agendamento flow (steps 2–4).
 * The "match" in the Figma names is the symbol's name, not a flow's — hence `StepShell`.
 *
 * Rendered by the flow's **layout route**, not by the screens, so the lockup, the back
 * button, the progress bar and the footer bar stay still while only the page content
 * slides between steps. What each screen puts inside those fixed parts arrives through
 * `step-chrome`.
 *
 * A sibling of `SignUpShell` rather than a variant of it: the Figma symbols are separate,
 * and three things genuinely differ — the title stays Heading L (32/40) on *both*
 * breakpoints instead of growing from Display S to Heading XXL; the header row is
 * centre-aligned on mobile and bottom-aligned on desktop; and the footer keeps its top
 * border and 32px bottom padding on desktop, where the sign-up footer drops both.
 *
 * DS-GAP: same `ProgressBar` track and `Badge` divergences as `SignUpShell` — left as the
 * design system renders them rather than patched over with className. See DS-GAPS.md.
 */
export function StepShell({
  stepLabel,
  progress,
  onBack,
  wide = false,
  aside,
  comMenu = false,
  alturaFixa,
  children,
}: StepShellProps) {
  useScreenSurface('surface-base')

  // The flow name is the first path segment, so the bar of each flow animates from its own
  // previous step and never from another flow's.
  const flow = useLocation().pathname.split('/')[1] ?? 'app'
  const override = useChromeProgress()
  const alvo = override ?? progress
  const progressoAnimado = useAdvancingProgress(flow, alvo)
  const setFooterNode = useFooterSlot()

  return (
    <div
      className={cn(
        'bg-surface-base pt-safe px-safe flex flex-col gap-3 lg:gap-0',
        alturaFixa ? 'h-dvh overflow-hidden' : 'min-h-dvh',
        /*
          Nos passos de duas colunas, o desktop também trava a altura — e só a coluna da
          direita rola. A esquerda (título, profissional e o resumo que vai se preenchendo)
          fica parada, e a barra de progresso e a ação continuam à vista.

          Medido em "Escolher data e horário": o conteúdo tem 984px, contra os 900 de uma
          tela de 1440x900 e os 800 de um laptop mais baixo — a página ganhava barra de
          rolagem e o CTA saía de vista. O próprio frame é desenhado em 960px de altura, que
          já não cabe na viewport útil da maioria dos laptops.

          Só no `lg:`: no mobile a página rola normalmente, que é a decisão do CLAUDE.md por
          causa do teclado do iOS — e aqui ela importa, porque "Suas informações" tem campo
          de texto.
        */
        aside && 'lg:h-dvh lg:overflow-hidden',
      )}
    >
      {/* Com a régua na tela o lockup já está nela, no topo. */}
      <header className={cn('hidden w-full px-8 py-8 lg:block', comMenu && 'lg:hidden')}>
        <GuiaLockup height={18} className="text-fg-default" />
      </header>

      {/*
        O recuo da régua vai aqui, e não na raiz: `.px-safe` é CSS escrito depois das
        utilities do Tailwind em `styles/index.css`, então na raiz ele ganharia de qualquer
        `lg:pl-*`. Ver a nota em CLAUDE.md.
      */}
      <div
        className={cn(
          'flex flex-1 flex-col lg:items-center',
          alturaFixa && 'min-h-0',
          aside && 'lg:min-h-0',
          // Com a régua, o respiro é a própria centralização no que sobra: 1440 = 280 +
          // 80 + 1000 + 80, exatamente o frame 1617:4660. Sem ela, os 36px de sempre.
          comMenu ? 'lg:pl-[280px]' : 'lg:px-9',
        )}
      >
        <div
          className={cn(
            'flex w-full flex-1 flex-col',
            alturaFixa && 'min-h-0',
            aside && 'lg:min-h-0',
            // 1000 = 24 + 436 + 80 + 436 + 24, the measures of `profissionals` (1279:14636).
            aside
              ? 'lg:max-w-[1000px] lg:flex-row lg:gap-20 lg:px-6 lg:pt-6'
              : wide
                ? 'lg:max-w-[1000px]'
                : 'lg:max-w-[450px]',
          )}
        >
          {aside ? (
            <aside className="hidden lg:flex lg:w-[436px] lg:shrink-0 lg:flex-col lg:gap-12">
              <IconButton
                icon={<ArrowLeftIcon className="size-[18px]" />}
                aria-label="Voltar"
                onClick={onBack}
              />
              {aside}
            </aside>
          ) : null}

          <div
            className={cn(
              'flex w-full flex-1 flex-col',
              alturaFixa && 'min-h-0',
              aside && 'lg:w-[436px] lg:min-w-0 lg:min-h-0',
            )}
          >
            <div
              className={cn(
                'bg-surface-base sticky top-0 z-10 flex items-center gap-6 px-6 py-4',
                'lg:static lg:items-end lg:px-0',
                // Split: the progress bar sits 40px into the right column and the content
                // 24px under it; otherwise the single-column spacing the other flows use.
                aside ? 'lg:pt-4 lg:pb-6' : 'lg:pt-5 lg:pb-12',
              )}
            >
              <IconButton
                icon={<ArrowLeftIcon className="size-[18px]" />}
                aria-label="Voltar"
                onClick={onBack}
                className={cn(aside && 'lg:hidden')}
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <ProgressBar value={progressoAnimado} />
                <div className="flex items-end justify-between pt-2 lg:items-center">
                  <p className="text-body-s text-fg-subtle lg:text-body-m whitespace-nowrap">
                    {stepLabel}
                  </p>
                  <Badge variant="success">{alvo}%</Badge>
                </div>
              </div>
            </div>

            {/*
              Nos passos de duas colunas, este é o trecho que rola no desktop: fica entre a
              barra de progresso (acima) e a ação (abaixo), que assim não saem de vista.

              O embrulho não muda o layout — o `StepFooter` que o `StepBody` declara vai por
              portal para a barra de baixo, então o que sobra aqui dentro é só o título e o
              corpo do passo. A barra de rolagem fica escondida porque a coluna já é estreita
              e o desenho não a prevê; rodar, arrastar e navegar por teclado seguem iguais.
            */}
            {aside ? (
              <div className="flex w-full flex-1 flex-col lg:min-h-0 lg:overflow-y-auto lg:sem-barra-de-rolagem">
                {children}
              </div>
            ) : (
              children
            )}

            {/*
              `min-h-[76px]` holds the bar's height through the single frame between the
              outgoing screen unmounting and the incoming one filling the portal, so the
              layout does not jump at the handover.
            */}
            <footer
              ref={setFooterNode}
              className={cn(
                'bg-surface-base border-outline-subtle pb-safe flex w-full flex-col border-t px-6',
                'min-h-[76px] gap-4 pt-3 [--pb-safe:1rem] lg:px-0',
                // The split frames draw no rule above the action, and give it more room.
                aside && 'lg:border-t-0 lg:pt-12',
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

type StepBodyProps = {
  title?: ReactNode
  subtitle?: ReactNode
  /** Rendered into the shell's fixed footer bar. */
  footer?: ReactNode
  /** Only where the bar moves with the answer; otherwise the step's own value stands. */
  progress?: number
  /** Põe o conteúdo num `ListaRolavel`. Pede o `alturaFixa` do `StepShell` para ter contra o que medir. */
  rolavel?: boolean
  children?: ReactNode
}

/**
 * The part of a step that slides: its title and its content. Rendered by the screen,
 * inside the layout's transition. The footer it declares is portalled into the fixed bar,
 * so the buttons keep the screen's own state while the bar itself never moves.
 */
export function StepBody({
  title,
  subtitle,
  footer,
  progress,
  rolavel,
  children,
}: StepBodyProps) {
  usePublishProgress(progress ?? null)

  const corpo = <div className="flex flex-1 flex-col px-6 lg:px-0">{children}</div>

  return (
    <>
      {title ? (
        <div className="flex shrink-0 flex-col gap-4 p-6 lg:px-0 lg:py-6">
          {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
          <h1 className="font-display text-heading-l text-fg-default">{title}</h1>
          {subtitle ? <p className="text-body-s text-fg-subtle">{subtitle}</p> : null}
        </div>
      ) : null}

      {rolavel ? <ListaRolavel className="px-6 lg:px-0">{children}</ListaRolavel> : corpo}

      <StepFooter>{footer}</StepFooter>
    </>
  )
}
