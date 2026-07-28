import { useEffect, useMemo, useState } from 'react'
import type { ReactElement } from 'react'

interface CurrencyInputProps {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
  onBlur?: () => void
  disabled?: boolean
  error?: string
  readOnly?: boolean
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0)
}

function parseCurrency(value: string): number {
  const normalized = value.replace(/[^0-9.-]/g, '')

  if (!normalized || normalized === '-' || normalized === '.') {
    return 0
  }

  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

function toEditableNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return '0'
  }

  return String(value)
}

/**
 * Reusable USD currency input with formatted display and numeric output.
 */
export function CurrencyInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  disabled,
  error,
  readOnly,
}: CurrencyInputProps): ReactElement {
  const [isFocused, setIsFocused] = useState(false)
  const [displayValue, setDisplayValue] = useState(() => formatCurrency(value))

  useEffect(() => {
    if (isFocused) {
      return
    }

    setDisplayValue(formatCurrency(value))
  }, [value, isFocused])

  const classes = useMemo(() => {
    return `w-full rounded-xl border px-3 py-2 text-sm text-brand-ink shadow-sm transition placeholder:text-brand-steel/60 focus:outline-none focus:ring-2 ${error ? 'border-red-400 focus:ring-red-200' : 'border-brand-border focus:ring-brand-mist'}`
  }, [error])

  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-sm font-medium text-brand-ink">{label}</span>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={displayValue}
        disabled={disabled}
        readOnly={readOnly}
        className={classes}
        onChange={(event) => {
          const rawValue = event.target.value
          setDisplayValue(rawValue)
          onChange(parseCurrency(rawValue))
        }}
        onFocus={() => {
          setIsFocused(true)
          setDisplayValue(toEditableNumber(value))

          requestAnimationFrame(() => {
            const element = document.getElementById(id)

            if (element instanceof HTMLInputElement) {
              element.select()
            }
          })
        }}
        onBlur={() => {
          const parsedValue = parseCurrency(displayValue)
          onChange(parsedValue)
          setDisplayValue(formatCurrency(parsedValue))
          setIsFocused(false)
          onBlur?.()
        }}
      />
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  )
}
