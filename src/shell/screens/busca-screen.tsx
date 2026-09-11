import { useState } from 'react'

import { Button, Chip, Input } from '@guia-da-alma/ds'
import { ChevronDownIcon, SearchIcon } from 'lucide-react'

import { CardProfissional } from '@/components/local/card-profissional'
import { PainelFiltro } from '@/components/local/painel-filtro'
import {
  ESPECIALIDADES,
  FILTROS_VAZIOS,
  TEMAS,
  filtrar,
  type FiltrosBusca,
} from '@/shell/catalogo'

type Grupo = 'temas' | 'especialidades'

const GRUPOS: Record<Grupo, { titulo: string; opcoes: readonly string[] }> = {
  temas: { titulo: 'Temas', opcoes: TEMAS },
  especialidades: { titulo: 'Especialidades', opcoes: ESPECIALIDADES },
}

/**
 * Busca — `1316:1891` / `1526:908` empty, `1324:16928` and `1324:16272` with the Temas
 * panel open, `1324:16170` / `1526:1003` with filters applied.
 *
 * The four frames are states of one screen, so they are one component: the filter buttons
 * carry a count once a group is applied, "Mais recomendadas" gives way to "Filtros
 * aplicados" and the removable chips, and the list is filtered for real by
 * `shell/catalogo.ts` rather than swapped for a second hard-coded set.
 *
 * The cards are `card-profissional` — the same component the Match results use, and the
 * same composition of it, so `CardProfissional` is reused rather than redrawn.
 */
export function BuscaScreen() {
  const [filtros, setFiltros] = useState<FiltrosBusca>(FILTROS_VAZIOS)
  const [painel, setPainel] = useState<Grupo | null>(null)

  const resultados = filtrar(filtros)
  const aplicados = [...filtros.temas, ...filtros.especialidades]

  const remover = (valor: string) =>
    setFiltros((atual) => ({
      ...atual,
      temas: atual.temas.filter((item) => item !== valor),
      especialidades: atual.especialidades.filter((item) => item !== valor),
    }))

  return (
    <div className="flex flex-col gap-6 px-4 pt-6 lg:px-0 lg:pt-12">
      {/*
        DS-GAP: `Input` has no slot for a leading icon, so the search glyph is positioned
        over it and the field gets the padding to clear it. Its placeholder is also Body M
        where the design sets Body S. See DS-GAPS.md.
      */}
      <div className="relative w-full">
        <SearchIcon
          className="text-icon-subtle pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden
        />
        <Input
          type="search"
          aria-label="Busque pelo terapeuta ou terapia"
          placeholder="Busque pelo terapeuta ou terapia"
          className="pl-9"
          value={filtros.termo}
          onChange={(evento) => setFiltros({ ...filtros, termo: evento.target.value })}
        />
      </div>

      <div className="flex items-center gap-2">
        {(Object.keys(GRUPOS) as Grupo[]).map((grupo) => {
          const quantidade = filtros[grupo].length

          return (
            <Button
              key={grupo}
              variant="outlined"
              trailingIcon={<ChevronDownIcon className="size-4" />}
              onClick={() => setPainel(grupo)}
            >
              {GRUPOS[grupo].titulo}
              {quantidade > 0 ? ` (${quantidade})` : ''}
            </Button>
          )
        })}
      </div>

      <div className="flex w-full flex-col gap-4">
        {aplicados.length > 0 ? (
          <>
            <p className="text-label-s text-fg-subtle">Filtros aplicados</p>
            <div className="flex flex-wrap gap-2">
              {aplicados.map((valor) => (
                <Chip key={valor} color="green" onDismiss={() => remover(valor)}>
                  {valor}
                </Chip>
              ))}
            </div>
          </>
        ) : (
          <p className="text-label-s text-fg-subtle">Mais recomendadas</p>
        )}

        {resultados.length === 0 ? (
          // Not drawn in the file: every results frame has matches. See SYNC-FIGMA.md.
          <p className="text-body-s text-fg-subtle">
            Nenhum profissional encontrado com esses filtros.
          </p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {resultados.map((profissional) => (
              <CardProfissional key={profissional.nome} {...profissional} />
            ))}
          </div>
        )}
      </div>

      {painel ? (
        <PainelFiltro
          titulo={GRUPOS[painel].titulo}
          opcoes={GRUPOS[painel].opcoes}
          selecionados={filtros[painel]}
          onFechar={() => setPainel(null)}
          onAplicar={(selecionados) => {
            setFiltros((atual) => ({ ...atual, [painel]: selecionados }))
            setPainel(null)
          }}
        />
      ) : null}
    </div>
  )
}
