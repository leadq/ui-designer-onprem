import type { ReactNode } from 'react'

import { TableTbody } from './TableTbody'
import { TableTd } from './TableTd'
import { TableTh } from './TableTh'
import { TableThead } from './TableThead'
import { TableTr } from './TableTr'

import styles from './styles.module.scss'

export const Table = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => (
  <div className={styles.table__container}>
    <table className={[styles.table, className].join(' ')}>{children}</table>
  </div>
)

Table.Thead = TableThead

Table.Tbody = TableTbody

Table.Tr = TableTr

Table.Th = TableTh

Table.Td = TableTd
