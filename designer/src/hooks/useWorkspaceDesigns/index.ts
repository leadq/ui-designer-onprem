import { useCallback, useState } from 'react'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import { createDesignDocument, type DesignDocument } from '@root/utils/designDocument'
import {
  activateWorkspaceDesign,
  createWorkspaceDesign,
} from '@root/utils/workspacePersistence/designs'
import { doWorkspaceTransition } from '@root/utils/workspacePersistence/doWorkspaceTransition'
import { listWorkspaceDesigns } from '@root/utils/workspacePersistence/persistence'
import { saveCurrentDesign } from '@root/utils/workspacePersistence/saveCurrentDesign'
import { getWorkspace } from '@root/utils/workspacePersistence/state'
import type { WorkspaceRecord } from '@root/utils/workspacePersistence/types'

export const useWorkspaceDesigns = () => {
  const { translate } = useBuilderI18n()
  const [designs, setDesigns] = useState<WorkspaceRecord[]>([])
  const [error, setError] = useState('')
  const [isBusy, setIsBusy] = useState(false)

  const handleMenuChange = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        setError('')

        void listWorkspaceDesigns()
          .then(setDesigns)
          .catch(() => setError(translate('workspace.failed')))
      }
    },
    [translate],
  )

  const handleSelectClick = async (
    id?: string,
    isCopy = false,
    nextAdapterId?: string,
    imported?: DesignDocument,
  ) => {
    setIsBusy(true)

    setError('')

    try {
      return await doWorkspaceTransition(
        async () => {
          const current = useEditorStore.getState()

          if (id) {
            await activateWorkspaceDesign(id)

            return
          }

          const document =
            imported ??
            createDesignDocument(
              isCopy ? current.nodes : [],
              isCopy
                ? `${current.pageName} — ${translate('workspace.copySuffix')}`
                : translate('newFlow.defaultName'),
              isCopy ? current.pageNotes : '',
              isCopy ? current.pageAnnotations : [],
              nextAdapterId ? undefined : current.slotComponents,
              nextAdapterId ?? current.adapterId,
            )

          createWorkspaceDesign(document)

          if (isCopy) {
            await saveCurrentDesign()
          }
        },
        !isCopy &&
          (!id ||
            getWorkspace().lastDocument !== getWorkspace().savedDocument ||
            getWorkspace().hasError),
      )
    } catch (error) {
      setError(
        translate(
          error instanceof Error && error.message === 'DESIGN_CHANGED_DURING_SWITCH'
            ? 'workspace.switchConflict'
            : 'workspace.failed',
        ),
      )

      return false
    } finally {
      setIsBusy(false)
    }
  }

  const handleSaveClick = async () => {
    if (getWorkspace().isSwitching) {
      return
    }

    setError('')

    try {
      await saveCurrentDesign()
    } catch {
      setError(translate('workspace.failed'))
    }
  }

  const handleImport = (document: DesignDocument) =>
    handleSelectClick(undefined, false, undefined, document)

  const handleDuplicateClick = () => handleSelectClick(undefined, true)
  const handleNewClick = () => handleSelectClick()

  return {
    designs,
    error,
    isBusy,
    handleMenuChange,
    handleSelectClick,
    handleNewClick,
    handleSaveClick,
    handleDuplicateClick,
    handleImport,
  }
}
