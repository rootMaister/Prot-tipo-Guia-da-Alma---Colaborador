import { onboarding } from '@/analytics/posthog'

import { Link } from 'react-router'

import { GuiaLockup } from '@/components/local/guia-lockup'
import { agendamentoSteps } from '@/flows/agendamento/steps'
import { cadastroSteps, figmaNodeUrl } from '@/flows/cadastro/steps'
import { matchSteps } from '@/flows/match/steps'

import { useScreenSurface } from '@/lib/use-screen-surface'

/**
 * A porta de entrada do protótipo.
 *
 * Mostra **um** fluxo: o onboarding, que são o Cadastro, o Match e o Agendamento emendados —
 * eles já se costuram sozinhos no protótipo (o "Perfil aprovado" abre o Match, o "Ver mais"
 * do card abre o Agendamento, e o fim cai em Meus agendamentos), então aqui aparecem como uma
 * jornada só, e não como três listas.
 *
 * O resto do protótipo **continua funcionando por URL** — Avaliação, Registro de humor,
 * Introdução à gamificação e os destinos do app têm rota, só não aparecem aqui. A decisão é
 * de vitrine: esta página existe para o time abrir e ver como o projeto está, e três fluxos
 * soltos mais seis destinos convidam a começar pelo meio.
 *
 * As etapas continuam listadas abaixo, com o link do frame no Figma, para quem quiser pular
 * direto a uma tela ou comparar com o desenho.
 */
const etapas = [
  {
    nome: 'Cadastro',
    basePath: '/cadastro',
    steps: cadastroSteps,
    descricao: 'Da abertura do app até o perfil aprovado pelo RH.',
  },
  {
    nome: 'Match de terapia',
    basePath: '/match',
    steps: matchSteps,
    descricao: 'Continua do "Perfil aprovado": o questionário e as sessões recomendadas.',
  },
  {
    nome: 'Agendamento',
    basePath: '/agendamento',
    steps: agendamentoSteps,
    descricao: 'Continua de "Ver mais": detalhe da sessão, data e horário, dados e confirmação.',
  },
]

const COMECO = '/cadastro/splash'

export function IndexPage() {
  useScreenSurface('surface-subtle')

  const totalTelas = etapas.reduce((total, etapa) => total + etapa.steps.length, 0)

  return (
    <div className="bg-surface-subtle pt-safe px-safe pb-safe min-h-dvh [--pb-safe:3rem]">
      {/* Bottom spacing lives on the root, which is what carries the safe inset. */}
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 pt-12">
        <header className="flex flex-col gap-4">
          <GuiaLockup height={26} className="text-fg-default" />

          <div className="flex flex-col gap-3">
            <h1 className="font-display text-heading-m text-fg-default">
              Fluxo de Onboarding
            </h1>
            <p className="text-body-m text-fg-muted max-w-prose">
              Primeiro contato do colaborador com a plataforma. Desde o cadastro, match e
              agendamento da sua primeira sessão.
            </p>
          </div>

          <Link
            to={COMECO}
            onClick={(event) => {
              if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) onboarding.start()
            }}
            className="bg-action-primary text-fg-on-action text-label-s hover:bg-action-primary-hover w-fit rounded-full px-5 py-4 font-semibold transition-colors duration-150 ease-out"
          >
            Começar do início →
          </Link>

          <p className="text-body-s text-fg-subtle max-w-prose">
            {totalTelas} telas, do splash até "Meus agendamentos", sem voltar aqui no meio do
            caminho. Cada tela também tem URL própria: dá para abrir uma específica, e os links
            de node abrem o frame correspondente no Figma.
          </p>
        </header>

        {etapas.map((etapa) => (
          <section key={etapa.basePath} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h2 className="font-display text-heading-s text-fg-default">{etapa.nome}</h2>
              <p className="text-body-s text-fg-subtle max-w-prose">{etapa.descricao}</p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {etapa.steps.map((step) => (
                <li key={step.slug}>
                  <div className="bg-surface-base border-outline-subtle flex h-full flex-col gap-3 rounded-2xl border p-5">
                    <Link
                      to={`${etapa.basePath}/${step.slug}`}
                      className="text-label-m text-fg-default hover:text-fg-brand"
                    >
                      {step.title}
                    </Link>

                    <p className="text-caption text-fg-subtle font-mono">
                      {etapa.basePath}/{step.slug}
                    </p>

                    <div className="text-caption text-fg-subtle mt-auto flex flex-wrap gap-x-3 gap-y-1">
                      {step.nodeMobile ? (
                        <a
                          className="underline underline-offset-2"
                          href={figmaNodeUrl(step.nodeMobile)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Figma mobile
                        </a>
                      ) : (
                        <span>sem desenho no Figma</span>
                      )}
                      {!step.nodeMobile ? null : step.nodeDesktop ? (
                        <a
                          className="underline underline-offset-2"
                          href={figmaNodeUrl(step.nodeDesktop)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Figma desktop
                        </a>
                      ) : (
                        <span>só mobile</span>
                      )}
                      {step.progress === null ? null : <span>{step.progress}%</span>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
