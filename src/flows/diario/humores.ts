/**
 * A escala de humor do diário — seção "2 - Registro de humor" (`2823:20978`).
 *
 * Cinco pontos, do mais difícil ao mais leve, nesta ordem: é a ordem do slider e a do
 * gráfico de "Seu mês em detalhes". O índice é o que fica guardado num registro.
 *
 * A escala é nova: substituiu as carinhas (😡 Estressado, 😢 Triste, 😐 OK, 😊 Radiante,
 * 😄 Feliz), e o aviso que explica a troca está em `aviso-escala-screen.tsx`.
 */

export type Humor = {
  /** Como o frame do passo 1 escreve. */
  nome: string
  /** A frase de apoio embaixo do nome. */
  apoio: string
  /**
   * O nome como a **lista de registros** o escreve: "Dia difícil" e "Um dia bom" no lugar de
   * "Difícil" e "Um bom dia". O arquivo usa os dois; cada tela usa o seu. Ver SYNC-FIGMA.md.
   */
  nomeNaLista: string
  /** Frame do passo 1 neste humor, no mobile. */
  node: string
}

export const humores: readonly Humor[] = [
  {
    nome: 'Difícil',
    apoio: 'Vale registrar o que pesou o dia',
    nomeNaLista: 'Dia difícil',
    node: '2823:20823',
  },
  {
    nome: 'Pesado',
    apoio: 'Anote um ponto que te ajude a entender amanhã.',
    nomeNaLista: 'Pesado',
    node: '2823:20792',
  },
  {
    nome: 'Estável',
    apoio: 'Adicione um detalhe',
    nomeNaLista: 'Estável',
    node: '2823:20854',
  },
  {
    nome: 'Um bom dia',
    apoio: 'O que fez diferença?',
    nomeNaLista: 'Um dia bom',
    node: '2823:20885',
  },
  {
    nome: 'Fluindo',
    apoio: 'Anote o que você precisa repetir.',
    nomeNaLista: 'Fluindo',
    node: '2823:20916',
  },
]

/** O humor do meio, onde o slider começa. */
export const HUMOR_INICIAL = 2

/**
 * Os motivos do passo 2 (`2831:1296`) — treze, em ordem alfabética, como o frame os desenha.
 * São os mesmos que a tela de detalhes e os insights mostram como "pontos de influência".
 */
export const motivos: readonly string[] = [
  'Autoestima',
  'Disposição',
  'Espiritualidade',
  'Família',
  'Finanças',
  'Lazer e hobby',
  'Realização e propósito',
  'Relacionamento',
  'Saúde emocional',
  'Saúde física',
  'Trabalho',
  'Vida pessoal',
  'Vida social',
]

/**
 * O texto do insight do mês, um por faixa de humor médio — os cinco frames `Insight do mês /
 * *` (2815:20079 e irmãos). Qual deles aparece não está escrito em lugar nenhum: aqui é a
 * média dos registros do mês, arredondada. Ver SYNC-FIGMA.md.
 */
export const insightsDoMes: readonly string[] = [
  'Esse mês parece que foi mais puxado. Em vários dos seus registros, você não estava se sentindo tão bem, e esses foram alguns dos pontos de influência que mais apareceram.',
  'Esse mês parece que foi mais puxado. Em vários dos seus registros, você não estava se sentindo tão bem, e esses foram alguns dos pontos de influência que mais apareceram.',
  'Esse mês teve muitos dias em que você se sentiu mais neutro. Alguns pontos de influência apareceram com frequência nesses momentos.',
  'Parece que você teve vários momentos bons esse mês. E algumas coisas estiveram presentes com frequência nesses dias.',
  'Esse mês teve muitos momentos em que você se sentiu muito bem. Olhando seus registros, algumas coisas parecem ter feito parte desses dias.',
]

/** A escala antiga e a nova, lado a lado, como o aviso as mostra (2862:2246). */
export const escalaAntiga: readonly { emoji: string; antes: string; agora: string }[] = [
  { emoji: '😡', antes: 'Estressado', agora: 'Difícil' },
  { emoji: '😢', antes: 'Triste', agora: 'Pesado' },
  { emoji: '😐', antes: 'OK', agora: 'Estável' },
  { emoji: '😊', antes: 'Radiante', agora: 'Um bom dia' },
  { emoji: '😄', antes: 'Feliz', agora: 'Fluindo' },
]
