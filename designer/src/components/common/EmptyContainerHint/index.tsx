import { Box, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import styles from './styles.module.scss'

export interface EmptyContainerHintProps {
  isSpacingHintVisible?: boolean
}

export const EmptyContainerHint = ({ isSpacingHintVisible = false }: EmptyContainerHintProps) => {
  const { translate } = useBuilderI18n()

  return (
    <Box data-designer-empty-container className={styles.emptyContainerHint}>
      <Text className={styles.emptyContainerHint__text} size='xs'>
        {translate('canvas.emptyContainer')}
      </Text>
      <Text className={styles.emptyContainerHint__text} size='xs'>
        {translate('canvas.emptyContainerDrop')}
      </Text>
      {isSpacingHintVisible ? (
        <Text className={styles.emptyContainerHint__text} size='xs'>
          {translate('canvas.emptyContainerSpacing')}
        </Text>
      ) : null}
    </Box>
  )
}
