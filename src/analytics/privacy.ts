import type { PostHogConfig } from 'posthog-js'
import { eventNames } from './onboarding.ts'

// Explicit allowlist also removes URLs, queries, referrers and automatic SDK properties.
const allowedProperties = new Set([
  'token', 'distinct_id', '$device_id', '$session_id', '$window_id', '$lib', '$lib_version',
  'flow', 'flow_version', 'attempt_id', 'elapsed_ms', 'entry', 'step', 'step_index',
  'step_duration_ms', 'reason', 'phase', 'phase_duration_ms', 'direction', 'completion_kind',
])
export const privacyConfig: Partial<PostHogConfig> = {
  autocapture: false,
  save_referrer: false,
  save_campaign_params: false,
  capture_pageview: false,
  capture_pageleave: false,
  capture_dead_clicks: false,
  rageclick: false,
  capture_exceptions: false,
  capture_heatmaps: false,
  capture_performance: false,
  disable_session_recording: false,
  disable_surveys: true,
  advanced_disable_flags: false,
  person_profiles: 'never',
  persistence: 'sessionStorage',
  ip: false,
  enable_recording_console_log: false,
  session_recording: {
    maskAllInputs: true,
    maskTextSelector: '*',
    maskInputFn: () => '••••',
    maskTextFn: (text) => text.replace(/[^\s]/g, '*'),
    // Block fields (including hidden/file), health choices and media before serialization.
    blockSelector: '.ph-no-capture, input, textarea, select, canvas, video, img, iframe',
    maskAttributeFn: (name, value) => {
      // Preserve only layout/SVG styling. No labels, values, IDs or data attributes.
      if (['class', 'style', 'width', 'height', 'viewBox', 'd', 'fill', 'stroke',
        'stroke-width', 'xmlns', 'role', 'type', 'rel'].includes(name)) return value
      if (name === 'href' && /\.css(?:[?#]|$)/.test(value)) return value.split(/[?#]/)[0]
      return ''
    },
    recordHeaders: false,
    recordBody: false,
    captureCanvas: { recordCanvas: false },
    recordCrossOriginIframes: false,
    captureJsonLd: false,
    maskCapturedNetworkRequestFn: (request) => ({
      ...request, name: request.name?.split(/[?#]/)[0],
    }),
  },
  before_send: (event) => {
    if (!event) return null
    const replay = event.event === '$snapshot'

    if (!replay && !eventNames.some((name) => name === event.event)) return null
    event.properties = Object.fromEntries(Object.entries(event.properties ?? {})
      .filter(([key]) => allowedProperties.has(key) || (replay &&
        ['$snapshot_data', '$snapshot_bytes', '$snapshot_host'].includes(key))))
    event.properties.$process_person_profile = false
    event.properties.$geoip_disable = true
    // Ingestion otherwise fills the IP from the HTTP connection, even with ip: false.
    event.properties.$ip = '0.0.0.0'
    delete event.$set
    delete event.$set_once
    return event
  },
}

