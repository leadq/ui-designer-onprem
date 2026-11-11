import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import { validateComponentContract } from '@root/utils/designer/componentContract'

export const getUpdateSlotComponentAction =
  (set: EditorStoreSet): EditorActions['updateSlotComponent'] =>
  (id, name, nodes) =>
    set((state) => {
      validateComponentContract(nodes, registry)

      const component = state.slotComponents.find((child) => child.id === id)

      if (component) {
        component.name = name

        component.nodes = nodes
      }
    })
