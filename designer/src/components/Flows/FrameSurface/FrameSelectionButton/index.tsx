import type { MouseEvent } from 'react'
import { Button } from '@root/components/common/Button'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { Tooltip } from '@root/components/common/Tooltip'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import { useReferenceStore } from '@root/stores/referenceStore'

export interface FrameSelectionButtonProps {
  frameId: string
  label: string
  className: string
}

export const FrameSelectionButton = ({ frameId, label, className }: FrameSelectionButtonProps) => {
  const { translate } = useBuilderI18n()
  const isSelected = useEditorStore((state) => state.selectedFrameIds.includes(frameId))

  const handleSelectClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()

    useReferenceStore.getState().clearSelection()

    useEditorStore.getState().selectFrameContents(frameId, true)
  }

  return (
    <Tooltip label={translate('flow.selectWholeScreenHint')}>
      <Button
        aria-label={translate('flow.selectWholeScreen', { name: label })}
        aria-pressed={isSelected}
        className={className}
        data-frame-selection-control={frameId}
        size='sm'
        variant='ghost'
        onClick={handleSelectClick}
      >
        <EditorIcon aria-hidden name={isSelected ? 'selected' : 'unselected'} size={16} />
      </Button>
    </Tooltip>
  )
}
