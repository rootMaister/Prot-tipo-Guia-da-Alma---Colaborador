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
 * seguir em frente.
 *
 * A saída, que o protótipo tinha resolvido com um botão só, é desenhada como **duas coisas
 * lado a lado** (`2395:23976` no mobile, `2395:23973` no desktop): a pergunta em Body S
 * regular, e um botão de texto com a ação. Ambos devolvem ao passo do código.
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

          {/*
            8px de intervalo no mobile e 14 no desktop, centrados na linha.

            DS-GAP: o rótulo do botão de texto do DS é `font-bold` e o do Figma é SemiBold,
            o que engorda o botão o bastante para a linha não caber nos 345px do mobile. Daí
            o `flex-wrap`: em vez de espremer a pergunta no meio de uma palavra, as duas
            partes quebram em duas linhas centradas. Ver DS-GAPS.md.
          */}
          <div className="flex w-full flex-wrap items-center justify-center gap-x-2 lg:gap-x-3.5">
            <p className="text-body-s text-fg-subtle whitespace-nowrap">Não é a sua empresa?</p>
            <Button variant="text" onClick={goBack}>
              Insira o código novamente
            </Button>
          </div>
        </>
      }
    />
  )
}
