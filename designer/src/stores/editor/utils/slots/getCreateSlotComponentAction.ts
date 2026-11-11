import { registry } from '@root/registry'
import type { EditorActions, EditorStoreSet } from '@root/stores/editor/types'
import type { SlotComponent } from '@root/types/document'
import { validateComponentContract } from '@root/utils/designer/componentContract'

export const getCreateSlotComponentAction =
  (set: EditorStoreSet): EditorActions['createSlotComponent'] =>
  (id, name, nodes) =>
    set((state) => {
      validateComponentContract(nodes, registry)

      const newComponent: SlotComponent = {
        id,
        name,
        nodes,
      }

      state.slotComponents.push(newComponent)
    })
