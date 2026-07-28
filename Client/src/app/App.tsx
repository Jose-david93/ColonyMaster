import type { ReactElement } from 'react'
import { AppProviders } from '@/app/providers/AppProviders'
import { AppRouter } from '@/app/router/AppRouter'

/**
 * Root application component.
 */
export function App(): ReactElement {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}
