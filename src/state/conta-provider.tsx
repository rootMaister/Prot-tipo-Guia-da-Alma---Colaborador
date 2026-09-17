import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

import avatar from '@/assets/match/profissional-1.jpg'

export type SessaoAgendada = {
  /**
   * The slot itself, not a formatted line. The card writes it one way ("5 de agosto •
   * 14:00") and `Detalhes da sessão` another ("Qua, 5 de agosto de 2026" / "14:00 – 14:45"),
   * so each screen formats from the date rather than from the other's string — see
   * `lib/sessao-formato.ts`.
   */
  data: Date
  horario: string
  titulo: string
  /**
   * The same session is titled twice in the file: the cards carry the long line, and
   * `Detalhes da sessão` (1776:38) a short one. Both are reproduced rather than one being
   * chosen for the other — see SYNC-FIGMA.md.
   */
  tituloCurto: string
  /** Abbreviated title as drawn: "Psi." on some cards, "Psic." on others. */
  profissionalTitulo: string
  profissionalNome: string
  /** Spelled out — "Psicóloga" — which is how `Detalhes da sessão` writes it. */
  profissionalProfissao: string
  avatar: string
  /** As the detail screen writes the rating: "★ 4,5 · 67 avaliações". */
  nota: string
  avaliacoes: number
}

export type Conta = {
  nome: string
  /**
   * O arquivo só escreve "Lara", na saudação da Home. O sobrenome existe porque a revisão
   * de 11/09/2026 pediu **duas** iniciais no menu ("ex: LD") — é invenção do protótipo, e
   * está registrado no SYNC-FIGMA.md.
   */
  sobrenome: string
  /**
   * Login e-mail and phone, as "Meus dados" (2873:3 / 2874:109) writes them. The e-mail is
   * the only field that screen renders disabled: "O e-mail de acesso não pode ser alterado."
   */
  email: string
  telefone: string
  nivel: number
  pontos: number
  moedas: number
  /** Plan allowance, as the "Seu plano" card states it. */
  agendamentosPorMes: number
  sessoes: SessaoAgendada[]
}

/**
 * Account state, mocked and shared by the whole prototype.
 *
 * It sits above the router rather than inside a flow because it is the one thing that has to
 * survive moving between them: booking a session in the Agendamento flow is what flips the
 * Home from "Descubra a melhor sessão" to "Sua próxima sessão". Flow providers are scoped to
 * their own route subtree and are torn down on the way out, so they cannot hold this.
 *
 * Starts with no sessions, so the prototype opens on the Home the design draws for someone
 * who has not booked yet (1448:7654). Walking Agendamento to the end produces the other one
 * (1429:6283).
 */
const CONTA_INICIAL: Conta = {
  nome: 'Lara',
  sobrenome: 'Duarte',
  email: 'lara.duarte@empresa.com.br',
  telefone: '+55 (11) 98765-4321',
  nivel: 1,
  pontos: 123,
  moedas: 232,
  agendamentosPorMes: 4,
  sessoes: [],
}

/** What the Agendamento flow books, matching the session that flow is drawn around. */
export const SESSAO_DEMO: Omit<SessaoAgendada, 'data' | 'horario'> = {
  titulo:
    'Sessão de Psicoterapia Analítica/Junguiana | atendimento exclusivo para mulheres e pessoas LGBT+',
  tituloCurto: 'Sessão de Psicoterapia Junguiana',
  profissionalTitulo: 'Psi.',
  profissionalNome: 'Daniele Tramontina',
  profissionalProfissao: 'Psicóloga',
  avatar,
  nota: '4,5',
  avaliacoes: 67,
}

/** O que "Meus dados" edita — o e-mail fica de fora porque a tela o desenha desabilitado. */
export type DadosEditaveis = Pick<Conta, 'nome' | 'sobrenome' | 'telefone'>

type ContaContextValue = {
  conta: Conta
  agendar: (sessao: SessaoAgendada) => void
  atualizarDados: (dados: DadosEditaveis) => void
  reset: () => void
}

const ContaContext = createContext<ContaContextValue | null>(null)

export function ContaProvider({ children }: { children: ReactNode }) {
  const [conta, setConta] = useState<Conta>(CONTA_INICIAL)

  const agendar = useCallback((sessao: SessaoAgendada) => {
    setConta((atual) => {
      // Booking the same slot twice — re-walking the flow — should not stack duplicates.
      if (atual.sessoes.some((s) => chaveSessao(s) === chaveSessao(sessao))) {
        return atual
      }

      return { ...atual, sessoes: [...atual.sessoes, sessao] }
    })
  }, [])

  /**
   * Nome, sobrenome e telefone de "Meus dados". Fica aqui, e não no estado da tela, porque o
   * nome e as iniciais aparecem no menu e na saudação do Início: trocar o nome e ver o menu
   * mudar é a única prova de que a tela salvou alguma coisa.
   */
  const atualizarDados = useCallback((dados: DadosEditaveis) => {
    setConta((atual) => ({ ...atual, ...dados }))
  }, [])

  const reset = useCallback(() => setConta(CONTA_INICIAL), [])

  const value = useMemo(
    () => ({ conta, agendar, atualizarDados, reset }),
    [conta, agendar, atualizarDados, reset],
  )

  return <ContaContext.Provider value={value}>{children}</ContaContext.Provider>
}

export function useConta(): ContaContextValue {
  const context = useContext(ContaContext)

  if (!context) {
    throw new Error('useConta must be used inside a ContaProvider')
  }

  return context
}

/** "LD" — as iniciais que o menu do desktop mostra no avatar. */
export const iniciais = (conta: Conta): string =>
  `${conta.nome.charAt(0)}${conta.sobrenome.charAt(0)}`.toUpperCase()

/** A session is its slot: same day and same time is the same booking. */
export const chaveSessao = (sessao: SessaoAgendada): string =>
  `${sessao.data.toDateString()} ${sessao.horario}`

/** Sessions left this month, for the "Seu plano" card. */
export const agendamentosRestantes = (conta: Conta): number =>
  Math.max(0, conta.agendamentosPorMes - conta.sessoes.length)
