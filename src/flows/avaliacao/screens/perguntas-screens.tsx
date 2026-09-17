import { Button, TextareaField } from '@guia-da-alma/ds'

import { FeedbackBody } from '@/components/layout/feedback-shell'
import { NotaEstrelas } from '@/components/local/nota-estrelas'
import { OpcoesResposta } from '@/components/local/opcoes-resposta'

import {
  ESCALA,
  NOTA_MINIMA_SEM_COMENTARIO,
  QUALIDADE_CHAMADA,
  finalDaAvaliacao,
  podeEnviar,
  useAvaliacao,
  type AvaliacaoData,
} from '../avaliacao-provider'
import { useAvaliacaoNavigation } from '../use-avaliacao-navigation'
import type { StepSlug } from '../steps'

/**
 * The four questions. They share one footer and, the first two, one scale — so they live
 * together rather than in four files that repeat each other.
 *
 * Every question can be skipped: "Prefiro não responder" clears the answer and moves on.
 */

const opcoesEscala = ESCALA.map(({ valor, rotulo, marcador }) => ({
  valor,
  // The circled digit is decoration: the word is what a screen reader should announce.
  rotulo: (
    <>
      <span aria-hidden>{marcador}</span>
      {'  '}
      {rotulo}
    </>
  ),
}))

type RodapePerguntaProps = {
  podeAvancar: boolean
  onProxima: () => void
  onPular: () => void
}

function RodapePergunta({ podeAvancar, onProxima, onPular }: RodapePerguntaProps) {
  return (
    <>
      <Button
        variant="contained"
        className="w-full lg:flex-1"
        disabled={!podeAvancar}
        onClick={onProxima}
      >
        Próxima
      </Button>
      <Button variant="text-neutral" className="w-full lg:flex-1" onClick={onPular}>
        Prefiro não responder
      </Button>
    </>
  )
}

type PerguntaEscalaProps = {
  campo: 'acolhimento' | 'reflexao'
  proxima: StepSlug
  titulo: string
  subtitulo?: string
}

function PerguntaEscala({ campo, proxima, titulo, subtitulo }: PerguntaEscalaProps) {
  const { data, update } = useAvaliacao()
  const { irPara } = useAvaliacaoNavigation()
  const valor = data[campo]

  return (
    <FeedbackBody
      title={titulo}
      subtitle={subtitulo}
      footer={
        <RodapePergunta
          podeAvancar={valor !== null}
          onProxima={() => irPara(proxima)}
          onPular={() => {
            update({ [campo]: null } satisfies Partial<AvaliacaoData>)
            irPara(proxima)
          }}
        />
      }
    >
      <OpcoesResposta
        nome={campo}
        rotuloGrupo={titulo}
        opcoes={opcoesEscala}
        valor={valor}
        onChange={(novo) => update({ [campo]: novo })}
      />
    </FeedbackBody>
  )
}

/**
 * Question 1 — nodes 2775:18010 (mobile) and 2791:1400 (desktop).
 *
 * "acolhido" is the file's copy, in the masculine, on a screen that thanks the person with
 * "Obrigada" two steps later. Reproduced; see SYNC-FIGMA.md.
 */
export function AcolhimentoScreen() {
  return <PerguntaEscala campo="acolhimento" proxima="reflexao" titulo="Você se sentiu acolhido?" />
}

/** Question 2 — nodes 2775:18039 (mobile) and 2792:1779 (desktop). */
export function ReflexaoScreen() {
  return (
    <PerguntaEscala
      campo="reflexao"
      proxima="chamada"
      titulo="Você saiu da sessão com algo que valeu a pena?"
      subtitulo="Um alívio, uma reflexão ou um próximo passo."
    />
  )
}

/**
 * Question 3 — nodes 2775:18069 (mobile) and 2792:2017 (desktop); answered in 2775:18593 /
 * 2792:2558, and with a serious problem reported in 2775:18532 / 2792:2783.
 *
 * The serious-problem answer opens a note under the list saying support will see the report.
 * It is also one of the two things that send the person to the 3b ending.
 */
export function ChamadaScreen() {
  const { data, update } = useAvaliacao()
  const { irPara } = useAvaliacaoNavigation()

  return (
    <FeedbackBody
      title="Áudio e vídeo funcionaram bem?"
      subtitle="Nesta etapa, avalie apenas a qualidade técnica da chamada."
      footer={
        <RodapePergunta
          podeAvancar={data.chamada !== null}
          onProxima={() => irPara('nota')}
          onPular={() => {
            update({ chamada: null })
            irPara('nota')
          }}
        />
      }
    >
      <OpcoesResposta
        nome="chamada"
        rotuloGrupo="Áudio e vídeo funcionaram bem?"
        opcoes={QUALIDADE_CHAMADA}
        valor={data.chamada}
        onChange={(valor) => update({ chamada: valor as AvaliacaoData['chamada'] })}
      />

      {data.chamada === 'serios' ? (
        // 8px under the list, like the gap between the options — hence the pull-up.
        <div
          role="status"
          className="bg-surface-faint border-outline-subtle text-fg-muted -mt-1 flex flex-col gap-3 rounded-xl border p-3"
        >
          <p className="text-label-s font-semibold">Vamos verificar o que aconteceu</p>
          <p className="text-body-s">
            Ao enviar o feedback, nossa equipe de suporte receberá o relato para analisar a falha
            técnica.
          </p>
        </div>
      ) : null}
    </FeedbackBody>
  )
}

/**
 * Question 4 — nodes 2288:12265 / 2296:10625 with no rating, and three states once rated:
 * 2b, optional comment (4–5 stars); 2c, required comment (1–3 stars), still empty; 2d, the
 * required comment filled in.
 *
 * The comment field only appears once there is a rating, and its label, placeholder and
 * helper change with it. The mobile 2d frame drops the back button and the progress header
 * that 2a–2c draw; this keeps them, since nothing else about the screen changes.
 *
 * "Reportar um problema" has no destination anywhere in the file: drawn, and does not
 * navigate — the same treatment as "Ver perfil do psicólogo". See SYNC-FIGMA.md.
 *
 * DS-GAP: `TextareaField` writes its label in Label S on `fg/muted` where the file has
 * Label M on `text/default`, and fills the field with `surface/base` where the file uses
 * `surface/faint`. Left as the DS renders it. See DS-GAPS.md, item 36.
 */
export function NotaScreen() {
  const { data, update } = useAvaliacao()
  const { irPara } = useAvaliacaoNavigation()

  const obrigatorio = data.nota !== null && data.nota < NOTA_MINIMA_SEM_COMENTARIO

  return (
    <FeedbackBody
      title={
        <>
          Como foi <br className="lg:hidden" />o atendimento?
        </>
      }
      footer={
        <>
          <Button
            variant="contained"
            className="w-full lg:flex-1"
            disabled={!podeEnviar(data)}
            onClick={() => irPara(finalDaAvaliacao(data))}
          >
            Enviar avaliação
          </Button>
          <Button
            variant="text-neutral"
            className="w-full lg:flex-1"
            onClick={() => irPara('proxima')}
          >
            Prefiro não avaliar
          </Button>
        </>
      }
    >
      <NotaEstrelas valor={data.nota} onChange={(nota) => update({ nota })} />

      {data.nota === null ? null : (
        <TextareaField
          id="avaliacao-comentario"
          rows={4}
          label={obrigatorio ? 'O que poderia ter sido melhor?' : 'Deixe um comentário (opcional)'}
          placeholder={
            obrigatorio
              ? 'Conte apenas o que se sentir confortável em compartilhar.'
              : 'Conte como foi a sua experiência'
          }
          helperText={obrigatorio ? 'Comentário obrigatório para notas de 1 a 3.' : undefined}
          required={obrigatorio}
          value={data.comentario}
          onChange={(evento) => update({ comentario: evento.target.value })}
        />
      )}

      <Button variant="text-neutral" className="w-full" aria-disabled="true">
        Reportar um problema
      </Button>
    </FeedbackBody>
  )
}
