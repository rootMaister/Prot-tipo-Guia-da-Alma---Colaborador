import type { ReactNode } from 'react'

import { Badge, Button, FeaturedIcon, IconButton, TextareaField, cn } from '@guia-da-alma/ds'
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'

import { FeedbackBody } from '@/components/layout/feedback-shell'
import { OrbeHumor } from '@/components/local/orbe-humor'
import { comOrigem, lerOrigem } from '@/lib/origem'
import { useConta } from '@/state/conta-provider'

import { useDiario } from '../diario-provider'
import { humores, motivos as listaDeMotivos } from '../humores'
import { getNextStep, getPreviousStep, type StepSlug } from '../steps'
import { registroPorExtenso } from '../formato'

/**
 * As cinco telas do Registro de humor (`2823:20823`, `2831:1296`, `2831:1511`, `2833:1948` e
 * `2834:2098` no mobile).
 *
 * Ficam num arquivo só porque compartilham o cabeçalho do humor escolhido e a mesma dupla de
 * ações — como os finais da Avaliação.
 */

function useNavegacao(slug: StepSlug) {
  const navigate = useNavigate()
  const { search } = useLocation()
  const origem = lerOrigem(search, '/app/diario')
  const proximo = getNextStep(slug)
  const anterior = getPreviousStep(slug)

  return {
    origem,
    avancar: () => navigate(proximo ? `/diario/${proximo.slug}${search}` : origem),
    voltar: () => navigate(anterior ? `/diario/${anterior.slug}${search}` : origem),
    sair: () => navigate(origem),
    ir: (destino: string) => navigate(destino),
  }
}

/** Passo 1 — a escala. O único desenhado sobre `surface/muted`. */
export function HumorScreen() {
  const { humor, setHumor } = useDiario()
  const { avancar, sair } = useNavegacao('humor')
  const escolhido = humores[humor]

  return (
    <FeedbackBody
      footer={
        <>
          <Button variant="contained" className="w-full lg:w-auto" onClick={avancar}>
            Continuar
          </Button>
          <Button variant="text" className="w-full lg:w-auto" onClick={sair}>
            Deixar para depois
          </Button>
        </>
      }
    >
      <div className="flex flex-1 flex-col items-center gap-6 text-center">
        {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
        <h1 className="font-display text-heading-l text-fg-default">
          Como está sendo
          <br /> o seu dia?
        </h1>

        <OrbeHumor valor={humor} />

        <div className="flex min-h-[72px] flex-col gap-1">
          <p className="text-label-l text-fg-default">{escolhido.nome}</p>
          <p className="text-body-s text-fg-subtle">{escolhido.apoio}</p>
        </div>

        <SliderHumor valor={humor} onChange={setHumor} />
      </div>
    </FeedbackBody>
  )
}

/**
 * O slider de cinco pontos. É um `input[type=range]` de verdade — teclado, leitor de tela e
 * arrasto saem de graça —, com a trilha e os pontos desenhados por baixo.
 *
 * DS-GAP: o design system não tem slider. Ver DS-GAPS.md.
 */
function SliderHumor({ valor, onChange }: { valor: number; onChange: (valor: number) => void }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="relative h-9">
        <div className="bg-surface-base absolute inset-x-0 top-3 flex h-2.5 items-center justify-between rounded-full">
          {humores.map((humor) => (
            <span key={humor.nome} className="bg-outline-default size-2.5 rounded-full" />
          ))}
        </div>

        <input
          type="range"
          min={0}
          max={humores.length - 1}
          step={1}
          value={valor}
          onChange={(evento) => onChange(Number(evento.target.value))}
          aria-label="Como está sendo o seu dia"
          aria-valuetext={humores[valor].nome}
          className="slider-humor relative h-9 w-full cursor-pointer appearance-none bg-transparent"
        />
      </div>

      <div className="text-body-s text-fg-muted flex justify-between">
        <span>{humores[0].nome}</span>
        <span>{humores[humores.length - 1].nome}</span>
      </div>
    </div>
  )
}

/** Passo 2 — os treze motivos, em cápsulas de seleção múltipla. */
export function MotivosScreen() {
  const { humor, motivos, alternarMotivo } = useDiario()
  const { avancar, voltar, sair } = useNavegacao('motivos')

  return (
    <FeedbackBody
      footer={
        <>
          <Button variant="contained" className="w-full lg:w-auto" onClick={avancar}>
            Continuar
          </Button>
          <Button variant="text" className="w-full lg:w-auto" onClick={sair}>
            Deixar para depois
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <Voltar onClick={voltar} />

        <HumorEscolhido humor={humor} />

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-heading-m text-fg-default">
            Quais os principais motivos?
          </h1>
          <p className="text-body-s text-fg-subtle">
            Escolha um ou mais. Isso ajuda a perceber o que costuma estar presente nos seus
            dias.
          </p>
        </div>

        {/*
          DS-GAP: o DS tem `Chip`, que é um rótulo, não um controle de seleção múltipla — sem
          estado marcado nem semântica de checkbox. Mesma lacuna do `choice-chip` do Match
          (item 18). Aqui são checkboxes escondidos dentro da cápsula. Ver DS-GAPS.md.
        */}
        <ul className="flex flex-wrap gap-2">
          {listaDeMotivos.map((motivo) => {
            const marcado = motivos.includes(motivo)

            return (
              <li key={motivo}>
                <label
                  className={cn(
                    'text-label-s flex cursor-pointer items-center rounded-full border px-3 py-2',
                    'transition-colors duration-150 ease-out focus-within:outline-2',
                    marcado
                      ? 'border-action-primary bg-surface-subtle text-fg-default'
                      : 'border-outline-default text-fg-muted hover:bg-surface-subtle',
                  )}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={marcado}
                    onChange={() => alternarMotivo(motivo)}
                  />
                  {motivo}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    </FeedbackBody>
  )
}

/** Passo 3 — o texto livre, e o passo que de fato grava o registro. */
export function ComplementoScreen() {
  const { humor, motivos, complemento, setComplemento } = useDiario()
  const { registrarHumor } = useConta()
  const { avancar, voltar, sair } = useNavegacao('complemento')

  const registrar = () => {
    registrarHumor({ data: new Date(), humor, motivos, complemento })
    avancar()
  }

  return (
    <FeedbackBody
      footer={
        <>
          <Button variant="contained" className="w-full lg:w-auto" onClick={registrar}>
            Registrar
          </Button>
          <Button variant="text" className="w-full lg:w-auto" onClick={sair}>
            Deixar para depois
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <Voltar onClick={voltar} />

        <HumorEscolhido humor={humor} motivos={motivos} />

        <h1 className="font-display text-heading-m text-fg-default">Por que se sente assim?</h1>

        <TextareaField
          label=""
          value={complemento}
          onChange={(evento) => setComplemento(evento.target.value)}
          rows={5}
          placeholder="Dormi mal e o dia no trabalho foi bem corrido. Senti falta de energia para fazer as coisas de que gosto."
          helperText="Opcional. Este é um espaço seguro e privado."
        />
      </div>
    </FeedbackBody>
  )
}

/** Passo 4 — a confirmação. */
export function FeedbackScreen() {
  const { avancar, sair } = useNavegacao('feedback')

  return (
    <FeedbackBody
      footer={
        <>
          <Button variant="contained" className="w-full lg:w-auto" onClick={avancar}>
            Ver meu registro
          </Button>
          <Button variant="text" className="w-full lg:w-auto" onClick={sair}>
            Voltar ao diário
          </Button>
        </>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
        <FeaturedIcon icon={CheckIcon} size="lg" color="positive" />
        <h1 className="font-display text-heading-m text-fg-default">Seu registro foi salvo</h1>
        <p className="text-body-s text-fg-subtle">
          Obrigada por tirar um momento para olhar para o seu dia. Com o tempo, seus registros
          ajudam você a perceber padrões.
        </p>
      </div>
    </FeedbackBody>
  )
}

/** Passo 5 — o registro recém-salvo, com o padrão que ele repete. */
export function DetalhesScreen() {
  const { conta } = useConta()
  const { voltar, sair, ir, origem } = useNavegacao('detalhes')

  // O registro que acabou de ser salvo é o primeiro da lista.
  const registro = conta.registros[0]

  if (!registro) {
    // Deep-link frio: não há registro nenhum para mostrar.
    return (
      <FeedbackBody
        footer={
          <Button variant="contained" className="w-full lg:w-auto" onClick={sair}>
            Voltar ao diário
          </Button>
        }
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
          <h1 className="font-display text-heading-m text-fg-default">Nenhum registro ainda</h1>
          <p className="text-body-s text-fg-subtle">
            Faça um registro para ver os detalhes dele aqui.
          </p>
        </div>
      </FeedbackBody>
    )
  }

  const humor = humores[registro.humor]
  // "Trabalho também esteve presente em outros 2 registros deste mês."
  const repetido = registro.motivos
    .map((motivo) => ({
      motivo,
      vezes: conta.registros.slice(1).filter((outro) => outro.motivos.includes(motivo)).length,
    }))
    .sort((a, b) => b.vezes - a.vezes)[0]

  return (
    <FeedbackBody
      footer={
        <Button variant="contained" className="w-full lg:w-auto" onClick={sair}>
          Voltar ao diário
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        <Voltar onClick={voltar} />

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-heading-m text-fg-default">Seu registro</h1>
          <p className="text-body-s text-fg-subtle">{registroPorExtenso(registro.data)}</p>
        </div>

        <div className="flex items-center gap-4">
          <OrbeHumor valor={registro.humor} tamanho={56} />
          <div className="flex flex-col gap-1">
            <p className="text-label-l text-fg-default">{humor.nome}</p>
            <p className="text-body-s text-fg-subtle">
              Foi assim que você descreveu o seu dia
            </p>
          </div>
        </div>

        {registro.motivos.length > 0 ? (
          <section className="flex flex-col gap-2">
            <h2 className="text-label-m text-fg-muted">Motivos</h2>
            <ul className="flex flex-wrap gap-2">
              {registro.motivos.map((motivo) => (
                <li key={motivo}>
                  <Badge variant="neutral">{motivo}</Badge>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {registro.complemento ? (
          <section className="flex flex-col gap-2">
            <h2 className="text-label-m text-fg-muted">Por que você se sentiu assim</h2>
            <p className="text-body-s text-fg-subtle">{registro.complemento}</p>
          </section>
        ) : null}

        {repetido && repetido.vezes > 0 ? (
          <section className="bg-surface-faint flex flex-col items-start gap-2 rounded-2xl p-4">
            <h2 className="text-label-m text-fg-muted">Um padrão para observar</h2>
            <p className="text-body-s text-fg-subtle">
              {repetido.motivo} também esteve presente em {repetido.vezes === 1 ? 'outro' : 'outros'}{' '}
              {repetido.vezes} {repetido.vezes === 1 ? 'registro' : 'registros'} deste mês.
            </p>
            <Button
              variant="text"
              trailingIcon={<ArrowRightIcon className="size-[18px]" />}
              onClick={() => ir(comOrigem('/app/diario-mes', origem))}
            >
              Ver detalhes do mês
            </Button>
          </section>
        ) : null}
      </div>
    </FeedbackBody>
  )
}

/** O botão de voltar que os passos 2, 3 e 5 desenham — só no mobile, como no resto do app. */
function Voltar({ onClick }: { onClick: () => void }) {
  return (
    <IconButton
      icon={<ArrowLeftIcon className="size-[18px]" />}
      aria-label="Voltar"
      onClick={onClick}
      className="self-start lg:hidden"
    />
  )
}

/** O resumo do que já foi escolhido, no topo dos passos 2 e 3. */
function HumorEscolhido({ humor, motivos }: { humor: number; motivos?: string[] }): ReactNode {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <OrbeHumor valor={humor} tamanho={40} />
      <p className="text-label-m text-fg-default">{humores[humor].nome}</p>
      {motivos?.map((motivo) => (
        <Badge key={motivo} variant="neutral">
          {motivo}
        </Badge>
      ))}
    </div>
  )
}
