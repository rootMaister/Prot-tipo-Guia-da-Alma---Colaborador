import type { ReactNode } from 'react'

import { Button, FeaturedIcon, cn } from '@guia-da-alma/ds'
import { ArrowRightIcon, FlameIcon, TargetIcon } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'

import moeda from '@/assets/app/calma-coin.svg'
import { FeedbackBody } from '@/components/layout/feedback-shell'
import { lerOrigem } from '@/lib/origem'
import { formatarNumero } from '@/shell/pontos'
import { pontosParaProximoNivel, useConta } from '@/state/conta-provider'

import { ORIGEM_PADRAO } from '../introducao-route'
import { getNextStep, TOTAL_PASSOS, getStepIndex, type StepSlug } from '../steps'

/**
 * As três telas da Introdução à gamificação (`2856:385`, `2856:429` e `2856:468` no mobile).
 *
 * São a mesma montagem em três conteúdos: ilustração, os três segmentos, título e descrição,
 * e um cartão de destaque. Por isso vivem num arquivo só, como os finais da Avaliação.
 */

/** A navegação é a mesma nas três: "Próximo" avança, "Pular" sai para a origem. */
function useIntroducaoNavigation(slug: StepSlug) {
  const navigate = useNavigate()
  const { search } = useLocation()
  const origem = lerOrigem(search, ORIGEM_PADRAO)
  const proximo = getNextStep(slug)

  return {
    avancar: () => navigate(proximo ? `/introducao/${proximo.slug}${search}` : origem),
    sair: () => navigate(origem),
    verPontos: () => navigate('/app/pontos'),
  }
}

export function PontosScreen() {
  const { avancar, sair } = useIntroducaoNavigation('pontos')

  return (
    <Passo
      slug="pontos"
      ilustracao={<FeaturedIcon icon={FlameIcon} size="lg" color="positive" />}
      titulo="Cuidar de você agora rende pontos"
      descricao="Você ganha pontos quando agenda e avalia suas terapias, faz registros no seu diário e acessa a plataforma."
      destaque={
        <Destaque
          numero="+75 pontos"
          legenda="Você já começou: ativou sua conta (+25) e fez seu Match de Terapia (+50)."
        />
      }
      acoes={<Acoes onAvancar={avancar} onSair={sair} />}
    />
  )
}

export function CalmasScreen() {
  const { conta } = useConta()
  const { avancar, sair } = useIntroducaoNavigation('calmas')

  return (
    <Passo
      slug="calmas"
      ilustracao={<img src={moeda} alt="" className="h-[58px] w-20" />}
      titulo="Seus pontos viram Calmas"
      descricao="Cada ponto vale 1 Calma. Junte Calmas e troque por prêmios, como sessões de terapia gratuitas."
      destaque={
        <Destaque
          numero="1 ponto = 1 Calma"
          legenda={`Você já tem ${formatarNumero(conta.moedas)} Calmas. Uma terapia gratuita custa 1.570 Calmas.`}
        />
      }
      acoes={<Acoes onAvancar={avancar} onSair={sair} />}
    />
  )
}

export function NivelScreen() {
  const { conta } = useConta()
  const { sair, verPontos } = useIntroducaoNavigation('nivel')
  const faltam = pontosParaProximoNivel(conta)
  const preenchido = Math.min(100, Math.round((conta.pontos / conta.pontosProximoNivel) * 100))

  return (
    <Passo
      slug="nivel"
      ilustracao={<FeaturedIcon icon={TargetIcon} size="lg" color="positive" />}
      titulo="Suba de nível no seu ritmo"
      descricao="Conforme você acumula pontos, seu nível sobe. Sem pressa: cada cuidado conta."
      destaque={
        <Destaque numero={`Nível ${conta.nivel}`}>
          <div className="bg-surface-muted h-2 w-full overflow-hidden rounded">
            <div className="bg-accent-brand h-2 rounded" style={{ width: `${preenchido}%` }} />
          </div>
          <p className="text-body-s text-fg-subtle">
            Faltam {formatarNumero(faltam)} pontos para o nível {conta.nivel + 1}
          </p>
        </Destaque>
      }
      acoes={
        <>
          <Button variant="contained" className="w-full lg:w-auto" onClick={verPontos}>
            Ver meus pontos
          </Button>
          <Button variant="text" className="w-full lg:w-auto" onClick={sair}>
            Pular
          </Button>
        </>
      }
    />
  )
}

type PassoProps = {
  slug: StepSlug
  ilustracao: ReactNode
  titulo: string
  descricao: string
  destaque: ReactNode
  acoes: ReactNode
}

function Passo({ slug, ilustracao, titulo, descricao, destaque, acoes }: PassoProps) {
  const atual = getStepIndex(slug) + 1

  return (
    <FeedbackBody footer={acoes}>
      <div className="flex flex-col gap-8">
        <div className="flex justify-center py-6">{ilustracao}</div>

        {/*
          Os três segmentos do passo. Não é o `ProgressoPerguntas` da Avaliação: lá eles vêm
          com "Pergunta N de 4" em cima e ocupam a largura toda; aqui são três traços curtos,
          sem rótulo. Mesma lacuna do DS (item 36), em outra forma.
        */}
        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={TOTAL_PASSOS}
          aria-valuenow={atual}
          aria-valuetext={`Passo ${atual} de ${TOTAL_PASSOS}`}
          className="flex gap-1.5"
        >
          {Array.from({ length: TOTAL_PASSOS }, (_, indice) => (
            <span
              key={indice}
              className={cn(
                'h-1 w-6 rounded-full transition-colors duration-300 ease-out',
                indice + 1 === atual ? 'bg-action-primary' : 'bg-outline-subtle',
              )}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
          <h1 className="font-display text-heading-l text-fg-default">{titulo}</h1>
          <p className="text-body-s text-fg-subtle">{descricao}</p>
        </div>

        {destaque}
      </div>
    </FeedbackBody>
  )
}

/** O cartão claro do rodapé do conteúdo — `surface/faint`, raio 24 (aqui `rounded-2xl`). */
function Destaque({
  numero,
  legenda,
  children,
}: {
  numero: string
  legenda?: string
  children?: ReactNode
}) {
  return (
    <div className="bg-surface-faint flex flex-col gap-2 rounded-2xl p-4">
      <p className="text-label-l text-fg-default">{numero}</p>
      {legenda ? <p className="text-body-s text-fg-subtle">{legenda}</p> : null}
      {children}
    </div>
  )
}

function Acoes({ onAvancar, onSair }: { onAvancar: () => void; onSair: () => void }) {
  return (
    <>
      {/* A primária vem primeiro e o `flex-row-reverse` do shell a manda para a direita no desktop. */}
      <Button
        variant="contained"
        className="w-full lg:w-auto"
        trailingIcon={<ArrowRightIcon className="size-[18px]" />}
        onClick={onAvancar}
      >
        Próximo
      </Button>
      <Button variant="text" className="w-full lg:w-auto" onClick={onSair}>
        Pular
      </Button>
    </>
  )
}
