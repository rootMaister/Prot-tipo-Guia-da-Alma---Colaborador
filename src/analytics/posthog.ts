import type { PostHog } from 'posthog-js'
import { privacyConfig } from './privacy'
import { createOnboardingTracker } from './onboarding'
import type { CompletionKind, EventName, Properties } from './onboarding'

// Production builds cannot enable capture, even if someone sets the environment variables.
const enabled = import.meta.env.DEV &&
  ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) &&
  import.meta.env.VITE_POSTHOG_ENABLED === 'true' &&
  Boolean(import.meta.env.VITE_POSTHOG_KEY?.trim())

let client: PostHog | undefined
let failed = false
const pending: { event: EventName; properties: Properties; timestamp: Date }[] = []
if (enabled) {
  // Keep the SDK out of the production bundle and never delay rendering for analytics.
  void import('posthog-js').then(({ default: posthog }) => {
    posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
      api_host: 'https://us.i.posthog.com',
      ...privacyConfig,
    })
    client = posthog
    for (const { event, properties, timestamp } of pending.splice(0)) {
      client.capture(event, properties, { timestamp })
    }
  }).catch(() => { failed = true; pending.length = 0 })
}
let storage: Storage | undefined
try { if (enabled) storage = window.sessionStorage } catch { /* Optional storage. */ }
const tracker = createOnboardingTracker({
  capture: (event, properties) => {
    if (!enabled || failed) return
    if (client) client.capture(event, properties)
    else if (pending.length < 100) pending.push({ event, properties, timestamp: new Date() })
  },
  now: () => Date.now(), id: () => crypto.randomUUID(), storage,
})
export const onboarding = {
  stepCompleted: (path: string, kind?: CompletionKind) => { if (enabled) tracker.stepCompleted(path, kind) },
  start: () => { if (enabled) tracker.start() },
  view: (path: string) => { if (enabled) tracker.view(path) },
  exit: (reason: 'skip_match' | 'explore_app') => { if (enabled) tracker.exit(reason) },
  blocked: () => { if (enabled) tracker.blocked() },
  requestBooking: () => { if (enabled) tracker.requestBooking() },
  bookingRegistered: () => { if (enabled) tracker.bookingRegistered() },
}
