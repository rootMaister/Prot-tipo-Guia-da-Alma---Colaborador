/**
 * Where a task flow was entered from, so it knows where to hand the person back.
 *
 * The Agendamento flow is reachable from three places — the Match results during
 * onboarding, the Busca screen of the app, and "Reagendar" on a booked session — and the
 * Match flow from two. Until this existed, every one of them returned to the onboarding
 * screen the flow was first built against: booking from Busca and pressing back dropped the
 * person into the Match questionnaire's results.
 *
 * It travels in the **query string**, not in router state, because the flows already append
 * `search` to every step navigation (see each flow's `use-step-navigation.ts`). Router state
 * does not survive that: moving between steps creates history entries with none, which is
 * why `agendamento-provider` has to read `disponibilidade` once in its initialiser. `origem`
 * is needed on the way *out*, from whichever step the person happens to be on, so it has to
 * survive every hop.
 */

const CHAVE = 'origem'

/** Adds `origem` to a destination, preserving whatever else the current search carries. */
export function comOrigem(destino: string, origem: string, search = ''): string {
  const params = new URLSearchParams(search)
  params.set(CHAVE, origem)

  return `${destino}?${params.toString()}`
}

/**
 * Reads it back. `padrao` is what the flow did before it knew any better, so a cold
 * deep-link into a step behaves exactly as it does today.
 */
export function lerOrigem(search: string, padrao: string): string {
  const valor = new URLSearchParams(search).get(CHAVE)

  // Only same-origin paths: this ends up in `navigate()`, and a query string is user input.
  return valor && valor.startsWith('/') && !valor.startsWith('//') ? valor : padrao
}
