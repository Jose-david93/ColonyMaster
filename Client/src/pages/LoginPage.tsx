import type { ReactElement } from 'react'
import { LoginForm } from '@/features/auth/ui/LoginForm'
import { BrandLogo } from '@/shared/branding/BrandLogo'

/**
 * Page that renders the authentication form.
 */
export function LoginPage(): ReactElement {
  return (
    <div className="cm-page">
      <main className="cm-shell grid min-h-screen place-items-center py-8">
        <section className="cm-card flex w-full max-w-4xl items-center gap-12 p-10">
          <div className="hidden flex-shrink-0 items-center justify-center border-r border-gray-200 pr-12 sm:flex">
            <BrandLogo className="h-64 w-auto" />
          </div>
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-semibold text-brand-ink">Sign in</h1>
            <div className="mt-6">
              <LoginForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
