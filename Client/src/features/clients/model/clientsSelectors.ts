import type { RootState } from '@/app/store/rootReducer'
import type { Client } from '@/features/clients/model/clientTypes'
import type { Invoice } from '@/features/invoices/model/invoiceTypes'

/**
 * Returns all clients from redux cache.
 */
export function selectClients(state: RootState): Client[] {
  return state.clients.items
}

/**
 * Returns whether clients are currently being loaded.
 */
export function selectClientsIsLoading(state: RootState): boolean {
  return state.clients.isLoading
}

/**
 * Returns whether a client creation request is in progress.
 */
export function selectClientsIsCreating(state: RootState): boolean {
  return state.clients.isCreating
}

/**
 * Returns whether a client update request is in progress.
 */
export function selectClientsIsUpdating(state: RootState): boolean {
  return state.clients.isUpdating
}

/**
 * Returns whether a client detail request is in progress.
 */
export function selectClientsIsLoadingDetail(state: RootState): boolean {
  return state.clients.isLoadingDetail
}

/**
 * Returns selected client detail.
 */
export function selectSelectedClient(state: RootState): Client | null {
  return state.clients.selectedClient
}

/**
 * Returns selected invoices.
 */
export function selectSelectedInvoices(state: RootState): Invoice[] {
  return state.clients.selectedInvoices
}

/**
 * Returns whether selected client invoices are being loaded.
 */
export function selectClientsIsLoadingInvoices(state: RootState): boolean {
  return state.clients.isLoadingInvoices
}

/**
 * Returns clients module error state.
 */
export function selectClientsError(state: RootState): string | null {
  return state.clients.error
}
