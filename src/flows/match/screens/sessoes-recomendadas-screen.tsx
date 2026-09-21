
import { StepBody } from '@/components/layout/step-shell'
import { PularMatchButton } from '@/components/local/pular-match-button'
import { CardProfissional, type SessaoRecomendada } from '@/components/local/card-profissional'

import avatar1 from '@/assets/match/profissional-1.jpg'
import avatar2 from '@/assets/match/profissional-2.jpg'


/**
 * Step 7 — nodes 1119:12688 (mobile) and 1134:2891 (desktop); 1124:13327 is the same
 * screen scrolled.
 *
 * Mocked results: the cards are the four the design draws, verbatim, rather than anything
 * derived from what was picked earlier in the flow. The first and last two share one
 * portrait in the file.
 *
 * The step label is again step 2's "Temas para a sessão", left behind on the results
 * screen. Reproduced as drawn; see the note in `steps.ts`.
 */
const SESSOES: SessaoRecomendada[] = [
  {
    sessao:
      'Sessão de Psicoterapia Analítica/Junguiana | atendimento exclusivo para mulheres e pessoas LGBT+',
    titulo: 'Psi.',
    nome: 'Daniele Tramontina',
    tags: ['Junguiana', 'Autoconhecimento'],
    avatar: avatar1,
    estrelas: 4,
    avaliacoes: 67,
    sessoesRealizadas: 980,
    disponibilidade: 'Disponível hoje às • 18:00',
    destaque: 'Mais recomendada',
  },
  {
    sessao: 'Sessão de Terapia Cognitivo-Comportamental | foco na ansiedade e depressão',
    titulo: 'Psic.',
    nome: 'Lucas Mendes',
    tags: ['Cognitivo-comportamental', 'Ansiedade'],
    avatar: avatar2,
    estrelas: 5,
    avaliacoes: 21,
    sessoesRealizadas: 150,
    disponibilidade: 'Disponível amanhã às • 14:00',
  },
  {
    sessao: 'Sessão de Psicoterapia Humanista | abordagem centrada na pessoa',
    titulo: 'Psic.',
    nome: 'Mariana Souza',
    tags: ['Humanista', 'Autoconhecimento'],
    avatar: avatar1,
    estrelas: 4,
    avaliacoes: 31,
    sessoesRealizadas: 250,
    disponibilidade: 'Disponível hoje às • 16:00',
  },
  {
    sessao: 'Sessão de Terapia Familiar | trabalho com dinâmicas familiares',
    titulo: 'Psi.',
    nome: 'Roberto Lima',
    tags: ['Terapia familiar', 'Família'],
    avatar: avatar1,
    estrelas: 5,
    avaliacoes: 11,
    sessoesRealizadas: 100,
    disponibilidade: 'Disponível hoje às • 20:00',
  },
]

export function SessoesRecomendadasScreen() {

  return (
    <StepBody
      // "recomendas" is how the heading is spelled in the file, while the subtitle right
      // below it says "recomendadas". Reproduced as drawn and logged, not corrected.
      title={
        <>
          Sessões
          {/* The mobile frame breaks the line; the desktop one sets it on a single line. */}
          <br className="lg:hidden" /> recomendas
        </>
      }
      subtitle="Sessões recomendadas para o seu perfil com os horários mais próximos de atendimento"
      rolavel
      footer={
        <PularMatchButton />
      }
    >
      {/* Desktop lays the results out in two columns; mobile stacks them. */}
      <div className="grid gap-4 pt-6 pb-6 lg:grid-cols-2">
        {SESSOES.map((sessao) => (
          <CardProfissional key={sessao.nome} {...sessao} />
        ))}
      </div>
    </StepBody>
  )
}
