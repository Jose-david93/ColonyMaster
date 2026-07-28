import { useState } from 'react'
import type { ReactElement } from 'react'
import { Outlet } from 'react-router-dom'
import { useAppDispatch } from '@/app/store/hooks'
import { logout } from '@/features/auth/model/authSlice'
import { Button } from '@/shared/ui/Button'
import { AppHeader } from '@/shared/layout/AppHeader'
import { AppMenu } from '@/shared/navigation/AppMenu'

/**
 * Main authenticated shell with responsive left navigation.
 */
export function MasterPage(): ReactElement {
  const dispatch = useAppDispatch()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = (): void => {
    setIsMenuOpen(false)
  }

  return (
    <div className="cm-page">
      <AppHeader
        rightSlot={
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" className="md:hidden" onClick={() => setIsMenuOpen((value) => !value)}>
              Menu
            </Button>
            <Button type="button" variant="secondary" onClick={() => dispatch(logout())}>
              Sign out
            </Button>
          </div>
        }
      />

      <div className="cm-shell grid grid-cols-1 gap-6 py-6 md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block">
          <div className="cm-card p-4">
            <AppMenu />
          </div>
        </aside>

        {isMenuOpen ? (
          <aside className="md:hidden">
            <div className="cm-card p-4">
              <AppMenu onNavigate={closeMenu} />
            </div>
          </aside>
        ) : null}

        <main className="cm-card min-h-[420px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
