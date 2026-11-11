import { useState } from 'react'
import { Button, Group, Stack } from '@root/components/common'
import { AnchoredPopover } from '@root/components/common/AnchoredPopover'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import { IconPicker } from '../IconPicker'

export interface IconSelectionPopoverProps {
  anchor: HTMLElement
  value: string
  onChange: (value: string) => void
  onClose: () => void
}

export const IconSelectionPopover = ({
  anchor,
  value,
  onChange,
  onClose,
}: IconSelectionPopoverProps) => {
  const [draft, setDraft] = useState(value)
  const handleDraftChange = setDraft
  const { translate } = useBuilderI18n()

  return (
    <AnchoredPopover anchor={anchor} label={translate('icons.choose')} onClose={onClose}>
      <Stack gap='sm'>
        <IconPicker value={draft} onChange={handleDraftChange} />
        <Group gap='sm' justify='end'>
          <Button variant='ghost' onClick={onClose}>
            {translate('general.cancel')}
          </Button>
          <Button
            isDisabled={!draft}
            onClick={() => {
              onChange(draft)

              onClose()
            }}
          >
            {translate('icons.confirm')}
          </Button>
        </Group>
      </Stack>
    </AnchoredPopover>
  )
}
