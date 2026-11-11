import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { validateResponsiveProps } from '@root/utils/designer/componentContract/validateResponsiveProps'
import { findNode } from '@root/utils/nodes'

import { getNextHistory } from '../getNextHistory'

export const getUpdateResponsivePropsAction =
  (set: EditorStoreSet): EditorActions['updateResponsiveProps'] =>
  (ids, key, value) =>
    set((state) => {
      let changed = false

      for (const id of ids) {
        const node = findNode(state.nodes, id)

        if (
          !node ||
          !registry[node.type]?.propsSchema.some((prop) => prop.key === key && prop.isResponsive)
        ) {
          continue
        }

        if (value !== undefined) {
          validateResponsiveProps(
            { ...node, responsiveProps: { md: { [key]: value } } },
            registry[node.type],
          )
        }

        const breakpoint = state.activeBreakpoint

        if (breakpoint === 'xl') {
          if (value === undefined) {
            delete node.props[key]
          } else {
            node.props[key] = value
          }
        } else {
          if (!node.responsiveProps) {
            node.responsiveProps = {}
          }

          const layer = node.responsiveProps[breakpoint] ?? {}

          if (value === undefined) {
            delete layer[key]
          } else {
            layer[key] = value
          }

          if (Object.keys(layer).length) {
            node.responsiveProps[breakpoint] = layer
          } else {
            delete node.responsiveProps[breakpoint]
          }

          if (!Object.keys(node.responsiveProps).length) {
            delete node.responsiveProps
          }

          validateResponsiveProps(node, registry[node.type])
        }

        changed = true
      }

      if (changed) {
        Object.assign(state, getNextHistory(state))
      }
    })
