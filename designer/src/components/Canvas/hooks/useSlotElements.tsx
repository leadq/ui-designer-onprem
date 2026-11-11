import type { ReactNode } from 'react'
import { ItemDataProvider } from '@root/contexts/ItemDataContext'
import { useItemData } from '@root/contexts/ItemDataContext/hooks/useItemData'
import { SlotRenderProvider } from '@root/contexts/SlotRenderContext'
import { useSlotRenderPath } from '@root/contexts/SlotRenderContext/hooks/useSlotRenderPath'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { getSlotRenderMode } from '@root/utils/slotRendering'
import { TABLE_CELL_CONTENTS } from '@root/utils/tableAuthoring/constants'

import { SlotContent } from '../SlotContent'

export const useSlotElements = (node: DesignNode, selectionProxyId?: string) => {
  const { translate } = useBuilderI18n()
  const savedDesigns = useEditorStore((state) => state.slotComponents)
  const isPreviewMode = useEditorStore((state) => state.previewMode)
  const parentItem = useItemData()
  const path = useSlotRenderPath()
  const slots: Record<string, ReactNode | ((...args: unknown[]) => ReactNode)> = {}

  for (const schema of registry[node.type]?.propsSchema.filter((field) => field.type === 'slot') ??
    []) {
    if (registry[node.type]?.tableContents && schema.key === TABLE_CELL_CONTENTS) {
      continue
    }

    const saved = savedDesigns.find((design) => design.id === node.props[schema.key])
    const nodes = saved?.nodes ?? node.slots?.[schema.key] ?? []

    if (nodes.length === 0 && schema.slotShowPlaceholder === false) {
      continue
    }

    const hasCycle = Boolean(saved && path.includes(saved.id))
    const slotPath = saved ? [...path, saved.id] : path

    const renderSlot = (item: Record<string, unknown> | null) => (
      <SlotRenderProvider path={slotPath}>
        <ItemDataProvider item={item}>
          <SlotContent
            hasCycle={hasCycle}
            isPreviewMode={isPreviewMode}
            label={schema.key === 'renderItem' ? translate('slot.itemDesign') : schema.label}
            nodes={nodes}
            parentId={node.id}
            selectionProxyId={selectionProxyId ?? node.id}
            slotKey={schema.key}
          />
        </ItemDataProvider>
      </SlotRenderProvider>
    )

    slots[schema.key] =
      getSlotRenderMode(schema) === 'callback'
        ? (...args: unknown[]) => {
            const item = !isPreviewMode
              ? null
              : schema.slotArgumentNames
                ? Object.fromEntries(
                    schema.slotArgumentNames.map((name, index) => [name, args[index]]),
                  )
                : args[0] && typeof args[0] === 'object'
                  ? (args[0] as Record<string, unknown>)
                  : null

            return renderSlot(item)
          }
        : renderSlot(parentItem)
  }

  return slots
}
