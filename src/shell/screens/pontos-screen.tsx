import { useState } from 'react'

import { Badge, Button, FeaturedIcon, cn } from '@guia-da-alma/ds'
import {
  ChevronDownIcon,
  CircleHelpIcon,
  FlameIcon,
  SparklesIcon,
  TargetIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router'

import moeda from '@/assets/app/calma-coin.svg'
import { RankingPontos } from '@/components/local/ranking-pontos'
import { comOrigem } from '@/lib/origem'
import {
  duvidas,
  formasDePontuar,
  formatarNumero,
  premios,
  type Duvida,
  type Premio,
} from '@/shell/pontos'
import { pontosParaProximoNivel, useConta } from '@/state/conta-provider'

type Aba = 'premios' | 'pontuar' | 'funciona'

const ABAS: readonly { id: Aba; rotulo: string; icone: typeof TargetIcon }[] = [
  { id: 'premios', rotulo: 'Prêmios', icone: SparklesIcon },
  { id: 'pontuar', rotulo: 'Como pontuar?', icone: TargetIcon },
  { id: 'funciona', rotulo: 'Como funciona?', icone: CircleHelpIcon },
]

/**
 * Meus pontos — `2563:262` / `2565:301` / `2566:364` no mobile e `2552:4` / `2559:89` /
 * `2560:191` no desktop. Uma tela com três abas, não três telas.
 *
 * Mobile e desktop são desenhos diferentes: lá tudo é uma coluna, e as abas rolam na
 * horizontal; aqui a tela é uma grade de duas colunas — "Seus pontos" e a aba à esquerda,
 * "Resumo" e o Ranking à direita —, as abas ganham ícone e o ranking cresce de cinco para dez.
 *
 * Os números da pessoa vêm do `conta-provider`; os do frame (905 pontos, nível 5) são de uma
 * conta mais avançada e não são reproduzidos. Ver SYNC-FIGMA.md.
 */
export function PontosScreen() {
  const [aba, setAba] = useState<Aba>('premios')

  return (
    <div className="flex flex-col gap-6 px-6 pt-2 pb-12 lg:px-0 lg:pt-20">
      <header className="flex flex-col gap-2">
        {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
        <h1 className="font-display text-heading-l text-fg-muted">Meus pontos</h1>
        <p className="text-body-s text-fg-subtle">
          Ganhe pontos cuidando de você e troque suas Calmas por prêmios.
        </p>
      </header>

      {/*
        Uma grade só, e não duas colunas empilhadas: no mobile a ordem desenhada é Seus
        pontos → Resumo → abas → Ranking, e no desktop o Resumo sobe para a direita, ao lado
        de "Seus pontos". Com dois contêineres, o Resumo cairia depois das abas no mobile.
      */}
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_360px] lg:items-start lg:gap-x-6">
        <div className="lg:col-start-1 lg:row-start-1">
          <SeusPontos />
        </div>

        <div className="lg:col-start-2 lg:row-start-1">
          <Resumo />
        </div>

        <div className="flex flex-col gap-6 lg:col-start-1 lg:row-start-2">

          {/*
            As abas rolam na horizontal no mobile: o desenho corta "Como funciona?" na
            borda da tela em vez de quebrar a linha.
          */}
          <div
            role="tablist"
            aria-label="Conteúdo de Meus pontos"
            className="-mx-6 flex gap-1 overflow-x-auto px-6 lg:mx-0 lg:px-0"
          >
            {ABAS.map(({ id, rotulo, icone: Icone }) => (
              <button
                key={id}
                role="tab"
                type="button"
                aria-selected={aba === id}
                onClick={() => setAba(id)}
                className={cn(
                  'text-label-s flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 font-semibold',
                  'transition-colors duration-150 ease-out',
                  aba === id
                    ? // DS-GAP: `tab/background-item/active` (#466700) não existe no DS, e o
                      // `TabsList` embrulha as abas numa caixa que o desenho não tem — ver a
                      // nota em `ranking-pontos.tsx` e o DS-GAPS.md.
                      'bg-action-primary text-fg-on-action'
                    : 'text-fg-default hover:bg-surface-subtle',
                )}
              >
                {/* Só o desktop desenha ícone nas abas. */}
                <Icone className="hidden size-4 lg:block" aria-hidden />
                {rotulo}
              </button>
            ))}
          </div>

          {aba === 'premios' ? <AbaPremios /> : null}
          {aba === 'pontuar' ? <AbaComoPontuar /> : null}
          {aba === 'funciona' ? <AbaComoFunciona /> : null}
        </div>

        <div className="lg:col-start-2 lg:row-start-2">
          <RankingPontos />
        </div>
      </div>
    </div>
  )
}

/** "Seus pontos" (2853:1295): o total, o nível e a barra até o próximo. */
function SeusPontos() {
  const { conta } = useConta()
  const faltam = pontosParaProximoNivel(conta)
  const preenchido = Math.min(100, Math.round((conta.pontos / conta.pontosProximoNivel) * 100))

  return (
    <section className="bg-surface-base border-outline-subtle flex flex-col gap-4 rounded-2xl border p-4">
      <h2 className="text-label-l text-fg-default">Seus pontos</h2>

      <div className="flex items-center gap-4">
        <FeaturedIcon icon={TargetIcon} size="lg" color="positive" />
        <div className="flex flex-col gap-1">
          <p className="font-display text-heading-l text-fg-muted">
            {formatarNumero(conta.pontos)} pontos
          </p>
          <p className="text-body-s text-fg-subtle">Você está no nível {conta.nivel}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {/*
          DS-GAP: o `ProgressBar` do DS tem trilho de 4px e rótulo próprio; aqui a barra é de
          8px, raio 4, `surface/muted` sob `accent/brand`, sem rótulo. Ver DS-GAPS.md.
        */}
        <Barra preenchido={preenchido} />
        <div className="text-body-s text-fg-subtle flex justify-between gap-4">
          <span>Nível {conta.nivel}</span>
          <span>
            Faltam {formatarNumero(faltam)} pontos para o nível {conta.nivel + 1}
          </span>
        </div>
      </div>
    </section>
  )
}

/** "Resumo" (2853:1308): Calmas, nível e a sequência de dias. */
function Resumo() {
  const { conta } = useConta()

  return (
    <section className="bg-surface-base border-outline-subtle flex flex-col gap-1 rounded-2xl border p-4">
      <h2 className="text-label-m text-fg-default">Resumo</h2>

      <Metrica numero={formatarNumero(conta.moedas)} rotulo="Calmas disponíveis" divisor>
        <img src={moeda} alt="" className="h-[29px] w-10" />
      </Metrica>

      <Metrica numero={String(conta.nivel)} rotulo="Seu nível atual" divisor>
        <FeaturedIcon icon={TargetIcon} size="sm" color="neutral" />
      </Metrica>

      <Metrica
        numero={`${conta.diasSeguidos}/${conta.diasParaBonus}`}
        rotulo="Dias seguidos de acesso · +50 pontos ao completar"
      >
        <FeaturedIcon icon={FlameIcon} size="sm" color="neutral" />
      </Metrica>
    </section>
  )
}

function Metrica({
  numero,
  rotulo,
  divisor,
  children,
}: {
  numero: string
  rotulo: string
  divisor?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 py-4',
        divisor && 'border-outline-subtle border-b',
      )}
    >
      <p className="font-display text-heading-s text-fg-muted w-16">{numero}</p>
      <p className="text-body-s text-fg-muted flex-1">{rotulo}</p>
      <div className="flex size-10 items-center justify-center">{children}</div>
    </div>
  )
}

function AbaPremios() {
  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start">
      {premios.map((premio) => (
        <CardPremio key={premio.titulo} premio={premio} />
      ))}
    </div>
  )
}

function CardPremio({ premio }: { premio: Premio }) {
  const { conta } = useConta()
  const faltam = Math.max(0, premio.custo - conta.moedas)
  const preenchido = Math.min(100, Math.round((conta.moedas / premio.custo) * 100))

  return (
    <article className="bg-surface-base border-outline-subtle flex flex-col gap-4 rounded-2xl border p-4">
      <h3 className="text-label-m text-fg-muted">{premio.titulo}</h3>

      <p className="flex items-center gap-1 whitespace-nowrap">
        <img src={moeda} alt="" className="h-5 w-7 shrink-0" />
        <span className="font-display text-heading-s text-fg-muted">
          {formatarNumero(premio.custo)} Calmas
        </span>
      </p>

      <p className="text-body-s text-fg-subtle">
        {faltam > 0 ? `Faltam ${formatarNumero(faltam)} Calmas` : 'Você já pode resgatar'}
      </p>

      <Barra preenchido={preenchido} />

      {/* Não há tela de detalhe do prêmio no arquivo — o botão aparece e não navega. */}
      <Button variant="outlined" className="w-full" aria-disabled="true">
        Saber mais
      </Button>
    </article>
  )
}

function AbaComoPontuar() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-4">
      {formasDePontuar.map((forma) => {
        const Icone = forma.icone

        return (
          <article
            key={forma.titulo}
            className="bg-surface-base border-outline-subtle flex flex-col gap-4 rounded-2xl border p-4"
          >
            <div className="flex items-center gap-4">
              <FeaturedIcon icon={Icone} size="md" color="neutral" />
              <div className="flex min-w-0 flex-col gap-1">
                <h3 className="text-label-m text-fg-muted">{forma.titulo}</h3>
                <p className="text-body-s text-fg-subtle">{forma.pontos}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant={forma.concluido ? 'success' : 'neutral'}>{forma.status}</Badge>
              {/*
                "Saber mais" não tem destino desenhado em nenhum dos sete cartões. O único que
                o protótipo consegue honrar é a introdução, que explica exatamente isto — os
                outros aparecem e não navegam. Ver SYNC-FIGMA.md.
              */}
              <Button
                variant="outlined"
                onClick={() => navigate(comOrigem('/introducao/pontos', '/app/pontos'))}
              >
                Saber mais
              </Button>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function AbaComoFunciona() {
  return (
    <div className="bg-surface-base border-outline-subtle flex flex-col rounded-2xl border p-4">
      {duvidas.map((duvida, indice) => (
        <Pergunta key={duvida.pergunta} duvida={duvida} aberta={indice === 0} />
      ))}
    </div>
  )
}

/**
 * Uma pergunta do acordeão. Só a primeira tem resposta escrita no arquivo — as outras cinco
 * abrem e não têm o que mostrar. Ver SYNC-FIGMA.md.
 */
function Pergunta({ duvida, aberta }: { duvida: Duvida; aberta: boolean }) {
  const [abertaAgora, setAberta] = useState(aberta)

  return (
    <div className="border-outline-subtle border-b py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setAberta((atual) => !atual)}
        aria-expanded={abertaAgora}
        className="text-label-m text-fg-muted flex w-full items-center justify-between gap-4 text-left"
      >
        {duvida.pergunta}
        <ChevronDownIcon
          aria-hidden
          className={cn(
            'size-5 shrink-0 transition-transform duration-200 ease-out',
            abertaAgora && 'rotate-180',
          )}
        />
      </button>

      {abertaAgora ? (
        <div className="flex flex-col gap-3 pt-3">
          {duvida.resposta.length > 0 ? (
            duvida.resposta.map((paragrafo) => (
              <p key={paragrafo} className="text-body-s text-fg-subtle">
                {paragrafo}
              </p>
            ))
          ) : (
            <p className="text-body-s text-fg-subtle italic">
              Esta resposta ainda não foi escrita no Figma.
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}

/** A barra de 8px que "Seus pontos" e os prêmios desenham. */
function Barra({ preenchido }: { preenchido: number }) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={preenchido}
      className="bg-surface-muted h-2 w-full overflow-hidden rounded"
    >
      <div
        className="bg-accent-brand h-2 rounded transition-[width] duration-300 ease-out"
        style={{ width: `${preenchido}%` }}
      />
    </div>
  )
}
