import type { ComponentMeta } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import { isAuthoredTable } from '@root/utils/tableAuthoring/isAuthoredTable'

const COMPLEX_PROP_TYPES = ['icon', 'arrayOfObjects', 'dataTable', 'slot'] as const

export const getRightPanelSchemas = (
  meta: ComponentMeta | null | undefined,
  selectedNodes: DesignNode[],
  canEditState: boolean,
) => {
  const scalarSchemas =
    meta?.propsSchema.filter(
      (state) =>
        (state.key !== 'disabled' || !canEditState) &&
        !COMPLEX_PROP_TYPES.includes(state.type as (typeof COMPLEX_PROP_TYPES)[number]),
    ) ?? []

  const complexSchemas =
    meta?.propsSchema.filter(
      (state) =>
        COMPLEX_PROP_TYPES.includes(state.type as (typeof COMPLEX_PROP_TYPES)[number]) &&
        !(
          (meta.tableContents && ['rows', 'cellContents'].includes(state.key)) ||
          (selectedNodes.every(isAuthoredTable) && state.key === 'renderCell')
        ),
    ) ?? []

  return { scalarSchemas, complexSchemas }
}
