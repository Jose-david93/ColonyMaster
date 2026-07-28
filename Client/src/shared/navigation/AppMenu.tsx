import type { ReactElement } from 'react'
import { NavLink } from 'react-router-dom'

interface AppMenuProps {
  onNavigate?: () => void
}

/**
 * Renders the main application navigation menu.
 */
export function AppMenu({ onNavigate }: AppMenuProps): ReactElement {
  return (
    <nav aria-label="Main navigation" className="space-y-2">
      <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-steel">Menu</p>
      <NavLink
        to="/invoices"
        onClick={onNavigate}
        className={({ isActive }) =>
          isActive
            ? 'block rounded-xl bg-brand-ink px-3 py-2 text-sm font-medium text-white'
            : 'block rounded-xl px-3 py-2 text-sm font-medium text-brand-ink hover:bg-brand-paper'
        }
      >
        Invoices
      </NavLink>
      <NavLink
        to="/clients"
        onClick={onNavigate}
        className={({ isActive }) =>
          isActive
            ? 'block rounded-xl bg-brand-ink px-3 py-2 text-sm font-medium text-white'
            : 'block rounded-xl px-3 py-2 text-sm font-medium text-brand-ink hover:bg-brand-paper'
        }
      >
        Clients
      </NavLink>
    </nav>
  )
}
