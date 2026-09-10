import { Button, Textarea } from '@guia-da-alma/ds'
import { ArrowRightIcon } from 'lucide-react'

import { StepBody } from '@/components/layout/step-shell'
import { PularMatchButton } from '@/components/local/pular-match-button'

import { useMatch } from '../match-provider'
import { useStepNavigation } from '../use-step-navigation'

/**
 * Step 3 — nodes 1105:11342 (mobile) and 1134:2179 (desktop). The filled state, with its
 * extra primary action, is 1105:11501.
 */
export function InformacoesAdicionaisScreen() {
  const { goNext } = useStepNavigation('informacoes-adicionais')
  const { data, update } = useMatch()


  return (
    <StepBody
      title="Mais detalhes"
      subtitle="Isso irá ajudar a trazer resultados de profissionais que mais se encaixam com o seu perfil"
      footer={
        <>
          {/*
            Este passo é opcional — não há mínimo a atingir —, então o primário fica sempre
            ativo em vez de aparecer só depois que o campo tem texto. O Figma só o desenha no
            frame preenchido. Ver SYNC-FIGMA.md.
          */}
          <Button
            variant="contained"
            className="w-full"
            onClick={goNext}
            trailingIcon={<ArrowRightIcon className="size-[18px]" />}
          >
            Escolher abordagem
          </Button>

          <Button variant="outlined" className="w-full" onClick={goNext}>
            Pular essa parte
          </Button>

          <PularMatchButton />
        </>
      }
    >
      {/*
        DS-GAP: Figma draws this field on `surface/faint` at 14px over 120px of height; the
        DS `Textarea` is `surface/base` at `text-body-m` (16px) with an 80px minimum. Only
        the height is matched here, through `rows` — a native prop, not a style override.
        See DS-GAPS.md.
      */}
      <Textarea
        rows={4}
        value={data.detalhes}
        onChange={(event) => update({ detalhes: event.target.value })}
        placeholder="Descreva com as suas palavras o seu momento atual"
        aria-label="Descreva o seu momento atual"
      />
    </StepBody>
  )
}
