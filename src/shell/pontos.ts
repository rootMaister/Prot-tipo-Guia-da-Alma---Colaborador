import {
  BrainCircuitIcon,
  CalendarIcon,
  CircleUserIcon,
  MessageCircleIcon,
  NotebookPenIcon,
  type LucideIcon,
} from 'lucide-react'

/**
 * O conteúdo de "Meus pontos" — prêmios, formas de pontuar, ranking e dúvidas.
 *
 * Fica fora da tela pelo mesmo motivo que o `catalogo.ts` da Busca: é lista desenhada no
 * Figma, não estado da pessoa. O que é da conta (pontos, Calmas, nível, dias seguidos) vem do
 * `conta-provider`.
 */

export type Premio = {
  titulo: string
  /** Preço em Calmas. */
  custo: number
}

/** Aba "Prêmios" (2564:283 e 2564:303). */
export const premios: readonly Premio[] = [
  { titulo: '+1 terapia gratuita', custo: 1570 },
  { titulo: '+2 terapias gratuitas', custo: 2470 },
]

export type FormaDePontuar = {
  titulo: string
  /** Como o frame escreve a recompensa: "+25 pontos", "+110 pontos por sessão". */
  pontos: string
  icone: LucideIcon
  /** O texto do badge. Estados desenhados: concluído, uma contagem, ou "Pendente". */
  status: string
  concluido: boolean
}

/**
 * Aba "Como pontuar?" (2565:301). Os status são os do frame — "2 terapias agendadas", "5
 * avaliações pendentes" — e não a conta desta sessão: são estados demonstrativos de uma conta
 * mais avançada do que a que o protótipo começa. Ver SYNC-FIGMA.md.
 */
export const formasDePontuar: readonly FormaDePontuar[] = [
  {
    titulo: 'Ative sua conta',
    pontos: '+25 pontos',
    icone: CircleUserIcon,
    status: 'Concluído',
    concluido: true,
  },
  {
    titulo: 'Descubra seu Match de Terapia',
    pontos: '+50 pontos',
    icone: BrainCircuitIcon,
    status: 'Concluído',
    concluido: true,
  },
  {
    titulo: 'Agende sua terapia',
    pontos: '+110 pontos por sessão',
    icone: CalendarIcon,
    status: '2 terapias agendadas',
    concluido: false,
  },
  {
    titulo: 'Deixe uma avaliação para sua terapia',
    pontos: '+25 pontos',
    icone: MessageCircleIcon,
    status: '5 avaliações pendentes',
    concluido: false,
  },
  {
    titulo: 'Agende sua 3ª terapia no mês',
    pontos: '+30 pontos',
    icone: CalendarIcon,
    status: 'Pendente',
    concluido: false,
  },
  {
    titulo: 'Agende sua 4ª terapia no mês',
    pontos: '+30 pontos',
    icone: CalendarIcon,
    status: 'Pendente',
    concluido: false,
  },
  {
    // A camada se chama "Anote seu humor diariamente" e o texto renderizado é outro — o
    // arquivo tem esse drift de cópia em vários lugares. Vale o texto.
    titulo: 'Faça um registro no seu diário',
    pontos: '+25 pontos por registro',
    icone: NotebookPenIcon,
    status: 'Pendente',
    concluido: false,
  },
]

export type Duvida = {
  pergunta: string
  /** Só a primeira pergunta tem resposta escrita no arquivo. Ver SYNC-FIGMA.md. */
  resposta: readonly string[]
}

/** Aba "Como funciona?" (2566:364) — um acordeão, com a primeira aberta. */
export const duvidas: readonly Duvida[] = [
  {
    pergunta: 'Como faço para ganhar pontos e Calmas?',
    resposta: [
      'São várias formas! O jeito mais fácil é agendar suas terapias sempre aqui na plataforma. Quanto mais sessões agendadas, mais pontos você ganha!',
      'Você também ganha pontos quando deixa uma avaliação nas suas terapias.',
      'Outra forma é entrar aqui todos os dias! A cada 5 dias de acessos consecutivos você ganha pontos e recomeça a contagem :)',
      'Para ver com mais detalhes como ganhar pontos e Calmas, visite a aba “Como pontuar?”.',
    ],
  },
  { pergunta: 'Para que servem as Calmas?', resposta: [] },
  { pergunta: 'Para que servem os pontos?', resposta: [] },
  { pergunta: 'Como funciona o ranking?', resposta: [] },
  { pergunta: 'Como funcionam os prêmios?', resposta: [] },
  { pergunta: 'Vai ter mais prêmios além dos que já tem hoje?', resposta: [] },
]

export type PosicaoRanking = {
  posicao: number
  nome: string
  pontos: number
  nivel: number
}

/**
 * "Ranking · Guia da Alma". O mobile desenha cinco posições e o desktop dez, com a pessoa
 * sempre em 12º — a lista é a mesma, o mobile só mostra menos. A linha de "você" não vem
 * daqui: é montada com a conta.
 */
export const ranking: readonly PosicaoRanking[] = [
  { posicao: 1, nome: 'Mariana Alves', pontos: 750, nivel: 5 },
  { posicao: 2, nome: 'Pedro Lima', pontos: 660, nivel: 4 },
  { posicao: 3, nome: 'Camila Rocha', pontos: 635, nivel: 4 },
  { posicao: 4, nome: 'Rafael Souza', pontos: 625, nivel: 4 },
  { posicao: 5, nome: 'Beatriz Nunes', pontos: 550, nivel: 4 },
  { posicao: 6, nome: 'Lucas Pereira', pontos: 470, nivel: 4 },
  { posicao: 7, nome: 'Júlia Martins', pontos: 460, nivel: 4 },
  { posicao: 8, nome: 'Gabriel Costa', pontos: 410, nivel: 3 },
  { posicao: 9, nome: 'Isabela Ramos', pontos: 395, nivel: 3 },
  { posicao: 10, nome: 'Thiago Melo', pontos: 360, nivel: 3 },
]

/** A posição da pessoa, como os dois frames a desenham. */
export const SUA_POSICAO = 12

/** "1.570 Calmas" — o arquivo escreve milhar com ponto. */
export const formatarNumero = (valor: number): string => valor.toLocaleString('pt-BR')
