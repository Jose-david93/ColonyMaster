import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store/rootReducer'
import type { Invoice, InvoiceCreateInput, InvoiceUpdateInput } from '@/features/invoices/model/invoiceTypes'
import { createInvoice, getInvoiceById, getInvoices, updateInvoice } from '@/features/invoices/services/invoiceService'

interface FetchInvoicesArgs {
  force?: boolean
}

/**
 * Fetches invoices list when required by cache rules.
 */
export const fetchInvoices = createAsyncThunk<
  Invoice[],
  FetchInvoicesArgs | undefined,
  { state: RootState }
>(
  'invoices/fetchInvoices',
  async () => {
    return getInvoices()
  },
  {
    condition: (args, { getState }) => {
      const state = getState().invoices
      const force = args?.force ?? false

      if (force) {
        return true
      }

      if (state.isLoading) {
        return false
      }

      if (!state.isLoaded) {
        return true
      }

      return state.needsRefresh
    },
  },
)

/**
 * Creates a new invoice and marks list cache for refresh.
 */
export const createInvoiceRecord = createAsyncThunk<void, InvoiceCreateInput>(
  'invoices/createInvoiceRecord',
  async (input) => {
    await createInvoice(input)
  },
)

/**
 * Loads invoice detail by id.
 */
export const fetchInvoiceDetail = createAsyncThunk<Invoice, string>(
  'invoices/fetchInvoiceDetail',
  async (id) => {
    return getInvoiceById(id)
  },
)

/**
 * Updates an invoice and marks list cache for refresh.
 */
export const updateInvoiceRecord = createAsyncThunk<void, InvoiceUpdateInput>(
  'invoices/updateInvoiceRecord',
  async (input) => {
    await updateInvoice(input)
  },
)
