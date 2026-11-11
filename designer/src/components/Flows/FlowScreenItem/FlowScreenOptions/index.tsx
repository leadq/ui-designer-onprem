import { Box, Button, Group, Text } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import styles from '../styles.module.scss'

export interface FlowScreenOptionsProps {
  isOverlay: boolean
  isPreview: boolean
  isStart: boolean
  isConfirmingDelete: boolean
  onMakeStart: () => void
  onDelete: () => void
  onConfirmDeleteChange: (value: boolean) => void
}

export const FlowScreenOptions = ({
  isOverlay,
  isPreview,
  isStart,
  isConfirmingDelete,
  onMakeStart: handleMakeStartClick,
  onDelete: handleDelete,
  onConfirmDeleteChange: handleConfirmDeleteChange,
}: FlowScreenOptionsProps) => {
  const { translate } = useBuilderI18n()

  return (
    <Box className={styles.flowScreenItem__settings}>
      {!isOverlay && (
        <Button
          isDisabled={isPreview || isStart}
          size='sm'
          variant='ghost'
          onClick={handleMakeStartClick}
        >
          <EditorIcon aria-hidden name='preview' size={14} />
          {isStart ? translate('flow.firstScreen') : translate('flow.makeStart')}
        </Button>
      )}
      {isConfirmingDelete ? (
        <>
          <Text size='xs'>{translate('flow.deleteScreenHint')}</Text>
          <Group gap='xs'>
            <Button
              isDisabled={isPreview}
              size='sm'
              variant='danger'
              onClick={() => handleDelete()}
            >
              {translate('flow.deleteScreen')}
            </Button>
            <Button size='sm' variant='ghost' onClick={() => handleConfirmDeleteChange(false)}>
              {translate('flow.cancel')}
            </Button>
          </Group>
        </>
      ) : (
        <Button
          isDisabled={isPreview}
          size='sm'
          variant='ghost'
          onClick={() => handleConfirmDeleteChange(true)}
        >
          {translate('flow.deleteScreen')}
        </Button>
      )}
    </Box>
  )
}
