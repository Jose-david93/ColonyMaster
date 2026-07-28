import type { ReactElement, ReactNode } from 'react'
import { BrandLogo } from '@/shared/branding/BrandLogo'

interface AppHeaderProps {
  rightSlot?: ReactNode
}

/**
 * Application header with shared branding.
 */
export function AppHeader({ rightSlot }: AppHeaderProps): ReactElement {
  return (
    <header className="cm-header">
      <div className="cm-shell flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <BrandLogo className="h-14 w-auto" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-steel">Carpet Clean, LLC</p>
            <p className="text-lg font-semibold text-brand-ink">Colony Master</p>
          </div>
        </div>
        {rightSlot ? <div>{rightSlot}</div> : null}
      </div>
    </header>
  )
}
