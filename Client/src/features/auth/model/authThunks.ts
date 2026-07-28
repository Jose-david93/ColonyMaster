import { createAsyncThunk } from '@reduxjs/toolkit'
import type { LoginCredentials } from '@/features/auth/model/authTypes'
import { authenticate } from '@/features/auth/services/authService'

/**
 * Authenticates a user with email and password.
 */
export const login = createAsyncThunk('auth/login', async (credentials: LoginCredentials) => {
  const user = await authenticate(credentials)
  return user
})
