import { useState } from 'react'

import { Button, InputField } from '@guia-da-alma/ds'
import { ArrowRightIcon } from 'lucide-react'

import { SignUpBody } from '@/components/layout/sign-up-shell'
import { FieldShake, useSubmitAttempts } from '@/components/local/field-shake'
import { PasswordStrength } from '@/components/local/password-strength'

import { useCadastro } from '../cadastro-provider'
import { useStepNavigation } from '../use-step-navigation'

const MIN_PASSWORD_LENGTH = 8

type Errors = {
  password?: string
  confirmation?: string
}

export function SenhaScreen() {
  const { data, update } = useCadastro()
  const { goNext } = useStepNavigation('senha')

  // Only the chosen password belongs to the flow state; the confirmation is local to
  // this screen and is never carried forward.
  const [confirmation, setConfirmation] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const { attempt, registerAttempt } = useSubmitAttempts()

  const handleSubmit = () => {
    const nextErrors: Errors = {}

    if (data.password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = `Use no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`
    }

    if (!confirmation) {
      nextErrors.confirmation = 'Repita a senha.'
    } else if (confirmation !== data.password) {
      nextErrors.confirmation = 'As senhas não coincidem.'
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
          Senha
          <br />
          de acesso
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
        <div className="flex flex-col">
          <FieldShake trigger={errors.password ? attempt : 0}>
            <InputField
              id="senha"
              type="password"
              label="Senha"
              helperText={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`}
              value={data.password}
              error={errors.password}
              autoComplete="new-password"
              onChange={(event) => update({ password: event.target.value })}
            />
          </FieldShake>

          <PasswordStrength senha={data.password} />
        </div>

        <FieldShake trigger={errors.confirmation ? attempt : 0}>
          <InputField
            id="repita-senha"
            type="password"
            label="Repita a senha"
            value={confirmation}
            error={errors.confirmation}
            autoComplete="new-password"
            onChange={(event) => setConfirmation(event.target.value)}
          />
        </FieldShake>
      </div>
    </SignUpBody>
  )
}
