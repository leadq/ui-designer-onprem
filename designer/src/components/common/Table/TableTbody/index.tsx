import type { ReactNode } from 'react'

export interface TableTbodyProps {
  children: ReactNode
}

export const TableTbody = ({ children }: TableTbodyProps) => <tbody>{children}</tbody>
