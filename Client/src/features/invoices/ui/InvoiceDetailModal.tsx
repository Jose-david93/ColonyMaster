import type { ReactElement } from 'react'
import type { Invoice } from '@/features/invoices/model/invoiceTypes'
import { Button } from '@/shared/ui/Button'

interface InvoiceDetailModalProps {
  isOpen: boolean
  invoice: Invoice | null
  isLoading: boolean
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
 * Displays invoice detail in a responsive modal.
 */
export function InvoiceDetailModal({
  isOpen,
  invoice,
  isLoading,
  onClose,
}: InvoiceDetailModalProps): ReactElement | null {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/45 p-0 sm:items-center sm:p-6">
      <section className="w-full max-h-[95vh] overflow-auto rounded-t-2xl border border-brand-border bg-white p-4 sm:max-w-6xl sm:rounded-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-brand-ink">Invoice detail</h3>
            <p className="mt-1 text-sm text-brand-steel">Complete invoice information and item lines</p>
          </div>
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>

        {isLoading ? <p className="mt-4 text-sm text-brand-steel">Loading invoice detail...</p> : null}

        {invoice ? (
          <>
            <div className="mt-4 grid gap-2 rounded-xl border border-brand-border bg-brand-paper p-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <p><span className="font-semibold">Invoice number:</span> {invoice.invoiceNumber || '-'}</p>
              <p><span className="font-semibold">Date:</span> {formatDate(invoice.date)}</p>
              <p><span className="font-semibold">Client:</span> {invoice.clientName || '-'}</p>
              <p><span className="font-semibold">Payment:</span> {invoice.paymentMethod || '-'}</p>
              <p><span className="font-semibold">Total:</span> {formatMoney(invoice.total)}</p>
              <p><span className="font-semibold">Taxes:</span> {formatMoney(invoice.taxes)}</p>
              <p><span className="font-semibold">Amount paid:</span> {formatMoney(invoice.amountPaid)}</p>
              <p><span className="font-semibold">From:</span> {invoice.fromName || '-'}</p>
              <p><span className="font-semibold">Sold to:</span> {invoice.soldName || '-'}</p>
              <p><span className="font-semibold">Notes:</span> {invoice.notes || '-'}</p>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-brand-border">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-brand-border">
                  <thead className="bg-brand-paper">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Description</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Qty</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Unit price</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Line total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border bg-white">
                    {invoice.details.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-3 py-3 text-sm text-brand-steel">No item lines found.</td>
                      </tr>
                    ) : (
                      invoice.details.map((line) => (
                        <tr key={line.id}>
                          <td className="px-3 py-3 text-sm text-brand-ink">{line.description || '-'}</td>
                          <td className="px-3 py-3 text-sm text-brand-ink">{line.quantity}</td>
                          <td className="px-3 py-3 text-sm text-brand-ink">{formatMoney(line.unitPrice)}</td>
                          <td className="px-3 py-3 text-sm text-brand-ink">{formatMoney(line.quantity * line.unitPrice)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </div>
  )
}
