import type { ReactNode } from 'react'
import { EditorIcon } from '@root/components/common/EditorIcon'

import { Box } from '../Box'
import { Text } from '../Text'

import styles from './styles.module.scss'

export interface HintProps {
  children: ReactNode
}

export const Hint = ({ children }: HintProps) => (
  <Box className={styles.hint}>
    <EditorIcon aria-hidden name='info' size={18} />
    <Text className={styles.hint__text}>{children}</Text>
  </Box>
)
