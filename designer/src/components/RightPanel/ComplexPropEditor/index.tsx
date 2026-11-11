import { Text } from '@root/components/common/Text'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import type { DesignNode } from '@root/types/document'
import type { PropSchema } from '@root/types/propSchema'
import { isAuthoredTable } from '@root/utils/tableAuthoring/isAuthoredTable'

import { IconPropEditor } from '../IconPropEditor'
import { ArrayOfObjectsEditor, DataTableEditor, SlotEditor } from '../PropEditors'

export interface ComplexPropEditorProps {
  schema: PropSchema
  selectedNodes: DesignNode[]
  onChange: (key: string, value: unknown) => void
  onNodesPropsChange: (ids: string[], key: string, value: unknown) => void
}

export const ComplexPropEditor = ({
  schema,
  selectedNodes,
  onChange: handleChange,
  onNodesPropsChange: handleNodesPropsChange,
}: ComplexPropEditorProps) => {
  const { translate } = useBuilderI18n()

  const isShared = selectedNodes.every(
    (node) =>
      JSON.stringify(node.props[schema.key]) === JSON.stringify(selectedNodes[0].props[schema.key]),
  )

  const value = isShared ? (selectedNodes[0].props[schema.key] ?? schema.defaultValue) : undefined

  switch (schema.type) {
    case 'icon':
      return (
        <IconPropEditor
          value={String(value ?? '')}
          onChange={(next) => handleChange(schema.key, next)}
        />
      )

    case 'arrayOfObjects':
      return (
        <ArrayOfObjectsEditor
          key={schema.key}
          itemSchema={schema.itemSchema ?? []}
          items={(value as Record<string, unknown>[]) ?? []}
          label={schema.label}
          onChange={(newItems) => handleChange(schema.key, newItems)}
        />
      )

    case 'dataTable': {
      if (selectedNodes.every(isAuthoredTable)) {
        return (
          <Text color='secondary' size='xs'>
            {translate('tableAuthoring.hint')}
          </Text>
        )
      }

      const nodeColumns = selectedNodes[0]?.props.columns
      const nodeData = selectedNodes[0]?.props.data

      return (
        <DataTableEditor
          key={schema.key}
          columns={(nodeColumns as { key: string; header: string; width?: number }[]) ?? []}
          data={(nodeData as Record<string, unknown>[]) ?? []}
          onChange={(newColumns, newData) => {
            for (const node of selectedNodes) {
              handleNodesPropsChange([node.id], 'columns', newColumns)

              handleNodesPropsChange([node.id], 'data', newData)
            }
          }}
        />
      )
    }

    case 'slot': {
      const parentNode = selectedNodes[0]

      return (
        <SlotEditor
          key={schema.key}
          isMultiple={schema.slotAcceptsMultiple ?? true}
          label={schema.key === 'renderItem' ? translate('slot.itemDesign') : schema.label}
          parentNodeId={parentNode.id}
          slotKey={schema.key}
          description={
            schema.key === 'renderItem' ? translate('slot.itemDesignHint') : schema.slotDescription
          }
        />
      )
    }

    default:
      return null
  }
}
