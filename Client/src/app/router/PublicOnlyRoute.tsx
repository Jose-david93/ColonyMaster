import type { ReactElement } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/app/store/hooks'
import { selectIsAuthenticated } from '@/features/auth/model/authSelectors'

/**
 * Restricts access to users that are not authenticated.
 */
export function PublicOnlyRoute(): ReactElement {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/invoices" replace />
  }

  return <Outlet />
}
