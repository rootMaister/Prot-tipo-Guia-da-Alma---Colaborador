import { Badge, Button, FeaturedIcon } from '@guia-da-alma/ds'
import { ArrowRightIcon, NotebookPenIcon, PlusIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router'

import { MenuButton } from '@/components/local/barra-conta'
import { OrbeHumor } from '@/components/local/orbe-humor'
import { mesPorExtenso, noMesmoMes, registroNaLista } from '@/flows/diario/formato'
import { humores, insightsDoMes } from '@/flows/diario/humores'
import { comOrigem } from '@/lib/origem'
import { useConta, type RegistroHumor } from '@/state/conta-provider'

/**
 * Meu diário — `2813:19777` / `2484:3`, e o estado vazio em `2845:2287` / `2845:2147`.
 *
 * Duas telas no arquivo, um destino aqui: qual delas aparece é o número de registros, do
 * mesmo jeito que o Início troca de estado conforme a conta tenha ou não sessão marcada.
 *
 * O insight do mês é um cartão com cinco textos possíveis, um por faixa de humor
 * (`2815:20079` e irmãos). Qual aparece não está escrito no arquivo; aqui é a média dos
 * registros do mês. Ver SYNC-FIGMA.md.
 */
export function DiarioScreen() {
  const { conta } = useConta()
  const navigate = useNavigate()

  const registrar = () => navigate(comOrigem('/diario/humor', '/app/diario'))

  return (
    <div className="flex flex-col gap-6 px-6 pt-2 pb-12 lg:px-0 lg:pt-20">
      {/* O frame mobile (2813:19777) abre com o botão de menu, no lugar da barra inferior. */}
      <MenuButton />

      <header className="flex flex-col gap-2">
        {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
        <h1 className="font-display text-heading-l text-fg-muted">Meu diário</h1>
        <p className="text-body-s text-fg-subtle">
          Acompanhe como você tem se sentido e o que influencia o seu humor.
        </p>
      </header>

      {conta.registros.length === 0 ? (
        <EstadoVazio onRegistrar={registrar} />
      ) : (
        <>
          <Button
            variant="contained"
            className="w-fit"
            leadingIcon={<PlusIcon className="size-[18px]" />}
            onClick={registrar}
          >
            Registrar meu dia
          </Button>

          <InsightDoMes registros={conta.registros} />

          <ListaDeRegistros registros={conta.registros} />
        </>
      )}
    </div>
  )
}

/** "Seu diário começa aqui" (2845:2287): o que é, como funciona e o primeiro registro. */
function EstadoVazio({ onRegistrar }: { onRegistrar: () => void }) {
  const passos = [
    'Escolha como está sendo o seu dia',
    'Marque o que influenciou',
    'Se quiser, conte um pouco mais',
  ]

  return (
    <section className="bg-surface-base border-outline-subtle flex flex-col items-start gap-6 rounded-2xl border p-6">
      <FeaturedIcon icon={NotebookPenIcon} size="lg" color="positive" />

      <div className="flex flex-col gap-2">
        <h2 className="font-display text-heading-m text-fg-default">Seu diário começa aqui</h2>
        <p className="text-body-s text-fg-subtle">
          Registre como está sendo o seu dia. Com o tempo, este espaço vai mostrar o que
          costuma estar presente nos seus dias — sem notas e sem metas, só para você se
          conhecer melhor.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <h3 className="text-label-m text-fg-muted">Como funciona</h3>
        <ol className="flex flex-col gap-3">
          {passos.map((passo, indice) => (
            <li key={passo} className="flex items-center gap-3">
              <span className="bg-surface-subtle text-label-s text-fg-muted flex size-8 shrink-0 items-center justify-center rounded-full">
                {indice + 1}
              </span>
              <span className="text-body-s text-fg-muted">{passo}</span>
            </li>
          ))}
        </ol>
      </div>

      <Button
        variant="contained"
        className="w-full"
        leadingIcon={<PlusIcon className="size-[18px]" />}
        onClick={onRegistrar}
      >
        Fazer meu primeiro registro
      </Button>
    </section>
  )
}

/** O cartão escuro do mês, com os dois pontos de influência que mais apareceram. */
function InsightDoMes({ registros }: { registros: RegistroHumor[] }) {
  const navigate = useNavigate()
  const agora = new Date()
  const doMes = registros.filter((registro) => noMesmoMes(registro.data, agora))

  if (doMes.length === 0) {
    return null
  }

  const media = doMes.reduce((soma, registro) => soma + registro.humor, 0) / doMes.length
  const contagem = new Map<string, number>()

  for (const registro of doMes) {
    for (const motivo of registro.motivos) {
      contagem.set(motivo, (contagem.get(motivo) ?? 0) + 1)
    }
  }

  const principais = [...contagem.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([motivo]) => motivo)

  return (
    <section className="bg-surface-base border-outline-subtle flex flex-col gap-4 rounded-2xl border p-4">
      <p className="text-label-s text-fg-subtle">Seu mês até aqui · {mesPorExtenso(agora)}</p>

      <p className="text-body-s text-fg-muted">{insightsDoMes[Math.round(media)]}</p>

      {principais.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {principais.map((motivo) => (
            <li key={motivo}>
              <Badge variant="neutral">{motivo}</Badge>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-caption text-fg-subtle">Com base nos seus registros deste mês.</p>
        <Button
          variant="text"
          trailingIcon={<ArrowRightIcon className="size-[18px]" />}
          onClick={() => navigate(comOrigem('/app/diario-mes', '/app/diario'))}
        >
          Ver detalhes do mês
        </Button>
      </div>
    </section>
  )
}

function ListaDeRegistros({ registros }: { registros: RegistroHumor[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-label-l text-fg-default">Meu diário</h2>
      <p className="text-caption text-fg-subtle">
        Seus registros antigos foram renomeados para a escala nova.{' '}
        <Link to="/app/diario-aviso" className="text-fg-brand underline underline-offset-2">
          Ver o que mudou
        </Link>
      </p>

      <ul className="bg-surface-base border-outline-subtle flex flex-col rounded-2xl border">
        {/* O frame lista cinco e guarda o resto atrás de "Ver todos os registros". */}
        {registros.slice(0, 5).map((registro) => (
          <li
            key={registro.data.toISOString()}
            className="border-outline-subtle flex items-center gap-3 border-b p-4 last:border-b-0"
          >
            <OrbeHumor valor={registro.humor} tamanho={40} />

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="text-caption text-fg-subtle">{registroNaLista(registro.data)}</p>
              {registro.motivos.length > 0 ? (
                <ul className="flex flex-wrap gap-1">
                  {registro.motivos.slice(0, 1).map((motivo) => (
                    <li key={motivo}>
                      <Badge variant="neutral">{motivo}</Badge>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <p className="text-label-s text-fg-muted">{humores[registro.humor].nomeNaLista}</p>
          </li>
        ))}
      </ul>

      {registros.length > 5 ? (
        // Não há tela de "todos os registros" no arquivo — o botão aparece e não navega.
        <Button variant="outlined" className="w-full" aria-disabled="true">
          Ver todos os registros
        </Button>
      ) : null}
    </section>
  )
}
