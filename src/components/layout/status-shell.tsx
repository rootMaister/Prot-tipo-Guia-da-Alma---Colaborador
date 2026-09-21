import type { ReactNode } from 'react'

import { GuiaDaAlmaSymbol } from '@guia-da-alma/ds'

import { GuiaLockup } from '@/components/local/guia-lockup'

import { useScreenSurface } from '@/lib/use-screen-surface'

type StatusShellProps = {
  illustration: ReactNode
  title: string
  body: string
  /** Ação dentro do conteúdo, abaixo do texto — o "Voltar para a tela de acesso" do passo 7. */
  acao?: ReactNode
  footer: ReactNode
}

/**
 * Waiting/status screen — step 7, "Em análise" (nodes 1078:9292 and 1089:10400; the
 * desktop frame is misnamed "[Desktop] 6. Crie uma senha" in Figma).
 *
 * The two breakpoints diverge in more than size: mobile centres the Guia da Alma *symbol*
 * at the top and left-aligns the copy, while desktop puts the full *lockup* in the corner
 * and centres everything.
 */
export function StatusShell({ illustration, title, body, acao, footer }: StatusShellProps) {
  useScreenSurface('surface-base')

  return (
    <div className="bg-surface-base pt-safe px-safe flex min-h-dvh flex-col">
      <div className="flex w-full flex-col items-center px-8 py-8 lg:items-start">
        <GuiaDaAlmaSymbol className="text-fg-default h-[33px] w-[38px] lg:hidden" />
        <GuiaLockup height={18} className="text-fg-default hidden lg:inline-flex" />
      </div>
      <div className="flex flex-1 flex-col gap-6 px-6 py-12 lg:items-center lg:justify-center">
        <div className="flex flex-1 flex-col items-start justify-end gap-3 lg:max-w-[560px] lg:items-center lg:justify-center lg:text-center">
          {/*
            Grows on both breakpoints so the illustration centres in the space above the
            copy, instead of sitting flush on top of it on desktop. Review decision,
            applies to every feedback screen.
          */}
          <div className="flex w-full flex-1 items-center justify-center">{illustration}</div>
          <h1 className="font-display text-display-m text-fg-muted">{title}</h1>
          <p className="text-body-m text-fg-subtle">{body}</p>
          {acao ? <div className="w-full pt-6">{acao}</div> : null}
        </div>
      </div>
      <div className="border-outline-subtle pb-safe flex w-full items-center justify-between border-t p-6 [--pb-safe:1rem] lg:justify-center lg:gap-4">
        {footer}
      </div>
    </div>
  )
}
