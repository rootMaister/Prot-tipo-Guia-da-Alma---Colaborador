import { onboarding } from '@/analytics/posthog'

import { useState } from 'react'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@guia-da-alma/ds'
import { useLocation, useNavigate } from 'react-router'

import { lerOrigem } from '@/lib/origem'

/**
 * The "Pular match" action, which appears in the footer of every questionnaire screen.
 *
 * Skipping loses whatever was answered so far, so it asks first — added in review. The
 * copy is the reviewer's, reproduced verbatim.
 *
 * Confirming leaves the flow for the Home, which is where someone who skips the match
 * lands — it draws the Match banner precisely for them.
 */
export function PularMatchButton() {
  const [aberto, setAberto] = useState(false)
  const navigate = useNavigate()
  const { search } = useLocation()

  return (
    <>
      <Button variant="text" className="w-full" onClick={() => setAberto(true)}>
        Pular match
      </Button>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deseja pular o match de terapia?</DialogTitle>
            <DialogDescription>Você poderá realiza-lo outra hora.</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outlined" onClick={() => setAberto(false)}>
              Voltar
            </Button>
            <Button variant="contained" onClick={() => { onboarding.exit('skip_match'); navigate(lerOrigem(search, '/app/inicio')) }}>
              Pular match
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
