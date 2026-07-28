import { createSlice } from '@reduxjs/toolkit'
import type { AuthState } from '@/features/auth/model/authTypes'
import { login } from '@/features/auth/model/authThunks'
import {
  clearPersistedAuthSession,
  persistAuthSession,
  readPersistedAuthSession,
} from '@/features/auth/services/authStorage'
import { setApiAccessToken, setApiTokenExpiration } from '@/shared/api/httpClient'

function isSessionExpired(value: string): boolean {
  const expirationTime = Date.parse(value)

  if (!Number.isFinite(expirationTime)) {
    return true
  }

  return Date.now() >= expirationTime
}

function buildInitialAuthState(): AuthState {
  const persistedSession = readPersistedAuthSession()

  if (!persistedSession) {
    setApiAccessToken(null)
    setApiTokenExpiration(null)

    return {
      currentEmail: null,
      accessToken: null,
      expiresAt: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }
  }

  if (isSessionExpired(persistedSession.expiresAt)) {
    clearPersistedAuthSession()
    setApiAccessToken(null)
    setApiTokenExpiration(null)

    return {
      currentEmail: null,
      accessToken: null,
      expiresAt: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }
  }

  setApiAccessToken(persistedSession.token)
  setApiTokenExpiration(persistedSession.expiresAt)

  return {
    currentEmail: null,
    accessToken: persistedSession.token,
    expiresAt: persistedSession.expiresAt,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  }
}

const initialState: AuthState = buildInitialAuthState()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentEmail = null
      state.accessToken = null
      state.expiresAt = null
      state.isAuthenticated = false
      state.error = null
      state.isLoading = false
      clearPersistedAuthSession()
      setApiAccessToken(null)
      setApiTokenExpiration(null)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.currentEmail = action.meta.arg.email
        state.accessToken = action.payload.token
        state.expiresAt = action.payload.expiresAt
        state.error = null
        persistAuthSession(action.payload.token, action.payload.expiresAt)
        setApiAccessToken(action.payload.token)
        setApiTokenExpiration(action.payload.expiresAt)
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false
        state.error = 'Unable to authenticate. Please try again.'
      })
  },
})

export const { logout } = authSlice.actions
export const authReducer = authSlice.reducer
