import { ProfissionalResumo } from '@/components/local/profissional-resumo'

import { formatarQuando, SESSAO, useAgendamento } from './agendamento-provider'

/**
 * The left column of the Agendamento flow on desktop — `Frame 1597885289` (436px) in
 * 1279:14636 and in every sibling frame of that step, onboarding and "com menu" alike.
 *
 * It is a running summary of the booking, and the file animates it by **opacity**: each
 * block is drawn in every frame and only becomes visible once its data exists.
 *
 * | frame | "Data e horário" | "Seus dados" |
 * |---|---|---|
 * | escolher horário, nada escolhido | 0 | 0 |
 * | escolher horário, hora escolhida | 1 | 0 |
 * | informações, vazio | 1 | 0 |
 * | informações, preenchido | 1 | 1 |
 *
 * So it is state, not layout: reproduced by rendering each block when the provider has
 * what it needs, which is also why the column belongs here, beside the provider the steps
 * write to, rather than inside either screen.
 *
 * Desktop only: the mobile frames have no second column, and the same information appears
 * inline as each step needs it.
 *
 * `semDados` é o "Confirmar informações" (1279:15578): lá a coluna fica só com título e
 * profissional, porque a própria confirmação, à direita, lista os dados.
 */
export function ResumoAgendamento({ semDados = false }: { semDados?: boolean }) {
  const { data } = useAgendamento()

  const temHorario = !semDados && data.data !== null && data.horario !== null
  // Era o CPF que revelava este bloco; com o campo fora do fluxo, quem o revela é o
  // WhatsApp, o único dado que a tela de informações ainda pede. Ver `informacoes-screen`.
  const temDados = !semDados && data.whatsapp.trim().length > 0

  return (
    <>
      {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
      <h1 className="font-display text-heading-l text-fg-default">{SESSAO.titulo}</h1>

      <ProfissionalResumo {...SESSAO.profissional} semCrp />

      {temHorario || temDados ? (
        <div className="flex flex-col gap-8">
          {temHorario ? (
            <div className="flex flex-col gap-6">
              <p className="text-caption text-fg-subtle">Data e horário da sessão</p>
              <p className="text-label-m text-fg-default">
                {formatarQuando(data.data as Date, data.horario as string)}
              </p>
            </div>
          ) : null}

          {temDados ? (
            <div className="flex flex-col gap-6">
              <p className="text-caption text-fg-subtle">Seus dados</p>
              <Campo rotulo="WhatsApp" valor={data.whatsapp} />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  )
}

function Campo({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-body-s text-fg-subtle">{rotulo}</p>
      <p className="text-label-m text-fg-default">{valor}</p>
    </div>
  )
}
