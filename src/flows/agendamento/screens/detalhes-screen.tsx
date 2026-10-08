import { useState } from 'react'

import { Button, IconButton, Tabs, TabsContent, TabsList, TabsTrigger, cn } from '@guia-da-alma/ds'
import { ArrowLeftIcon, ArrowRightIcon, PlayIcon } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'

import { GuiaLockup } from '@/components/local/guia-lockup'
import { ListaRolavel } from '@/components/local/lista-rolavel'
import { CardOutraSessao, type OutraSessao } from '@/components/local/card-outra-sessao'
import { CardReview, type Review } from '@/components/local/card-review'
import { ProfissionalResumo } from '@/components/local/profissional-resumo'

import { SESSAO } from '../agendamento-provider'
import { useStepNavigation } from '../use-step-navigation'

import { lerOrigem, veioDoApp } from '@/lib/origem'
import { useScreenSurface } from '@/lib/use-screen-surface'

/**
 * Step 1 — nodes 1184:5171 (mobile) and 1236:12522 (desktop). As outras abas são 3254:2973,
 * 1184:5198 e 1184:5259 no mobile, e 3255:3422, 3255:3248 e 3255:3336 no desktop.
 *
 * The breakpoints are not one layout reflowed, they are two designs. Mobile stacks a
 * 20px Label L title, the professional, then the tab bar, all scrolling above a fixed
 * footer. Desktop splits into two columns: the title in *display serif* with the
 * professional and the call to action on the left, the tab bar and its content on the right.
 *
 * Até 23/09/2026 o desktop não tinha abas e empilhava descrição, avaliações e outras sessões
 * numa coluna só. Agora os dois breakpoints têm as mesmas quatro abas — Descrição, Formação,
 * Avaliações e Mais sessões —, e o que muda entre eles é o conteúdo de cada uma.
 */

const DESCRICAO = [
  'Se você sente que carrega um peso que não sabe nomear, uma inquietação que insiste em voltar, saiba que não precisa enfrentar isso sozinho(a). Na psicoterapia analítica/junguiana, vamos explorar juntos os símbolos, sonhos e padrões que moldam sua história, criando um espaço seguro e acolhedor para mulheres e pessoas LGBT+.',
  'Acredito que o autoconhecimento é o caminho para relações mais saudáveis — com o mundo e com você mesma(o). Terei o cuidado de caminhar nesse processo ao seu lado, no seu tempo.',
]

const ASSINATURA = 'Daniele Tramontina – Psicóloga clínica'

const LEGENDA_VIDEO = 'Apresentação de Daniele · 1 min'

/** A aba Formação (3254:3035), grupo a grupo, na ordem do arquivo. */
const FORMACAO = [
  { grupo: 'Graduação', itens: ['Psicologia — PUC-SP, 2012'] },
  {
    grupo: 'Pós-graduação',
    itens: ['Psicologia Analítica (Junguiana) — Instituto Junguiano de São Paulo, 2016'],
  },
  {
    grupo: 'Especializações',
    itens: [
      'Terapia de Casal — Sedes Sapientiae, 2019',
      'Psicoterapia de Adolescentes — Instituto Sedes, 2021',
    ],
  },
  {
    grupo: 'Certificações',
    itens: ['Manejo de Luto — ABP, 2022', 'Terapia Focada na Compaixão — Compassionate Mind, 2023'],
  },
  { grupo: 'Registro profissional', itens: [SESSAO.profissional.crp] },
]

const REVIEWS: Review[] = [
  {
    nome: 'Amélie Laurent',
    iniciais: 'AL',
    estrelas: 5,
    texto:
      'A sessão me ajudou muito a entender coisas me incomodava desde a minha infância. Foi muito esclarecedor, só tenho a agradecer.',
  },
  {
    nome: 'Bruno Ribeiro',
    iniciais: 'BR',
    estrelas: 4,
    texto:
      'A experiência foi incrível! O terapeuta teve uma abordagem muito sensível e me fez sentir confortável para compartilhar.',
  },
  {
    nome: 'Carla Almeida',
    iniciais: 'CA',
    estrelas: 5,
    texto:
      'Senti que pude me abrir de uma maneira que nunca tinha conseguido antes. Foi uma revelação.',
  },
  {
    nome: 'Diego Esteves',
    iniciais: 'DE',
    estrelas: 4,
    texto: 'Me ajudou a ver as coisas sob uma nova perspectiva. Algumas técnicas foram muito úteis.',
  },
  {
    nome: 'Elena Lima',
    iniciais: 'EL',
    estrelas: 5,
    texto:
      'Uma experiência transformadora. Senti que fiz grandes progressos na minha autoaceitação.',
  },
  {
    nome: 'Felipe Rocha',
    iniciais: 'FR',
    estrelas: 5,
    texto: 'A sessão foi muito esclarecedora. O profissional foi atencioso e me guiou de maneira eficaz.',
  },
  {
    nome: 'Gabriela Esteves',
    iniciais: 'GE',
    estrelas: 4,
    texto: 'Uma jornada que valeu a pena. O espaço seguro proporcionado ajudou muito.',
  },
  {
    nome: 'Hugo Oliveira',
    iniciais: 'HO',
    estrelas: 5,
    texto:
      'Senti que a terapia me trouxe um novo senso de esperança. As orientações foram valiosas e muito enriquecedoras.',
  },
]

/**
 * O desktop (3255:3336) repete "Sessão de Casal" no segundo cartão — sobra de cópia da
 * instância; o mobile (1184:5259) traz "Orientação Vocacional", que vale nos dois.
 */
const OUTRAS_SESSOES: OutraSessao[] = [
  {
    titulo: 'Sessão de Casal | terapia para relacionamentos e comunicação',
    disponibilidade: 'Disponível amanhã às • 10:00',
    profissional: SESSAO.profissional,
  },
  {
    titulo: 'Orientação Vocacional | autoconhecimento e escolhas de carreira',
    disponibilidade: 'Disponível sexta às • 09:00',
    profissional: SESSAO.profissional,
  },
]

/**
 * The copy of the back button, by where the flow was opened from. "Voltar para as sessões"
 * is what the frame draws, and it is right for the Match results; coming from Busca it would
 * name the wrong list. The Busca wording is new copy — see SYNC-FIGMA.md.
 */
const ROTULO_VOLTAR: Record<string, string> = {
  '/match/sessoes-recomendadas': 'Voltar para as sessões',
  '/app/busca': 'Voltar para a busca',
  '/app/inicio': 'Voltar para o início',
  '/app/agendamentos': 'Voltar para os agendamentos',
}

/** Only on desktop: the header above the review list there states both. */
const AVALIACOES_TOTAL = 38
const AVALIACOES_MEDIA = '4,5'

/**
 * As abas (1635:3042 no mobile, 3255:2989 no desktop). "Certificações" saiu do arquivo em
 * 21/09/2026; em 23/09 entrou "Formação", que traz as certificações entre outros grupos.
 */
const ABAS = [
  { valor: 'descricao', rotulo: 'Descrição' },
  { valor: 'formacao', rotulo: 'Formação' },
  { valor: 'avaliacoes', rotulo: 'Avaliações' },
  { valor: 'sessoes', rotulo: 'Mais sessões' },
] as const

/**
 * O `segmented-tab` (1635:3043) é uma pílula solta sobre o fundo da tela: sem contêiner, sem
 * borda, 8px entre elas, `radius/xl` — que **aqui** são 12px, contra os 16 do mesmo nome no
 * card do Match. Só o `cornerRadius` do nó vale; ver a regra no CLAUDE.md.
 *
 * Vem do DS pelo comportamento (Radix: teclado, roles, painel ligado à aba) e é repintado
 * por `className`, que o `cn` do DS deixa vencer. O que o DS traz e o arquivo não tem é o
 * contêiner com borda em `surface/subtle` e o ativo em `action/primary`. Com quatro abas a
 * fila passa da largura do mobile e rola na horizontal, como o `tabs` do arquivo
 * (`overflow-x-auto`).
 *
 * DS-GAP: as duas cores de texto do componente — `navigation/text/active` (#F0FCDD) e
 * `tab/fg/default` (#121E0F) — não existem como token semântico no DS; só como primitivas
 * (`brand-lime-medium-25` e `brand-dark-900`), fora de `@theme` e portanto sem utility. Ficam
 * nas semânticas mais próximas, `fg/on-action` (#ECFACA) e `fg/default` (#1C2E17). Ver
 * DS-GAPS.md.
 */
function Abas() {
  return (
    <TabsList className="sem-barra-de-rolagem w-full shrink-0 justify-start gap-2 overflow-x-auto rounded-none border-0 bg-transparent px-0 py-1">
      {ABAS.map(({ valor, rotulo }) => (
        <TabsTrigger
          key={valor}
          value={valor}
          className="text-fg-default rounded-xl px-3 py-2 data-[state=active]:bg-category-green-icon"
        >
          {rotulo}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}

/**
 * O "Vídeo de apresentação" (3248:2970): a miniatura com o botão de play e a legenda. Não há
 * vídeo no protótipo, então o botão existe e não toca nada.
 *
 * DS-GAP: `radius/xxl` (24px) fica em `rounded-2xl` (16px), o teto da escala do DS. Item 9
 * do DS-GAPS.md.
 */
function VideoApresentacao({ className }: { className: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          'bg-surface-muted border-outline-subtle flex w-full items-center justify-center rounded-2xl border',
          className,
        )}
      >
        <button
          type="button"
          aria-label="Assistir à apresentação de Daniele"
          className="bg-surface-base text-fg-default flex size-14 items-center justify-center rounded-full"
        >
          <PlayIcon className="size-6" />
        </button>
      </div>
      <p className="text-caption text-fg-subtle">{LEGENDA_VIDEO}</p>
    </div>
  )
}

export function DetalhesScreen() {

  useScreenSurface('surface-base')

  const { goNext } = useStepNavigation('detalhes')
  const navigate = useNavigate()
  const { search } = useLocation()
  const [aba, setAba] = useState('descricao')

  /*
    This is the first step of its own flow, so the generic `goBack` would fall through to the
    prototype index. It is reached from the Match results during onboarding and from Busca
    once the app exists, so back means back to whichever one opened it — the default keeps
    the onboarding behaviour for a cold deep-link. See `lib/origem.ts`.
  */
  const origem = lerOrigem(search, '/match/sessoes-recomendadas')
  // Com a régua na tela (fluxo aberto de dentro do app) o conteúdo vem depois dela.
  const comMenu = veioDoApp(search)
  const voltar = () => navigate(origem)
  const rotuloVoltar = ROTULO_VOLTAR[origem] ?? 'Voltar'

  const textoDescricao = (
    <>
      <div className="flex flex-col gap-5">
        {DESCRICAO.map((paragrafo) => (
          <p key={paragrafo.slice(0, 24)}>{paragrafo}</p>
        ))}
      </div>
      <p>{ASSINATURA}</p>
    </>
  )

  // Caption em `fg/subtle` para o nome do grupo, Body S em `fg/default` para cada item.
  const formacao = (
    <div className="flex flex-col gap-4">
      {FORMACAO.map(({ grupo, itens }) => (
        <div key={grupo} className="flex flex-col gap-1">
          <p className="text-caption text-fg-subtle">{grupo}</p>
          {itens.map((item) => (
            <p key={item} className="text-body-s text-fg-default">
              {item}
            </p>
          ))}
        </div>
      ))}
    </div>
  )

  const acoes = (
    <>
      <p className="text-label-s text-fg-subtle w-full text-center">{SESSAO.duracao}</p>
      <Button variant="contained" className="w-full" onClick={goNext}>
        Agendar com Daniele
      </Button>
      <Button
        variant="outlined"
        className="w-full"
        onClick={voltar}
        leadingIcon={<ArrowLeftIcon className="size-[18px]" />}
      >
        {rotuloVoltar}
      </Button>
    </>
  )

  return (
    <>
      {/* Mobile */}
      {/*
        O frame (1635:3027) prende as ações embaixo e rola só o conteúdo acima — ele desenha
        o esmaecido como um nó próprio, `scroll-fade` (2421:24399), a 85px do rodapé. Mesmo
        recurso dos passos de lista do Match. Não há campo de texto aqui, então a exceção ao
        `h-dvh overflow-hidden` que o CLAUDE.md abre por causa do teclado do iOS se aplica.
      */}
      <div className="bg-surface-base pt-safe px-safe flex h-dvh flex-col overflow-hidden lg:hidden">
        <ListaRolavel semBarra className="px-6">
          <div className="flex flex-col gap-6 py-6">
            <p className="text-label-l text-fg-default">{SESSAO.titulo}</p>
            <ProfissionalResumo {...SESSAO.profissional} />
            <Tabs value={aba} onValueChange={setAba} className="flex flex-col gap-4">
              <Abas />
              <TabsContent value="descricao">
                {/* No mobile a descrição vem direto depois do vídeo, sem "Sobre a sessão". */}
                <div className="text-body-s text-fg-muted flex flex-col gap-2">
                  <VideoApresentacao className="h-40" />
                  {textoDescricao}
                </div>
              </TabsContent>
              <TabsContent value="formacao">{formacao}</TabsContent>
              <TabsContent value="avaliacoes">
                <div className="flex flex-col">
                  {REVIEWS.map((review) => (
                    <CardReview key={review.nome} {...review} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="sessoes">
                <div className="flex flex-col gap-4">
                  {OUTRAS_SESSOES.map((outra) => (
                    <CardOutraSessao key={outra.titulo} {...outra} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ListaRolavel>

        <div className="pb-safe flex w-full flex-col gap-4 px-6 pt-3 [--pb-safe:0.75rem]">{acoes}</div>
      </div>

      {/* Desktop */}
      {/*
        A tela não rola: rola **só o conteúdo da aba**, na coluna da direita. A esquerda —
        título, profissional e o "Agendar com Daniele" — fica parada, e a fila de abas também,
        para a ação e a troca de aba não sumirem enquanto se lê.

        Isso exige a altura travada aqui e `min-h-0` em cada elo até a coluna: sem isso o
        `flex-1` não tem contra o que se medir e o contêiner cresce em vez de rolar — o
        mesmo encadeamento que os passos de lista do Match precisaram.
      */}
      <div className="bg-surface-base pt-safe px-safe hidden flex-col lg:flex lg:h-dvh lg:overflow-hidden">
        {/* Com a régua na tela o lockup já está nela. */}
        {comMenu ? null : (
          <header className="w-full px-8 py-8">
            <GuiaLockup height={18} className="text-fg-default" />
          </header>
        )}
        {/*
          1000 = 24 + 436 + 80 + 436 + 24, the measures of `profissionals` (1236:12522).
          O recuo da régua fica neste contêiner, não na raiz: lá `.px-safe` ganharia dele.
        */}
        <div className={cn('flex min-h-0 flex-1 flex-col', comMenu && 'lg:pl-[280px]')}>
          <div className="mx-auto flex min-h-0 w-full max-w-[1000px] flex-1 gap-20 px-6">
            <div className="flex w-[436px] shrink-0 flex-col gap-12 pb-12">
              <IconButton
                icon={<ArrowLeftIcon className="size-[18px]" />}
                aria-label={rotuloVoltar}
                onClick={voltar}
              />

              {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
              {/* Heading L (32/40), the same size the other split steps give this title. */}
              <h1 className="font-display text-heading-l text-fg-default">{SESSAO.titulo}</h1>
              <ProfissionalResumo {...SESSAO.profissional} />
              <div className="flex flex-col gap-4">
                <Button variant="contained" className="w-full" onClick={goNext}>
                  Agendar com Daniele
                </Button>
                <p className="text-label-s text-fg-subtle w-full text-center">{SESSAO.duracao}</p>
              </div>
            </div>

            {/* 64px entre a fila de abas e o conteúdo, o `space/layout/lg` de 3255:3277. */}
            <Tabs
              value={aba}
              onValueChange={setAba}
              className="flex min-h-0 w-[436px] min-w-0 flex-col gap-16"
            >
              <Abas />
              <ListaRolavel semBarra>
                <div className="pb-12">
                  <TabsContent value="descricao">
                    <div className="text-body-s text-fg-muted flex flex-col gap-2">
                      <VideoApresentacao className="h-[220px]" />
                      <h2 className="text-label-m text-fg-default">Sobre a sessão</h2>
                      {textoDescricao}
                    </div>
                  </TabsContent>
                  <TabsContent value="formacao">{formacao}</TabsContent>
                  <TabsContent value="avaliacoes">
                    <section className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h2 className="text-label-m text-fg-default">
                            Avaliações ({AVALIACOES_TOTAL})
                          </h2>
                          <p className="text-accent-rating text-label-m">
                            <span className="text-fg-muted mr-2">{AVALIACOES_MEDIA}</span>
                            <span aria-hidden>★ ★ ★ ★ ★</span>
                          </p>
                        </div>
                        <div className="flex flex-col">
                          {REVIEWS.slice(2, 4).map((review) => (
                            <CardReview key={review.nome} {...review} />
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="outlined"
                        size="small"
                        className="w-fit"
                        trailingIcon={<ArrowRightIcon className="size-[18px]" />}
                      >
                        Ver todas as avaliações
                      </Button>
                    </section>
                  </TabsContent>
                  <TabsContent value="sessoes">
                    <section className="flex flex-col gap-3">
                      <h2 className="text-label-m text-fg-muted">
                        Mais sessões oferecidas por Daniele
                      </h2>
                      {/*
                        O desktop desenha tipos diferentes do `card-profissional` na mesma
                        lista: Compact no primeiro, super-compact no segundo. Reproduzido como
                        está — ver SYNC-FIGMA.md.
                      */}
                      <div className="flex flex-col gap-[13px]">
                        {OUTRAS_SESSOES.map((outra, indice) => (
                          <CardOutraSessao key={outra.titulo} {...outra} detalhado={indice === 1} />
                        ))}
                      </div>
                    </section>
                  </TabsContent>
                </div>
              </ListaRolavel>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}
