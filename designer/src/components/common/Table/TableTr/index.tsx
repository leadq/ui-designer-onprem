import type { ReactNode } from 'react'

export interface TableTrProps {
  children: ReactNode
}

export const TableTr = ({ children }: TableTrProps) => <tr>{children}</tr>
