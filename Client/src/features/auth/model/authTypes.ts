export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthenticationResponse {
  token?: string | null
  accessToken?: string | null
  expiresAt?: string | null
  expires_at?: string | null
}

export interface AuthSession {
  token: string
  expiresAt: string
}

export interface AuthState {
  currentEmail: string | null
  accessToken: string | null
  expiresAt: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
