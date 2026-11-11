import type { ReactNode } from 'react'

export interface TableTdProps {
  children?: ReactNode
}

export const TableTd = ({ children }: TableTdProps) => <td>{children}</td>
