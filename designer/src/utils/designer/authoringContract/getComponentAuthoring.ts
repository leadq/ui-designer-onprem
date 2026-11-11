import type { ComponentMeta } from '@root/types/componentContract'

import { getAcceptedPropKeys } from '../componentContract'

import { COMPONENT_GUIDANCE } from './componentGuidance'

const INITIAL_TAB_COUNT = 2

export const getComponentAuthoring = (meta: ComponentMeta) => ({
  responsivePropKeys: meta.propsSchema.filter((prop) => prop.isResponsive).map((prop) => prop.key),
  responsiveSemanticElement: meta.responsiveSemanticElement,
  acceptedPropKeys: getAcceptedPropKeys(meta),
  slotKeys: meta.propsSchema.filter((prop) => prop.type === 'slot').map((prop) => prop.key),
  guidance: COMPONENT_GUIDANCE[meta.type] ?? [],
  ...(meta.disclosure
    ? {
        disclosure: {
          ...meta.disclosure,
          content: 'children',
          editorExpanded:
            'transient; starts open; selected descendants reveal their ancestors; never serialize designExpanded',
          nativeMapping:
            'adapter derives compound children or items and boolean change; no user data list or callback',
          guide: 'data-display',
        },
      }
    : {}),
  ...(meta.collection
    ? {
        collection: {
          ...meta.collection,
          contents: 'children',
          maxItems: 100,
          initialItems: meta.collection.kind === 'tabs' ? INITIAL_TAB_COUNT : 0,
          add:
            meta.collection.kind === 'tabs'
              ? 'new title and empty content'
              : 'independent copy of last item, or empty first item',
          initialItemProp: meta.collection.kind === 'tabs' ? 'initialItemId' : null,
          identity: 'item node id; never derive from title or index',
          editorSelection: 'transient; does not change initialItemId',
          guide: 'data-display',
        },
      }
    : {}),
  ...(meta.collectionItem
    ? {
        collectionItem: {
          kind: meta.collectionItem,
          parentRequired: true,
          palette: false,
          edits: 'use owning collection commands',
          content: 'children',
        },
      }
    : {}),
  ...(meta.tableContents
    ? {
        tableContents: {
          slot: 'cellContents',
          rowsProp: 'rows',
          order: 'row-major',
          cellRoot: 'box',
          cellDesigner:
            'Design cell opens an isolated native-component draft. Finish replaces only that unchanged cell in one undo; Cancel discards it. Save as custom component creates an independent named snapshot. No workspace fields are serialized; row/column copies remain independent.',
          initialColumns: 6,
          initialRows: 10,
          insertedCells: 'empty',
          valueType:
            'derived per column: number | text | custom | mixed; read-only editor information',
          columnAlignment: meta.tableColumnAlignment
            ? {
                prop: 'columns[].align',
                values: ['left', 'center', 'right'],
                default: 'native library default when omitted',
                scope:
                  'header and body cells; explicit inner component alignment remains authoritative',
              }
            : null,
          guide: 'data-display',
        },
      }
    : {}),
  ...(meta.previewValue
    ? {
        initialValue: {
          prop: meta.previewValue.defaultProp,
          runtimeProp: meta.previewValue.prop,
          emptyValue: meta.previewValue.emptyValue,
          rule: 'Write sample data to the initial prop, not runtime prop or placeholder. Preview owns changes and restart restores initial props.',
        },
      }
    : {}),
})
