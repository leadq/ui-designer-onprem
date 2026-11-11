import { Box, ButtonBase } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { Tooltip } from '@root/components/common/Tooltip'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useActionEditorStore } from '@root/stores/actionEditorStore'
import { useEditorStore } from '@root/stores/editor'

import { useActionMarkerGeometry } from './hooks/useActionMarkerGeometry'

import styles from './styles.module.scss'

/** Editor-only badges scale with their authored components. */
export const ActionMarkers = () => {
  const { translate } = useBuilderI18n()
  const { previewMode, sources, layerRef } = useActionMarkerGeometry()

  const handleOpen = (
    nodeId: string,
    mode: 'flow' | 'state' | 'note',
    trigger: HTMLButtonElement,
  ) => {
    // WebKit does not focus buttons on mouse click; give the dialog a return target.
    trigger.focus({ preventScroll: true })

    useEditorStore.getState().setSelectedNodeIds([nodeId])

    const editor = useActionEditorStore.getState()

    if (mode === 'state') {
      editor.openState([nodeId])
    } else if (mode === 'note') {
      editor.openNote(nodeId)
    } else {
      editor.open(nodeId)
    }
  }

  if (previewMode) {
    return null
  }

  return (
    <Box ref={layerRef} className={styles.actionMarkers}>
      {sources.map(({ node, hasAction, hasNote, hasState }) => (
        <Box
          key={node.id}
          className={styles.actionMarkers__group}
          data-node-markers={node.id}
          onClick={(event) => event.stopPropagation()}
          onDoubleClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          onContextMenu={(event) => {
            event.preventDefault()

            event.stopPropagation()
          }}
        >
          {hasAction ? (
            <Tooltip label={`${translate('action.marker')}: ${node.label ?? node.type}`}>
              <ButtonBase
                aria-label={`${translate('action.marker')}: ${node.label ?? node.type}`}
                className={styles.actionMarkers__badge}
                data-action-marker={node.id}
                onClick={(event) => handleOpen(node.id, 'flow', event.currentTarget)}
              >
                <EditorIcon aria-hidden name='action' size={15} strokeWidth={1.8} />
              </ButtonBase>
            </Tooltip>
          ) : null}
          {hasState ? (
            <Tooltip label={`${translate('componentState.marker')}: ${node.label ?? node.type}`}>
              <ButtonBase
                aria-label={`${translate('componentState.marker')}: ${node.label ?? node.type}`}
                className={`${styles.actionMarkers__badge} ${styles.actionMarkers__badgeNote}`}
                data-state-marker={node.id}
                onClick={(event) => handleOpen(node.id, 'state', event.currentTarget)}
              >
                <EditorIcon aria-hidden name='adjustments' size={15} strokeWidth={1.8} />
              </ButtonBase>
            </Tooltip>
          ) : null}
          {hasNote ? (
            <Tooltip label={`${translate('note.marker')}: ${node.label ?? node.type}`}>
              <ButtonBase
                aria-label={`${translate('note.marker')}: ${node.label ?? node.type}`}
                className={`${styles.actionMarkers__badge} ${styles.actionMarkers__badgeNote}`}
                data-note-marker={node.id}
                onClick={(event) => handleOpen(node.id, 'note', event.currentTarget)}
              >
                <EditorIcon aria-hidden name='note' size={15} strokeWidth={1.8} />
              </ButtonBase>
            </Tooltip>
          ) : null}
        </Box>
      ))}
    </Box>
  )
}
