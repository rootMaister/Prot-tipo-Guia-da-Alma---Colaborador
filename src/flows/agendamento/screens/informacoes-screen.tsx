import { Button, InputField, Textarea } from '@guia-da-alma/ds'
import { ArrowRightIcon } from 'lucide-react'

import { StepBody } from '@/components/layout/step-shell'
import { maskPhone } from '@/lib/masks'

import { useAgendamento } from '../agendamento-provider'
import { useStepNavigation } from '../use-step-navigation'

/**
 * Step 3 — nodes 1204:997 (mobile, empty) and 1236:10602 (filled); desktop 1279:14976 and
 * 1279:15398.
 *
 * **O campo de CPF saiu** na revisão de 21/09/2026. Ele era o eixo desta tela: era o que
 * segurava o progresso em 75% até ser preenchido, o que mantinha o botão desabilitado com o
 * rótulo "Insira o seu CPF" fazendo as vezes de mensagem de validação, e o que reaparecia
 * na confirmação e no resumo da coluna esquerda. Sem ele não sobra campo obrigatório algum,
 * então:
 *
 * - o progresso fica nos 85% do estado preenchido, que é onde a tela sempre está agora;
 * - o botão nasce habilitado e já com o rótulo final, "Confirmar informações";
 * - a linha de CPF sai da confirmação e do resumo.
 *
 * O texto de apoio do WhatsApp também só aparecia no estado preenchido, o que lia mais como
 * descuido do frame vazio do que como intenção; agora aparece sempre.
 *
 * O CPF do **Cadastro** é outro, e continua: ele foi *adicionado* ao arquivo na mesma
 * revisão. Ver SYNC-FIGMA.md.
 *
 * Em 23/09/2026 saiu também a "Data de nascimento (opcional)": a tela ficou com o WhatsApp
 * e as observações.
 */
export function InformacoesScreen() {
  const { goNext } = useStepNavigation('informacoes')
  const { data, update } = useAgendamento()

  return (
    <StepBody
      progress={85}
      footer={
        <Button
          variant="contained"
          className="w-full"
          onClick={goNext}
          trailingIcon={<ArrowRightIcon className="size-[18px]" />}
        >
          Confirmar informações
        </Button>
      }
    >
      <div className="flex flex-col gap-6 pt-6 pb-6">
        <InputField
          id="whatsapp"
          label="Confirme o seu Whatsapp"
          helperText="Usado para você receber informações das suas sessões"
          inputMode="tel"
          value={data.whatsapp}
          onChange={(event) => update({ whatsapp: maskPhone(event.target.value) })}
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
