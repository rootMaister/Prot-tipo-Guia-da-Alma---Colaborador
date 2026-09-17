import { Badge, IconButton, cn } from '@guia-da-alma/ds'
import { ArrowLeftIcon } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'

import { mesPorExtenso, noMesmoMes } from '@/flows/diario/formato'
import { humores } from '@/flows/diario/humores'
import { lerOrigem } from '@/lib/origem'
import { useConta, type RegistroHumor } from '@/state/conta-provider'

/**
 * Seu mês em detalhes — `2809:613` / `2809:457`, seção "4 - Seu mês em detalhes".
 *
 * Sub-página do Diário, não item de menu: o frame começa com um breadcrumb "Meu diário › Seu
 * mês" e um botão de voltar. É `foraDoMenu` em `destinos.ts`, como "Meus dados".
 *
 * Tudo aqui é contado a partir dos registros do mês corrente. O frame desenha oito registros
 * de setembro; o protótipo começa sem nenhum, então a tela cresce conforme a pessoa registra.
 * Ver SYNC-FIGMA.md.
 */
export function DiarioMesScreen() {
  const { conta } = useConta()
  const { search } = useLocation()
  const navigate = useNavigate()

  const agora = new Date()
  const doMes = conta.registros.filter((registro) => noMesmoMes(registro.data, agora))
  const voltar = lerOrigem(search, '/app/diario')

  return (
    <div className="flex flex-col gap-6 px-6 pt-2 pb-12 lg:px-0 lg:pt-20">
      <nav aria-label="Trilha" className="flex items-center gap-3">
        <IconButton
          icon={<ArrowLeftIcon className="size-[18px]" />}
          aria-label="Voltar"
          onClick={() => navigate(voltar)}
        />
        <p className="text-caption text-fg-subtle">
          <Link to="/app/diario" className="hover:text-fg-brand underline underline-offset-2">
            Meu diário
          </Link>{' '}
          › <span className="text-fg-muted">Seu mês</span>
        </p>
      </nav>

      <header className="flex flex-col gap-2">
        {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
        <h1 className="font-display text-heading-l text-fg-muted">Seu mês em detalhes</h1>
        <p className="text-body-s text-fg-subtle">
          {mesPorExtenso(agora)} · Uma visão mais completa dos seus registros, para você
          observar com calma.
        </p>
      </header>

      {doMes.length === 0 ? (
        <p className="text-body-s text-fg-subtle">
          Ainda não há registros neste mês. Assim que você registrar um dia, ele aparece aqui.
        </p>
      ) : (
        <>
          <ComoSeSentiu registros={doMes} />
          <PontosDeInfluencia registros={doMes} />
          <Evolucao registros={doMes} />
        </>
      )}
    </div>
  )
}

/** "Como você se sentiu": uma linha por humor, com a barra proporcional e a contagem. */
function ComoSeSentiu({ registros }: { registros: RegistroHumor[] }) {
  const contagem = humores.map(
    (_, indice) => registros.filter((registro) => registro.humor === indice).length,
  )
  const maior = Math.max(...contagem)
  const campeao = contagem.indexOf(maior)

  return (
    <section className="bg-surface-base border-outline-subtle flex flex-col gap-4 rounded-2xl border p-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-label-m text-fg-default">Como você se sentiu</h2>
        <p className="text-body-s text-fg-subtle">
          {humores[campeao].nome} foi o humor que mais apareceu nos seus registros deste mês.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {/* Do mais leve para o mais difícil não: o frame lista na ordem da escala. */}
        {humores.map((humor, indice) => (
          <li key={humor.nome} className="flex items-center gap-3">
            <span className="text-body-s text-fg-muted w-24 shrink-0">{humor.nome}</span>

            <span className="bg-surface-muted h-2 flex-1 overflow-hidden rounded">
              <span
                className="bg-accent-brand block h-2 rounded"
                style={{ width: maior ? `${(contagem[indice] / maior) * 100}%` : 0 }}
              />
            </span>

            <span className="text-body-s text-fg-subtle w-20 shrink-0 text-right">
              {contagem[indice] === 0
                ? 'Nenhum dia'
                : `${contagem[indice]} ${contagem[indice] === 1 ? 'dia' : 'dias'}`}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** "Pontos de influência": os motivos com a contagem entre parênteses, como o frame escreve. */
function PontosDeInfluencia({ registros }: { registros: RegistroHumor[] }) {
  const contagem = new Map<string, number>()

  for (const registro of registros) {
    for (const motivo of registro.motivos) {
      contagem.set(motivo, (contagem.get(motivo) ?? 0) + 1)
    }
  }

  const ordenados = [...contagem.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <section className="bg-surface-base border-outline-subtle flex flex-col gap-4 rounded-2xl border p-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-label-m text-fg-default">Pontos de influência</h2>
        <p className="text-body-s text-fg-subtle">
          Os que mais apareceram nos seus registros.
        </p>
      </div>

      {ordenados.length === 0 ? (
        <p className="text-body-s text-fg-subtle">
          Nenhum motivo marcado nos registros deste mês.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {ordenados.map(([motivo, vezes]) => (
            <li key={motivo}>
              <Badge variant="neutral">{`${motivo} (${vezes})`}</Badge>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/**
 * "Evolução ao longo do mês": o humor de cada registro num gráfico de linha, com os cinco
 * humores no eixo da esquerda e os dias embaixo.
 *
 * SVG à mão: o DS não tem gráfico, e o arquivo desenha a linha e os pontos um a um.
 * Ver DS-GAPS.md.
 */
function Evolucao({ registros }: { registros: RegistroHumor[] }) {
  const ordenados = [...registros].sort((a, b) => a.data.getTime() - b.data.getTime())
  const diasNoMes = new Date(
    ordenados[0].data.getFullYear(),
    ordenados[0].data.getMonth() + 1,
    0,
  ).getDate()

  const pontos = ordenados.map((registro) => ({
    x: ((registro.data.getDate() - 1) / (diasNoMes - 1)) * 100,
    // O eixo cresce para cima: Fluindo em cima, Difícil embaixo.
    y: 100 - (registro.humor / (humores.length - 1)) * 100,
    chave: registro.data.toISOString(),
  }))

  return (
    <section className="bg-surface-base border-outline-subtle flex flex-col gap-4 rounded-2xl border p-4">
      <h2 className="text-label-m text-fg-default">Evolução ao longo do mês</h2>

      <div className="flex gap-3">
        <ul className="text-caption text-fg-subtle flex h-40 flex-col justify-between">
          {[...humores].reverse().map((humor) => (
            <li key={humor.nome}>{humor.nome}</li>
          ))}
        </ul>

        <div className="flex flex-1 flex-col gap-2">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            role="img"
            aria-label={`Humor de cada registro do mês, de ${humores[0].nome} a ${humores[humores.length - 1].nome}`}
            className="h-40 w-full"
          >
            {humores.map((humor, indice) => (
              <line
                key={humor.nome}
                x1="0"
                x2="100"
                y1={100 - (indice / (humores.length - 1)) * 100}
                y2={100 - (indice / (humores.length - 1)) * 100}
                className="stroke-outline-subtle"
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {pontos.length > 1 ? (
              <polyline
                points={pontos.map((ponto) => `${ponto.x},${ponto.y}`).join(' ')}
                fill="none"
                className="stroke-accent-brand"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            ) : null}

            {pontos.map((ponto) => (
              <circle
                key={ponto.chave}
                cx={ponto.x}
                cy={ponto.y}
                r="1.5"
                className="fill-accent-brand"
                // Sem isso o círculo vira elipse: o viewBox não é quadrado na tela.
                vectorEffect="non-scaling-size"
              />
            ))}
          </svg>

          <div className={cn('text-caption text-fg-subtle flex justify-between')}>
            <span>01</span>
            <span>10</span>
            <span>20</span>
            <span>{diasNoMes}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
