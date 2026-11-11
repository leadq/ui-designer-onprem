import { EditorIcon } from '@root/components/common/EditorIcon'

import { Box } from '../Box'

import styles from './styles.module.scss'

export const WarningIndicator = () => (
  <Box aria-hidden className={styles.warningIndicator}>
    <EditorIcon name='warning' size={36} strokeWidth={1.75} />
  </Box>
)
