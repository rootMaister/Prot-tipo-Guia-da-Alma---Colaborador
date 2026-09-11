import { useEffect } from 'react'

import { Button, IconButton } from '@guia-da-alma/ds'
import { ArrowLeftIcon, XIcon } from 'lucide-react'
import { useNavigate } from 'react-router'

import { comOrigem } from '@/lib/origem'
import { DURACAO_MIN, dataPorExtenso, faixaHorario } from '@/lib/sessao-formato'
import type { SessaoAgendada } from '@/state/conta-provider'

type DetalhesSessaoProps = {
  sessao: SessaoAgendada
  onFechar: () => void
  /** Where "Reagendar" should return to once the flow is done — the screen that opened this. */
  origem: string
}

/**
 * `Detalhes da sessão` — a session that is already booked. Page "Sessão" of the file:
 * `1776:3` on mobile, `1784:30` on desktop.
 *
 * Not to be confused with the Agendamento flow's own `detalhes` step (1184:5171), which is
 * the screen you read **before** booking and whose footer says "Agendar com Daniele". This
 * one replaces it wherever the session is already marked: it drops the description, the
 * reviews and the tabs, and carries the slot, the format and "Entrar na sala" instead.
 *
 * One component, two shapes, switched by CSS rather than by a breakpoint read in JS:
 * mobile is a full page with a back arrow and the title in display serif; desktop is a
 * 512px drawer pinned right over a 30% scrim, with the title in the drawer header and an ✕.
 * That desktop half is the same Figma `modal-drawer` (791:1781) that `painel-filtro.tsx`
 * draws — keep the two in step; they are candidates to share a shell.
 *
 * DS-GAP: as in `painel-filtro`, the design system's `Dialog` cannot produce either shape —
 * `DialogContent` is a centred `max-w-lg` card with an ✕ baked into the corner. See item 34
 * of DS-GAPS.md.
 */
export function DetalhesSessao({ sessao, onFechar, origem }: DetalhesSessaoProps) {
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') onFechar()
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onFechar])

  const acoes = (
    <>
      {/*
        The session is online via Google Meet and there is no room to enter, and no profile
        page exists anywhere in the file. Both are drawn as they are drawn and simply do not
        navigate — the same choice made for Diário and Meu progresso in the menu.
      */}
      <Button variant="contained" className="w-full" aria-disabled="true">
        Entrar na sala
      </Button>
      <Button
        variant="outlined"
        className="w-full"
        // In the query string, not router state: state does not survive the flow's own
        // step-to-step navigation, and the origin is needed on the way out. See `lib/origem.ts`.
        onClick={() => navigate(comOrigem('/agendamento/horario', origem))}
      >
        Reagendar
      </Button>
    </>
  )

  return (
    <div role="dialog" aria-modal="true" aria-label="Detalhes da sessão">
      {/* Mobile covers the screen, so the scrim only has anything to darken on desktop. */}
      <div className="fixed inset-0 z-30 hidden bg-black/30 lg:block" onClick={onFechar} />

      <div
        className={[
          'bg-surface-base pt-safe px-safe fixed inset-0 z-30 flex flex-col',
          'lg:inset-y-0 lg:right-0 lg:left-auto lg:m-1 lg:w-[512px] lg:gap-6 lg:rounded-2xl lg:p-4',
          'lg:border-outline-subtle lg:border',
        ].join(' ')}
      >
        {/* Drawer header — desktop only; mobile leads with the back arrow and the big title. */}
        <div className="hidden w-full items-center justify-between lg:flex">
          <h2 className="text-label-l text-fg-default">Detalhes da sessão</h2>
          <IconButton icon={<XIcon className="size-[18px]" />} aria-label="Fechar" onClick={onFechar} />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 pt-2 pb-6 lg:px-0 lg:pt-0 lg:pb-0">
          <IconButton
            icon={<ArrowLeftIcon className="size-[18px]" />}
            aria-label="Voltar"
            onClick={onFechar}
            className="lg:hidden"
          />

          {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
          <h1 className="font-display text-heading-l text-fg-muted lg:hidden">
            Detalhes da sessão
          </h1>

          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full items-center gap-4">
              {/*
                DS-GAP: 48px rounded square at `radius/xxl` (24px); `Avatar` is round with a
                fixed size scale, and the radius scale stops at `rounded-2xl` (16px).
                Items 9 and 19 of DS-GAPS.md.
              */}
              <img
                src={sessao.avatar}
                alt=""
                className="border-outline-avatar size-12 shrink-0 rounded-2xl border object-cover"
              />

              <div className="text-fg-muted flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-label-m">{sessao.tituloCurto}</p>
                <p className="text-body-s">
                  {sessao.profissionalNome} · {sessao.profissionalProfissao}
                </p>
                <p className="text-caption">
                  <span aria-hidden>★ </span>
                  {sessao.nota} · {sessao.avaliacoes} avaliações
                </p>
              </div>
            </div>

            <Button variant="outlined" className="w-full" aria-disabled="true">
              Ver perfil do psicólogo
            </Button>
          </div>

          <dl className="flex w-full flex-col gap-4">
            <Informacao rotulo="Data e horário">
              {dataPorExtenso(sessao.data)}
              <br />
              {faixaHorario(sessao.horario)}
            </Informacao>
            <Informacao rotulo="Formato">Sessão online · Google Meet</Informacao>
            <Informacao rotulo="Duração">{DURACAO_MIN} minutos</Informacao>
          </dl>
        </div>

        {/* `--pb-safe` has to sit on the element that reads it: custom properties inherit down. */}
        <div className="pb-safe flex w-full flex-col gap-3 px-6 pt-4 [--pb-safe:2rem] lg:px-0 lg:[--pb-safe:0px]">
          {acoes}
        </div>
      </div>
    </div>
  )
}

function Informacao({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-1">
      <dt className="text-caption text-fg-subtle">{rotulo}</dt>
      <dd className="text-body-s text-fg-muted">{children}</dd>
    </div>
  )
}
