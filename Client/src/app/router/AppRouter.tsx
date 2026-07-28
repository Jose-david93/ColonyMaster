import type { ReactElement } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { InvoicesPage } from '@/pages/InvoicesPage'
import { ClientsPage } from '@/pages/ClientsPage'
import { ProtectedRoute } from '@/app/router/ProtectedRoute'
import { PublicOnlyRoute } from '@/app/router/PublicOnlyRoute'
import { MasterPage } from '@/shared/layout/MasterPage'

const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <MasterPage />,
        children: [
          {
            index: true,
            element: <Navigate to="/invoices" replace />,
          },
          {
            path: 'invoices',
            element: <InvoicesPage />,
          },
          {
            path: 'clients',
            element: <ClientsPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])

/**
 * Application router provider.
 */
export function AppRouter(): ReactElement {
  return <RouterProvider router={router} />
}
