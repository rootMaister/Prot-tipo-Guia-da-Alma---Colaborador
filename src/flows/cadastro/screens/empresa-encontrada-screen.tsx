import { Button } from '@guia-da-alma/ds'
import { ArrowRightIcon, CheckIcon } from 'lucide-react'

import { FeatureShell } from '@/components/layout/feature-shell'

import { useCadastro } from '../cadastro-provider'
import { useStepNavigation } from '../use-step-navigation'

export function EmpresaEncontradaScreen() {
  const { data } = useCadastro()
  const { goNext } = useStepNavigation('empresa-encontrada')

  return (
    <FeatureShell
      icon={CheckIcon}
      eyebrow="Encontramos sua empresa"
      title={data.companyName}
      footer={
        <Button
          variant="contained"
          className="w-full"
          onClick={goNext}
          trailingIcon={<ArrowRightIcon className="size-[18px]" />}
        >
          Criar perfil de acesso
        </Button>
      }
    />
  )
}
