import { Children, type ReactNode } from 'react'

/** Editor-only hints replace empty content without adding wrappers or document nodes. */
export const renderContainerContent = (
  children: ReactNode,
  emptyContent: ReactNode = null,
): ReactNode =>
  Children.toArray(children).some((child) => typeof child !== 'string' || child.trim().length > 0)
    ? children
    : (emptyContent ?? children)
