import { useState, useSyncExternalStore } from 'react'
import { Button, Modal, Stack, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import {
  getStorageRejections,
  subscribeStorageRejections,
} from '@root/utils/designer/storedContract'
import { downloadFile } from '@root/utils/designExport/downloadFile'

export const RejectedDesignNotice = () => {
  const { translate } = useBuilderI18n()
  const records = useSyncExternalStore(subscribeStorageRejections, getStorageRejections)
  const [dismissedCount, setDismissedCount] = useState(0)

  return (
    <Modal
      isOpen={records.length > dismissedCount}
      title={translate('recovery.title')}
      onClose={() => setDismissedCount(records.length)}
    >
      <Stack>
        <Text>{translate('recovery.description')}</Text>
        {records.map((record, index) => (
          <Stack key={`${record.key}-${index}`}>
            <Text>{record.reason}</Text>
            <Button onClick={() => downloadFile(record.raw, `rejected-design-${index + 1}.json`)}>
              {translate('recovery.download')}
            </Button>
          </Stack>
        ))}
      </Stack>
    </Modal>
  )
}
