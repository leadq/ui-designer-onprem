export const COMPONENT_GUIDANCE: Record<string, string[]> = {
  accordion: [
    'Design-first expandable section: set title and defaultExpanded, place real components in children. No data list or native activeKey/value/callback. Designer open/closed state is transient; preview starts from defaultExpanded, retains mounted content, and emits one boolean change per actual toggle. Read data-display.',
  ],
  itemList: [
    'Design-first independent items: children must be listItem nodes; each item owns its subtree. No data or renderItem binding. Palette starts empty; add first item then independently copy the last item.',
  ],
  tabs: [
    'Children must be tabItem nodes with string label and optional disabled. The item node ID pairs native trigger and panel; initialItemId must reference an owned item (empty only for empty tabs). Read data-display.',
  ],
  list: [
    'Legacy shared data/renderItem template. For direct independent item design use itemList; do not silently convert existing list documents.',
  ],
  box: [
    'defaultStyle includes editor placeholder spacing. For a compact layout group explicitly set padding: 0 and minHeight: 0 before adding gap/padding.',
  ],
  typography: [
    'Use children for text and registered size/weight choices. Do not assume native Title/heading props are exposed by Typography.',
  ],
  textInput: [
    'Use defaultValue for visible sample data; placeholder is only an empty-field hint. Native input types, adornments and icons require explicit catalog props/slots.',
  ],
  textarea: [
    'This is plain multiline text, not a rich-text editor. A toolbar or character counter is not implied by the native library.',
  ],
  button: [
    'Use only the selected adapter color prop schema and its registered choices. Do not infer native color values from another library or write native appearance props into layout style.',
    'A Save/Cancel label does not implement save/reset. Interactions must be explicit; service persistence is outside the preview contract.',
  ],
  segmented: [
    'This stores one scalar selection. It does not create tab panels or navigation automatically.',
  ],
  dataTable: [
    'Palette creation initializes 6 columns × 10 body rows with Column1…Column6 and Row 1-1…Row 10-6. Each cell is an independent box subtree in slots.cellContents, in row-major order; props.rows contains stable {id} records, columns use unique stable keys, and data is empty.',
    'Independent mode requires 1–20 columns, 1–100 rows, exactly rows.length × columns.length inline box roots, and no renderCell or saved cellContents binding. Inserting a row/column creates empty boxes and preserves all other IDs/content.',
    'Cell copy replaces every other cell in the chosen body row/column with an independent deep clone of all components, values, props, styles and inline slots; internal references are remapped, nested saved slots are materialized. One undo transaction. Editor helpers and inferred column value types are never JSON fields.',
    'Legacy columns/data and optional renderCell remain supported without conversion: plain values stringify; renderCell is sampled in the first cell in design and repeated per cell in preview. Never mix legacy data/renderCell with independent mode.',
    'Read data-display for an independent-table JSON recipe. Filtering, pagination, sorting, selection, sticky rows/headers and service behavior are outside the basic authoring contract.',
  ],
}
