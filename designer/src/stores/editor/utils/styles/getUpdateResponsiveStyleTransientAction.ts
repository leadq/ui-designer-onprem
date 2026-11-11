import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { validateComponentContract } from '@root/utils/designer/componentContract'
import { findNode } from '@root/utils/nodes'
import { findParent } from '@root/utils/nodes/findParent'

export const getUpdateResponsiveStyleTransientAction =
  (set: EditorStoreSet): EditorActions['updateResponsiveStyleTransient'] =>
  (id, breakpoint, style) =>
    set((state) => {
      const node = findNode(state.nodes, id)

      if (!node || node.type === 'designerFrame' || node.type === 'designerFlow') {
        return
      }

      if (breakpoint === 'xl') {
        node.style = { ...node.style, ...style }
      } else {
        if (!node.responsiveStyles) {
          node.responsiveStyles = {}
        }

        node.responsiveStyles[breakpoint] = {
          ...node.responsiveStyles[breakpoint],
          ...style,
        }
      }

      validateComponentContract([node], registry, findParent(state.nodes, node.id) ?? undefined)
    })
