import { Button, Text } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useWorkspaceDesigns } from '@root/hooks/useWorkspaceDesigns'

export const NewFlowButton = () => {
  const { translate } = useBuilderI18n()
  const { handleNewClick, error, isBusy } = useWorkspaceDesigns()

  return (
    <>
      <Button isDisabled={isBusy} size='sm' variant='secondary' onClick={handleNewClick}>
        <EditorIcon aria-hidden name='add' size={16} />
        {translate('newFlow.button')}
      </Button>
      {error ? <Text role='alert'>{error}</Text> : null}
    </>
  )
}
