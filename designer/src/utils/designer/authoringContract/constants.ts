import { DESIGN_LAYOUT_KEYS } from '../componentContract'

import { JSON_GENERATION_CONTRACT, SIZING_CONTRACT } from './jsonAuthoring'
import { RESPONSIVE_PROP_CONTRACT } from './responsiveProps'
import { RUNTIME_COMPATIBILITY_CONTRACT } from './runtimeCompatibility'

export const DESIGN_AUTHORING_CONTRACT = {
  localPersistence: {
    rule: 'Complete design documents use browser-profile/origin-local IndexedDB with the central HTTP MCP connection. File > My designs opens the same document library as the startup dialog. Save flushes the current document without changing designId; Save a copy creates a new active designId and preserves the original. Automatic saving is optional (off by default) and writes after 5 seconds without document edits. Save and Ctrl/Cmd+S explicitly persist the same designId. New/import/library changes create unsaved drafts, not extra saved records. Leaving dirty content requires Save and continue, Continue without saving, or Cancel; previously saved records remain. Pending/error/dirty state protects browser exit with a native warning. MCP mutations still explicitly persist the document and operation receipt atomically regardless of the user autosave preference. Saved status means IndexedDB transaction completion, not server/cloud storage. Developer connection IDs are under Advanced > MCP connection, separate from design copying. Old localStorage document templates are not imported; old active drafts are read only by boot compatibility when no IndexedDB document exists. Reusable custom components use a separate IndexedDB metadata library, with definitions embedded in the full document; no new design or component-library writes use localStorage. Listing saved designs is read-only and remains available after write failures. Canonical JSON fields and schema are unchanged.',
  },
  colorTokens: {
    rule: 'Schema v14: styleTokens maps backgroundColor/color/borderColor to adapter colorPalette IDs, never raw CSS or Sass values. Optional responsiveStyleTokens uses wide/lg/md/sm/xs, desktop-first inheritance. Absent keys inherit; removing an override restores the wider value. Registered usages limit each token. Tokens apply to the native root after layout/default styles; native color props retain their own semantics. Structural frames/flows cannot carry color tokens. Catalog backgroundColor is the optional adapter palette token ID for the default frame, palette preview and prototype viewport surface; null uses the neutral fallback. This library default is not a document field and does not override component backgrounds. Target applications should apply it to their page surface when reproducing the preview; TSX node export does not inject a page background. Canvas and preview resolve cssValue, preserving CSS var references. CSS defining those variables must be explicitly imported by the adapter Provider and target app. Sass variable/importPath is optional code-generation metadata, never a browser value. TSX resolves base CSS and preserves authored/responsive token metadata; target generation must translate responsive layers and may use the Sass mapping with an explicit import. Picker state is editor-only. Switching adapters never maps IDs by label.',
  },
  selectedFrameExport: {
    tool: 'export_selected_frames',
    rule: 'Read ready get_editor_context; frameExport.eligible must be true. The top responsive row has frame checkboxes that toggle whole-screen IDs without modifiers. All responsive copies show the frame outline; component selection remains empty. Active screen tabs and component selections never imply full-screen selection. Pass exactly frameExport.frameIds and current expectedVersion, plus editorId and HTTP clientId/designId. Partial, mixed, stale, preview and empty selections fail closed. Includes whole subtrees, slots, responsive values and owned overlays. Removes interactions and bindings referencing excluded nodes; retains links between included screens. Retains referenced slot templates and their transitive dependencies with stable IDs, pruning excluded targets inside each template while preserving its internal references; missing or recursive saved content fails. Omits unrelated page notes, annotations and unused saved templates. Nested or flat is a standalone strict-importable document. Selection metadata and scope/omission report are response context, never DesignDocument fields. get_design remains the full source document; export never mutates it.',
  },
  icons: {
    searchTool: 'search_icons',
    componentType: 'icon',
    rule: 'UI-independent icon node: props.glyph is a registered libraryId:iconId string from the configured institution icon source. The delivery starts with no active icon source; catalog.iconLibraries retains its array shape and is empty until one source is configured. New nodes use the first registered catalog icon, or an explicit empty placeholder when no catalog entry exists. Only registered glyph schema options are valid; archived sample sources are not active or silently remapped. An explicit empty string remains supported with its size preserved; props.size defaults to 32 CSS px (1–1024); accessibleLabel is optional. Glyphs are not JSX, import paths, functions or item bindings. Icons can be ordinary children and supported slot children. Appearance inherits currentColor; arbitrary visual styles remain forbidden. Preview/export resolve the exact configured native package icon with source-owned import and prop mapping; authored layout width/height overrides size-derived dimensions. Editor control icons and picker/search state are not document fields.',
  },
  adapterConfiguration: {
    rule: 'Adapter registration order is dropdown/catalog order. The first registered adapter is the default for new documents; saved adapterId is preserved. Unlabelled historical documents retain the legacy adapter identity and are not reinterpreted when order changes. Display versions are maintained manually by adapter authors, not injected by the bundler.',
  },
  runtimeCompatibility: RUNTIME_COMPATIBILITY_CONTRACT,
  jsonGeneration: JSON_GENERATION_CONTRACT,
  componentRecipes: {
    rule: 'Component descriptions/visualHints and recipeIndex aid recognition; details include recipes beside props/slots. Match the observed use case before following instructions and adapting example IDs. A native ReactNode prop requires a registered Designer slot/subtree mapping; never serialize JSX/functions as JSON props. Recipes cannot expand acceptedPropKeys or slotKeys. Prefer the matching native/compound recipe over imitating it with unrelated sibling nodes. If no recipe proves ownership, do not infer it solely from proximity/color. Recipes and images are optional adapter additions; existing metadata/renderers do not require them. Optional images metadata identifies recipe-owned prepared PNG references: fetch only a selected get_recipe_image using the same contractRevision; never serialize these references in design JSON.',
  },
  contractDiscovery: {
    tool: 'get_design_contract',
    rule: 'Read overview for common JSON fields, adapter component summaries and strategy index; after purpose/scale analysis batch only selected componentTypes and guide sections in details. Reuse contractRevision; allComponents is explicit opt-in. The same field meanings apply to authoring and React generation.',
  },
  annotations: {
    guide: 'json-field-reference',
    rule: 'The note editor authors multiple title/text annotations without a category selector. New notes use kind behavior; preserve existing kinds when editing. Interpret the text in its target node/page context, not as executable rules. Explicitly saving a legacy notes/pageNotes entry converts only that entry into one structured annotation and clears its old text field; node conversion is one undo transaction.',
  },
  responsiveProps: RESPONSIVE_PROP_CONTRACT,
  collections: {
    guide: 'data-display',
    components: ['itemList', 'listItem', 'tabs', 'tabItem'],
    rule: 'Read component authoring.collection and collectionItem. Structural item ownership, initialItemId and children must be updated atomically. Transient editing selection and helpers are not JSON fields.',
  },
  renderFeedback: {
    tool: 'render_design_frame',
    guide: 'render-feedback',
    mode: 'isolated-initial-preview',
    default: 'none',
    activation: 'explicit-user-request',
    rule: 'Only when the user explicitly requests visual comparison/refinement: read ready editor context, render a normal frame at explicit CSS-pixel width/height, inspect PNG and node measurements. Fix authored props/layout via update_design, wait for applied ACK, verify the imported frame or patched values in get_design and wait for matching ready context, then render the new version. ACK can precede document sync. Do not copy measured rectangles to absolute positions or design JSON.',
    bounds: {
      minWidth: 320,
      maxWidth: 2048,
      minHeight: 200,
      maxHeight: 2048,
      maxImageMiB: 8,
      maxMeasuredNodes: 500,
    },
    limitations:
      'Viewport image at scroll origin. Initial prototype state, not live input/overlay state. Same-origin GET resources only. Vertical scroll/overflow observations require interpretation. Requires configured local Designer and existing Playwright Chromium.',
  },
  editorContext: {
    tool: 'get_editor_context',
    rule: 'Read before each selected-element/reference request. Wait for ready=true. Use returned editorId and version for all reads/writes. Selection, breakpoint and reference placement are editor context, not design JSON. Backend HTTP mode requires the secret clientId copied from Advanced > MCP connection on EVERY live tool call; never infer it from a transport session. Retain designId/editorId/content version for writes; isPersisted=true confirms IndexedDB. Transport sessions scope cancellation only; reinitialize after backend restart or session expiry. Failed receipt writes recover atomically with subsequent saves. One active socket per clientId; multiple distinct clients are isolated.',
    referenceOrder:
      'Rows top-to-bottom, left-to-right within each row. selectedReferences follows canvas order, never click/upload order. Source pixel dimensions differ from displayWidth.',
    styles:
      'Selected nodes include authored props/responsiveProps, effectiveProps, authored style/styleTokens/responsiveStyleTokens, effectiveStyle at the current width, resolvedSizingStyle, parent, siblings and path. Never serialize resolvedSizingStyle back as authored intent.',
    screenshot:
      'Context is semantic. Use render_design_frame with explicit editorId, version, frameId and viewport for an isolated initial-preview PNG and DOM measurements; it is not a live tab screenshot or automatic similarity score.',
  },
  promptAuthoring: {
    guide: 'prompt-authoring',
    input:
      'Text prompts or reference images. Read authoring-modes: ask Basic/Detailed if unspecified and ask once for approximate CSS viewport or modal/card reference width if neither is known. Basic includes UI and strategy-defined structural form/wizard flow; Detailed confirms business rules. For screen generation, inspect selected/requested screens or all current-document frames if unspecified; co-delivery alone does not prove a wizard. Read forms/wizard for shared provider/stepper even without drawn links. Read screen-understanding for project visual-recognition briefs; recognizing a trigger does not define its unseen content. Basic preserves the known closed view; Detailed resolves missing content and static/service sources within its question budget. Default to native theme.',
    update:
      'update_design patches existing node IDs in place. JSON merge patch: objects merge, null removes a key, arrays replace. Read current editorId/version; poll get_design_import for applied. Preserve unaffected IDs and use one undo. New screens use import_design.',
  },
  guideIds: {
    authoringModes: 'authoring-modes',
    screenUnderstanding: 'screen-understanding',
    dataInference: 'data-inference',
    templateCompletion: 'template-completion',
    layout: 'layout',
    capabilityGaps: 'capability-gaps',
    referenceImages: 'reference-images',
  },
  referenceImages: {
    workspace:
      'References are movable, multi-selectable canvas objects with aspect-locked edge/corner resizing. Placement is local editor metadata, never DesignNode.style or exported JSON. Image pixel dimensions remain unchanged by display resizing.',
    storage:
      'Editor references are separate IndexedDB binary PNG records, not component nodes or design JSON. Retrieve metadata with list_reference_images and pixels on demand with get_reference_image. Never embed reference Base64 in the design document.',
    import:
      'Optional import_design appends only new root screens and their flows to the current explicitly targeted browser/design. Validate first, use the current get_design snapshot version (not document schema version), and confirm applied with get_design_import. Existing screens and page metadata are preserved; savedDesigns are not accepted. Internal IDs are remapped and the append is one undo step.',
    retry:
      'Keep the same requestId and arguments on retry. Pending is not applied. Read the reference-images guide for acknowledgement, expiration and stale-document handling.',
  },
  propPolicy:
    'Enforced on every JSON load, including files, flat documents, saved designs, templates, preview and MCP. Only acceptedPropKeys from adapter defaultProps/propsSchema are accepted; dataTable editor pseudo-props are excluded. Slots accept saved-design IDs or null, not arbitrary objects. Unknown keys reject the whole document before changing the editor. The upstream TypeScript/native API is not the runtime adapter contract. Never serialize handlers, JSX or functions.',
  allowedLayoutKeys: [...DESIGN_LAYOUT_KEYS],
  stylePolicy:
    'Only listed layout keys may be overridden in style/responsiveStyles. Appearance must use registered props or the adapter colorTokens contract; arbitrary CSS remains forbidden. Fixed defaultStyle values may round-trip unchanged; they cannot be customized outside layout. No legacy version bypass. Rejected local records are preserved for recovery.',
  workspace:
    'Every frame/overlay must be a root sibling registered exactly once in a root-layout designerFlow, even for one screen. Flow children must be empty.',
  editorPresentation:
    'Frame design surfaces have a 960px minimum height and grow with content. This is editor-only: keep structural props/style empty; preview uses its viewport and TSX emits no frame wrapper. Linked width rows reuse canonical node IDs; each flow starts at 1440px. View rows, panel labels, disclosure state, focus, zoom and shortcut hints are not design JSON fields.',
  styleResolution: {
    contextAlignment:
      'Selected-item left/right and horizontal/vertical centering write normal responsive layout styles in one undo transaction. Auto margins align the selected node within remaining flex space; grid aligns within its cell. Block parents become column flex, preserving sibling styles. Only the selected node is aligned, not its children. Absolute/fixed and named-slot roots are unsupported. Uniform margin edits replace alignment margins; no extra alignment JSON field.',
    order: [
      'defaultStyle',
      'style',
      'responsiveStyles.wide',
      'responsiveStyles.lg',
      'responsiveStyles.md',
      'responsiveStyles.sm',
      'responsiveStyles.xs',
    ],
    rule: 'Stop at the active breakpoint. xl uses base style only; responsiveStyles.xl is not applied. Smaller breakpoints inherit larger overrides.',
    units:
      'Numeric dimensional CSS values use px; unitless values such as flexGrow remain unitless. Explicit CSS units are accepted for layout.',
    spacing: {
      presets: { minPx: 0, maxPx: 120, stepPx: 4, marginAllowsAuto: true },
      uniform:
        'Set padding/margin on the target style layer and remove its four side keys from that layer. A shorthand clears inherited side overrides before that layer is merged.',
      custom:
        'Uniform and custom spacing are mutually exclusive on an edited layer. For custom mode, remove the group shorthand, initialize all four sides from the currently resolved spacing, then change the chosen side. Only those four values apply; clearing a custom field writes 0px. A complete four-side layer replaces inherited shorthand. Opening the side editor does not mutate data. Legacy mixed documents remain readable.',
      serialization:
        'Use CSS values only, e.g. 12 or "12px". Special Values and other UI labels are not values. Omit removed keys in full JSON; undefined is not JSON. Non-preset CSS values remain supported; presets are UI choices, not a schema limit.',
    },
    sizing:
      'Fill intent is width/height: "100%"; resolve remaining space against the current parent and breakpoint (flex main-axis grow, cross-axis stretch, grid cell fill). Content sizing is explicit "auto" to override inherited fill. Preserve min/max bounds; do not bake rendered flex CSS into saved intent.',
    sizingRules: SIZING_CONTRACT,
  },
  supportPolicy:
    'If a role/prop/slot is missing, annotate the gap or use an explicitly labelled native fallback; do not draw an imitation or claim unsupported behavior works.',
}
