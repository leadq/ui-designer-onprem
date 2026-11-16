import { useRef } from 'react'
import { Box, Button, Group, InfoPopover, Select, Text } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { InputControl } from '@root/components/common/InputControl'
import { type BuilderTranslationKey } from '@root/contexts/BuilderI18nContext/context'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import translations from '@root/i18n/tr.json'
import { useReferenceStore } from '@root/stores/referenceStore'
import type { ReferenceImage } from '@root/types/references'
import { fitCanvas } from '@root/utils/canvas/navigation'

import styles from './styles.module.scss'

export interface ReferencePanelProps {
  images: ReferenceImage[]
  error: string
  progress: number | null
  syncedIds: string[]
  onAdd: (files: File[]) => void
  onSync: () => void
  onRemove: (id: string) => void
  onCancel: () => void
}

export const ReferencePanel = ({
  images,
  error,
  progress,
  syncedIds,
  onAdd,
  onSync,
  onRemove,
  onCancel,
}: ReferencePanelProps) => {
  const { translate } = useBuilderI18n()
  const selectedId = useReferenceStore((state) => state.selectedId)
  const fileRef = useRef<HTMLInputElement>(null)
  const selected = images.find((image) => image.id === selectedId)

  return (
    <Box
      data-designer-chrome
      aria-label={translate('reference.title')}
      className={styles.referencePanel}
    >
      <Group gap='sm' justify='between'>
        <Text weight={600}>{translate('reference.title')}</Text>
        <Group gap='xs'>
          <InfoPopover icon='help' label={translate('reference.helpTitle')}>
            <Text>{translate('reference.help')}</Text>
          </InfoPopover>
          <Button
            aria-label={translate('reference.close')}
            size='sm'
            variant='ghost'
            onClick={() => useReferenceStore.getState().setOpen(false)}
          >
            <EditorIcon name='close' size={18} />
          </Button>
        </Group>
      </Group>
      <Text color='secondary' size='xs'>
        {translate('reference.instructions')}
      </Text>
      <InputControl
        ref={fileRef}
        hidden
        multiple
        accept='image/png,image/jpeg,image/webp'
        aria-label={translate('reference.add')}
        type='file'
        onChange={(event) => {
          onAdd([...(event.target.files ?? [])])

          event.target.value = ''
        }}
      />
      <Group isWrapping gap='sm'>
        <Button
          isDisabled={progress !== null}
          size='sm'
          variant='outline'
          onClick={() => fileRef.current?.click()}
        >
          <EditorIcon name='upload' size={16} />
          {translate('reference.add')}
        </Button>
        <Button
          isDisabled={!images.length || progress !== null}
          size='sm'
          variant='ghost'
          onClick={onSync}
        >
          {translate('reference.backendSync')}
        </Button>
      </Group>
      {progress !== null && (
        <Group justify='between'>
          <Text role='status'>{translate('reference.progress', { value: progress })}</Text>
          <Button size='sm' variant='ghost' onClick={onCancel}>
            {translate('reference.cancel')}
          </Button>
        </Group>
      )}
      {error ? (
        <Text role='alert' size='xs'>
          {translate(
            error in translations ? (error as BuilderTranslationKey) : 'reference.storageError',
          )}
        </Text>
      ) : null}
      {!selected && <Text color='secondary'>{translate('reference.empty')}</Text>}
      {selected ? (
        <>
          <Select
            label={translate('reference.selected')}
            value={selected.id}
            data={images.map((image, index) => ({
              value: image.id,
              label: `${index + 1}. ${image.name}`,
            }))}
            onChange={(event) => useReferenceStore.getState().select(event.target.value)}
          />
          <Group isWrapping gap='xs' justify='between'>
            <Text color='secondary' size='xs'>
              {selected.width} × {selected.height} ·{' '}
              {translate(
                syncedIds.includes(selected.id) ? 'reference.backendReady' : 'reference.local',
              )}
            </Text>
          </Group>
          <Text color='secondary' size='xs'>
            {translate('reference.canvasHelp')}
          </Text>
          <Button size='sm' variant='outline' onClick={() => fitCanvas(true)}>
            {translate('reference.fitScreen')}
          </Button>
          <Button
            isDisabled={progress !== null}
            size='sm'
            variant='ghost'
            onClick={() => onRemove(selected.id)}
          >
            {translate('reference.remove')}
          </Button>
        </>
      ) : null}
    </Box>
  )
}
