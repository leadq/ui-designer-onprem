import { useEffect } from 'react'
import { shallow } from 'zustand/shallow'

import { EditorLayout } from './components/Editor/EditorLayout'
import { ShortcutManager } from './components/ShortcutManager/ShortcutManager'
import { BuilderI18nProvider } from './contexts/BuilderI18nContext'
import { useSelectionReferenceSync } from './hooks/references/useSelectionReferenceSync'
import { useBackendBridge } from './hooks/useBackendBridge'
import { useEditorStore } from './stores/editor'
import { createDesignDocument, saveAutosavedDesign } from './utils/designDocument'
import { getWorkspace } from './utils/workspacePersistence/getWorkspace'
import { notifyWorkspace } from './utils/workspacePersistence/notifyWorkspace'
import { persistComponentLibrary } from './utils/workspacePersistence/persistComponentLibrary'
import { updateWorkspaceDocument } from './utils/workspacePersistence/updateWorkspaceDocument'

export const App = () => {
  useSelectionReferenceSync()

  useBackendBridge()

  // Persist local edits; MCP reads the live workspace through WebSocket on demand.
  useEffect(() => {
    const currentState = useEditorStore.getState()

    updateWorkspaceDocument(
      createDesignDocument(
        currentState.nodes,
        currentState.pageName,
        currentState.pageNotes,
        currentState.pageAnnotations,
        currentState.slotComponents,
        currentState.adapterId,
      ),
    )

    notifyWorkspace()

    // Local autosave remains independent of the MCP connection.
    const unsubscribe = useEditorStore.subscribe(
      (state) => ({
        nodes: state.nodes,
        pageName: state.pageName,
        pageNotes: state.pageNotes,
        pageAnnotations: state.pageAnnotations,
        slotComponents: state.slotComponents,
        adapterId: state.adapterId,
      }),
      (input, previous) => {
        if (getWorkspace().isApplying) {
          return
        }

        if (input.slotComponents !== previous.slotComponents) {
          void persistComponentLibrary(input.adapterId, input.slotComponents).catch(() => {})
        }

        saveAutosavedDesign(
          createDesignDocument(
            input.nodes,
            input.pageName,
            input.pageNotes,
            input.pageAnnotations,
            input.slotComponents,
            input.adapterId,
          ),
        )
      },
      { equalityFn: shallow },
    )

    return unsubscribe
  }, [])

  return (
    <BuilderI18nProvider>
      <ShortcutManager />
      <EditorLayout />
    </BuilderI18nProvider>
  )
}
