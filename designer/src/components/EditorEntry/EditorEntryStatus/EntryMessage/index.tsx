import { Box } from '@root/components/common/Box'
import { Button } from '@root/components/common/Button'
import { Card } from '@root/components/common/Card'
import { Text } from '@root/components/common/Text'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import styles from '../styles.module.scss'

interface EntryMessageProps {
  status: 'checking' | 'blocked' | 'unavailable' | 'storageError'
}

export const EntryMessage = ({ status }: EntryMessageProps) => {
  const { translate } = useBuilderI18n()
  const handleRetryClick = () => window.location.reload()

  return (
    <Box className={styles.editorEntry} role='status'>
      <Card className={styles.editorEntry__card} padding='lg'>
        <Text size='xl' weight={600}>
          {translate(`editorEntry.${status}.title`)}
        </Text>
        <Text color='secondary'>{translate(`editorEntry.${status}.description`)}</Text>
        {status !== 'checking' && (
          <Button onClick={handleRetryClick}>{translate('editorEntry.retry')}</Button>
        )}
      </Card>
    </Box>
  )
}
