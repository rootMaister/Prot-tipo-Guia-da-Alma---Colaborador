import { cadastroSteps } from '../flows/cadastro/steps.ts'
import { matchSteps } from '../flows/match/steps.ts'
import { agendamentoSteps } from '../flows/agendamento/steps.ts'

export const paths = [
  // "Acesso recusado" fica fora de propósito: é o fim da tentativa, não uma etapa dela,
  // e incluí-lo deslocaria o `step_index` de tudo o que vem depois. Visitá-lo encerra a
  // tentativa como `left_flow`. Ver ANALYTICS.md.
  ...cadastroSteps.filter(({ slug }) => slug !== 'reprovado').map(({ slug }) => `/cadastro/${slug}`),
  ...matchSteps.map(({ slug }) => `/match/${slug}`),
  ...agendamentoSteps.map(({ slug }) => `/agendamento/${slug}`),
  '/app/agendamentos',
]
export const eventNames = [
  'onboarding_started', 'onboarding_step_completed', 'onboarding_step_viewed', 'onboarding_step_left',
  'onboarding_booking_confirmed', 'onboarding_completed', 'onboarding_exited', 'onboarding_phase_completed', 'onboarding_blocked',
] as const
export type EventName = typeof eventNames[number]
export type CompletionKind = 'advance' | 'validated' | 'automatic' | 'skip_optional'
export type Properties = Record<string, string | number | boolean>
type Attempt = {
  id: string; startedAt: number; lastAt: number; path: string
  phase: string; phaseStarts: Record<string, number>; completedPhases: string[]
  status: 'active' | 'completed' | 'exited'; requested: boolean; booked: boolean
}
type Dependencies = {
  capture: (event: EventName, properties: Properties) => void
  now: () => number
  id: () => string
  storage?: Pick<Storage, 'getItem' | 'setItem'>
}
const STORAGE_KEY = 'prototype-onboarding-v1'
const MAX_AGE = 24 * 60 * 60 * 1000

/** Only route identifiers and random attempt IDs: never receives form/account data. */
export function createOnboardingTracker({ capture, now, id, storage }: Dependencies) {
  let attempt: Attempt | undefined
  let completedVisit: string | undefined
  try {
    const saved: unknown = JSON.parse(storage?.getItem(STORAGE_KEY) ?? 'null')
    if (saved && typeof saved === 'object') {
      const a = saved as Attempt
      if (typeof a.id === 'string' && /^[a-f0-9-]{36}$/.test(a.id) &&
          Number.isFinite(a.startedAt) && Number.isFinite(a.lastAt) &&
          a.startedAt <= now() && now() - a.startedAt < MAX_AGE &&
          paths.includes(a.path) && ['active', 'completed', 'exited'].includes(a.status) &&
          ['', 'cadastro', 'match', 'agendamento', 'app'].includes(a.phase) &&
          a.phaseStarts && typeof a.phaseStarts === 'object' &&
          Object.entries(a.phaseStarts).every(([p, t]) =>
            ['cadastro', 'match', 'agendamento', 'app'].includes(p) && Number.isFinite(t)) &&
          Array.isArray(a.completedPhases) &&
          a.completedPhases.every((p) => ['cadastro', 'match', 'agendamento'].includes(p)) &&
          typeof a.requested === 'boolean' && typeof a.booked === 'boolean') {
        attempt = { id: a.id, startedAt: a.startedAt, lastAt: a.lastAt, path: a.path,
          phase: a.phase, phaseStarts: a.phaseStarts, completedPhases: a.completedPhases,
          status: a.status, requested: a.requested, booked: a.booked }
      }
    }
  } catch { /* Storage unavailable or corrupt: analytics never blocks the prototype. */ }
  function save() {
    try { storage?.setItem(STORAGE_KEY, JSON.stringify(attempt)) } catch { /* Optional. */ }
  }
  function emit(event: EventName, extra: Properties = {}) {
    if (!attempt) return
    try {
      capture(event, { flow: 'onboarding', flow_version: 1, attempt_id: attempt.id,
        elapsed_ms: Math.max(0, now() - attempt.startedAt), ...extra })
    } catch { /* A blocked analytics endpoint must not break navigation. */ }
  }
  function active() {
    return attempt?.status === 'active' && now() - attempt.startedAt < MAX_AGE
  }
  function leaveStep() {
    if (!attempt?.path) return
    emit('onboarding_step_left', { step: attempt.path,
      step_duration_ms: Math.max(0, now() - attempt.lastAt) })
  }
  function exit(reason: 'skip_match' | 'explore_app' | 'left_flow' | 'restart') {
    if (!active() || !attempt) return
    leaveStep()
    emit('onboarding_exited', { step: attempt.path, reason })
    attempt.status = 'exited'
    save()
  }
  function start() {
    exit('restart')
    completedVisit = undefined
    attempt = { id: id(), startedAt: now(), lastAt: now(), path: '',
      phase: '', phaseStarts: {}, completedPhases: [],
      status: 'active', requested: false, booked: false }
    emit('onboarding_started', { entry: 'index_cta' })
    save()
  }
  function completePhase() {
    if (!attempt || attempt.completedPhases.includes(attempt.phase)) return
    emit('onboarding_phase_completed', { phase: attempt.phase,
      phase_duration_ms: Math.max(0, now() - attempt.phaseStarts[attempt.phase]) })
    attempt.completedPhases.push(attempt.phase)
  }
  function view(path: string) {
    if (!active() || !attempt || path === attempt.path) return
    if (!paths.includes(path)) { exit('left_flow'); return }
    if (attempt.path) leaveStep()
    completedVisit = undefined
    const previous = attempt.path
    const phase = path.split('/')[1]
    attempt.phase = phase
    attempt.phaseStarts[phase] ??= now()
    attempt.path = path
    attempt.lastAt = now()
    // A pending confirmation is valid only for the immediate transition to success.
    if (path !== '/agendamento/agendada') attempt.requested = false
    emit('onboarding_step_viewed', { step: path, phase, step_index: paths.indexOf(path) + 1,
      direction: previous && paths.indexOf(path) < paths.indexOf(previous) ? 'backward' : 'forward' })
    if ((path === '/cadastro/aprovado' && previous === '/cadastro/analise') ||
        (path === '/match/sessoes-recomendadas' && previous === '/match/suas-sessoes')) completePhase()
    if (path === '/app/agendamentos') {
      if (attempt.booked && ['cadastro', 'match', 'agendamento'].every(
        (phase) => attempt?.completedPhases.includes(phase),
      )) {
        emit('onboarding_completed')
        attempt.status = 'completed'
      } else {
        exit('left_flow')
      }
    }
    save()
  }
  function requestBooking() {
    if (active() && attempt?.path === '/agendamento/confirmar') {
      attempt.requested = true
      save()
    }
  }
  // Called after the app registers the mock booking, never from a success pageview alone.
  function bookingRegistered() {
    if (!active() || !attempt?.requested || attempt.booked ||
        attempt.path !== '/agendamento/agendada') return
    attempt.booked = true
    attempt.requested = false
    emit('onboarding_booking_confirmed')
    completePhase()
    save()
  }
  function stepCompleted(path: string, kind: CompletionKind = 'advance') {
    if (!active() || !attempt || attempt.path !== path || completedVisit === path) return
    completedVisit = path
    emit('onboarding_step_completed', { step: path, completion_kind: kind,
      step_duration_ms: Math.max(0, now() - attempt.lastAt) })
  }
  function blocked() {
    if (active() && attempt) emit('onboarding_blocked', { step: attempt.path, reason: 'validation_error' })
  }
  return { start, view, exit, requestBooking, bookingRegistered, blocked, stepCompleted }
}
