import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
))

Box.displayName = 'Box'
