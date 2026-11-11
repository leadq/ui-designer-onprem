import { getDisclosureContext } from '@root/components/RightPanel/utils/getDisclosureContext'
import { getTableCellContext } from '@root/components/RightPanel/utils/getTableCellContext'
import { registry } from '@root/registry'
import type { DesignNode } from '@root/types/document'
import type { PropSchema } from '@root/types/propSchema'
import { getCollectionContext } from '@root/utils/collectionAuthoring/getCollectionContext'

export const hasEditableProperties = (
  scalar: PropSchema[],
  complex: PropSchema[],
  hasWindowSettings: boolean,
  nodes: DesignNode[],
  selected: DesignNode[],
): boolean =>
  scalar.length > 0 ||
  complex.length > 0 ||
  hasWindowSettings ||
  (selected.length === 1 &&
    Boolean(
      getCollectionContext(nodes, selected[0].id, registry) ||
      getDisclosureContext(nodes, selected[0].id, registry) ||
      getTableCellContext(nodes, selected[0].id),
    ))
