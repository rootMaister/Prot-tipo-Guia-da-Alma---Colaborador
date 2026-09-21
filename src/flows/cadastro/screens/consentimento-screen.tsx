import type { ReactNode } from 'react'

import { Button } from '@guia-da-alma/ds'
import { ArrowRightIcon } from 'lucide-react'

import ilustracao from '@/assets/cadastro/ilustracao-consentimento.svg'
import { SignUpBody } from '@/components/layout/sign-up-shell'

import { useStepNavigation } from '../use-step-navigation'

type ConsentLinkProps = {
  children: ReactNode
}

/** The three policy documents are links in the design; they have no destination yet. */
function ConsentLink({ children }: ConsentLinkProps) {
  return <span className="text-fg-muted underline underline-offset-2">{children}</span>
}

export function ConsentimentoScreen() {
  const { goNext } = useStepNavigation('consentimento')

  return (
    <SignUpBody
      title={
        <>
          Seus dados
          <br />
          estão seguros
        </>
      }
      subtitle="Suas informações com profissionais são sigilosas. O RH não tem dados sobre seu caso terapêutico; tudo é anônimo."
      footer={
        <div className="flex flex-col gap-5">
          {/*
            Continua sem checkbox: o consentimento é o próprio botão, "Eu concordo,
            continuar". Nenhum dos dois frames desenha um controle.

            Os dois breakpoints escrevem esta linha diferente — o mobile para em "Termo de
            Uso." e o desktop acrescenta "e Politica de Privacidade.", sem o acento. Fica a
            versão longa, com o acento corrigido. Ver SYNC-FIGMA.md.
          */}
          <p className="text-caption text-fg-subtle">
            Li e concordo com o <ConsentLink>Termo de Uso</ConsentLink> e{' '}
            <ConsentLink>Política de Privacidade</ConsentLink>.
          </p>

          <Button
            variant="contained"
            className="w-full"
            onClick={goNext}
            trailingIcon={<ArrowRightIcon className="size-[18px]" />}
          >
            Eu concordo, continuar
          </Button>
        </div>
      }
    >
      <div className="flex flex-1 items-center justify-center">
        <img
          src={ilustracao}
          alt=""
          className="h-[195px] w-[188px] max-w-full shrink-0 object-contain"
        />
      </div>
    </SignUpBody>
  )
}
