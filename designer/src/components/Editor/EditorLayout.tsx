import { useEffect, useState } from 'react'
import { DndContext, pointerWithin } from '@dnd-kit/core'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import { hasAutosavedDesign } from '@root/utils/designDocument'
import { getStorageRejections } from '@root/utils/designer/storedContract'

import { Canvas } from '../Canvas/Canvas'
import { Box } from '../common'
import { LeftPanel } from '../LeftPanel/LeftPanel'
import { BehaviorListModal } from '../Modals/BehaviorListModal'
import { ExportTsxModal } from '../Modals/ExportTsxModal'
import { SaveDesignModal } from '../Modals/SaveDesignModal'
import { StartupModal } from '../Modals/StartupModal'
import { WorkspaceConfirmation } from '../Modals/WorkspaceConfirmation'
import { WorkspaceDesigns } from '../Modals/WorkspaceDesigns'
import { RightPanel } from '../RightPanel/RightPanel'

import { Header } from './Header/Header'
import { useEditorDrag } from './hooks/useEditorDrag'
import { useSelectionKey } from './hooks/useSelectionKey'
import { getDraggedElementRect } from './utils/getDraggedElementRect'
import { EditorDragOverlay } from './EditorDragOverlay'
import { PanelCollapseButton } from './PanelCollapseButton'
import { RejectedDesignNotice } from './RejectedDesignNotice'

import styles from './EditorLayout.module.scss'

export const EditorLayout = () => {
  const { translate } = useBuilderI18n()
  const [exportTsxModalOpened, setExportTsxModalOpened] = useState(false)
  const [manageModalOpened, setManageModalOpened] = useState(false)
  const [behaviorsModalOpened, setBehaviorsModalOpened] = useState(false)

  const [startupModalOpened, setStartupModalOpened] = useState(
    () => !hasAutosavedDesign() && getStorageRejections().length === 0,
  )

  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false)
  const selectionKey = useSelectionKey()
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(selectionKey === '')

  useEffect(() => {
    setIsRightPanelCollapsed(selectionKey === '')
  }, [selectionKey])

  const saveDesignNodeIds = useEditorStore((state) => state.saveDesignNodeIds)
  const cancelSaveDesign = useEditorStore((state) => state.cancelSaveDesign)
  const clearDesign = useEditorStore((state) => state.clearDesign)

  const {
    sensors,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleDragCancel,
    ...dragPreview
  } = useEditorDrag()

  const handleCancelSaveDesignClose = cancelSaveDesign

  return (
    <DndContext
      collisionDetection={pointerWithin}
      sensors={sensors}
      measuring={{
        draggable: {
          measure: getDraggedElementRect,
        },
      }}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
      onDragStart={handleDragStart}
    >
      <div
        className={[
          styles.layout,
          isLeftPanelCollapsed ? styles['layout--collapsed'] : '',
          isRightPanelCollapsed ? styles['layout--rightCollapsed'] : '',
        ].join(' ')}
      >
        <nav
          className={[styles.navbar, isLeftPanelCollapsed ? styles['navbar--collapsed'] : ''].join(
            ' ',
          )}
        >
          <LeftPanel isCollapsed={isLeftPanelCollapsed} />

          <PanelCollapseButton
            collapseLabel={translate('panel.left.collapse')}
            expandLabel={translate('panel.left.expand')}
            isCollapsed={isLeftPanelCollapsed}
            side='left'
            onToggle={() => setIsLeftPanelCollapsed((isCollapsed) => !isCollapsed)}
          />
        </nav>

        <header className={styles.header}>
          <Header
            onExportTsx={() => setExportTsxModalOpened(true)}
            onOpenDesigns={() => setManageModalOpened(true)}
          />
        </header>

        <main className={styles.main}>
          <Canvas onManageBehaviors={() => setBehaviorsModalOpened(true)} />
        </main>

        <aside className={styles.aside}>
          {!isRightPanelCollapsed && (
            <Box className={styles.aside__content}>
              <RightPanel />
            </Box>
          )}
          <PanelCollapseButton
            collapseLabel={translate('panel.right.collapse')}
            expandLabel={translate('panel.right.expand')}
            isCollapsed={isRightPanelCollapsed}
            side='right'
            onToggle={() => setIsRightPanelCollapsed((isCollapsed) => !isCollapsed)}
          />
        </aside>
      </div>

      <RejectedDesignNotice />
      <EditorDragOverlay
        activeItem={dragPreview.activeItem}
        centerOverlayOnCursor={dragPreview.centerOverlayOnCursor}
        isPalette={dragPreview.isPalette}
        paletteWidth={dragPreview.paletteWidth}
      />

      {saveDesignNodeIds.length > 0 && (
        <SaveDesignModal nodeIds={saveDesignNodeIds} onClose={handleCancelSaveDesignClose} />
      )}
      <ExportTsxModal
        isOpen={exportTsxModalOpened}
        onClose={() => setExportTsxModalOpened(false)}
      />
      <WorkspaceDesigns isOpen={manageModalOpened} onClose={() => setManageModalOpened(false)} />
      <BehaviorListModal
        isOpen={behaviorsModalOpened}
        onClose={() => setBehaviorsModalOpened(false)}
      />
      <StartupModal
        isOpen={startupModalOpened}
        onClose={() => {
          clearDesign()

          setStartupModalOpened(false)
        }}
        onSelectSaved={() => {
          setStartupModalOpened(false)

          setManageModalOpened(true)
        }}
      />
      <WorkspaceConfirmation />
    </DndContext>
  )
}
