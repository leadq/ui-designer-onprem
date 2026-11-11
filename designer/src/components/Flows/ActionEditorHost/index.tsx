import { Modal, Stack } from '@root/components/common'
import { InteractionEditorModal } from '@root/components/Modals/InteractionEditorModal'
import { NoteEditorModal } from '@root/components/Modals/NoteEditorModal'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useActionEditorStore } from '@root/stores/actionEditorStore'
import { useEditorStore } from '@root/stores/editor'
import { findNode } from '@root/utils/nodes'

import { SelectionState } from '../SelectionState'
import { ToggleBindingEditor } from '../ToggleBindingEditor'

export const ActionEditorHost = () => {
  const { translate } = useBuilderI18n()
  const { nodeId, mode, stateNodeIds, close } = useActionEditorStore()
  const nodes = useEditorStore((state) => state.nodes)
  const previewMode = useEditorStore((state) => state.previewMode)

  if (!nodeId || previewMode || !findNode(nodes, nodeId)) {
    return null
  }

  if (mode === 'note') {
    const handleCloseClose = close

    return <NoteEditorModal isOpen targetNodeId={nodeId} onClose={handleCloseClose} />
  }

  if (mode === 'state') {
    const handleCloseClose = close

    return (
      <Modal isOpen size='lg' title={translate('componentState.title')} onClose={handleCloseClose}>
        <Stack gap='md'>
          <SelectionState isExpanded nodeIds={stateNodeIds} />
          {stateNodeIds.length === 1 && <ToggleBindingEditor isExpanded nodeId={nodeId} />}
        </Stack>
      </Modal>
    )
  }

  const handleCloseClose = close

  return <InteractionEditorModal key={nodeId} isOpen nodeId={nodeId} onClose={handleCloseClose} />
}
