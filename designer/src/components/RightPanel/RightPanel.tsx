import { useState } from 'react'
import { getTableColumnSelection } from '@root/components/RightPanel/utils/getTableColumnSelection'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { getConditionNodes } from '@root/utils/conditions/conditionModel'
import { findNode } from '@root/utils/nodes'

import { Box, Stack, Text } from '../common'
import { SelectionState } from '../Flows/SelectionState'
import { WindowSettings } from '../Flows/WindowSettings'

import { getRightPanelSchemas } from './hooks/getRightPanelSchemas'
import { hasEditableProperties as getHasEditableProperties } from './hooks/hasEditableProperties'
import { hasWindowSettings as getHasWindowSettings } from './hooks/hasWindowSettings'
import { ComplexPropEditor } from './ComplexPropEditor'
import { ContentAuthoringInspectors } from './ContentAuthoringInspectors'
import { FrameInspector } from './FrameInspector'
import { ResponsivePropEditor } from './ResponsivePropEditor'
import { ResponsivePropertiesScope } from './ResponsivePropertiesScope'
import { RightPanelEmptyState } from './RightPanelEmptyState'
import { type RightPanelTab, RightPanelTabs } from './RightPanelTabs'
import { SelectionContextInspectors } from './SelectionContextInspectors'
import { SelectionHeader } from './SelectionHeader'
import { StylePanel } from './StylePanel'
import { TableColumnInspector } from './TableColumnInspector'
import { TextBindingEditor } from './TextBindingEditor'

import styles from './styles.module.scss'

export const RightPanel = () => {
  const { translate } = useBuilderI18n()
  const [preferredTab, setPreferredTab] = useState<RightPanelTab>('props')
  const handleTabChange = setPreferredTab
  const selectedNodeIds = useEditorStore((state) => state.selectedNodeIds)
  const selectedColumnKey = useEditorStore((state) => state.selectedTableColumnKey)
  const nodes = useEditorStore((state) => state.nodes)
  const handleNodesPropsChange = useEditorStore((state) => state.updateMultipleProps)

  const selectedNodes: DesignNode[] = selectedNodeIds
    .map((id) => findNode(nodes, id))
    .filter((node): node is DesignNode => node !== null)

  if (selectedNodes.length === 0) {
    return <RightPanelEmptyState />
  }

  const column = getTableColumnSelection(nodes, selectedNodeIds, selectedColumnKey)

  if (column) {
    return <TableColumnInspector {...column} />
  }

  if (selectedNodes.some((node) => node.type === 'designerFrame' || node.type === 'designerFlow')) {
    return <FrameInspector node={selectedNodes.length === 1 ? selectedNodes[0] : undefined} />
  }

  const isSameType = selectedNodes.every((node) => node.type === selectedNodes[0].type)
  const meta = isSameType ? registry[selectedNodes[0].type] : null

  const canEditState = selectedNodes.every(
    (node) =>
      !node.overlay &&
      !registry[node.type]?.collectionItem &&
      getConditionNodes(nodes).some((candidate) => candidate.id === node.id),
  )

  const { scalarSchemas, complexSchemas } = getRightPanelSchemas(meta, selectedNodes, canEditState)

  const hasEditableProperties = getHasEditableProperties(
    scalarSchemas,
    complexSchemas,
    getHasWindowSettings(nodes, selectedNodes),
    nodes,
    selectedNodes,
  )

  const activeTab = hasEditableProperties ? preferredTab : 'styles'

  const handleChange = (key: string, val: unknown) => {
    handleNodesPropsChange(
      selectedNodes.map((node) => node.id),
      key,
      val,
    )
  }

  return (
    <div className={styles.rightPanel}>
      <div className={styles.rightPanel__header}>
        <Box className={styles.rightPanel__selectionContext}>
          <SelectionHeader
            nodes={selectedNodes}
            title={
              isSameType
                ? (meta?.displayName ?? selectedNodes[0].type)
                : translate('rightPanel.mixedSelection')
            }
          />
          {canEditState ? (
            <Box className={styles.rightPanel__stateSection}>
              <SelectionState isScrollable />
            </Box>
          ) : null}
        </Box>
        <RightPanelTabs
          activeTab={activeTab}
          hasEditableProperties={hasEditableProperties}
          onChange={handleTabChange}
        />
      </div>

      <div className={styles.rightPanel__content}>
        {activeTab === 'props' && (
          <div className={styles.rightPanel__scrollArea}>
            <Box className={styles.rightPanel__sections}>
              {selectedNodes.length === 1 && (
                <SelectionContextInspectors nodeId={selectedNodes[0].id} />
              )}
              {isSameType ? (
                <Stack gap='md'>
                  <ResponsivePropertiesScope schemas={scalarSchemas} />
                  {selectedNodes.length === 1 && <TextBindingEditor node={selectedNodes[0]} />}
                  {selectedNodes.length === 1 && <WindowSettings node={selectedNodes[0]} />}
                  {scalarSchemas.length > 0 && (
                    <Box className={styles.rightPanel__propertyGrid}>
                      {scalarSchemas.map((schema) => (
                        <ResponsivePropEditor
                          key={schema.key}
                          schema={schema}
                          selectedNodes={selectedNodes}
                          onChange={handleChange}
                        />
                      ))}
                    </Box>
                  )}
                  {selectedNodes.length === 1 && (
                    <ContentAuthoringInspectors nodeId={selectedNodes[0].id} />
                  )}
                  {complexSchemas.map((schema) => (
                    <ComplexPropEditor
                      key={schema.key}
                      schema={schema}
                      selectedNodes={selectedNodes}
                      onChange={handleChange}
                      onNodesPropsChange={handleNodesPropsChange}
                    />
                  ))}
                </Stack>
              ) : (
                <Text color='secondary' size='xs'>
                  {translate('rightPanel.mixedHint')}
                </Text>
              )}
            </Box>
          </div>
        )}

        {activeTab === 'styles' && (
          <div className={styles.rightPanel__scrollArea}>
            <StylePanel />
          </div>
        )}
      </div>
    </div>
  )
}
