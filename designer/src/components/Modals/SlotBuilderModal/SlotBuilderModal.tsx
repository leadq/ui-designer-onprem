import { getAdapter } from '@root/adapters'
import { Modal } from '@root/components/common'
import { ButtonBase } from '@root/components/common/ButtonBase'
import { IconEditingProvider } from '@root/contexts/IconEditingContext'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'

import { COMPONENT_ICONS } from './constants/componentIcons'
import { useSlotBuilder } from './hooks/useSlotBuilder'
import { SlotBuilderInspector } from './SlotBuilderInspector'
import { SlotBuilderWorkspace } from './SlotBuilderWorkspace'
import { SlotTemplateNameInput } from './SlotTemplateNameInput'

import styles from './styles.module.scss'

interface SlotBuilderModalProps {
  isOpened: boolean
  slotNodes: DesignNode[]
  isMultiple: boolean
  title: string
  initialName?: string
  onApply: (nodes: DesignNode[], name: string) => void
  onClose: () => void
}

export const SlotBuilderModal = ({
  isOpened,
  slotNodes,
  isMultiple,
  title,
  initialName = '',
  onApply,
  onClose,
}: SlotBuilderModalProps) => {
  const adapterId = useEditorStore((state) => state.adapterId)
  const AdapterProvider = getAdapter(adapterId).Provider
  const { translate } = useBuilderI18n()

  const {
    localNodes,
    selectedNodeId,
    templateName,
    setTemplateName,
    handleAddComponent,
    handlePropChange,
    handleStyleChange,
    selectedNode,
    selectedMeta,
    handleSetSelectedNodeIdSelect,
    handleDeleteNodeDelete,
    handleMoveNodeMove,
  } = useSlotBuilder(isOpened, slotNodes, initialName, isMultiple)

  const handleTemplateNameChange = setTemplateName

  return (
    <Modal isOpen={isOpened} size='xl' title={title} onClose={onClose}>
      <IconEditingProvider
        selectedIds={selectedNodeId ? [selectedNodeId] : []}
        onChange={(_id, value) => handlePropChange('glyph', value)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
          {/* Slot Component Name Input */}
          <SlotTemplateNameInput templateName={templateName} onChange={handleTemplateNameChange} />

          <div className={styles.slotBuilderModal__content}>
            {/* Left Side: Palette */}
            <div className={styles.slotBuilderModal__palette}>
              <div className={styles.slotBuilderModal__paletteTitle}>
                {translate('slotBuilder.palette')}
              </div>
              <div className={styles.slotBuilderModal__paletteGrid}>
                {Object.values(registry)
                  .filter((meta) => !meta.collectionItem && !meta.collection)
                  .filter((comp) => comp.type !== 'list' && !comp.overlay) // Frame-owned overlays cannot be embedded in item templates
                  .map((comp) => (
                    <ButtonBase
                      key={comp.type}
                      className={styles.slotBuilderModal__paletteBtn}
                      type='button'
                      onClick={() => handleAddComponent(comp.type)}
                    >
                      <span className={styles.slotBuilderModal__paletteBtnIcon}>
                        {COMPONENT_ICONS[comp.type] ?? '📦'}
                      </span>
                      <span>{comp.displayName}</span>
                    </ButtonBase>
                  ))}
              </div>
            </div>

            {/* Center Section: Canvas & Tree */}
            <SlotBuilderWorkspace
              AdapterProvider={AdapterProvider}
              isMultiple={isMultiple}
              localNodes={localNodes}
              selectedNodeId={selectedNodeId}
              onDelete={handleDeleteNodeDelete}
              onMove={handleMoveNodeMove}
              onSelect={handleSetSelectedNodeIdSelect}
            />

            {/* Right Side: Property Panel */}
            <SlotBuilderInspector
              selectedMeta={selectedMeta}
              selectedNode={selectedNode}
              onPropChange={handlePropChange}
              onStyleChange={handleStyleChange}
            />
          </div>
        </div>
      </IconEditingProvider>
      {/* Footer */}
      <div className={styles.slotBuilderModal__footer}>
        <ButtonBase className={styles.slotBuilderModal__btn} type='button' onClick={onClose}>
          {translate('slotBuilder.cancel')}
        </ButtonBase>
        <ButtonBase
          type='button'
          className={[styles.slotBuilderModal__btn, styles['slotBuilderModal__btn--primary']].join(
            ' ',
          )}
          onClick={() => onApply(localNodes, templateName)}
        >
          {translate('slotBuilder.save')}
        </ButtonBase>
      </div>
    </Modal>
  )
}
