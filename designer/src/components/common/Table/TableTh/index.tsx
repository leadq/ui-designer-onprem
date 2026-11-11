import type { ReactNode } from 'react'

export interface TableThProps {
  children?: ReactNode
}

export const TableTh = ({ children }: TableThProps) => <th>{children}</th>
