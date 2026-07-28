import type { PropsWithChildren, ReactElement } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/app/store/store'
import { logout } from '@/features/auth/model/authSlice'
import { setApiSessionExpiredHandler } from '@/shared/api/httpClient'

setApiSessionExpiredHandler(() => {
  store.dispatch(logout())

  if (window.location.pathname !== '/login') {
    window.location.assign('/login')
  }
})

/**
 * Provides the Redux store to the application tree.
 */
export function StoreProvider({ children }: PropsWithChildren): ReactElement {
  return <Provider store={store}>{children}</Provider>
}
