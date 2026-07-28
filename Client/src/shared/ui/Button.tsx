import type { ButtonHTMLAttributes, ReactElement } from 'react'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

/**
 * Reusable button component with visual variants.
 */
export function Button({
  variant = 'primary',
  className,
  type = 'button',
  ...props
}: ButtonProps): ReactElement {
  const baseStyles =
    'inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

  const variantStyles =
    variant === 'secondary'
      ? 'border border-brand-border bg-brand-surface text-brand-ink hover:bg-brand-paper focus-visible:outline-brand-steel'
      : 'bg-brand-ink text-white hover:bg-brand-steel focus-visible:outline-brand-ink'

  const classes = className ? `${baseStyles} ${variantStyles} ${className}` : `${baseStyles} ${variantStyles}`

  return <button type={type} className={classes} {...props} />
}
