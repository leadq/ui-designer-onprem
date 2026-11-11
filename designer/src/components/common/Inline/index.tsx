import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

export interface InlineProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode
}

/** Phrasing-content host for inline assets, including icons inside native button/label slots. */
export const Inline = forwardRef<HTMLSpanElement, InlineProps>((props, ref) => (
  <span ref={ref} {...props} />
))

Inline.displayName = 'Inline'
