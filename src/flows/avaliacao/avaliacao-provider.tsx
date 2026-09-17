import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

import type { StepSlug } from './steps'

/** The 1–5 scale of questions 1 and 2, as drawn: a circled digit, two spaces, the word. */
export const ESCALA = [
  { valor: '1', rotulo: 'Nada', marcador: '①' },
  { valor: '2', rotulo: 'Pouco', marcador: '②' },
  { valor: '3', rotulo: 'Mais ou menos', marcador: '③' },
  { valor: '4', rotulo: 'Bastante', marcador: '④' },
  { valor: '5', rotulo: 'Totalmente', marcador: '⑤' },
] as const

export const QUALIDADE_CHAMADA = [
  { valor: 'ok', rotulo: 'Sim, tudo certo' },
  { valor: 'pequenos', rotulo: 'Tive pequenos problemas, mas consegui acompanhar' },
  { valor: 'serios', rotulo: 'Tive problemas sérios que prejudicaram a sessão' },
] as const

export type QualidadeChamada = (typeof QUALIDADE_CHAMADA)[number]['valor']

/**
 * The file draws two rating states: 2b, "comentário opcional", for 4–5 stars, and 2c,
 * "comentário obrigatório", whose helper spells the rule out — "Comentário obrigatório para
 * notas de 1 a 3."
 */
export const NOTA_MINIMA_SEM_COMENTARIO = 4

export type AvaliacaoData = {
  acolhimento: string | null
  reflexao: string | null
  chamada: QualidadeChamada | null
  nota: number | null
  comentario: string
}

const VAZIO: AvaliacaoData = {
  acolhimento: null,
  reflexao: null,
  chamada: null,
  nota: null,
  comentario: '',
}

type AvaliacaoContextValue = {
  data: AvaliacaoData
  update: (patch: Partial<AvaliacaoData>) => void
}

const AvaliacaoContext = createContext<AvaliacaoContextValue | null>(null)

/**
 * Mocked answers. Nothing is sent anywhere: the answers only decide which ending the flow
 * reaches. Scoped to the layout route, so leaving the flow forgets them.
 */
export function AvaliacaoProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AvaliacaoData>(VAZIO)

  const update = useCallback((patch: Partial<AvaliacaoData>) => {
    setData((atual) => ({ ...atual, ...patch }))
  }, [])

  const value = useMemo(() => ({ data, update }), [data, update])

  return <AvaliacaoContext.Provider value={value}>{children}</AvaliacaoContext.Provider>
}

export function useAvaliacao(): AvaliacaoContextValue {
  const context = useContext(AvaliacaoContext)

  if (!context) {
    throw new Error('useAvaliacao must be used inside an AvaliacaoProvider')
  }

  return context
}

/** Whether "Enviar avaliação" can be pressed: a rating, and a comment if the rating is low. */
export const podeEnviar = ({ nota, comentario }: AvaliacaoData): boolean =>
  nota !== null && (nota >= NOTA_MINIMA_SEM_COMENTARIO || comentario.trim().length > 0)

/**
 * Which of the two endings follows the rating. The file does not say; the reading here is
 * that 3b, "Acolhimento após dificuldades", is for whoever reported one — a low rating, or
 * a call that broke down. Recorded in SYNC-FIGMA.md.
 */
export const finalDaAvaliacao = ({ nota, chamada }: AvaliacaoData): StepSlug =>
  (nota !== null && nota < NOTA_MINIMA_SEM_COMENTARIO) || chamada === 'serios'
    ? 'apoio'
    : 'agradecimento'
