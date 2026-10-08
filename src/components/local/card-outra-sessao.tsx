import { Button, cn } from '@guia-da-alma/ds'

import { ProfissionalResumo, type Profissional } from './profissional-resumo'

export type OutraSessao = {
  titulo: string
  disponibilidade: string
  profissional: Profissional
}

/**
 * Uma sessão de "Mais sessões" no Detalhes da sessão (1184:5259, 3255:3336) — instâncias do
 * `card-profissional` (1173:4573) em dois dos seus tipos:
 *
 * - **Compact** (padrão): a foto de 56px ao lado do título, sobre um degradê que sobe de
 *   `surface/faint` para `#ECEFED`. É o que o mobile desenha nos dois cartões e o desktop no
 *   primeiro.
 * - **super-compact** (`detalhado`): título em cima, depois foto, nome, CRP e avaliação, e o
 *   botão alinhado à direita, sobre `surface/faint` liso. Só o segundo cartão do desktop.
 *
 * DS-GAP: o degradê termina em `brand-dark-medium-50`, primitiva fora de `@theme` e sem
 * utility — daí a variável pelo nome, como no `card-profissional`. E `radius/xxl` (24px)
 * fica em `rounded-2xl` (16px), o teto da escala do DS. Itens 9 e 33 do DS-GAPS.md.
 */
export function CardOutraSessao({
  titulo,
  disponibilidade,
  profissional,
  detalhado,
}: OutraSessao & { detalhado?: boolean }) {
  // DS-GAP: Inter Tight Bold 12/18, peso avulso sem estilo nomeado — ver `card-profissional`.
  const linhaDisponibilidade = (
    <p className="text-caption text-fg-brand-accent font-bold">{disponibilidade}</p>
  )
  const verDetalhes = (
    <Button variant="outlined" size="small">
      Ver detalhes
    </Button>
  )

  return (
    <div
      className={cn(
        'border-outline-subtle flex w-full flex-col gap-2 rounded-2xl border p-3',
        detalhado
          ? 'bg-surface-faint'
          : 'from-surface-faint bg-gradient-to-t to-[var(--color-brand-dark-medium-50)]',
      )}
    >
      {detalhado ? (
        <>
          <p className="text-label-s text-fg-default px-1 py-2">{titulo}</p>
          <ProfissionalResumo {...profissional} compacto />
          <div className="flex w-full flex-col items-end gap-4">
            <div className="w-full">{linhaDisponibilidade}</div>
            {verDetalhes}
          </div>
        </>
      ) : (
        <>
          <div className="flex w-full items-center gap-4">
            <img
              src={profissional.avatar}
              alt=""
              className="border-outline-avatar size-14 shrink-0 rounded-xl border object-cover"
            />
            <p className="text-label-s text-fg-default min-w-0 flex-1 px-1 py-2">{titulo}</p>
          </div>
          <div className="flex w-full items-center justify-between pl-3">
            {linhaDisponibilidade}
            {verDetalhes}
          </div>
        </>
      )}
    </div>
  )
}
