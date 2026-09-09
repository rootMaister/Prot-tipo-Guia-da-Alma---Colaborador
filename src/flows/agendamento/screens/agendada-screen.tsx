import { Button } from '@guia-da-alma/ds'
import { CheckIcon } from 'lucide-react'

import { FeatureShell } from '@/components/layout/feature-shell'

import { useStepNavigation } from '../use-step-navigation'

/**
 * Step 5 — nodes 1236:11034 (mobile) and 1279:15911 (desktop).
 *
 * The same celebratory shell as "Empresa encontrada" and "Perfil aprovado" in Cadastro —
 * which is literally where the desktop frame's name comes from, since it is still called
 * "[Desktop] 3. Empresa encontrada" in Figma. This one drops the eyebrow line.
 */
export function AgendadaScreen() {
  // Last step of the flow: `goNext` has nowhere to go, so it returns to the index.
  const { goNext } = useStepNavigation('agendada')

  return (
    <FeatureShell
      icon={CheckIcon}
      title={
        <>
          Sessão
          <br />
          Agendada
        </>
      }
      footer={
        <Button variant="contained" className="w-full" onClick={goNext}>
          Continuar
        </Button>
      }
    />
  )
}
