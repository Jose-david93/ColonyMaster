import { createSlice } from '@reduxjs/toolkit'
import type { Invoice } from '@/features/invoices/model/invoiceTypes'
import {
  createInvoiceRecord,
  fetchInvoiceDetail,
  fetchInvoices,
  updateInvoiceRecord,
} from '@/features/invoices/model/invoicesThunks'

interface InvoicesState {
  items: Invoice[]
  isLoaded: boolean
  isLoading: boolean
  isLoadingDetail: boolean
  isCreating: boolean
  isUpdating: boolean
  needsRefresh: boolean
  selectedInvoice: Invoice | null
  error: string | null
}

const initialState: InvoicesState = {
  items: [],
  isLoaded: false,
  isLoading: false,
  isLoadingDetail: false,
  isCreating: false,
  isUpdating: false,
  needsRefresh: false,
  selectedInvoice: null,
  error: null,
}

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    invalidateInvoicesCache: (state) => {
      state.needsRefresh = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
        state.isLoaded = true
        state.needsRefresh = false
      })
      .addCase(fetchInvoices.rejected, (state) => {
        state.isLoading = false
        state.error = 'Unable to load invoices. Please try again.'
      })
      .addCase(fetchInvoiceDetail.pending, (state) => {
        state.isLoadingDetail = true
        state.selectedInvoice = null
        state.error = null
      })
      .addCase(fetchInvoiceDetail.fulfilled, (state, action) => {
        state.isLoadingDetail = false
        state.selectedInvoice = action.payload
      })
      .addCase(fetchInvoiceDetail.rejected, (state) => {
        state.isLoadingDetail = false
        state.error = 'Unable to load invoice detail. Please try again.'
      })
      .addCase(createInvoiceRecord.pending, (state) => {
        state.isCreating = true
        state.error = null
      })
      .addCase(createInvoiceRecord.fulfilled, (state) => {
        state.isCreating = false
        state.needsRefresh = true
      })
      .addCase(createInvoiceRecord.rejected, (state) => {
        state.isCreating = false
        state.error = 'Unable to create the invoice. Please try again.'
      })
      .addCase(updateInvoiceRecord.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateInvoiceRecord.fulfilled, (state) => {
        state.isUpdating = false
        state.needsRefresh = true
      })
      .addCase(updateInvoiceRecord.rejected, (state) => {
        state.isUpdating = false
        state.error = 'Unable to update the invoice. Please try again.'
      })
  },
})

export const { invalidateInvoicesCache } = invoicesSlice.actions
export const invoicesReducer = invoicesSlice.reducer
