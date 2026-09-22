import test from 'node:test'
import assert from 'node:assert/strict'
import { createOnboardingTracker, paths } from '../src/analytics/onboarding.ts'
import { privacyConfig } from '../src/analytics/privacy.ts'

function fixture() {
  let clock = 1_000
  let saved = null
  const events = []
  const dependencies = {
    capture: (event, properties) => events.push({ event, properties }),
    now: () => clock,
    id: () => '12345678-1234-1234-1234-123456789abc',
    storage: { getItem: () => saved, setItem: (_, value) => { saved = value } },
  }
  return {
    tracker: createOnboardingTracker(dependencies), events,
    reload: () => createOnboardingTracker(dependencies),
    advance: (ms) => { clock += ms },
  }
}
const count = (events, name) => events.filter(({ event }) => event === name).length

function runPrerequisites(tracker) {
  for (const path of paths.filter(p => p.startsWith('/cadastro/') || p.startsWith('/match/'))) tracker.view(path)
}

function runBooking(tracker) {
  tracker.view('/agendamento/confirmar')
  tracker.requestBooking()
  tracker.view('/agendamento/agendada')
  tracker.bookingRegistered()
  tracker.bookingRegistered() // React StrictMode or repeated effects
  tracker.view('/app/agendamentos')
}

test('full journey emits three phase completions, one booking and one final completion', () => {
  const { tracker, events, advance } = fixture()
  tracker.start()
  for (const path of paths) {
    advance(1_000)
    tracker.view(path)
    tracker.view(path) // duplicate router notification
    if (path === '/agendamento/confirmar') tracker.requestBooking()
    if (path === '/agendamento/agendada') {
      tracker.bookingRegistered()
      tracker.bookingRegistered()
    }
  }
  assert.equal(count(events, 'onboarding_started'), 1)
  assert.equal(count(events, 'onboarding_step_viewed'), paths.length)
  assert.deepEqual(events.filter(e => e.event === 'onboarding_phase_completed')
    .map(e => e.properties.phase), ['cadastro', 'match', 'agendamento'])
  assert.equal(count(events, 'onboarding_booking_confirmed'), 1)
  assert.equal(count(events, 'onboarding_completed'), 1)
  assert.equal(events.at(-1).properties.elapsed_ms, paths.length * 1_000)
})

test('cold deep links and a success page without the confirmation action cannot complete', () => {
  const { tracker, events } = fixture()
  runBooking(tracker)
  assert.equal(events.length, 0)
  tracker.start()
  tracker.view('/agendamento/agendada')
  tracker.bookingRegistered()
  tracker.view('/app/agendamentos')
  assert.equal(count(events, 'onboarding_booking_confirmed'), 0)
  assert.equal(count(events, 'onboarding_completed'), 0)
})

test('back cancels a pending booking and records direction; a validation block has no form data', () => {
  const { tracker, events } = fixture()
  tracker.start()
  tracker.view('/agendamento/confirmar')
  tracker.requestBooking()
  tracker.view('/agendamento/informacoes')
  tracker.blocked()
  tracker.view('/agendamento/agendada')
  tracker.bookingRegistered()
  assert.equal(count(events, 'onboarding_booking_confirmed'), 0)
  assert.equal(events.find(e => e.properties.step === '/agendamento/informacoes' &&
    e.event === 'onboarding_step_viewed').properties.direction, 'backward')
  assert.equal(events.find(e => e.event === 'onboarding_blocked').properties.reason, 'validation_error')
})

test('reload preserves the attempt, timestamps and idempotency', () => {
  const f = fixture()
  f.tracker.start()
  f.tracker.view('/cadastro/welcome')
  f.advance(5_000)
  const resumed = f.reload()
  resumed.view('/cadastro/welcome')
  runPrerequisites(resumed)
  runBooking(resumed)
  runBooking(f.reload())
  assert.equal(count(f.events, 'onboarding_started'), 1)
  assert.equal(count(f.events, 'onboarding_completed'), 1)
  assert.equal(f.events.at(-1).properties.elapsed_ms, 5_000)
})

test('explicit skip terminates the attempt; expired attempts cannot complete', () => {
  const f = fixture()
  f.tracker.start()
  f.tracker.view('/match/inicio')
  f.tracker.exit('skip_match')
  runBooking(f.tracker)
  assert.equal(count(f.events, 'onboarding_completed'), 0)
  assert.equal(f.events.find(e => e.event === 'onboarding_exited').properties.reason, 'skip_match')
  f.tracker.start()
  f.advance(24 * 60 * 60 * 1_000)
  runBooking(f.tracker)
  assert.equal(count(f.events, 'onboarding_completed'), 0)
})

test('storage and capture failures never block the prototype', () => {
  const tracker = createOnboardingTracker({
    now: () => 1, id: () => '12345678-1234-1234-1234-123456789abc',
    capture: () => { throw Error('blocked') },
    storage: { getItem: () => { throw Error('blocked') }, setItem: () => { throw Error('blocked') } },
  })
  assert.doesNotThrow(() => { tracker.start(); runBooking(tracker) })
})

test('privacy filter strips sensitive payloads, URLs and person properties but keeps ingestion token', () => {
  const filtered = privacyConfig.before_send({
    event: 'onboarding_started',
    properties: { token: 'test-public-token', distinct_id: 'anonymous', flow: 'onboarding',
      email: 'private@example.test', cpf: 'private', password: 'private',
      $current_url: 'http://localhost/?email=private', $referrer: 'private',
      $set: { name: 'private' }, answer: 'private health answer' },
    $set: { email: 'private' }, $set_once: { name: 'private' },
  })
  assert.deepEqual(filtered.properties, {
    token: 'test-public-token', distinct_id: 'anonymous', flow: 'onboarding',
    $process_person_profile: false, $geoip_disable: true, $ip: '0.0.0.0',
  })
  assert.equal(filtered.$set, undefined)
  assert.equal(filtered.$set_once, undefined)
  assert.equal(privacyConfig.before_send({ event: '$autocapture', properties: {} }), null)
  assert.equal(privacyConfig.before_send({ event: '$snapshot', properties: {} }), null)
  assert.equal(privacyConfig.disable_session_recording, true)
  assert.equal(privacyConfig.disable_surveys, true)
})


test('a booking after skipping cadastro or match is not a complete onboarding', () => {
  const { tracker, events } = fixture()
  tracker.start()
  runBooking(tracker)
  assert.equal(count(events, 'onboarding_booking_confirmed'), 1)
  assert.equal(count(events, 'onboarding_completed'), 0)
})

test('phase duration starts at the first entry even after going back to another phase', () => {
  const { tracker, events, advance } = fixture()
  tracker.start()
  tracker.view('/cadastro/welcome')
  advance(1_000)
  tracker.view('/match/inicio')
  advance(2_000)
  tracker.view('/cadastro/aprovado')
  advance(3_000)
  tracker.view('/match/suas-sessoes')
  advance(4_000)
  tracker.view('/match/sessoes-recomendadas')
  const completed = events.find(e => e.event === 'onboarding_phase_completed')
  assert.equal(completed.properties.phase_duration_ms, 9_000)
})

test('screen completion requires an action, is scoped to the current step and deduplicates a visit', () => {
  const { tracker, events } = fixture()
  tracker.start()
  tracker.view('/cadastro/dados-pessoais')
  tracker.blocked()
  assert.equal(count(events, 'onboarding_step_completed'), 0)
  tracker.stepCompleted('/cadastro/senha', 'validated')
  assert.equal(count(events, 'onboarding_step_completed'), 0)
  tracker.stepCompleted('/cadastro/dados-pessoais', 'validated')
  tracker.stepCompleted('/cadastro/dados-pessoais', 'validated')
  assert.equal(count(events, 'onboarding_step_completed'), 1)
  tracker.view('/match/o-que-te-traz')
  tracker.stepCompleted('/match/o-que-te-traz', 'skip_optional')
  tracker.stepCompleted('/match/o-que-te-traz')
  assert.equal(count(events, 'onboarding_step_completed'), 2)
  assert.equal(events.at(-1).properties.completion_kind, 'skip_optional')
})
