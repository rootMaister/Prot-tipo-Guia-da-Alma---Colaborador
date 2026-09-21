import { useState } from 'react'

import { Button, InputField } from '@guia-da-alma/ds'
import { ArrowRightIcon } from 'lucide-react'

import { SignUpBody } from '@/components/layout/sign-up-shell'
import { FieldShake, useSubmitAttempts } from '@/components/local/field-shake'
import { maskCpf, maskPhone, onlyDigits } from '@/lib/masks'

import { useCadastro } from '../cadastro-provider'
import { useStepNavigation } from '../use-step-navigation'

type Errors = {
  fullName?: string
  cpf?: string
  email?: string
  whatsapp?: string
}

/** Deliberately loose — this is a prototype, not a validation library. */
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
const isWhatsapp = (value: string) => onlyDigits(value).length >= 10
/** Só o comprimento: o protótipo não confere dígito verificador. */
const isCpf = (value: string) => onlyDigits(value).length === 11

export function DadosPessoaisScreen() {
  const { data, update } = useCadastro()
  const { goNext } = useStepNavigation('dados-pessoais')
  const [errors, setErrors] = useState<Errors>({})
  const { attempt, registerAttempt } = useSubmitAttempts()

  const handleSubmit = () => {
    const nextErrors: Errors = {}

    if (!data.fullName.trim()) {
      nextErrors.fullName = 'Informe seu nome completo.'
    }

    if (!data.cpf.trim()) {
      nextErrors.cpf = 'Informe seu CPF.'
    } else if (!isCpf(data.cpf)) {
      nextErrors.cpf = 'CPF incompleto.'
    }

    if (!data.email.trim()) {
      nextErrors.email = 'Informe seu e-mail.'
    } else if (!isEmail(data.email)) {
      nextErrors.email = 'E-mail inválido.'
    }

    if (!data.whatsapp.trim()) {
      nextErrors.whatsapp = 'Informe seu WhatsApp.'
    } else if (!isWhatsapp(data.whatsapp)) {
      nextErrors.whatsapp = 'Número incompleto.'
    }

    setErrors(nextErrors)
    registerAttempt()

    if (Object.keys(nextErrors).length === 0) {
      goNext()
    }
  }

  return (
    <SignUpBody
      title={
        <>
          Suas
          <br />
          informações
        </>
      }
      footer={
        <Button
          variant="contained"
          className="w-full"
          onClick={handleSubmit}
          trailingIcon={<ArrowRightIcon className="size-[18px]" />}
        >
          Continuar
        </Button>
      }
    >
      <div className="flex flex-col gap-8">
        {/*
          DS-GAP: the asterisk is typed into the label because InputField has no
          `required` prop. In Figma the input-field component has a Required boolean that
          renders it in `fg/required` (#c1442e); here it inherits the label colour.
        */}
        <FieldShake trigger={errors.fullName ? attempt : 0}>
          <InputField
            id="nome-completo"
            label="Nome completo *"
            placeholder="Seu nome completo"
            value={data.fullName}
            error={errors.fullName}
            autoComplete="name"
            onChange={(event) => update({ fullName: event.target.value })}
          />
        </FieldShake>

        <FieldShake trigger={errors.cpf ? attempt : 0}>
          <InputField
            id="cpf"
            label="CPF *"
            inputMode="numeric"
            placeholder="000.000.000-00"
            value={data.cpf}
            error={errors.cpf}
            autoComplete="off"
            onChange={(event) => update({ cpf: maskCpf(event.target.value) })}
          />
        </FieldShake>

        <FieldShake trigger={errors.email ? attempt : 0}>
          <InputField
            id="email"
            type="email"
            label="E-mail *"
            placeholder="seumelhor@email.com"
            helperText="Preferencialmente o e-mail corporativo"
            value={data.email}
            error={errors.email}
            autoComplete="email"
            onChange={(event) => update({ email: event.target.value })}
          />
        </FieldShake>

        <FieldShake trigger={errors.whatsapp ? attempt : 0}>
          <InputField
            id="whatsapp"
            type="tel"
            label="Número de WhatsApp *"
            placeholder="(99) 99999-9999"
            helperText="Para facilitar a comunicação durante os agendamentos"
            value={data.whatsapp}
            error={errors.whatsapp}
            autoComplete="tel"
            onChange={(event) => update({ whatsapp: maskPhone(event.target.value) })}
          />
        </FieldShake>
      </div>
    </SignUpBody>
  )
}
