import { useState } from 'react'

import { Button, cn } from '@guia-da-alma/ds'

import { ranking, SUA_POSICAO, formatarNumero } from '@/shell/pontos'
import { useConta } from '@/state/conta-provider'

/**
 * "Ranking · Guia da Alma" — `2564:321` no mobile, a coluna da direita no desktop (`2552:4`).
 *
 * Um desenho em dois tamanhos: o mobile lista cinco posições e escreve "Nível 4" por extenso;
 * o desktop lista dez, põe um cabeçalho de colunas (#, Nome, Nível) e deixa só o número. A
 * linha de "você" fica destacada em `surface/brand-subtle` nos dois, sempre em 12º.
 *
 * As duas abas ("Este mês" e "Acumulado") existem no desenho com uma lista só — a de
 * "Acumulado" não é desenhada. Aqui as duas mostram a mesma lista. Ver SYNC-FIGMA.md.
 */
export function RankingPontos() {
  const { conta } = useConta()
  const [periodo, setPeriodo] = useState<'mes' | 'acumulado'>('mes')

  const voce = {
    posicao: SUA_POSICAO,
    nome: `${conta.nome} ${conta.sobrenome} (você)`,
    pontos: conta.pontos,
    nivel: conta.nivel,
  }

  return (
    <section className="bg-surface-base border-outline-subtle flex flex-col gap-4 rounded-2xl border p-4">
      <h2 className="text-label-m text-fg-muted">Ranking · Guia da Alma</h2>

      {/*
        DS-GAP: as abas do arquivo são pílulas soltas, e o `TabsList` do DS embrulha os botões
        numa caixa com borda e `surface/subtle`; o ativo também é `action/primary` (#1C2E17) e
        não o `tab/background-item/active` (#466700) que o Figma pinta — token que o DS não
        expõe. Como são duas abas com a mesma lista, aqui elas são botões simples em vez de
        `Tabs`, que traria estado de rota e foco para nada. Ver DS-GAPS.md.
      */}
      <div className="flex gap-1" role="group" aria-label="Período do ranking">
        <AbaPeriodo ativo={periodo === 'mes'} onClick={() => setPeriodo('mes')}>
          Este mês
        </AbaPeriodo>
        <AbaPeriodo ativo={periodo === 'acumulado'} onClick={() => setPeriodo('acumulado')}>
          Acumulado
        </AbaPeriodo>
      </div>

      <ol className="flex flex-col gap-1">
        {/* Só o desktop desenha o cabeçalho de colunas. */}
        <li
          aria-hidden
          className="text-caption text-fg-subtle hidden gap-4 px-3 py-2 lg:flex"
        >
          <span className="w-7">#</span>
          <span className="flex-1">Nome</span>
          <span>Nível</span>
        </li>

        {ranking.map((posicao) => (
          <li
            key={posicao.posicao}
            // O mobile mostra cinco; o desktop, dez.
            className={cn(
              'flex items-center gap-4 px-3 py-2',
              posicao.posicao > 5 && 'hidden lg:flex',
            )}
          >
            <Linha {...posicao} />
          </li>
        ))}

        <li className="bg-surface-brand-subtle flex items-center gap-4 rounded-2xl px-3 py-2">
          <Linha {...voce} />
        </li>
      </ol>

      {/* Não há tela de ranking completo no arquivo — o botão aparece e não navega. */}
      <Button variant="outlined" className="w-full" aria-disabled="true">
        Ver ranking completo
      </Button>
    </section>
  )
}

function Linha({
  posicao,
  nome,
  pontos,
  nivel,
}: {
  posicao: number
  nome: string
  pontos: number
  nivel: number
}) {
  return (
    <>
      <span className="text-label-s text-fg-muted w-7">{posicao}º</span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-label-s text-fg-muted truncate">{nome}</span>
        <span className="text-caption text-fg-subtle">{formatarNumero(pontos)} pontos</span>
      </span>
      {/* Por extenso no mobile, só o número no desktop — é assim nos dois frames. */}
      <span className="text-caption text-fg-subtle">
        <span className="lg:hidden">Nível </span>
        {nivel}
      </span>
    </>
  )
}

function AbaPeriodo({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={cn(
        'text-label-s rounded-xl px-4 py-2 font-semibold transition-colors duration-150 ease-out',
        ativo
          ? 'bg-action-primary text-fg-on-action'
          : 'text-fg-default hover:bg-surface-subtle',
      )}
    >
      {children}
    </button>
  )
}
