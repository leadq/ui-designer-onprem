// --- PropSchema: drives the Right Panel dynamically ---
export type PropSchemaType =
  | 'icon' // registered namespaced icon reference
  | 'select' // dropdown (string value)
  | 'text' // string input
  | 'boolean' // checkbox toggle
  | 'number' // numeric input
  | 'color' // color picker
  | 'arrayOfObjects' // Select/MultiSelect options — [{value, label}] array editor
  | 'slot' // renderItem, header, footer — named child slot
  | 'dataTable'

// DataTable column/row builder

// --- ArrayOfObjects support ---
export interface ArrayItemField {
  key: string // e.g. "value", "label", "disabled"
  label: string // display label in editor column header
  type: 'text' | 'number' | 'boolean'
  required?: boolean
}

// --- DataTable support ---
export interface DataTableColumnConfig {
  key: string
  header: string
  width?: number
  align?: 'left' | 'center' | 'right'
  isSortable?: boolean
}

export interface DataTableConfig {
  defaultColumns: number
  defaultRows: number
  maxColumns?: number
  maxRows?: number
}

export interface PropSchema {
  key: string // e.g. "variant", "size", "disabled"
  label: string // display label in Right Panel
  description?: string // agent-facing effect, value meanings, defaults and dependencies; metadata only
  type: PropSchemaType
  min?: number
  max?: number
  options?: string[] // only for 'select' type
  defaultValue: unknown
  isResponsive?: boolean // Explicit adapter opt-in for scalar appearance only.

  // — arrayOfObjects —
  itemSchema?: ArrayItemField[]

  // — slot —
  slotDescription?: string // "Liste elemanı tasarımı" gibi açıklama
  slotAcceptsMultiple?: boolean // true = birden fazla child, false = tek node
  slotRenderMode?: 'node' | 'callback' // adapter declares ReactNode vs (item) => ReactNode
  slotArgumentNames?: string[] // maps callback arguments to named item fields
  slotShowPlaceholder?: boolean // false = optional slot remains absent when unbound

  // — dataTable —
  tableConfig?: DataTableConfig
}
