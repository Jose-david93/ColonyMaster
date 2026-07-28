import type { ReactElement } from 'react'
import type { Invoice } from '@/features/invoices/model/invoiceTypes'

interface InvoicesListProps {
  invoices: Invoice[]
  isLoading: boolean
  onDetail: (id: string) => void
  onEdit: (id: string) => void
  onPrint: (id: string) => void
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
 * Renders the invoices list table.
 */
export function InvoicesList({ invoices, isLoading, onDetail, onEdit, onPrint }: InvoicesListProps): ReactElement {
  if (isLoading) {
    return <p className="text-sm text-brand-steel">Loading invoices...</p>
  }

  if (invoices.length === 0) {
    return <p className="text-sm text-brand-steel">No invoices found.</p>
  }

  return (
    <div className="overflow-hidden rounded-xl border border-brand-border">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-border">
          <thead className="bg-brand-paper">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Client</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Payment</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Total</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Paid</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border bg-white">
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-4 py-3 text-sm text-brand-ink">{formatDate(invoice.date)}</td>
                <td className="px-4 py-3 text-sm text-brand-ink">{invoice.soldName || '-'}</td>
                <td className="px-4 py-3 text-sm text-brand-ink">{invoice.paymentMethod || '-'}</td>
                <td className="px-4 py-3 text-sm text-brand-ink">{formatMoney(invoice.total)}</td>
                <td className="px-4 py-3 text-sm text-brand-ink">{formatMoney(invoice.amountPaid)}</td>
                <td className="px-4 py-3 text-sm text-brand-ink">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title="Detail"
                      aria-label="Detail"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-brand-ink hover:bg-brand-paper"
                      onClick={() => onDetail(invoice.id)}
                    >
                      i
                    </button>
                    <button
                      type="button"
                      title="Edit"
                      aria-label="Edit"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-brand-ink hover:bg-brand-paper"
                      onClick={() => onEdit(invoice.id)}
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      title="Print"
                      aria-label="Print"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-brand-ink hover:bg-brand-paper"
                      onClick={() => onPrint(invoice.id)}
                    >
                      P
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
