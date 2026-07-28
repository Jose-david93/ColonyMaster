import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ClientForm } from '@/features/clients/ui/ClientForm'
import { ClientDetailModal } from '@/features/clients/ui/ClientDetailModal'
import { ClientsList } from '@/features/clients/ui/ClientsList'
import { useClients } from '@/features/clients/hooks/useClients'
import type { ClientCreateSchema } from '@/features/clients/schemas/clientSchema'
import { Button } from '@/shared/ui/Button'

type ClientsFormMode = 'create' | 'edit' | null

/**
 * Clients page with list and create workflow.
 */
export function ClientsPage(): ReactElement {
  const [formMode, setFormMode] = useState<ClientsFormMode>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    clients,
    isLoading,
    isLoadingDetail,
    isLoadingInvoices,
    isCreating,
    isUpdating,
    error,
    selectedClient,
    selectedInvoices,
    reload,
    create,
    loadDetail,
    loadInvoices,
    update,
  } = useClients()

  const includeInactive = searchParams.get('includeInactive') === 'true'

  useEffect(() => {
    void reload(includeInactive)
  }, [includeInactive, reload])

  const isFormOpen = formMode !== null
  const isEditMode = formMode === 'edit'
  const isSubmitting = isCreating || isUpdating

  const handleCreate = async (value: ClientCreateSchema): Promise<void> => {
    await create(value, includeInactive)
    setFormMode(null)
  }

  const handleEdit = async (value: ClientCreateSchema): Promise<void> => {
    if (!selectedClient) {
      return
    }

    await update({
      id: selectedClient.id,
      clientName: value.clientName,
      address: value.address,
      city: value.city,
      state: value.state,
      postalCode: value.postalCode,
      sin: value.sin,
      isActive: value.isActive,
    }, includeInactive)

    setFormMode(null)
  }

  const openCreate = (): void => {
    setFormMode('create')
  }

  const openEdit = async (id: string): Promise<void> => {
    await loadDetail(id)
    setFormMode('edit')
  }

  const openDetail = async (id: string): Promise<void> => {
    setIsDetailOpen(true)
    await Promise.all([loadDetail(id), loadInvoices(id)])
  }

  const handleCancel = (): void => {
    setFormMode(null)
  }

  const toggleIncludeInactive = (): void => {
    const nextParams = new URLSearchParams(searchParams)

    if (includeInactive) {
      nextParams.delete('includeInactive')
    } else {
      nextParams.set('includeInactive', 'true')
    }

    setSearchParams(nextParams)
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-brand-ink">Clients</h2>
        </div>
        <Button type="button" onClick={openCreate}>
          New client
        </Button>
      </div>

      <div className="flex items-center">
        <button
          type="button"
          className={`inline-flex items-center rounded-xl border px-3 py-2 text-sm font-medium transition ${includeInactive ? 'border-brand-ink bg-brand-ink text-white' : 'border-brand-border bg-white text-brand-ink hover:bg-brand-paper'}`}
          onClick={toggleIncludeInactive}
        >
          {includeInactive ? 'Including inactive' : 'Active only'}
        </button>
      </div>

      {isFormOpen ? (
        <div className="rounded-2xl border border-brand-border bg-brand-paper p-4">
          <ClientForm
            mode={isEditMode ? 'edit' : 'create'}
            initialValues={
              isEditMode && selectedClient
                ? {
                    clientName: selectedClient.clientName,
                    address: selectedClient.address,
                    city: selectedClient.city,
                    state: selectedClient.state,
                    postalCode: selectedClient.postalCode,
                    sin: selectedClient.sin,
                    initialConsecutive: selectedClient.initialConsecutive,
                    nextConsecutive: selectedClient.nextConsecutive,
                    isActive: selectedClient.isActive,
                  }
                : undefined
            }
            isSubmitting={isSubmitting || isLoadingDetail}
            onSubmit={isEditMode ? handleEdit : handleCreate}
            onCancel={handleCancel}
          />
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <ClientsList
        clients={clients}
        isLoading={isLoading}
        onDetail={(id) => {
          void openDetail(id)
        }}
        onEdit={(id) => {
          void openEdit(id)
        }}
      />

      <ClientDetailModal
        isOpen={isDetailOpen}
        client={selectedClient}
        invoices={selectedInvoices}
        isLoadingClient={isLoadingDetail}
        isLoadingInvoices={isLoadingInvoices}
        onClose={() => setIsDetailOpen(false)}
      />
    </section>
  )
}
