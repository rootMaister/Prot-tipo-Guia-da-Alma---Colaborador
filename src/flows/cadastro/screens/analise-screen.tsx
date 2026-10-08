import { onboarding } from '@/analytics/posthog'

import { useEffect } from 'react'

import { Button, FeaturedIcon } from '@guia-da-alma/ds'
import { EyeIcon } from 'lucide-react'
import { useNavigate } from 'react-router'

import { StatusShell } from '@/components/layout/status-shell'
import { abrirCentralDeAjuda } from '@/lib/central-de-ajuda'

import { useCadastro } from '../cadastro-provider'
import { useStepNavigation } from '../use-step-navigation'

/** Mocked HR review. Long enough to read the screen, short enough to keep a walkthrough moving. */
const REVIEW_DELAY_MS = 4000

/**
 * "Em análise" — `1078:9292` / `1089:10400`.
 *
 * O frame foi redesenhado: no lugar da ilustração "assinatura consciente" entrou um
 * `featured-icon` com o olho do lucide, e o rodapé ganhou "Voltar para a tela de acesso"
 * acima da linha de ajuda.
 */
export function AnaliseScreen() {
  const { goNext, goTo } = useStepNavigation('analise')
  const { analiseReprovada } = useCadastro()
  const navigate = useNavigate()

  // Dois desfechos: "Perfil aprovado", o próximo passo, ou "Acesso recusado", com o
  // código que simula a reprovação — ver `CODIGO_REPROVADO`.
  useEffect(() => {
    const concluir = () => {
      if (!analiseReprovada) {
        goNext()
        return
      }
      onboarding.stepCompleted('/cadastro/analise', 'automatic')
      goTo('reprovado')
    }
    const timer = window.setTimeout(concluir, REVIEW_DELAY_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [analiseReprovada, goNext, goTo])

  return (
    <StatusShell
      /*
        80×80, como o frame desenha — `size="xxl"` é exatamente isso. Mesma lacuna anotada
        no `feature-shell`: o contêiner bate, mas o glifo do DS sai em 40px, maior do que o
        do arquivo. Ver DS-GAPS.md.
      */
      illustration={<FeaturedIcon icon={EyeIcon} size="xxl" color="neutral" />}
      title="Em análise"
      body="Sua empresa está identificando seu cadastro, vamos te notificar quando você for aprovado. Contate o responsável da sua empresa para mais informações."
      /* O frame põe este botão acima da linha de ajuda, dentro do conteúdo. */
      acao={
        <Button
          variant="text"
          className="w-full"
          onClick={() => navigate('/cadastro/welcome')}
        >
          Voltar para a tela de acesso
        </Button>
      }
      footer={
        <>
          <p className="text-body-m text-fg-subtle">Precisa de ajuda?</p>
          {/*
            DS-GAP: Figma draws this as `fg/subtle` (#6e6e6e) semibold; the closest DS
            variant, `text-neutral`, is `action/neutral` (#434343) bold.
          */}
          <Button variant="text-neutral" size="small" onClick={abrirCentralDeAjuda}>
            Acesse a central de ajuda
          </Button>
        </>
      }
    />
  )
}
