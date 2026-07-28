import type { ReactElement } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/app/store/hooks'
import { selectIsAuthenticated } from '@/features/auth/model/authSelectors'

/**
 * Restricts access to authenticated users only.
 */
export function ProtectedRoute(): ReactElement {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
