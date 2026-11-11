import type { ReactNode } from 'react'

export interface TableTheadProps {
  children: ReactNode
}

export const TableThead = ({ children }: TableTheadProps) => <thead>{children}</thead>
