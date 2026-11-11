import { Button } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useReferenceStore } from '@root/stores/referenceStore'

export const ReferenceButton = () => {
  const { translate } = useBuilderI18n()
  const isOpen = useReferenceStore((state) => state.isOpen)
  const count = useReferenceStore((state) => state.images.length)

  return (
    <Button
      aria-expanded={isOpen}
      size='sm'
      variant='ghost'
      onClick={() => useReferenceStore.getState().setOpen(!isOpen)}
    >
      <EditorIcon aria-hidden name='reference' size={16} />
      {translate('reference.title')}
      {count > 0 ? ` (${count})` : ''}
    </Button>
  )
}
