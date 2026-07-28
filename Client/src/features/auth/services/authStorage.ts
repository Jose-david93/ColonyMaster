const AUTH_STORAGE_KEY = 'colony_master_auth'

interface PersistedAuthSession {
  token: string
  expiresAt: string
}

/**
 * Reads the persisted authentication session from localStorage.
 */
export function readPersistedAuthSession(): PersistedAuthSession | null {
  if (typeof window === 'undefined') {
    return null
  }

  const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY)

  if (!rawSession) {
    return null
  }

  try {
    const parsedSession = JSON.parse(rawSession) as PersistedAuthSession

    if (typeof parsedSession.token !== 'string' || parsedSession.token.length === 0) {
      return null
    }

    if (typeof parsedSession.expiresAt !== 'string' || parsedSession.expiresAt.length === 0) {
      return null
    }

    return parsedSession
  } catch {
    return null
  }
}

/**
 * Persists the authenticated user session in localStorage.
 */
export function persistAuthSession(token: string, expiresAt: string): void {
  if (typeof window === 'undefined') {
    return
  }

  const payload: PersistedAuthSession = { token, expiresAt }
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload))
}

/**
 * Removes the persisted authentication session from localStorage.
 */
export function clearPersistedAuthSession(): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}
