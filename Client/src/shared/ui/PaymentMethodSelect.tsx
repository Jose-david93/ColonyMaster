import type { ReactElement } from 'react'

export const PAYMENT_METHOD_OPTIONS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Check',
  'e-Transfer',
  'Wire Transfer',
  'Other',
] as const

interface PaymentMethodSelectProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  disabled?: boolean
  error?: string
}

/**
 * Dropdown input for selecting supported payment methods.
 */
export function PaymentMethodSelect({
  id,
  label,
  value,
  onChange,
  onBlur,
  disabled,
  error,
}: PaymentMethodSelectProps): ReactElement {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-sm font-medium text-brand-ink">{label}</span>
      <select
        id={id}
        value={value}
        disabled={disabled}
        className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-brand-ink shadow-sm transition focus:outline-none focus:ring-2 ${error ? 'border-red-400 focus:ring-red-200' : 'border-brand-border focus:ring-brand-mist'}`}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
      >
        <option value="">Select a payment method</option>
        {PAYMENT_METHOD_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  )
}
