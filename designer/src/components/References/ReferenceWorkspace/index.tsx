import { type ReactNode, useMemo, useState } from 'react'
import { Box, Text } from '@root/components/common'
import { ReferenceActionsContext } from '@root/contexts/ReferenceActionsContext'
import { useReferenceImages } from '@root/hooks/references/useReferenceImages'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useReferenceStore } from '@root/stores/referenceStore'

import { ReferencePanel } from '../ReferencePanel'

import styles from './styles.module.scss'

export interface ReferenceWorkspaceProps {
  children: ReactNode
}

export const ReferenceWorkspace = ({ children }: ReferenceWorkspaceProps) => {
  const { translate } = useBuilderI18n()
  const operation = useReferenceStore((state) => state.operation)
  const workspaceError = useReferenceStore((state) => state.workspaceError)
  const isOpen = useReferenceStore((state) => state.isOpen)
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const { handleAdd, handleSync, handleRemove, handleCancel, ...state } = useReferenceImages()
  const actions = useMemo(() => ({ onRemove: handleRemove }), [handleRemove])

  return (
    <Box
      className={styles.referenceWorkspace}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsDraggingFile(false)
        }
      }}
      onDragOverCapture={(event) => {
        if (event.dataTransfer.types.includes('Files')) {
          event.preventDefault()

          event.dataTransfer.dropEffect = 'copy'

          setIsDraggingFile(true)
        }
      }}
      onDropCapture={(event) => {
        setIsDraggingFile(false)

        if (!event.dataTransfer.files.length) {
          return
        }

        event.preventDefault()

        event.stopPropagation()

        useReferenceStore.getState().setOpen(true)

        void handleAdd([...event.dataTransfer.files])
      }}
    >
      {isOpen ? (
        <ReferencePanel
          error={state.error}
          images={state.images}
          progress={state.progress}
          syncedIds={state.syncedIds}
          onAdd={handleAdd}
          onCancel={handleCancel}
          onRemove={handleRemove}
          onSync={handleSync}
        />
      ) : null}
      <ReferenceActionsContext.Provider value={actions}>
        {children}
      </ReferenceActionsContext.Provider>
      {workspaceError ? <Text role='alert'>{translate('reference.storageError')}</Text> : null}
      {operation ? (
        <Box
          className={styles.referenceWorkspace__status}
          role='status'
          onClick={() => useReferenceStore.getState().setOperation(null)}
        >
          <Text size='sm'>{translate(`reference.operation.${operation}`)}</Text>
        </Box>
      ) : null}
      {isDraggingFile ? (
        <Box className={styles.referenceWorkspace__drop}>
          <Text weight={600}>{translate('reference.drop')}</Text>
        </Box>
      ) : null}
    </Box>
  )
}
