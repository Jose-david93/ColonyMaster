import { forwardRef } from 'react'
import type { InputHTMLAttributes, ReactElement } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

/**
 * Reusable form input with label and validation state.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, error, className, ...props },
  ref,
): ReactElement {
  const classes = className
    ? `w-full rounded-xl border px-3 py-2 text-sm text-brand-ink shadow-sm transition placeholder:text-brand-steel/60 focus:outline-none focus:ring-2 ${error ? 'border-red-400 focus:ring-red-200' : 'border-brand-border focus:ring-brand-mist'} ${className}`
    : `w-full rounded-xl border px-3 py-2 text-sm text-brand-ink shadow-sm transition placeholder:text-brand-steel/60 focus:outline-none focus:ring-2 ${error ? 'border-red-400 focus:ring-red-200' : 'border-brand-border focus:ring-brand-mist'}`

  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-sm font-medium text-brand-ink">{label}</span>
      <input ref={ref} id={id} className={classes} {...props} />
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  )
})
