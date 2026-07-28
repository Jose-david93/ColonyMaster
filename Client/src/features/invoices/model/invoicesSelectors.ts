import type { RootState } from '@/app/store/rootReducer'
import type { Invoice } from '@/features/invoices/model/invoiceTypes'

/**
 * Returns all invoices from redux cache.
 */
export function selectInvoices(state: RootState): Invoice[] {
  return state.invoices.items
}

/**
 * Returns whether invoices are currently being loaded.
 */
export function selectInvoicesIsLoading(state: RootState): boolean {
  return state.invoices.isLoading
}

/**
 * Returns whether invoice detail is currently being loaded.
 */
export function selectInvoicesIsLoadingDetail(state: RootState): boolean {
  return state.invoices.isLoadingDetail
}

/**
 * Returns whether invoice creation is in progress.
 */
export function selectInvoicesIsCreating(state: RootState): boolean {
  return state.invoices.isCreating
}

/**
 * Returns whether invoice update is in progress.
 */
export function selectInvoicesIsUpdating(state: RootState): boolean {
  return state.invoices.isUpdating
}

/**
 * Returns selected invoice detail.
 */
export function selectSelectedInvoice(state: RootState): Invoice | null {
  return state.invoices.selectedInvoice
}

/**
 * Returns invoices module error state.
 */
export function selectInvoicesError(state: RootState): string | null {
  return state.invoices.error
}
