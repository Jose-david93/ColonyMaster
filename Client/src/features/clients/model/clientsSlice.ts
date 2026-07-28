import { createSlice } from '@reduxjs/toolkit'
import type { Client } from '@/features/clients/model/clientTypes'
import type { Invoice } from '@/features/invoices/model/invoiceTypes'
import {
  createClientRecord,
  fetchClientDetail,
  fetchInvoicesByClientId,
  fetchClients,
  updateClientRecord,
} from '@/features/clients/model/clientsThunks'

interface ClientsState {
  items: Client[]
  isLoaded: boolean
  isLoading: boolean
  isLoadingDetail: boolean
  isLoadingInvoices: boolean
  isCreating: boolean
  isUpdating: boolean
  needsRefresh: boolean
  lastLoadedIncludeInactive: boolean
  selectedClient: Client | null
  selectedInvoices: Invoice[]
  error: string | null
}

const initialState: ClientsState = {
  items: [],
  isLoaded: false,
  isLoading: false,
  isLoadingDetail: false,
  isLoadingInvoices: false,
  isCreating: false,
  isUpdating: false,
  needsRefresh: false,
  lastLoadedIncludeInactive: false,
  selectedClient: null,
  selectedInvoices: [],
  error: null,
}

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    invalidateClientsCache: (state) => {
      state.needsRefresh = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
        state.isLoaded = true
        state.needsRefresh = false
        state.lastLoadedIncludeInactive = action.meta.arg?.includeInactive ?? false
      })
      .addCase(fetchClients.rejected, (state) => {
        state.isLoading = false
        state.error = 'Unable to load clients. Please try again.'
      })
      .addCase(createClientRecord.pending, (state) => {
        state.isCreating = true
        state.error = null
      })
      .addCase(createClientRecord.fulfilled, (state) => {
        state.isCreating = false
        state.needsRefresh = true
      })
      .addCase(createClientRecord.rejected, (state) => {
        state.isCreating = false
        state.error = 'Unable to create the client. Please try again.'
      })
      .addCase(fetchClientDetail.pending, (state) => {
        state.isLoadingDetail = true
        state.selectedClient = null
        state.selectedInvoices = []
        state.error = null
      })
      .addCase(fetchClientDetail.fulfilled, (state, action) => {
        state.isLoadingDetail = false
        state.selectedClient = action.payload
      })
      .addCase(fetchClientDetail.rejected, (state) => {
        state.isLoadingDetail = false
        state.error = 'Unable to load client detail. Please try again.'
      })
      .addCase(fetchInvoicesByClientId.pending, (state) => {
        state.isLoadingInvoices = true
        state.selectedInvoices = []
        state.error = null
      })
      .addCase(fetchInvoicesByClientId.fulfilled, (state, action) => {
        state.isLoadingInvoices = false
        state.selectedInvoices = action.payload
      })
      .addCase(fetchInvoicesByClientId.rejected, (state) => {
        state.isLoadingInvoices = false
        state.error = 'Unable to load client invoices. Please try again.'
      })
      .addCase(updateClientRecord.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateClientRecord.fulfilled, (state) => {
        state.isUpdating = false
        state.needsRefresh = true
      })
      .addCase(updateClientRecord.rejected, (state) => {
        state.isUpdating = false
        state.error = 'Unable to update the client. Please try again.'
      })
  },
})

export const { invalidateClientsCache } = clientsSlice.actions
export const clientsReducer = clientsSlice.reducer
