import { EditorIcon } from '@root/components/common/EditorIcon'
import { Menu } from '@root/components/common/Menu'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import { useReferenceStore } from '@root/stores/referenceStore'
import { createDesignDocument } from '@root/utils/designDocument'
import { downloadFile } from '@root/utils/designExport'
import { getFrameExportEligibility } from '@root/utils/frames/frameExport/getFrameExportEligibility'
import { getSelectedFrameExport } from '@root/utils/frames/frameExport/getSelectedFrameExport'

const JSON_INDENT = 2

export const SelectedFramesExportItem = () => {
  const { translate } = useBuilderI18n()
  const nodes = useEditorStore((state) => state.nodes)
  const selectedFrameIds = useEditorStore((state) => state.selectedFrameIds)
  const selectedNodeIds = useEditorStore((state) => state.selectedNodeIds)
  const previewMode = useEditorStore((state) => state.previewMode)
  const selectedReferenceIds = useReferenceStore((state) => state.selectedIds)

  const eligibility = getFrameExportEligibility(
    { nodes },
    { selectedFrameIds, selectedNodeIds, selectedReferenceIds, previewMode },
  )

  const handleExportClick = () => {
    const state = useEditorStore.getState()

    const document = createDesignDocument(
      state.nodes,
      state.pageName,
      state.pageNotes,
      state.pageAnnotations,
      state.slotComponents,
      state.adapterId,
    )

    const selection = { ...state, selectedReferenceIds: useReferenceStore.getState().selectedIds }

    if (!getFrameExportEligibility(document, selection).eligible) {
      return
    }

    try {
      const exported = getSelectedFrameExport(document, selection)
      const name = state.pageName.replace(/[^a-zA-Z0-9_-]/g, '_') || 'design'

      downloadFile(
        JSON.stringify(exported.document, null, JSON_INDENT),
        `${name}.selected-frames.json`,
      )
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(
        translate('header.selectedFramesFailed', {
          reason: error instanceof Error ? error.message : '',
        }),
      )
    }
  }

  return (
    <Menu.Item
      disabled={!eligibility.eligible}
      leftSection={<EditorIcon name='download' size={14} />}
      title={translate('header.selectedFramesHelp')}
      onClick={handleExportClick}
    >
      {translate('header.exportSelectedFrames')}
    </Menu.Item>
  )
}
