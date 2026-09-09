import { Button, InputField, Textarea } from '@guia-da-alma/ds'
import { ArrowRightIcon } from 'lucide-react'

import { StepBody } from '@/components/layout/step-shell'
import { maskCpf, maskDate, maskPhone } from '@/lib/masks'

import { useAgendamento } from '../agendamento-provider'
import { useStepNavigation } from '../use-step-navigation'

/**
 * Step 3 — nodes 1204:997 (mobile, empty) and 1236:10602 (filled); desktop 1279:14976 and
 * 1279:15398.
 *
 * Filling in the CPF changes three things, all drawn in the file: the badge moves 75% →
 * 85%, the required asterisk beside the label disappears, and the footer button flips from
 * a disabled "Insira o seu CPF" — the label doubling as the validation message — to an
 * enabled "Confirmar informações".
 *
 * The WhatsApp helper text also only appears once the form is filled, which reads more
 * like an oversight in the empty frame than an intent; reproduced as drawn either way.
 */
export function InformacoesScreen() {
  const { goNext } = useStepNavigation('informacoes')
  const { data, update } = useAgendamento()

  const temCpf = data.cpf.trim().length > 0

  return (
    <StepBody
      progress={temCpf ? 85 : 75}
      footer={
        <Button
          variant="contained"
          className="w-full"
          disabled={!temCpf}
          onClick={goNext}
          trailingIcon={temCpf ? <ArrowRightIcon className="size-[18px]" /> : undefined}
        >
          {temCpf ? 'Confirmar informações' : 'Insira o seu CPF'}
        </Button>
      }
    >
      <div className="flex flex-col gap-6 pt-6 pb-6">
        {/*
          DS-GAP: `InputField` has no `required`, so the asterisk is typed into the label
          and inherits the label colour instead of `fg/required` (#c1442e). See item 10 of
          DS-GAPS.md.
        */}
        <InputField
          id="cpf"
          label={temCpf ? 'CPF' : 'CPF *'}
          helperText="Usado apenas para emitir a nota fiscal da sua sessão."
          placeholder="000.000.000-00"
          inputMode="numeric"
          value={data.cpf}
          onChange={(event) => update({ cpf: maskCpf(event.target.value) })}
        />

        <InputField
          id="whatsapp"
          label="Confirme o seu Whatsapp"
          helperText={temCpf ? 'Usado para o profissional entrar em contato' : undefined}
          inputMode="tel"
          value={data.whatsapp}
          onChange={(event) => update({ whatsapp: maskPhone(event.target.value) })}
        />

        <InputField
          id="nascimento"
          label="Data de nascimento (opcional)"
          placeholder="DD/MM/AAAA"
          inputMode="numeric"
          value={data.nascimento}
          onChange={(event) => update({ nascimento: maskDate(event.target.value) })}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="observacoes" className="text-label-s text-fg-muted">
            Observações (opcional)
          </label>
          {/*
            DS-GAP: Figma draws the field on `surface/faint` at 14px; the DS `Textarea` is
            `surface/base` at `text-body-m`. Only the 120px height is matched, through the
            native `rows`. See DS-GAPS.md.
          */}
          <Textarea
            id="observacoes"
            rows={4}
            placeholder="Ex: prefiro sessões sem câmera, tenho dificuldade de ouvir..."
            value={data.observacoes}
            onChange={(event) => update({ observacoes: event.target.value })}
          />
        </div>
      </div>
    </StepBody>
  )
}
