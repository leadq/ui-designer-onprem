import { Button, Modal, Text } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { Tooltip as EditorTooltip } from '@root/components/common/Tooltip'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import { usePreviewTab } from './hooks/usePreviewTab'

export const OpenPreviewButton = () => {
  const { translate } = useBuilderI18n()
  const { isBlocked, handleOpenClick, handleDismissClose } = usePreviewTab()

  return (
    <>
      <EditorTooltip label={translate('preview.newTab')}>
        <Button size='sm' variant='outline' onClick={handleOpenClick}>
          <EditorIcon name='preview' size={16} />
          {translate('preview.open')}
        </Button>
      </EditorTooltip>
      <Modal isOpen={isBlocked} title={translate('preview.open')} onClose={handleDismissClose}>
        <Text>{translate('preview.blocked')}</Text>
      </Modal>
    </>
  )
}
