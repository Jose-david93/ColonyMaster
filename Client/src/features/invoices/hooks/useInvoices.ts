import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import type { Invoice, InvoiceCreateInput, InvoiceUpdateInput } from '@/features/invoices/model/invoiceTypes'
import {
  selectInvoices,
  selectInvoicesIsCreating,
  selectInvoicesIsLoadingDetail,
  selectInvoicesIsUpdating,
  selectInvoicesError,
  selectInvoicesIsLoading,
  selectSelectedInvoice,
} from '@/features/invoices/model/invoicesSelectors'
import { downloadInvoicePdf } from '@/features/invoices/services/invoiceService'
import {
  createInvoiceRecord,
  fetchInvoiceDetail,
  fetchInvoices,
  updateInvoiceRecord,
} from '@/features/invoices/model/invoicesThunks'

interface UseInvoicesResult {
  invoices: Invoice[]
  isLoading: boolean
  isLoadingDetail: boolean
  isCreating: boolean
  isUpdating: boolean
  error: string | null
  selectedInvoice: Invoice | null
  reload: () => Promise<void>
  create: (input: InvoiceCreateInput) => Promise<void>
  update: (input: InvoiceUpdateInput) => Promise<void>
  loadDetail: (id: string) => Promise<void>
  print: (id: string) => Promise<void>
}

/**
 * Provides invoices list data and reload operation for invoices module.
 */
export function useInvoices(): UseInvoicesResult {
  const dispatch = useAppDispatch()
  const invoices = useAppSelector(selectInvoices)
  const isLoading = useAppSelector(selectInvoicesIsLoading)
  const isLoadingDetail = useAppSelector(selectInvoicesIsLoadingDetail)
  const isCreating = useAppSelector(selectInvoicesIsCreating)
  const isUpdating = useAppSelector(selectInvoicesIsUpdating)
  const error = useAppSelector(selectInvoicesError)
  const selectedInvoice = useAppSelector(selectSelectedInvoice)

  const reload = useCallback(async (): Promise<void> => {
    const action = await dispatch(fetchInvoices(undefined))

    if (fetchInvoices.rejected.match(action) && !action.meta.condition) {
      throw action.error
    }
  }, [dispatch])

  const create = useCallback(async (input: InvoiceCreateInput): Promise<void> => {
    await dispatch(createInvoiceRecord(input)).unwrap()
    await dispatch(fetchInvoices({ force: true })).unwrap()
  }, [dispatch])

  const update = useCallback(async (input: InvoiceUpdateInput): Promise<void> => {
    await dispatch(updateInvoiceRecord(input)).unwrap()
    await dispatch(fetchInvoices({ force: true })).unwrap()
  }, [dispatch])

  const loadDetail = useCallback(async (id: string): Promise<void> => {
    await dispatch(fetchInvoiceDetail(id)).unwrap()
  }, [dispatch])

  const print = useCallback(async (id: string): Promise<void> => {
    await downloadInvoicePdf(id)
  }, [])

  return {
    invoices,
    isLoading,
    isLoadingDetail,
    isCreating,
    isUpdating,
    error,
    selectedInvoice,
    reload,
    create,
    update,
    loadDetail,
    print,
  }
}
