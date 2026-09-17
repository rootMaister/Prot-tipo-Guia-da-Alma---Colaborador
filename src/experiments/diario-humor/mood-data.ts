// Figma section 2815:20708. Corrected the accent in “Díficil”.
export const moods = [
  { label: 'Difícil', hint: 'Vale registrar o que pesou o dia', node: '2815:20562' },
  { label: 'Pesado', hint: 'Anote um ponto que te ajude a entender amanhã.', node: '2815:20487' },
  { label: 'Estável', hint: 'Adicione um detalhe', node: '2815:20524' },
  { label: 'Um bom dia', hint: 'O que fez diferença?', node: '2815:20600' },
  { label: 'Fluindo', hint: 'Anote o que você precisa repetir.', node: '2815:20637' },
] as const

// Influence reference image 2815:20712, alongside the section's second-step note.
export const influences = [
  'Autoestima', 'Disposição', 'Espiritualidade', 'Família', 'Finanças',
  'Lazer e hobby', 'Realização e propósito', 'Relacionamento', 'Saúde emocional',
  'Saúde física', 'Trabalho', 'Vida pessoal', 'Vida social',
] as const
