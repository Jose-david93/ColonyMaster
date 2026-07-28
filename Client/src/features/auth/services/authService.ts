import type {
  AuthenticationResponse,
  AuthSession,
  LoginCredentials,
} from '@/features/auth/model/authTypes'
import { apiPost } from '@/shared/api/httpClient'

/**
 * Authenticates a user using the backend API.
 */
export async function authenticate(credentials: LoginCredentials): Promise<AuthSession> {
  const payload = await apiPost<LoginCredentials, AuthenticationResponse>(
    '/api/Authentication/login',
    credentials,
  )

  if (!credentials.email.trim()) {
    throw new Error('Invalid credentials.')
  }

  const token = payload?.token?.trim() || payload?.accessToken?.trim() || ''
  const expiresAt = payload?.expiresAt?.trim() || payload?.expires_at?.trim() || ''

  if (!token) {
    throw new Error('Authentication token was not returned by the server.')
  }

  if (!expiresAt) {
    throw new Error('Token expiration was not returned by the server.')
  }

  return {
    token,
    expiresAt,
  }
}
