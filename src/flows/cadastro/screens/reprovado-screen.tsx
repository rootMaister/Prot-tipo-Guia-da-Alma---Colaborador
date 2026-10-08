import { Button } from '@guia-da-alma/ds'
import { XIcon } from 'lucide-react'

import { FeatureShell } from '@/components/layout/feature-shell'
import { abrirCentralDeAjuda } from '@/lib/central-de-ajuda'

/**
 * "Acesso recusado" — `3689:699` / `3689:709`. O outro desfecho do "Em análise", no lugar do
 * "Perfil aprovado", com o mesmo layout em sunflower.
 *
 * É um fim de linha: o frame não desenha volta nem "revisar dados", só a central de ajuda.
 */
export function ReprovadoScreen() {
  return (
    <FeatureShell
      tom="sunflower"
      icon={XIcon}
      title={
        <>
          {/* Duas linhas no mobile, uma no desktop — como os dois frames. */}
          Acesso <br className="lg:hidden" />
          recusado
        </>
      }
      legenda="Fale com o responsável para entender o que aconteceu."
      footer={
        // Variant=Text, Size=Large no arquivo, na largura toda.
        <Button variant="text" className="w-full" onClick={abrirCentralDeAjuda}>
          Acesse a central de ajuda
        </Button>
      }
    />
  )
}
