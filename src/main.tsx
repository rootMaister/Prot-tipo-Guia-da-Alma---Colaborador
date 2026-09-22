import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app'
import { router } from './routes'
import { onboarding } from './analytics/posthog'
import './styles/index.css'

// Observe committed routes outside React effects, avoiding StrictMode duplicate events.
const trackRoute = () => {
  if (router.state.initialized && router.state.navigation.state === 'idle') {
    onboarding.view(router.state.location.pathname)
  }
}
const unsubscribeAnalytics = router.subscribe(trackRoute)
trackRoute()
if (import.meta.hot) import.meta.hot.dispose(unsubscribeAnalytics)

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root not found in index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
