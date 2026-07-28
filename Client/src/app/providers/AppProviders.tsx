import type { PropsWithChildren, ReactElement } from 'react'
import { StoreProvider } from '@/app/providers/StoreProvider'

/**
 * Composes all root-level providers.
 */
export function AppProviders({ children }: PropsWithChildren): ReactElement {
  return <StoreProvider>{children}</StoreProvider>
}
