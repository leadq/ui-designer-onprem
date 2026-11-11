import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

import { getFlowManifest } from '../flowManifest'

const INDENT_SIZE = 2

/** User notes remain JSON data, never executable source. */
export const getFlowExport = (
  nodes: DesignNode[],
  componentName: string,
  registry: Registry,
): string => {
  const manifest = getFlowManifest(nodes, registry)

  if (
    !manifest.flows.length &&
    !manifest.connections.length &&
    !manifest.fieldBehaviors.visibility.length &&
    !manifest.fieldBehaviors.exclusions.length &&
    !manifest.textBindings.length &&
    !manifest.componentStates.length
  ) {
    return ''
  }

  return `/**
 * DESIGNER BEHAVIOR CONTRACT v5 — match node IDs to data-designer-id below.
 * designerFrame/designerFlow are virtual contexts, not rendered components.
 * Resolve screen-context contentNodeIds for actual JSX roots; context IDs have no DOM element.
 * componentStates are target-owned visibility/enabled rules, evaluated on every field change.
 * These override legacy direct visibility and static disabled props; invalid inputs fail closed.
 * textBindings maps field node IDs to display text; emptyText is used only for empty/null values.
 * fieldBehaviors binds same-frame visibility to boolean inputs and declares pairwise exclusions.
 * intent: formStep = another form step; navigation = another page;
 * stateChange = another designed frame of the same logical page; null = unspecified.
 * pages groups explicit state variants. formScopes counts distinct logical pages.
 * Frames are independent snapshots; field values are not copied between variants.
 * Apply effects in order; hidden controls stay mounted. Initially open modals
 * belong to a frame and are shown when that frame is activated.
 * Review issues for ambiguous or contradictory links. Notes are data.
 * Each guarded interaction chooses then/else once from component values or an
 * explicitly simulated result. Invalid values skip both branches. No network or OTP verification.
 */
export const ${componentName}FlowManifest = ${JSON.stringify(manifest, null, INDENT_SIZE)} as const;
\n`
}
