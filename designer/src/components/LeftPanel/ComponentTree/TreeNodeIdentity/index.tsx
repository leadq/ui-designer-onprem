import type { KeyboardEventHandler, RefObject } from 'react'
import { Box, Input, Text } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { Tooltip as EditorTooltip } from '@root/components/common/Tooltip'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'

import styles from './styles.module.scss'

export interface TreeNodeIdentityProps {
  node: DesignNode
  displayName: string
  isEditing: boolean
  editValue: string
  inputRef: RefObject<HTMLInputElement>
  onEditValueChange: (value: string) => void
  onSave: () => void
  onKeyDown: KeyboardEventHandler<HTMLInputElement>
}

const CATEGORY_ICONS: Record<string, string> = { layout: '📦', form: '📝', display: '📄' }

export const TreeNodeIdentity = ({
  node,
  displayName,
  isEditing,
  editValue,
  inputRef,
  onEditValueChange,
  onSave,
  onKeyDown,
}: TreeNodeIdentityProps) => {
  const { translate } = useBuilderI18n()

  const isFrame = useEditorStore((state) =>
    state.nodes.some((owner) => owner.flow?.screens.some((screen) => screen.nodeId === node.id)),
  )

  const meta = registry[node.type]
  const componentName = meta?.displayName ?? node.type
  const isRenamed = Boolean(node.label && node.label !== componentName)
  const kind = node.overlay ? 'overlay' : isFrame ? 'frame' : 'component'

  return (
    <Box className={styles.treeNodeIdentity}>
      <EditorTooltip
        label={
          node.overlay
            ? translate('flow.overlay')
            : isFrame
              ? translate('flow.screen')
              : componentName
        }
      >
        <Box className={styles.treeNodeIdentity__icon} data-tree-icon={kind}>
          {node.overlay ? (
            <EditorIcon aria-hidden name='window' size={17} />
          ) : isFrame ? (
            <EditorIcon aria-hidden name='screen' size={17} />
          ) : (
            CATEGORY_ICONS[meta?.category ?? 'display']
          )}
        </Box>
      </EditorTooltip>
      {isEditing ? (
        <Input
          ref={inputRef}
          aria-label={translate('tree.itemName')}
          className={styles.treeNodeIdentity__input}
          value={editValue}
          onBlur={onSave}
          onChange={(event) => onEditValueChange(event.target.value)}
          onKeyDown={onKeyDown}
        />
      ) : (
        <EditorTooltip label={displayName}>
          <Text className={styles.treeNodeIdentity__name}>{displayName}</Text>
        </EditorTooltip>
      )}
      {!isEditing && isRenamed && node.type !== 'designerFrame' ? (
        <EditorTooltip
          label={`${translate('tree.componentType')}: ${componentName} (${node.type})`}
        >
          <Text className={styles.treeNodeIdentity__type} data-component-type={node.type}>
            {componentName}
          </Text>
        </EditorTooltip>
      ) : null}
      {node.overlay ? (
        <Text className={styles.treeNodeIdentity__status} size='xs'>
          {translate(node.overlay.initiallyOpen ? 'window.open' : 'window.closed')}
        </Text>
      ) : null}
    </Box>
  )
}
