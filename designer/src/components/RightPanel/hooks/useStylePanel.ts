import { type CSSProperties, useCallback, useMemo } from 'react'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import { getNodeLayoutStyle } from '@root/utils/canvas/hitTesting'
import { getStyleAtBreakpoint } from '@root/utils/layout/getStyleAtBreakpoint'
import { findNode } from '@root/utils/nodes'
import { getPropsAtBreakpoint } from '@root/utils/responsive/getPropsAtBreakpoint'

export const useStylePanel = () => {
  const selectedNodeIds = useEditorStore((state) => state.selectedNodeIds)
  const nodes = useEditorStore((state) => state.nodes)

  const updateMultipleResponsiveStyles = useEditorStore(
    (state) => state.updateMultipleResponsiveStyles,
  )

  const activeBreakpoint = useEditorStore((state) => state.activeBreakpoint)

  const selectedNodes = useMemo(
    () =>
      selectedNodeIds
        .map((id) => findNode(nodes, id))
        .filter((node): node is DesignNode => node !== null),
    [selectedNodeIds, nodes],
  )

  const handleStyleChange = useCallback(
    (key: string, value: unknown) => {
      if (selectedNodeIds.length === 0) {
        return
      }

      const cssValue = value === '' ? undefined : value

      updateMultipleResponsiveStyles(selectedNodeIds, activeBreakpoint, {
        [key]: cssValue,
      } as Partial<CSSProperties>)
    },
    [selectedNodeIds, activeBreakpoint, updateMultipleResponsiveStyles],
  )

  const handleStylePatch = useCallback(
    (style: Partial<CSSProperties>) => {
      if (selectedNodeIds.length === 0) {
        return
      }

      updateMultipleResponsiveStyles(selectedNodeIds, activeBreakpoint, style)
    },
    [selectedNodeIds, activeBreakpoint, updateMultipleResponsiveStyles],
  )

  // Compute styles specific to the active breakpoint (overrides)
  const activeOverrides = useMemo(() => {
    const style: CSSProperties = {}

    if (selectedNodes.length === 0) {
      return style
    }

    const getOverrides = (node: DesignNode) =>
      activeBreakpoint === 'xl' ? node.style : node.responsiveStyles?.[activeBreakpoint] || {}

    const firstOverrides = getOverrides(selectedNodes[0])

    for (const key in firstOverrides) {
      const entryKey = key as keyof CSSProperties

      const isShared = selectedNodes.every(
        (node) => getOverrides(node)[entryKey] === firstOverrides[entryKey],
      )

      if (isShared) {
        Object.assign(style, { [entryKey]: firstOverrides[entryKey] })
      }
    }

    return style
  }, [selectedNodes, activeBreakpoint])

  const effectiveStyle = useMemo(() => {
    const styles = selectedNodes.map((node) => {
      const meta = registry[node.type]

      const style = getStyleAtBreakpoint(node, activeBreakpoint, {
        ...meta?.defaultStyle,
        ...meta?.getDefaultLayoutStyle?.(getPropsAtBreakpoint(node, activeBreakpoint, meta)),
      })

      const layout = getNodeLayoutStyle(node.id)
      const display = style.display ?? layout?.display

      return {
        ...style,
        ...(display ? { display } : {}),
        ...((display === 'flex' || display === 'inline-flex') && !style.flexDirection
          ? { flexDirection: layout?.flexDirection }
          : {}),
      }
    })

    const sharedStyle: CSSProperties = {}

    for (const [key, value] of Object.entries(styles[0] ?? {})) {
      if (styles.every((style) => style[key as keyof CSSProperties] === value)) {
        Object.assign(sharedStyle, { [key]: value })
      }
    }

    return sharedStyle
  }, [selectedNodes, activeBreakpoint])

  return {
    selectedNodes,
    activeBreakpoint,
    activeOverrides,
    effectiveStyle,
    handleStyleChange,
    handleStylePatch,
  }
}
