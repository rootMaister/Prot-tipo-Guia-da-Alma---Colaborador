import { Link } from 'react-router'

import { GuiaLockup } from '@/components/local/guia-lockup'
import { agendamentoSteps } from '@/flows/agendamento/steps'
import { avaliacaoSteps } from '@/flows/avaliacao/steps'
import { cadastroSteps, figmaNodeUrl } from '@/flows/cadastro/steps'
import { matchSteps } from '@/flows/match/steps'
import { destinos } from '@/shell/destinos'

import { useScreenSurface } from '@/lib/use-screen-surface'

/**
 * Index of every screen in the prototype, grouped by flow. All the flows live in the same
 * Figma file, so one `figmaNodeUrl` serves them.
 */
const flows = [
  {
    name: 'Cadastro',
    basePath: '/cadastro',
    firstStep: 'splash',
    steps: cadastroSteps,
    description: 'Da abertura do app até o perfil aprovado pelo RH.',
  },
  {
    name: 'Match de terapia',
    basePath: '/match',
    firstStep: 'inicio',
    steps: matchSteps,
    description: 'Continua direto do "Perfil aprovado": questionário, busca e sessões sugeridas.',
  },
  {
    name: 'Agendamento',
    basePath: '/agendamento',
    firstStep: 'detalhes',
    steps: agendamentoSteps,
    description:
      'Continua de "Ver agenda" nas sessões recomendadas: detalhe, data e horário, dados e confirmação.',
  },
  {
    name: 'Avaliação',
    basePath: '/avaliacao',
    firstStep: 'realizada',
    steps: avaliacaoSteps,
    description:
      'Depois da sessão — aberto por "Entrar na sala" em Detalhes da sessão: quatro perguntas, a nota e um dos três finais. No desktop, é um modal sobre Meus agendamentos.',
  },
]

export function IndexPage() {
  useScreenSurface('surface-subtle')

  const totalScreens = flows.reduce((total, flow) => total + flow.steps.length, 0)
  const destinosDisponiveis = destinos.filter((destino) => destino.disponivel)

  return (
    <div className="bg-surface-subtle pt-safe px-safe pb-safe min-h-dvh [--pb-safe:3rem]">
      {/* Bottom spacing lives on the root, which is what carries the safe inset. */}
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 pt-12">
        <header className="flex flex-col gap-3">
          <GuiaLockup height={26} className="text-fg-default" />
          <h1 className="font-display text-heading-m text-fg-default">
            Protótipo — Colaborador UI
          </h1>
          <p className="text-body-s text-fg-subtle max-w-prose">
            {flows.length} fluxos, {totalScreens} telas, mais os{' '}
            {destinosDisponiveis.length} destinos do app. Cada tela tem URL própria: dá para abrir e
            compartilhar uma tela específica sem percorrer o fluxo. Os links de node abrem o frame
            correspondente no Figma.
          </p>
        </header>

        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-heading-s text-fg-default">App</h2>
            <p className="text-body-s text-fg-subtle max-w-prose">
              O que existe depois do onboarding. Não são passos de um fluxo: são destinos, com
              navegação permanente e sem "próximo". Diário e Meu progresso aparecem no menu mas não
              têm telas desenhadas. Meus dados é o contrário: tem tela e não está no menu — abre
              pelo perfil.
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destinosDisponiveis.map((destino) => (
              <li key={destino.slug}>
                <div className="bg-surface-base border-outline-subtle flex h-full flex-col gap-3 rounded-2xl border p-5">
                  <Link
                    to={`/app/${destino.slug}`}
                    className="text-label-m text-fg-default hover:text-fg-brand"
                  >
                    {destino.rotulo}
                  </Link>

                  <p className="text-caption text-fg-subtle font-mono">/app/{destino.slug}</p>

                  <div className="text-caption text-fg-subtle mt-auto flex flex-wrap gap-x-3 gap-y-1">
                    {destino.nodeMobile ? (
                      <a
                        className="underline underline-offset-2"
                        href={figmaNodeUrl(destino.nodeMobile)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Figma mobile
                      </a>
                    ) : null}
                    {destino.nodeDesktop ? (
                      <a
                        className="underline underline-offset-2"
                        href={figmaNodeUrl(destino.nodeDesktop)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Figma desktop
                      </a>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {flows.map((flow) => (
          <section key={flow.basePath} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h2 className="font-display text-heading-s text-fg-default">{flow.name}</h2>
              <p className="text-body-s text-fg-subtle max-w-prose">{flow.description}</p>
              <Link
                to={`${flow.basePath}/${flow.firstStep}`}
                className="text-label-s text-fg-brand w-fit underline underline-offset-4"
              >
                Percorrer o fluxo desde o início →
              </Link>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {flow.steps.map((step) => (
                <li key={step.slug}>
                  <div className="bg-surface-base border-outline-subtle flex h-full flex-col gap-3 rounded-2xl border p-5">
                    <Link
                      to={`${flow.basePath}/${step.slug}`}
                      className="text-label-m text-fg-default hover:text-fg-brand"
                    >
                      {step.title}
                    </Link>

                    <p className="text-caption text-fg-subtle font-mono">
                      {flow.basePath}/{step.slug}
                    </p>

                    <div className="text-caption text-fg-subtle mt-auto flex flex-wrap gap-x-3 gap-y-1">
                      <a
                        className="underline underline-offset-2"
                        href={figmaNodeUrl(step.nodeMobile)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Figma mobile
                      </a>
                      {step.nodeDesktop ? (
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
