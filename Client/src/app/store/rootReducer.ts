import { combineReducers } from '@reduxjs/toolkit'
import { authReducer } from '@/features/auth/model/authSlice'
import { clientsReducer } from '@/features/clients/model/clientsSlice'
import { invoicesReducer } from '@/features/invoices/model/invoicesSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  clients: clientsReducer,
  invoices: invoicesReducer,
})

export type RootState = ReturnType<typeof rootReducer>
