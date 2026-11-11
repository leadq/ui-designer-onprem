import type { DesignNode } from '@root/types/document'
import { parseStateRules } from '@root/utils/conditions/componentState'
import { parseToggleBinding } from '@root/utils/conditions/toggleBindings'
import { parseFlow, parseOverlay } from '@root/utils/flows/flowModel'
import { parseTextBinding } from '@root/utils/flows/textBindings'

import { getParseAnnotations } from './getParseAnnotations'
import { getParseInteractions } from './getParseInteractions'
import { isRecord } from './isRecord'

export const getParseNodes = (value: unknown, path = 'nodes'): DesignNode[] => {
  if (!Array.isArray(value)) {
    throw new Error(`${path} must be an array`)
  }

  return value.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`${path}[${index}] must be an object`)
    }

    if (typeof item.id !== 'string' || typeof item.type !== 'string') {
      throw new Error(`${path}[${index}] requires string id and type fields`)
    }

    if (!isRecord(item.props) || !isRecord(item.style)) {
      throw new Error(`${path}[${index}] requires props and style objects`)
    }

    if (
      ['designerFrame', 'designerFlow'].includes(item.type) &&
      (Object.keys(item.props).length ||
        Object.keys(item.style).length ||
        item.responsiveStyles ||
        item.responsiveProps ||
        item.styleTokens !== undefined ||
        item.responsiveStyleTokens !== undefined ||
        item.slots)
    ) {
      throw new Error('Screen contexts cannot have component properties or styles')
    }

    if (item.slots !== undefined && !isRecord(item.slots)) {
      throw new Error(`${item.id}: slots must be an object`)
    }

    if (item.responsiveStyles !== undefined && !isRecord(item.responsiveStyles)) {
      throw new Error(`${item.id}: responsiveStyles must be an object`)
    }

    const slots = isRecord(item.slots)
      ? Object.fromEntries(
          Object.entries(item.slots).map(([key, nodes]) => [
            key,
            getParseNodes(nodes, `${path}[${index}].slots.${key}`),
          ]),
        )
      : undefined

    const children = getParseNodes(item.children ?? [], `${path}[${index}].children`)

    return {
      ...(item.styleTokens !== undefined ? { styleTokens: item.styleTokens } : {}),
      ...(item.responsiveStyleTokens !== undefined
        ? { responsiveStyleTokens: item.responsiveStyleTokens }
        : {}),
      id: item.id,
      type: item.type,
      label: typeof item.label === 'string' ? item.label : undefined,
      props: item.props,
      style: item.style,
      responsiveStyles: isRecord(item.responsiveStyles) ? item.responsiveStyles : undefined,
      ...(item.responsiveProps !== undefined ? { responsiveProps: item.responsiveProps } : {}),
      notes: typeof item.notes === 'string' ? item.notes : undefined,
      annotations:
        item.annotations === undefined ? undefined : getParseAnnotations(item.annotations),
      interactions:
        item.interactions === undefined ? undefined : getParseInteractions(item.interactions),
      prototypeHidden: item.prototypeHidden === true || undefined,
      ...(item.stateRules !== undefined ? { stateRules: parseStateRules(item.stateRules) } : {}),
      ...(item.textBinding !== undefined
        ? { textBinding: parseTextBinding(item.textBinding) }
        : {}),
      ...(item.toggleBinding !== undefined
        ? { toggleBinding: parseToggleBinding(item.toggleBinding) }
        : {}),
      children,
      ...(item.overlay !== undefined ? { overlay: parseOverlay(item.overlay) } : {}),
      ...(item.flow !== undefined ? { flow: parseFlow(item.flow, children) } : {}),
      slots,
    } as DesignNode
  })
}
