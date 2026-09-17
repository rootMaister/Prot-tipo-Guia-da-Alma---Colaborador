import { Button } from '@guia-da-alma/ds'
import { ArrowRightIcon } from 'lucide-react'
import { useNavigate } from 'react-router'

import { OrbeHumor } from '@/components/local/orbe-humor'
import { escalaAntiga } from '@/flows/diario/humores'

/**
 * "O seu diário agora fala em dias, não em carinhas" — `2862:2246` / `2862:2349`, seção
 * "3 - O que muda? (comunicação para usuários atuais)".
 *
 * É o aviso para quem já usava o diário com as carinhas. Não é item de menu: chega-se a ele
 * pela nota "Seus registros antigos foram renomeados para a escala nova", na lista de
 * registros. Quando ele apareceria de verdade — uma vez, na primeira visita depois da
 * mudança — não está desenhado. Ver SYNC-FIGMA.md.
 */
export function AvisoEscalaScreen() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-8 px-6 pt-8 pb-12 lg:px-0 lg:pt-20">
      <header className="flex flex-col gap-2">
        {/* No weight utility: Calma Serif ships Regular only — see styles/index.css. */}
        <h1 className="font-display text-heading-l text-fg-default">
          O seu diário agora fala em dias, não em carinhas
        </h1>
        <p className="text-body-s text-fg-subtle">
          Trocamos as carinhas por nomes que descrevem como foi o seu dia. Seus registros
          continuam os mesmos, só ganharam um nome novo.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-label-m text-fg-muted">Antes e agora</h2>

        <ul className="bg-surface-base border-outline-subtle flex flex-col rounded-2xl border">
          {escalaAntiga.map((linha, indice) => (
            <li
              key={linha.antes}
              className="border-outline-subtle flex items-center gap-3 border-b p-4 last:border-b-0"
            >
              <span aria-hidden className="text-heading-s w-8 text-center">
                {linha.emoji}
              </span>
              <span className="text-body-s text-fg-subtle flex-1">{linha.antes}</span>

              <ArrowRightIcon aria-hidden className="text-fg-subtle size-4 shrink-0" />

              <span className="flex flex-1 items-center justify-end gap-2">
                <OrbeHumor valor={indice} tamanho={28} />
                <span className="text-label-s text-fg-default">{linha.agora}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col gap-3 lg:flex-row-reverse lg:justify-end">
        <Button
          variant="contained"
          className="w-full lg:w-auto"
          onClick={() => navigate('/app/diario')}
        >
          Entendi
        </Button>
        <Button
          variant="text"
          className="w-full lg:w-auto"
          onClick={() => navigate('/app/diario')}
        >
          Ver meus registros
        </Button>
      </div>
    </div>
  )
}
