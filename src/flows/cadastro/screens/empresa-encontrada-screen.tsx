import { Button } from '@guia-da-alma/ds'
import { ArrowRightIcon, CheckIcon } from 'lucide-react'

import { FeatureShell } from '@/components/layout/feature-shell'

import { useCadastro } from '../cadastro-provider'
import { useStepNavigation } from '../use-step-navigation'

/**
 * Step 3 — nodes 670:606 (mobile) e 670:616 (desktop).
 *
 * A tela confirma uma empresa que o protótipo deduziu do código de 6 dígitos, e até a
 * revisão de 11/09/2026 não havia saída se a empresa estivesse errada: o único caminho era
 * seguir em frente. O botão terciário devolve para o passo do código. Cópia nova — ver
 * SYNC-FIGMA.md.
 */
export function EmpresaEncontradaScreen() {
  const { data } = useCadastro()
  const { goNext, goBack } = useStepNavigation('empresa-encontrada')

  return (
    <FeatureShell
      icon={CheckIcon}
      eyebrow="Encontramos sua empresa"
      title={data.companyName}
      footer={
        <>
          <Button
            variant="contained"
            className="w-full"
            onClick={goNext}
            trailingIcon={<ArrowRightIcon className="size-[18px]" />}
          >
            Criar perfil de acesso
          </Button>

          <Button variant="text" className="w-full" onClick={goBack}>
            Não é essa empresa?
          </Button>
        </>
      }
    />
  )
}
