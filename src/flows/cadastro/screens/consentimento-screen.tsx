import type { ReactNode } from 'react'

import { Button } from '@guia-da-alma/ds'
import { ArrowRightIcon } from 'lucide-react'

import ilustracao from '@/assets/cadastro/ilustracao-consentimento.svg'
import { SignUpBody } from '@/components/layout/sign-up-shell'

import { useStepNavigation } from '../use-step-navigation'

type ConsentLinkProps = {
  href: string
  children: ReactNode
}

/**
 * Os documentos abrem as páginas publicadas da plataforma, numa aba nova — os mesmos links
 * que o frame (3266:16644) carrega desde 23/09/2026. Sair do cadastro na mesma aba perderia
 * o que a pessoa já preencheu.
 */
function ConsentLink({ href, children }: ConsentLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
      {children}
    </a>
  )
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
      subtitle="Suas informações com profissionais são sigilosas. O RH não tem dados sobre seu caso terapêutico."
      footer={
        <div className="flex flex-col gap-5">
          {/*
            Continua sem checkbox: o consentimento é o próprio botão, "Eu concordo,
            continuar". Nenhum dos dois frames desenha um controle.

            A linha é toda `fg/muted`, links incluídos — só o sublinhado os distingue. O
            arquivo escreve "Politica" sem o acento; aqui vai corrigido. Ver SYNC-FIGMA.md.
          */}
          <p className="text-caption text-fg-muted">
            Li e concordo com o{' '}
            <ConsentLink href="https://plataforma.guiadaalma.com.br/termos-de-uso/">
              Termo de Uso
            </ConsentLink>{' '}
            e{' '}
            <ConsentLink href="https://plataforma.guiadaalma.com.br/politica-de-privacidade/">
              Política de Privacidade
            </ConsentLink>
            .
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
