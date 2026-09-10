import { useEffect, useState } from 'react'

import { Button } from '@guia-da-alma/ds'
import { ArrowRightIcon, Loader2Icon } from 'lucide-react'

import { SignUpBody } from '@/components/layout/sign-up-shell'
import { COMPANY_CODE_LENGTH, CompanyCodeInput } from '@/components/local/company-code-input'
import { FieldShake, useSubmitAttempts } from '@/components/local/field-shake'

import { useCadastro } from '../cadastro-provider'
import { useStepNavigation } from '../use-step-navigation'

/** Mocked lookup delay, so the loading state is actually visible. */
const LOOKUP_DELAY_MS = 1400

/**
 * Any six digits resolve to a company, so a reviewer walking the flow is never blocked.
 * `000000` is the one reserved code that fails, so the error state stays demoable.
 */
const INVALID_CODE = '000000'

export function EmpresaScreen() {
  const { data, update } = useCadastro()
  const { goNext } = useStepNavigation('empresa')

  const [isLooking, setIsLooking] = useState(false)
  const [hasError, setHasError] = useState(false)
  const { attempt, registerAttempt } = useSubmitAttempts()

  const code = data.companyCode
  const isComplete = code.length === COMPANY_CODE_LENGTH

  const handleChange = (value: string) => {
    update({ companyCode: value })
    setHasError(false)
  }

  // The design shows this screen mid-lookup ("Identificando sua empresa"), so filling the
  // last digit kicks the lookup off on its own rather than waiting for the button.
  useEffect(() => {
    if (!isComplete || hasError) {
      return
    }

    if (code === INVALID_CODE) {
      setHasError(true)
      registerAttempt()
      return
    }

    setIsLooking(true)
    const timer = window.setTimeout(() => {
      setIsLooking(false)
      goNext()
    }, LOOKUP_DELAY_MS)

    return () => {
      window.clearTimeout(timer)
      setIsLooking(false)
    }
  }, [code, isComplete, hasError, goNext, registerAttempt])

  return (
    <SignUpBody
      animateIn
      title={
        <>
          Código
          <br />
          da empresa
        </>
      }
      subtitle="Solicite ao RH ou setor responsável pelo código de 6 dígitos de acesso."
      footer={
        /*
          DS-GAP: the spinner is passed as a `leadingIcon` instead of through `isLoading`,
          because the DS `Button` hard-codes `disabled={isLoading || disabled}` — there is
          no way to show a loading state without also disabling the button, and the design
          keeps it active while it looks the company up. See DS-GAPS.md.
        */
        <Button
          variant="contained"
          className="w-full"
          disabled={!isComplete || hasError}
          leadingIcon={
            isLooking ? <Loader2Icon className="size-[18px] animate-spin" /> : undefined
          }
          trailingIcon={isLooking ? undefined : <ArrowRightIcon className="size-[18px]" />}
        >
          {isLooking ? 'Identificando sua empresa' : isComplete ? 'Continuar' : 'Digite os 6 dígitos'}
        </Button>
      }
    >
      <div className="flex flex-col gap-3">
        <FieldShake trigger={hasError ? attempt : 0}>
          <CompanyCodeInput
            value={code}
            onChange={handleChange}
            error={hasError}
            disabled={isLooking}
            autoFocus
          />
        </FieldShake>
        <p className="text-caption text-fg-error min-h-5" role="alert">
          {hasError ? 'Código não encontrado. Confira com o RH da sua empresa.' : ''}
        </p>
      </div>
    </SignUpBody>
  )
}
