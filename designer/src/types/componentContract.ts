import type { CSSProperties } from 'react'

import type { ColorToken } from '../utils/colorTokens/types'

import type { DesignNode } from './document'
import type { OverlayPresentation, OverlaySurfaceProps } from './flow'
import type { PreviewValueConfig } from './preview'
import type { PropSchema } from './propSchema'

// --- Renderer Contract ---
// All adapter renderers MUST accept this prop and apply it to their root DOM element.
// The adapter maps these values to its native root API or wrapper.
export interface RendererProps {
  rootClassName?: string
  renderMode?: 'design' | 'preview'
  rootRef?: (element: HTMLElement | null) => void
  style?: CSSProperties
  'data-node-id'?: string
  [key: string]: unknown
}

export type ComponentImportType = 'named' | 'default' | 'none'

export interface ComponentExportConfig {
  resolve?: (node: DesignNode) => ComponentExportConfig
  importPath: string
  importName: string
  importType: ComponentImportType
  jsxName?: string
  agentPlaceholder?: string
  additionalImports?: string[]
  wrapChild?: (jsx: string) => string
  supportCode?: string
  renderCollectionJSX?: (node: DesignNode, items: string[], attributes: string[]) => string
  renderTableJSX?: (node: DesignNode, cells: string[], attributes: string[]) => string
  renderJSX?: (node: DesignNode, propsEntries: string[], childrenJSX: string) => string
}

/** Adapter-owned, serializable usage guidance; never part of a saved design. */
export interface ComponentRecipe {
  id: string
  title: string
  when: string
  instructions: string[]
  /** Bundled adapter-owned PNG references; not persisted design fields. */
  images?: {
    id: string
    file: string
    caption: string
    sha256: string
    width: number
    height: number
  }[]
  avoid?: string[]
  /** Self-contained subtree using this component type and supported adapter props/slots. */
  example: DesignNode
}

// --- ComponentMeta: the adapter contract ---
export interface ComponentMeta {
  type: string // "button", "textInput", "card"
  displayName: string // shown in Left Panel
  description?: string // short purpose for agent discovery
  visualHints?: string[] // short overview recognition clues; no implementation recipes or unseen behavior claims
  recipes?: ComponentRecipe[] // fetched with component detail, not the overview
  searchKeywords?: string[] // adapter-owned aliases used by the component search
  category: 'layout' | 'form' | 'display' | 'overlays' | 'icons' // for grouping in palette
  isContainer: boolean // true → accepts children drops
  showEmptyPlaceholder?: boolean // opt-in editor hint for empty containers; never saved or exported
  initializeNode?: (node: DesignNode, registry: Registry) => DesignNode
  collection?: { kind: 'list' | 'tabs'; itemType: string }
  collectionItem?: 'list' | 'tabs'
  disclosure?: { titleProp: string; initialExpandedProp: string }
  tableContents?: boolean
  tableColumnAlignment?: boolean
  defaultProps: Record<string, unknown>
  defaultStyle: CSSProperties
  /** Native container layout derived from props, before explicit design styles. */
  getDefaultLayoutStyle?: (props: Record<string, unknown>) => CSSProperties
  propsSchema: PropSchema[]
  /** Keep native semantic element stable while visual typography changes. */
  responsiveSemanticElement?: {
    prop: string
    variantProp: string
    mapping: Record<string, string>
    fallback: string
  }
  overlay?: {
    presentation: OverlayPresentation
    Surface: React.ComponentType<OverlaySurfaceProps>
  }
  previewValue?: PreviewValueConfig
  renderer: React.ComponentType<RendererProps> // must handle rootClassName
  exportConfig: ComponentExportConfig
}

// --- Registry: maps type → meta ---
export type Registry = Record<string, ComponentMeta>

export interface UIAdapter {
  /** Palette token ID for palette previews, default frame and prototype preview backgrounds. */
  backgroundColor?: string
  colors?: ColorToken[]
  id: string
  name: string
  version: string
  registry: Registry
  Provider: React.ComponentType<{ children: React.ReactNode }>
  defaultContainerType: string
}
