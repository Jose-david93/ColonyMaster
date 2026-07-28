import type { ImgHTMLAttributes, ReactElement } from 'react'

interface BrandLogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  className?: string
}

/**
 * Renders the shared company brand logo.
 */
export function BrandLogo({ className, ...props }: BrandLogoProps): ReactElement {
  const classes = className ?? 'h-12 w-auto'

  return <img src="/brand/company-logo.jpeg" alt="Colony Master" className={classes} {...props} />
}
