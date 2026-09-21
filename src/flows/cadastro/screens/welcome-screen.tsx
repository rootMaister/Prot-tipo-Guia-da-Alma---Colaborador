import { Button } from '@guia-da-alma/ds'
import { ArrowRightIcon } from 'lucide-react'

import { AtmosferaAnimada } from '@/components/local/atmosfera-animada'
import { GuiaLockup } from '@/components/local/guia-lockup'
import { useScreenSurface } from '@/lib/use-screen-surface'

import { useStepNavigation } from '../use-step-navigation'

const TITULO_MOBILE = ['Agora você tem', 'terapia online', 'quando precisar.']
/**
 * O desktop quebra em duas linhas, depois de "terapia online".
 *
 * A quebra é **escrita**, não deixada para o navegador: solto, o texto quebrava onde a
 * largura mandasse — a 1440 sobrava um "precisar." sozinho na segunda linha, a 1920 virava
 * uma linha só e a 1280 caía por acaso no lugar certo. A manchete é a peça de tipografia da
 * tela; onde ela quebra é decisão de desenho, igual ao mobile logo acima.
 */
const TITULO_DESKTOP = ['Agora você tem terapia online', 'quando precisar.']
const SUBTITULO = 'Encontre sua empresa para acessar seu benefício'

/**
 * Entry screen — nodes 2028:647 ("[Mobile] Welcome — A / Imersiva") e 2020:647
 * ("[Desktop] 1. Welcome").
 *
 * Redesenhada no Figma: os nodes antigos (779:415 / 826:3114) não existem mais, e com eles
 * foi embora o painel escuro invertido do desktop — que era a única exceção aberta à regra de
 * não mascarar cor do DS com `className` (item 12 do DS-GAPS.md). Agora as duas telas são
 * claras, sobre `surface/subtle`.
 *
 * Continuam sendo desenhos diferentes, não um reflow: no mobile a manchete e o subtítulo
 * ficam juntos no rodapé, sobre a atmosfera que cobre a tela inteira; no desktop a atmosfera
 * vira um painel editorial de 688px à esquerda com só a manchete dentro, e o subtítulo vai
 * para a coluna de ações à direita. A manchete também muda de tamanho e de quebra: Heading L
 * em três linhas no mobile, Heading M em duas no desktop.
 *
 * A "atmosfera" é a mesma animação nos dois: o campo de cor de `atmosfera-animada.tsx`,
 * desenhado a partir da receita `blend`, no lugar do preenchimento de vídeo que o Figma usa
 * no painel (`2020:649`) e no fundo do mobile (`2028:647`).
 *
 * A receita em teste é escura — três das quatro paradas são verdes fechados —, então o texto
 * sobre ela é claro (`fg/on-action`) nos dois breakpoints. Na coluna da direita do desktop,
 * que continua sobre `surface/subtle`, o texto segue escuro.
 *
 * "Entrar" é renderizado e inerte: não existe fluxo de Login no protótipo.
 */
export function WelcomeScreen() {
  useScreenSurface('surface-subtle')

  const { goNext } = useStepNavigation('welcome')

  const acoes = (
    <div className="flex w-full flex-col gap-4">
      <Button
        variant="contained"
        className="w-full"
        onClick={goNext}
        trailingIcon={<ArrowRightIcon className="size-[18px]" />}
      >
        Identifique a sua empresa
      </Button>

      {/*
        Este bloco é renderizado nos dois breakpoints: no mobile ele fica sobre a animação
        escura, e no desktop sobre o `surface/subtle` claro da coluna da direita. Daí a cor
        virar no `lg:`.

        DS-GAP: o `Button variant="text"` pinta `action/tertiary`, que some sobre a paleta
        escura desta receita, e o DS não tem variante clara para texto. A cor vai por
        `className` — é a exceção que o item 12 do DS-GAPS.md já abre para esta tela,
        agora também no mobile.
      */}
      <div className="flex w-full items-center justify-center gap-1">
        <p className="text-body-s text-fg-on-action lg:text-action-tertiary">Já tem uma conta?</p>
        <Button
          variant="text"
          aria-disabled="true"
          className="text-fg-on-action lg:text-action-tertiary"
        >
          Entrar
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile */}
      {/*
        Os 96px do topo e os 24 das laterais vão nas variáveis das utilities de área segura,
        não em `pt-24`/`px-6`: elas são CSS escrito depois do Tailwind e ganhariam desses.
        Ver a nota em `styles/index.css` e em CLAUDE.md.
      */}
      <div className="bg-surface-subtle pt-safe px-safe pb-safe relative isolate flex min-h-dvh flex-col gap-8 overflow-hidden lg:hidden [--pb-safe:1.5rem] [--pt-safe:6rem] [--px-safe:1.5rem]">
        {/* Sangra a tela inteira, por trás de tudo. A grade é retrato, como o aparelho. */}
        <AtmosferaAnimada
          proporcao={393 / 852}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        />

        {/*
          O véu que segura o contraste do texto. A receita é um campo *em movimento*: a
          mesma linha da manchete passa por uma parada clara e por uma escura ao longo do
          loop, então o texto claro não pode depender do quadro que estiver passando. Os
          dois véus escurecem só onde há texto — o topo, do lockup, e os três quintos de
          baixo, com a manchete, o subtítulo e as ações — e deixam o meio da arte intacto.

          São dois elementos, e não um degradê de quatro paradas, porque cada ponta precisa
          de altura e intensidade próprias. Ficam em `z-0` como a animação: vêm depois dela
          no DOM, então pintam por cima, e seguem abaixo do `z-10` do conteúdo.

          DS-GAP: o degradê vai em `style`, e não em `from-brand-dark-950/80`, porque
          `brand-dark-*` é primitiva declarada fora de um bloco `@theme` — o Tailwind não
          gera utility de cor para ela, e a classe compila para `rgba(0,0,0,0)`, sem erro e
          sem aviso. Medido: os dois véus nasceram 100% transparentes. Mesma situação do
          degradê do `card-profissional` e da barra de navegação. Ver DS-GAPS.md.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-48"
          style={{
            background:
              'linear-gradient(to bottom, color-mix(in oklab, var(--color-brand-dark-950) 55%, transparent), transparent)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-3/5"
          style={{
            background:
              'linear-gradient(to top, color-mix(in oklab, var(--color-brand-dark-950) 80%, transparent), transparent)',
          }}
        />

        <GuiaLockup height={25} className="text-fg-on-action relative z-10" />

        <div className="relative z-10 flex flex-1 flex-col justify-end gap-5 pb-2">
          {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
          <h1 className="font-display text-heading-l text-fg-on-action">
            {TITULO_MOBILE.map((linha) => (
              <span key={linha} className="block">
                {linha}
              </span>
            ))}
          </h1>

          <p className="text-body-s text-fg-on-action">{SUBTITULO}</p>
        </div>

        <div className="relative z-10">{acoes}</div>
      </div>

      {/* Desktop */}
      <div className="bg-surface-subtle pt-safe px-safe hidden min-h-dvh items-start justify-between lg:flex">
        {/*
          O painel ocupa metade da tela, e não os 688px fixos do frame: assim ele segue
          sendo metade em qualquer largura, não só a 1440 (onde 688 + 32 de respiro davam
          exatamente 50%).
        */}
        <div className="flex h-dvh w-1/2 shrink-0 items-center p-4">
          <div className="relative flex h-full w-full flex-col justify-end gap-5 overflow-hidden rounded-2xl px-16 pt-24 pb-[72px]">
            {/* Metade de 1440 por uma tela de 1000: a grade nasce quase quadrada. */}
            <AtmosferaAnimada
              proporcao={720 / 1000}
              className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
            />

            <h1 className="font-display text-heading-m text-fg-on-action relative z-10">
              {TITULO_DESKTOP.map((linha) => (
                <span key={linha} className="block">
                  {linha}
                </span>
              ))}
            </h1>
          </div>
        </div>

        <div className="flex h-dvh min-w-0 flex-1 flex-col items-center justify-center gap-12 px-8 py-16">
          <div className="flex w-[400px] max-w-full flex-col gap-8">
            <GuiaLockup height={25} className="text-action-tertiary" />

            <div className="flex w-full flex-col gap-8">
              <p className="text-body-s text-action-tertiary">{SUBTITULO}</p>
              {acoes}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
