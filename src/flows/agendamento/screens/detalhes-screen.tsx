import { useState } from 'react'

import { Button, IconButton, Tabs, TabsContent, TabsList, TabsTrigger } from '@guia-da-alma/ds'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'

import { GuiaLockup } from '@/components/local/guia-lockup'
import { CardOutraSessao, type OutraSessao } from '@/components/local/card-outra-sessao'
import { CardReview, type Review } from '@/components/local/card-review'
import { ProfissionalResumo } from '@/components/local/profissional-resumo'

import { SESSAO } from '../agendamento-provider'
import { useStepNavigation } from '../use-step-navigation'

import { useScreenSurface } from '@/lib/use-screen-surface'
import { useLockedDocumentScroll } from '@/lib/use-locked-document-scroll'

/**
 * Step 1 — nodes 1184:5171 (mobile) and 1236:12522 (desktop); 1184:5198 and 1184:5259 are
 * the other two mobile tabs, 1279:13740 the desktop scrolled.
 *
 * The breakpoints are not one layout reflowed, they are two designs. Mobile stacks a
 * 20px Label L title, the professional, then a scrollable tab bar switching between
 * Descrição / Avaliações / Mais sessões / Certificações. Desktop drops the tabs entirely
 * and splits into two columns: the title in *display serif* with the professional and the
 * call to action on the left, every section stacked down the right.
 *
 * Desktop also carries data mobile does not — an "Avaliações (38)" count and a 4,5
 * average. Those exist only there, so they render only there.
 */

const DESCRICAO = [
  'Se você sente que carrega um peso que não sabe nomear, uma inquietação que insiste em voltar, saiba que não precisa enfrentar isso sozinho(a). Na psicoterapia analítica/junguiana, vamos explorar juntos os símbolos, sonhos e padrões que moldam sua história, criando um espaço seguro e acolhedor para mulheres e pessoas LGBT+.',
  'Acredito que o autoconhecimento é o caminho para relações mais saudáveis — com o mundo e com você mesma(o). Terei o cuidado de caminhar nesse processo ao seu lado, no seu tempo.',
]

const ASSINATURA = 'Daniele Tramontina – Psicóloga clínica'

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

const OUTRAS_SESSOES: OutraSessao[] = [
  {
    titulo: 'Sessão de Casal | terapia para relacionamentos e comunicação',
    disponibilidade: 'Disponível amanhã às • 10:00',
  },
  {
    titulo: 'Orientação Vocacional | autoconhecimento e escolhas de carreira',
    disponibilidade: 'Disponível sexta às • 09:00',
  },
]

/** Only on desktop: the header above the review list there states both. */
const AVALIACOES_TOTAL = 38
const AVALIACOES_MEDIA = '4,5'

export function DetalhesScreen() {
  // Fixed height with an internal scroll area: the page itself must not scroll, or the
  // keyboard drags the header out of place. See the hook.
  useLockedDocumentScroll()

  useScreenSurface('surface-base')

  const { goNext } = useStepNavigation('detalhes')
  const navigate = useNavigate()
  const { search } = useLocation()
  const [aba, setAba] = useState('descricao')

  /*
    This is the first step of its own flow, so the generic `goBack` would fall through to
    the prototype index. The screen is always reached from the Match results, so back
    means back to that list.
  */
  const voltarParaResultados = () => navigate(`/match/sessoes-recomendadas${search}`)

  const descricao = (
    <div className="text-body-s text-fg-muted flex flex-col gap-2">
      {DESCRICAO.map((paragrafo) => (
        <p key={paragrafo.slice(0, 24)}>{paragrafo}</p>
      ))}
      <p>{ASSINATURA}</p>
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
        onClick={voltarParaResultados}
        leadingIcon={<ArrowLeftIcon className="size-[18px]" />}
      >
        Voltar para as sessões
      </Button>
    </>
  )

  return (
    <>
      {/* Mobile */}
      <div className="bg-surface-base pt-safe px-safe flex h-app flex-col lg:hidden">
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
          <p className="text-label-l text-fg-default">{SESSAO.titulo}</p>
          <ProfissionalResumo {...SESSAO.profissional} />
          <Tabs value={aba} onValueChange={setAba} className="flex flex-col gap-4">
            {/*
              DS-GAP: Figma draws these as free pills on white with the row scrolling
              sideways, and paints the active one `category/green/icon` (#466700) with
              `navigation/text/active` text. `TabsList` wraps them in a bordered
              `surface-subtle` container the design does not have, and `TabsTrigger` paints
              the active tab `action-primary` (#1c2e17). Left as the DS renders them.
              See DS-GAPS.md.
            */}
            <TabsList className="overflow-x-auto">
              <TabsTrigger value="descricao">Descrição</TabsTrigger>
              <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
              <TabsTrigger value="sessoes">Mais sessões</TabsTrigger>
              <TabsTrigger value="certificacoes">Certificações</TabsTrigger>
            </TabsList>
            <TabsContent value="descricao">{descricao}</TabsContent>
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
            <TabsContent value="certificacoes">
              {/* The tab is drawn on all three frames, but no frame defines its content. */}
              <p className="text-body-s text-fg-subtle">
                Sem conteúdo desenhado para esta aba no Figma.
              </p>
            </TabsContent>
          </Tabs>
        </div>
        <div className="pb-safe flex w-full flex-col gap-4 px-6 pt-3 [--pb-safe:0.75rem]">{acoes}</div>
      </div>

      {/* Desktop */}
      <div className="bg-surface-base pt-safe px-safe hidden h-app flex-col lg:flex">
        <header className="w-full px-8 py-8">
          <GuiaLockup height={18} className="text-fg-default" />
        </header>
        <div className="flex min-h-0 flex-1 justify-center gap-16 overflow-hidden px-9 pb-12">
          <div className="flex w-full max-w-[450px] flex-col gap-8">
            <IconButton
              icon={<ArrowLeftIcon className="size-[18px]" />}
              aria-label="Voltar para as sessões"
              onClick={voltarParaResultados}
            />

            {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
            <h1 className="font-display text-display-s text-fg-default">{SESSAO.titulo}</h1>
            <ProfissionalResumo {...SESSAO.profissional} />
            <div className="flex flex-col gap-4">
              <Button variant="contained" className="w-full" onClick={goNext}>
                Agendar com Daniele
              </Button>
              <p className="text-label-s text-fg-subtle w-full text-center">{SESSAO.duracao}</p>
            </div>
          </div>
          <div className="flex w-full max-w-[450px] flex-col gap-12 overflow-y-auto">
            <section className="flex flex-col gap-4">
              <h2 className="text-label-m text-fg-default">Sobre a sessão</h2>
              {descricao}
            </section>
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-label-m text-fg-default">Avaliações ({AVALIACOES_TOTAL})</h2>
                <p className="text-accent-rating text-label-m">
                  <span className="text-fg-default mr-2">{AVALIACOES_MEDIA}</span>
                  <span aria-hidden>★ ★ ★ ★ ★</span>
                </p>
              </div>
              <div className="flex flex-col">
                {REVIEWS.slice(2, 4).map((review) => (
                  <CardReview key={review.nome} {...review} />
                ))}
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
            <section className="flex flex-col gap-4">
              <h2 className="text-label-m text-fg-default">Mais sessões oferecidas por Daniele</h2>
              {OUTRAS_SESSOES.map((outra) => (
                <CardOutraSessao key={outra.titulo} {...outra} />
              ))}
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
