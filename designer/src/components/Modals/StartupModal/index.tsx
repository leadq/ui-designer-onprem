import { Box, Card, Heading, Modal, Stack, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import styles from './styles.module.scss'

export interface StartupModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectSaved: () => void
}

export const StartupModal = ({ isOpen: opened, onClose, onSelectSaved }: StartupModalProps) => {
  const { translate } = useBuilderI18n()

  return (
    <Modal isOpen={opened} isOutsideClickCloseEnabled={false} size='lg' onClose={onClose}>
      <Box className={styles.startupModal}>
        <Stack align='center' className={styles.startupModal__intro}>
          <Heading order={1}>{translate('startup.title')}</Heading>
          <Text color='secondary'>{translate('startup.subtitle')}</Text>
        </Stack>

        <Box className={styles.startupModal__choices}>
          <Card as='button' className={styles.startupModal__choice} padding='lg' onClick={onClose}>
            <Stack align='center' gap='md'>
              <Text className={styles.startupModal__icon}>✨</Text>
              <Heading order={3}>{translate('startup.fresh.title')}</Heading>
              <Text color='secondary' size='sm'>
                {translate('startup.fresh.description')}
              </Text>
            </Stack>
          </Card>

          <Card
            as='button'
            className={styles.startupModal__choice}
            padding='lg'
            onClick={onSelectSaved}
          >
            <Stack align='center' gap='md'>
              <Text className={styles.startupModal__icon}>📁</Text>
              <Heading order={3}>{translate('startup.templates.title')}</Heading>
              <Text color='secondary' size='sm'>
                {translate('startup.templates.description')}
              </Text>
            </Stack>
          </Card>
        </Box>
      </Box>
    </Modal>
  )
}
