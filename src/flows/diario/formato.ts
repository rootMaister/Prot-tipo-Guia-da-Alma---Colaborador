/**
 * Como o diário escreve datas. São dois formatos, e cada tela usa o seu — como acontece com a
 * sessão em `lib/sessao-formato.ts`.
 */

/** "14/09/26 - 09:12", como a lista de registros escreve. */
export const registroNaLista = (data: Date): string => {
  const dia = data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
  const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return `${dia} - ${hora}`
}

/** "Quarta-feira, 17 de setembro · 18:03", como os detalhes do registro escrevem. */
export const registroPorExtenso = (data: Date): string => {
  const dia = data.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return `${dia.charAt(0).toUpperCase()}${dia.slice(1)} · ${hora}`
}

/** "Setembro de 2026", como o insight e "Seu mês em detalhes" escrevem. */
export const mesPorExtenso = (data: Date): string => {
  const mes = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  return `${mes.charAt(0).toUpperCase()}${mes.slice(1)}`.replace(' de ', ' de ')
}

/** Se dois instantes caem no mesmo mês — o recorte de todo o resumo do diário. */
export const noMesmoMes = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
