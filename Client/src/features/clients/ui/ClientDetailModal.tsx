import { useMemo, useState } from 'react'
import type { ReactElement } from 'react'
import type { Client } from '@/features/clients/model/clientTypes'
import type { Invoice } from '@/features/invoices/model/invoiceTypes'
import { downloadInvoicePdf } from '@/features/invoices/services/invoiceService'
import { Button } from '@/shared/ui/Button'

interface ClientDetailModalProps {
  isOpen: boolean
  client: Client | null
  invoices: Invoice[]
  isLoadingClient: boolean
  isLoadingInvoices: boolean
  onClose: () => void
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

function formatDate(value: string): string {
  if (!value) {
    return '-'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleDateString('en-US')
}

/**
 * Displays client detail and related invoices in a responsive modal.
 */
export function ClientDetailModal({
  isOpen,
  client,
  invoices,
  isLoadingClient,
  isLoadingInvoices,
  onClose,
}: ClientDetailModalProps): ReactElement | null {
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null)

  const summary = useMemo(() => {
    const total = invoices.reduce((acc, item) => acc + item.total, 0)
    const paid = invoices.reduce((acc, item) => acc + item.amountPaid, 0)
    return { total, paid }
  }, [invoices])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/45 p-0 sm:items-center sm:p-6">
      <section className="w-full max-h-[95vh] overflow-auto rounded-t-2xl border border-brand-border bg-white p-4 sm:max-w-6xl sm:rounded-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-brand-ink">Client detail</h3>
            <p className="mt-1 text-sm text-brand-steel">Invoices and full profile information</p>
          </div>
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>

        {isLoadingClient ? <p className="mt-4 text-sm text-brand-steel">Loading client detail...</p> : null}

        {client ? (
          <div className="mt-4 grid gap-2 rounded-xl border border-brand-border bg-brand-paper p-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <p><span className="font-semibold">Name:</span> {client.clientName}</p>
            <p><span className="font-semibold">Address:</span> {client.address}</p>
            <p><span className="font-semibold">City:</span> {client.city}</p>
            <p><span className="font-semibold">State:</span> {client.state}</p>
            <p><span className="font-semibold">Postal code:</span> {client.postalCode}</p>
            <p><span className="font-semibold">SIN:</span> {client.sin}</p>
            <p><span className="font-semibold">Initial consecutive:</span> {client.initialConsecutive}</p>
            <p><span className="font-semibold">Next consecutive:</span> {client.nextConsecutive}</p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-4 text-sm text-brand-ink">
          <p><span className="font-semibold">Invoices:</span> {invoices.length}</p>
          <p><span className="font-semibold">Total billed:</span> {formatMoney(summary.total)}</p>
          <p><span className="font-semibold">Total paid:</span> {formatMoney(summary.paid)}</p>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-brand-border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-border">
              <thead className="bg-brand-paper">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Payment</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Total</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Paid</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border bg-white">
                {isLoadingInvoices ? (
                  <>
                    <tr>
                      <td className="px-3 py-3" colSpan={5}>
                        <div className="h-4 w-full animate-pulse rounded bg-brand-paper" />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-3" colSpan={5}>
                        <div className="h-4 w-11/12 animate-pulse rounded bg-brand-paper" />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-3" colSpan={5}>
                        <div className="h-4 w-10/12 animate-pulse rounded bg-brand-paper" />
                      </td>
                    </tr>
                  </>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-sm text-brand-steel">No invoices found for this client.</td>
                  </tr>
                ) : (
                  invoices.map((invoice) => {
                    const isExpanded = expandedInvoiceId === invoice.id

                    return (
                      <>
                        <tr key={invoice.id}>
                          <td className="px-3 py-3 text-sm text-brand-ink">{formatDate(invoice.date)}</td>
                          <td className="px-3 py-3 text-sm text-brand-ink">{invoice.paymentMethod || '-'}</td>
                          <td className="px-3 py-3 text-sm text-brand-ink">{formatMoney(invoice.total)}</td>
                          <td className="px-3 py-3 text-sm text-brand-ink">{formatMoney(invoice.amountPaid)}</td>
                          <td className="px-3 py-3 text-sm text-brand-ink">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="rounded-lg border border-brand-border px-2 py-1 text-xs font-medium hover:bg-brand-paper"
                                onClick={() => setExpandedInvoiceId(isExpanded ? null : invoice.id)}
                              >
                                {isExpanded ? 'Hide' : 'View'}
                              </button>
                              <button
                                type="button"
                                title="Print"
                                aria-label="Print"
                                className="rounded-lg border border-brand-border px-2 py-1 text-xs font-medium hover:bg-brand-paper"
                                onClick={() => {
                                  void downloadInvoicePdf(invoice.id)
                                }}
                              >
                                Print
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded ? (
                          <tr key={`${invoice.id}-detail`}>
                            <td colSpan={5} className="bg-brand-paper px-3 py-3 text-sm text-brand-ink">
                              <div className="grid gap-2 sm:grid-cols-2">
                                <p><span className="font-semibold">Taxes:</span> {formatMoney(invoice.taxes)}</p>
                                <p><span className="font-semibold">Notes:</span> {invoice.notes || '-'}</p>
                                <p><span className="font-semibold">From:</span> {invoice.fromName || '-'}</p>
                                <p><span className="font-semibold">Sold to:</span> {invoice.soldName || '-'}</p>
                                <p><span className="font-semibold">From address:</span> {invoice.fromAddress || '-'}</p>
                                <p><span className="font-semibold">Sold address:</span> {invoice.soldAddress || '-'}</p>
                              </div>
                              <div className="mt-3 overflow-x-auto">
                                <table className="min-w-full divide-y divide-brand-border rounded-lg border border-brand-border">
                                  <thead className="bg-white">
                                    <tr>
                                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Description</th>
                                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Qty</th>
                                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Unit</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-brand-border bg-white">
                                    {invoice.details.length === 0 ? (
                                      <tr>
                                        <td colSpan={3} className="px-3 py-2 text-xs text-brand-steel">No detail lines.</td>
                                      </tr>
                                    ) : (
                                      invoice.details.map((line) => (
                                        <tr key={line.id}>
                                          <td className="px-3 py-2 text-xs text-brand-ink">{line.description || '-'}</td>
                                          <td className="px-3 py-2 text-xs text-brand-ink">{line.quantity}</td>
                                          <td className="px-3 py-2 text-xs text-brand-ink">{formatMoney(line.unitPrice)}</td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
