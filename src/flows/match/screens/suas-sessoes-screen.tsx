import { Button } from '@guia-da-alma/ds'

import { StepBody } from '@/components/layout/step-shell'
import { PularMatchButton } from '@/components/local/pular-match-button'
import { ChoiceChip } from '@/components/local/choice-chip'
import { OptionCard } from '@/components/local/option-card'

import { useMatch } from '../match-provider'
import { DIAS_SEMANA, HORARIOS } from '../opcoes'
import { useStepNavigation } from '../use-step-navigation'

/**
 * Step 5 — nodes 1119:12331 (mobile) and 1134:2636 (desktop). The filled state is
 * 1119:12542, which is where the selected chip treatment and the primary action come from.
 *
 * The step label reads "Temas para a sessão" in the file — step 2's label, left behind on
 * a screen about schedules. Reproduced as drawn; see the note in `steps.ts`.
 */

/**
 * Master toggles, added in review. Each one selects or clears every option in its group,
 * and reads as selected exactly when all of them are — so ticking the last individual
 * option lights it up too, and unticking any option turns it off again. Neither is stored
 * in the flow state; both are derived, which keeps a single source of truth.
 */
const TODOS_OS_DIAS = 'Todos os dias'
const QUALQUER_HORARIO = 'Qualquer horário'

export function SuasSessoesScreen() {
  const { goNext } = useStepNavigation('suas-sessoes')
  const { data, toggle, update } = useMatch()

  const hasSelection = data.dias.length > 0 || data.horarios.length > 0

  const todosOsDias = DIAS_SEMANA.every((dia) => data.dias.includes(dia))
  const qualquerHorario = HORARIOS.every((horario) => data.horarios.includes(horario))

  return (
    <StepBody
      title="Suas sessões"
      subtitle="Selecione os melhores horários para as suas sessões"
      rolavel
      footer={
        <>
          {/*
            Visível sempre, mesmo sem seleção: esconder o CTA tira a referência do que a
            tela faz e o gatilho para descobrir o que falta. Desabilitado, o rótulo é a
            própria mensagem — o mesmo padrão que "Insira o seu CPF" já usa no Agendamento.
            Diverge do Figma, que só desenha o botão no estado preenchido. Ver SYNC-FIGMA.md.
          */}
          <Button
            variant="contained"
            className="w-full"
            disabled={!hasSelection}
            onClick={goNext}
          >
            {hasSelection ? 'Buscar sessões' : 'Selecione um dia ou horário'}
          </Button>

          <PularMatchButton />
        </>
      }
    >
      <div className="flex flex-col gap-12 pb-6">
        <div className="flex flex-col gap-2">
          <p className="text-label-s text-fg-muted">Melhores dias da semana</p>
          <div className="flex flex-wrap gap-2">
            <ChoiceChip
              label={TODOS_OS_DIAS}
              selected={todosOsDias}
              onToggle={() => update({ dias: todosOsDias ? [] : [...DIAS_SEMANA] })}
            />

            {DIAS_SEMANA.map((dia) => (
              <ChoiceChip
                key={dia}
                label={dia}
                selected={data.dias.includes(dia)}
                onToggle={() => toggle('dias', dia)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {/* O mobile escreve "para você"; o desktop para em "Melhores horários". */}
          <p className="text-label-s text-fg-muted">Melhores horários para você</p>
          <OptionCard
            id="horario-qualquer"
            label={QUALQUER_HORARIO}
            checked={qualquerHorario}
            onCheckedChange={() =>
              update({ horarios: qualquerHorario ? [] : [...HORARIOS] })
            }
          />

          {HORARIOS.map((horario) => (
            <OptionCard
              key={horario}
              id={`horario-${horario}`}
              label={horario}
              checked={data.horarios.includes(horario)}
              onCheckedChange={() => toggle('horarios', horario)}
            />
          ))}
        </div>
      </div>
    </StepBody>
  )
}
