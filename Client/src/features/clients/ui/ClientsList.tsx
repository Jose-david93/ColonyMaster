import type { ReactElement } from 'react'
import type { Client } from '@/features/clients/model/clientTypes'

interface ClientsListProps {
  clients: Client[]
  isLoading: boolean
  onDetail: (id: string) => void
  onEdit: (id: string) => void
}

/**
 * Renders the clients list table.
 */
export function ClientsList({ clients, isLoading, onDetail, onEdit }: ClientsListProps): ReactElement {
  if (isLoading) {
    return <p className="text-sm text-brand-steel">Loading clients...</p>
  }

  if (clients.length === 0) {
    return <p className="text-sm text-brand-steel">No clients found.</p>
  }

  return (
    <div className="overflow-hidden rounded-xl border border-brand-border">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-border">
          <thead className="bg-brand-paper">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">City</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">State</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Postal code</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-steel">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border bg-white">
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="px-4 py-3 text-sm text-brand-ink">{client.clientName}</td>
                <td className="px-4 py-3 text-sm text-brand-ink">{client.city}</td>
                <td className="px-4 py-3 text-sm text-brand-ink">{client.state}</td>
                <td className="px-4 py-3 text-sm text-brand-ink">{client.postalCode}</td>
                <td className="px-4 py-3 text-sm text-brand-ink">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title="Detail"
                      aria-label="Detail"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-brand-ink hover:bg-brand-paper"
                      onClick={() => onDetail(client.id)}
                    >
                      i
                    </button>
                    <button
                      type="button"
                      title="Edit"
                      aria-label="Edit"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border text-brand-ink hover:bg-brand-paper"
                      onClick={() => onEdit(client.id)}
                    >
                      ✎
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
