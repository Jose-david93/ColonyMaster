import type { RootState } from '@/app/store/rootReducer'

/**
 * Returns true when the user has an active authenticated session.
 */
export function selectIsAuthenticated(state: RootState): boolean {
  return state.auth.isAuthenticated
}

/**
 * Returns the authenticated user email.
 */
export function selectCurrentEmail(state: RootState): string | null {
  return state.auth.currentEmail
}

/**
 * Returns the authenticated access token.
 */
export function selectAccessToken(state: RootState): string | null {
  return state.auth.accessToken
}

/**
 * Returns the current authentication loading status.
 */
export function selectAuthIsLoading(state: RootState): boolean {
  return state.auth.isLoading
}

/**
 * Returns the current authentication error message.
 */
export function selectAuthError(state: RootState): string | null {
  return state.auth.error
}
