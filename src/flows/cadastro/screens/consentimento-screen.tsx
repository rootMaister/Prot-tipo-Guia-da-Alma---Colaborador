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
      subtitle="Seus dados, respostas e informações sobre agendamentos e não serão acessados por terceiros"
      footer={
        <div className="flex flex-col gap-5">
          {/*
            The design has no checkbox here: consent is given by the button itself, whose
            label reads "Eu concordo, continuar". Keeping it that way rather than adding
            a control the design does not have.
          */}
          <p className="text-caption text-fg-subtle">
            Li e concordo com o <ConsentLink>Termo de Consentimento</ConsentLink>,{' '}
            <ConsentLink>Política de Dados Pessoais</ConsentLink> e{' '}
            <ConsentLink>Termos de Uso</ConsentLink>, autorizando a coleta e tratamento de meus
            dados pela Guia da Alma.
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
