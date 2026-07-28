import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store/rootReducer'
import type { Client, ClientCreateInput, ClientUpdateInput } from '@/features/clients/model/clientTypes'
import type { Invoice } from '@/features/invoices/model/invoiceTypes'
import {
  createClient,
  getClientById,
  getClients,
  updateClient,
} from '@/features/clients/services/clientService'
import { getInvoicesByClientId } from '@/features/invoices/services/invoiceService'

interface FetchClientsArgs {
  force?: boolean
  includeInactive?: boolean
}

/**
 * Fetches clients list when required by cache rules.
 */
export const fetchClients = createAsyncThunk<
  Client[],
  FetchClientsArgs | undefined,
  { state: RootState }
>(
  'clients/fetchClients',
  async (args) => {
    const includeInactive = args?.includeInactive ?? false
    return getClients(includeInactive)
  },
  {
    condition: (args, { getState }) => {
      const state = getState().clients
      const force = args?.force ?? false
      const includeInactive = args?.includeInactive ?? false

      if (force) {
        return true
      }

      if (state.isLoading) {
        return false
      }

      if (!state.isLoaded) {
        return true
      }

      if (state.lastLoadedIncludeInactive !== includeInactive) {
        return true
      }

      return state.needsRefresh
    },
  },
)

/**
 * Creates a client and refreshes cached clients list.
 */
export const createClientRecord = createAsyncThunk<void, ClientCreateInput>(
  'clients/createClientRecord',
  async (input) => {
    await createClient(input)
  },
)

/**
 * Loads client detail for editing.
 */
export const fetchClientDetail = createAsyncThunk<Client, string>(
  'clients/fetchClientDetail',
  async (id) => {
    return getClientById(id)
  },
)

/**
 * Updates a client record.
 */
export const updateClientRecord = createAsyncThunk<void, ClientUpdateInput>(
  'clients/updateClientRecord',
  async (input) => {
    await updateClient(input)
  },
)

/**
 * Loads invoices for a specific client.
 */
export const fetchInvoicesByClientId = createAsyncThunk<Invoice[], string>(
  'clients/fetchInvoicesByClientId',
  async (clientId) => {
    return getInvoicesByClientId(clientId)
  },
)
