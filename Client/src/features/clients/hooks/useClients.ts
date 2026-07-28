import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import type { Client, ClientCreateInput, ClientUpdateInput } from '@/features/clients/model/clientTypes'
import type { Invoice } from '@/features/invoices/model/invoiceTypes'
import {
  selectClients,
  selectClientsError,
  selectClientsIsCreating,
  selectClientsIsLoadingDetail,
  selectClientsIsLoadingInvoices,
  selectClientsIsLoading,
  selectClientsIsUpdating,
  selectSelectedClient,
  selectSelectedInvoices,
} from '@/features/clients/model/clientsSelectors'
import {
  createClientRecord,
  fetchClientDetail,
  fetchInvoicesByClientId,
  fetchClients,
  updateClientRecord,
} from '@/features/clients/model/clientsThunks'

interface UseClientsResult {
  clients: Client[]
  isLoading: boolean
  isLoadingDetail: boolean
  isLoadingInvoices: boolean
  isCreating: boolean
  isUpdating: boolean
  error: string | null
  selectedClient: Client | null
  selectedInvoices: Invoice[]
  reload: (includeInactive: boolean) => Promise<void>
  create: (input: ClientCreateInput, includeInactive: boolean) => Promise<void>
  loadDetail: (id: string) => Promise<void>
  loadInvoices: (clientId: string) => Promise<Invoice[]>
  update: (input: ClientUpdateInput, includeInactive: boolean) => Promise<void>
}

/**
 * Provides client list data and create operations for the clients module.
 */
export function useClients(): UseClientsResult {
  const dispatch = useAppDispatch()
  const clients = useAppSelector(selectClients)
  const isLoading = useAppSelector(selectClientsIsLoading)
  const isLoadingDetail = useAppSelector(selectClientsIsLoadingDetail)
  const isLoadingInvoices = useAppSelector(selectClientsIsLoadingInvoices)
  const isCreating = useAppSelector(selectClientsIsCreating)
  const isUpdating = useAppSelector(selectClientsIsUpdating)
  const error = useAppSelector(selectClientsError)
  const selectedClient = useAppSelector(selectSelectedClient)
  const selectedInvoices = useAppSelector(selectSelectedInvoices)

  const fetchClientsSafely = useCallback(async (includeInactive: boolean, force = false): Promise<void> => {
    const action = await dispatch(fetchClients({ includeInactive, force }))

    if (fetchClients.rejected.match(action) && !action.meta.condition) {
      throw action.error
    }
  }, [dispatch])

  const loadClients = useCallback(async (includeInactive: boolean): Promise<void> => {
    await fetchClientsSafely(includeInactive)
  }, [fetchClientsSafely])

  const create = useCallback(
    async (input: ClientCreateInput, includeInactive: boolean): Promise<void> => {
      await dispatch(createClientRecord(input)).unwrap()
      await fetchClientsSafely(includeInactive, true)
    },
    [dispatch, fetchClientsSafely],
  )

  const loadDetail = useCallback(async (id: string): Promise<void> => {
    await dispatch(fetchClientDetail(id)).unwrap()
  }, [dispatch])

  const update = useCallback(
    async (input: ClientUpdateInput, includeInactive: boolean): Promise<void> => {
      await dispatch(updateClientRecord(input)).unwrap()
      await fetchClientsSafely(includeInactive, true)
    },
    [dispatch, fetchClientsSafely],
  )

  const loadInvoices = useCallback(
    async (clientId: string): Promise<Invoice[]> => {
      return dispatch(fetchInvoicesByClientId(clientId)).unwrap()
    },
    [dispatch],
  )

  return {
    clients,
    isLoading,
    isLoadingDetail,
    isLoadingInvoices,
    isCreating,
    isUpdating,
    error,
    selectedClient,
    selectedInvoices,
    reload: loadClients,
    create,
    loadDetail,
    loadInvoices,
    update,
  }
}
