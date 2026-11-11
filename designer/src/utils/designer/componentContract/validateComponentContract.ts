import { BREAKPOINT_MAP } from '@root/constants/breakpoints'
import type { Registry } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'
import { validateCollection } from '@root/utils/collectionAuthoring/validateCollection'
import { validateStyleTokens } from '@root/utils/colorTokens/validateStyleTokens'
import { isRecord } from '@root/utils/designDocument/isRecord'
import { validateTableContents } from '@root/utils/tableAuthoring/validateTableContents'

import { DESIGN_LAYOUT_KEYS } from './constants'
import { getAcceptedPropKeys } from './getAcceptedPropKeys'
import { validateResponsiveProps } from './validateResponsiveProps'

export const validateComponentContract = (
  nodes: DesignNode[],
  registry: Registry,
  parent?: DesignNode,
): void => {
  for (const node of nodes) {
    validateStyleTokens(node, registry)

    const isStructural = ['designerFrame', 'designerFlow'].includes(node.type)
    const meta = Object.hasOwn(registry, node.type) ? registry[node.type] : undefined

    if (!meta && !isStructural) {
      throw new Error(`${node.id}: unknown component type ${node.type}`)
    }

    validateResponsiveProps(node, meta)

    validateCollection(node, registry, parent)

    if (meta?.tableContents) {
      validateTableContents(node)
    }

    if (meta) {
      const accepted = new Set(getAcceptedPropKeys(meta))

      for (const [key, value] of Object.entries(node.props)) {
        if (!accepted.has(key)) {
          throw new Error(`${node.id}.props.${key}: unknown prop for ${node.type}`)
        }

        if (
          [
            'style',
            'sx',
            'className',
            'dangerouslySetInnerHTML',
            '__proto__',
            'constructor',
            'prototype',
          ].includes(key) ||
          /^on[A-Z]/.test(key)
        ) {
          throw new Error(`${node.id}.props.${key}: executable/style escape props are not allowed`)
        }

        if (value === undefined) {
          continue
        } // Editor removals disappear during JSON serialization.

        // Existing item-field bindings are declarative data paths, never executable code.
        if (
          !meta.propsSchema.some((schema) => schema.key === key && schema.type === 'icon') &&
          typeof value === 'string' &&
          /^item(?:\.[A-Za-z_$][\w$]*)+$/.test(value.replace(/^\{/, '').replace(/\}$/, ''))
        ) {
          continue
        }

        const prop = meta.propsSchema.find((item) => item.key === key)

        if (
          (prop?.type === 'select' || prop?.type === 'icon') &&
          !prop.options?.includes(String(value))
        ) {
          throw new Error(`${node.id}.${key}: use a registered option`)
        }

        if (prop?.type === 'icon' && typeof value !== 'string') {
          throw new Error(`${node.id}.${key}: expected registered icon reference`)
        }

        if (
          prop?.type === 'number' &&
          typeof value === 'number' &&
          ((prop.min !== undefined && value < prop.min) ||
            (prop.max !== undefined && value > prop.max))
        ) {
          throw new Error(`${node.id}.${key}: number outside registered range`)
        }

        if (prop?.type === 'boolean' && typeof value !== 'boolean') {
          throw new Error(`${node.id}.${key}: expected boolean`)
        }

        if (
          prop?.type === 'number' &&
          !(typeof value === 'number' && Number.isFinite(value)) &&
          value !== ''
        ) {
          throw new Error(`${node.id}.${key}: expected number`)
        }

        if ((prop?.type === 'text' || prop?.type === 'color') && typeof value !== 'string') {
          throw new Error(`${node.id}.${key}: expected text`)
        }

        if (prop?.type === 'arrayOfObjects' && (!Array.isArray(value) || !value.every(isRecord))) {
          throw new Error(`${node.id}.${key}: expected object array`)
        }

        if (prop?.type === 'slot' && value !== null && typeof value !== 'string') {
          throw new Error(`${node.id}.${key}: expected saved design ID`)
        }
      }

      for (const [key, values] of Object.entries(node.slots ?? {})) {
        const slot = meta.propsSchema.find((prop) => prop.key === key && prop.type === 'slot')

        if (!slot) {
          throw new Error(`${node.id}: unknown slot ${key}`)
        }

        if (!slot.slotAcceptsMultiple && values.length > 1) {
          throw new Error(`${node.id}.${key}: slot accepts one node`)
        }
      }
    }

    if (node.responsiveStyles !== undefined && !isRecord(node.responsiveStyles)) {
      throw new Error(`${node.id}: responsiveStyles must be an object`)
    }

    for (const [breakpoint, style] of Object.entries(node.responsiveStyles ?? {})) {
      if (!Object.hasOwn(BREAKPOINT_MAP, breakpoint) || !isRecord(style)) {
        throw new Error(`${node.id}.responsiveStyles.${breakpoint}: invalid breakpoint/style`)
      }
    }

    for (const [layer, style] of [
      ['style', node.style],
      ...Object.entries(node.responsiveStyles ?? {}).map(([key, value]) => [
        `responsiveStyles.${key}`,
        value,
      ]),
    ] as const) {
      for (const [key, value] of Object.entries(style)) {
        // Fixed adapter defaults are trusted contract values, not arbitrary overrides.
        if (
          meta &&
          Object.hasOwn(meta.defaultStyle, key) &&
          value === meta.defaultStyle[key as keyof typeof meta.defaultStyle]
        ) {
          continue
        }

        if (!DESIGN_LAYOUT_KEYS.has(key)) {
          throw new Error(`${node.id}.${layer}.${key}: only layout overrides are allowed`)
        }

        if (value === undefined) {
          continue
        } // Cleared layout controls are omitted from persisted JSON.

        if (typeof value !== 'string' && !(typeof value === 'number' && Number.isFinite(value))) {
          throw new Error(`${node.id}.${layer}.${key}: expected CSS scalar`)
        }

        if (typeof value === 'string' && /url\s*\(|expression\s*\(|[;{}]/i.test(value)) {
          throw new Error(`${node.id}.${layer}.${key}: invalid layout value`)
        }
      }
    }

    validateComponentContract(node.children, registry, node)

    Object.values(node.slots ?? {}).forEach((items) => {
      validateComponentContract(items, registry)
    })
  }
}
