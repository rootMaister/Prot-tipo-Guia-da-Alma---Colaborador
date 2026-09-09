import { Button } from '@guia-da-alma/ds'
import { ArrowRightIcon, CheckIcon } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'

import { FeatureShell } from '@/components/layout/feature-shell'

export function AprovadoScreen() {
  const navigate = useNavigate()
  const { search } = useLocation()

  // Last step of Cadastro, and the seam with the next flow: the Match de terapia section
  // opens straight off this screen's call to action.
  const goToMatch = () => navigate(`/match/inicio${search}`)

  return (
    <FeatureShell
      icon={CheckIcon}
      eyebrow="Tudo certo por aqui"
      title={
        <>
          Perfil
          <br />
          aprovado
        </>
      }
      footer={
        <Button
          variant="contained"
          className="w-full"
          onClick={goToMatch}
          trailingIcon={<ArrowRightIcon className="size-[18px]" />}
        >
          Agendar primeiro atendimento
        </Button>
      }
    />
  )
}
