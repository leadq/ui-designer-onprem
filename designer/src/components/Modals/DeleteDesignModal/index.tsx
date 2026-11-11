import { Button, Group, Modal, Stack, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { SlotComponent } from '@root/types/document'

export interface DeleteDesignModalProps {
  design: SlotComponent
  useCount: number
  onClose: () => void
  onConfirm: () => void
}

export const DeleteDesignModal = ({
  design,
  useCount,
  onClose,
  onConfirm,
}: DeleteDesignModalProps) => {
  const { translate } = useBuilderI18n()

  return (
    <Modal isOpen size='sm' title={translate('savedDesign.deleteTitle')} onClose={onClose}>
      <Stack gap='md'>
        <Text weight={600}>{design.name}</Text>
        <Text color='secondary'>
          {useCount > 0
            ? translate('savedDesign.inUse', { name: design.name })
            : translate('savedDesign.deleteConfirm', { name: design.name })}
        </Text>
        <Group gap='sm' justify='end'>
          <Button type='button' variant='outline' onClick={onClose}>
            {useCount > 0 ? translate('general.close') : translate('general.cancel')}
          </Button>
          {useCount === 0 && (
            <Button type='button' variant='danger' onClick={onConfirm}>
              {translate('savedDesign.delete')}
            </Button>
          )}
        </Group>
      </Stack>
    </Modal>
  )
}
