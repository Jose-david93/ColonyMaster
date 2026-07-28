import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import { useInvoices } from '@/features/invoices/hooks/useInvoices'
import { InvoiceDetailModal } from '@/features/invoices/ui/InvoiceDetailModal'
import { InvoiceForm } from '@/features/invoices/ui/InvoiceForm'
import { InvoicesList } from '@/features/invoices/ui/InvoicesList'
import type { InvoiceCreateSchema } from '@/features/invoices/schemas/invoiceSchema'
import { PAYMENT_METHOD_OPTIONS } from '@/shared/ui/PaymentMethodSelect'
import { Button } from '@/shared/ui/Button'

type InvoicesFormMode = 'create' | 'edit' | null

function toDateInputValue(value: string): string {
  if (!value) {
    return ''
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return value.slice(0, 10)
  }

  return parsed.toISOString().slice(0, 10)
}

function toPaymentMethodValue(value: string): InvoiceCreateSchema['paymentMethod'] {
  const match = PAYMENT_METHOD_OPTIONS.find((option) => option === value)
  return match ?? 'Cash'
}

/**
 * Invoices page with list workflow.
 */
export function InvoicesPage(): ReactElement {
  const [formMode, setFormMode] = useState<InvoicesFormMode>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const {
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
  } = useInvoices()

  const isFormOpen = formMode !== null
  const isEditMode = formMode === 'edit'
  const isSubmitting = isCreating || isUpdating

  useEffect(() => {
    void reload()
  }, [reload])

  const handleCreate = async (value: InvoiceCreateSchema): Promise<void> => {
    await create(value)
    setFormMode(null)
  }

  const handleEdit = async (value: InvoiceCreateSchema): Promise<void> => {
    if (!selectedInvoice) {
      return
    }

    await update({
      id: selectedInvoice.id,
      date: value.date,
      fromName: value.fromName,
      fromAddress: value.fromAddress,
      fromCity: value.fromCity,
      fromState: value.fromState,
      fromPostalCode: value.fromPostalCode,
      soldName: value.soldName,
      soldAddress: value.soldAddress,
      soldCity: value.soldCity,
      soldState: value.soldState,
      soldPostalCode: value.soldPostalCode,
      paymentMethod: value.paymentMethod,
      total: value.total,
      taxes: value.taxes,
      amountPaid: value.amountPaid,
      notes: value.notes,
      details: value.details,
    })

    setFormMode(null)
  }

  const openDetail = async (id: string): Promise<void> => {
    setIsDetailOpen(true)
    await loadDetail(id)
  }

  const openCreate = (): void => {
    setFormMode('create')
  }

  const openEdit = async (id: string): Promise<void> => {
    await loadDetail(id)
    setFormMode('edit')
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-brand-ink">Invoices</h2>
        </div>
        <Button type="button" onClick={openCreate}>New invoice</Button>
      </div>

      {isFormOpen ? (
        <div className="rounded-2xl border border-brand-border bg-brand-paper p-4">
          <InvoiceForm
            mode={isEditMode ? 'edit' : 'create'}
            invoiceNumber={isEditMode ? selectedInvoice?.invoiceNumber ?? '' : ''}
            selectedClientDisplay={
              isEditMode && selectedInvoice
                ? selectedInvoice.clientName || '-'
                : ''
            }
            initialValues={
              isEditMode && selectedInvoice
                ? {
                    date: toDateInputValue(selectedInvoice.date),
                    clientId: selectedInvoice.clientId,
                    fromName: selectedInvoice.fromName,
                    fromAddress: selectedInvoice.fromAddress,
                    fromCity: selectedInvoice.fromCity,
                    fromState: selectedInvoice.fromState,
                    fromPostalCode: selectedInvoice.fromPostalCode,
                    soldName: selectedInvoice.soldName,
                    soldAddress: selectedInvoice.soldAddress,
                    soldCity: selectedInvoice.soldCity,
                    soldState: selectedInvoice.soldState,
                    soldPostalCode: selectedInvoice.soldPostalCode,
                    paymentMethod: toPaymentMethodValue(selectedInvoice.paymentMethod),
                    total: selectedInvoice.total,
                    taxes: selectedInvoice.taxes,
                    amountPaid: selectedInvoice.amountPaid,
                    notes: selectedInvoice.notes,
                    details: selectedInvoice.details.map((detail) => ({
                      id: detail.id,
                      description: detail.description,
                      quantity: detail.quantity,
                      unitPrice: detail.unitPrice,
                    })),
                  }
                : undefined
            }
            isSubmitting={isSubmitting || isLoadingDetail}
            onSubmit={isEditMode ? handleEdit : handleCreate}
            onCancel={() => setFormMode(null)}
          />
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <InvoicesList
        invoices={invoices}
        isLoading={isLoading}
        onDetail={(id) => {
          void openDetail(id)
        }}
        onEdit={(id) => {
          void openEdit(id)
        }}
        onPrint={(id) => {
          void print(id)
        }}
      />

      <InvoiceDetailModal
        isOpen={isDetailOpen}
        invoice={selectedInvoice}
        isLoading={isLoadingDetail}
        onClose={() => setIsDetailOpen(false)}
      />
    </section>
  )
}
