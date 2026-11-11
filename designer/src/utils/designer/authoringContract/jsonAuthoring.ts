import type { DesignNode } from '@root/types/document'

export const JSON_GENERATION_CONTRACT = {
  scope:
    'A repeatable decision process, not a promise of identical model output. These instructions are MCP context, never DesignDocument fields.',
  steps: [
    {
      id: 'discover',
      completeWhen:
        'Adapter and schemaVersion come from overview; selected component details and relevant guides use its contractRevision. For existing-design edits, ready editor context and get_design establish current IDs, selection, parents and responsive state. For each node, supported props/slots, defaults and native ownership are known. Recipes illustrate native composition; shared field/layout rules remain authoritative.',
    },
    {
      id: 'structure',
      completeWhen:
        'Each node has a unique stable ID and supported type. Every root frame/overlay is registered once in a root-layout flow with empty children; structural props/style are empty. References resolve. Updates preserve unrelated nodes/IDs. Props, slots, state and behavior use their field contracts.',
    },
    {
      id: 'layout',
      completeWhen:
        'For each changed node and target breakpoint, resolve defaults plus authored layers and the parent direction. Choose each axis as fixed, content or fill; then bounds and alignment using styleResolution.sizingRules. An omitted key inherits; use auto to override inherited fill. Native appearance uses registered props/tokens; layout uses allowedLayoutKeys. Save intent, not resolvedSizingStyle or measured rectangles.',
    },
    {
      id: 'validate',
      completeWhen:
        'validate_design accepts the exact candidate document for the selected adapter. Correct errors at their reported node/field paths and validate again. Compare returned hierarchy, props, styles and responsive layers with intended edits. Structural validity alone proves neither centering, overflow, visual similarity nor target React behavior.',
    },
    {
      id: 'apply',
      completeWhen:
        'When editor mutation is requested, read ready context and use its live identity/version: HTTP clientId on every live call, designId/editorId and expectedVersion for writes. Use import_design for new screens, update_design for existing nodes. Objects merge, null removes keys, arrays replace. Confirm applied receipt and persistence; then get_design and matching ready context to verify the resulting nodes/values. Pending or stale results are not completion; refresh and reconcile before retrying. Visual review follows renderFeedback only when requested.',
    },
  ],
}

interface SizingExample {
  id: string
  intent: string
  parentStyle: DesignNode['style']
  style: DesignNode['style']
  responsiveStyles?: DesignNode['responsiveStyles']
}

export const SIZING_CONTRACT = {
  guide: 'layout',
  scope:
    'Ordinary layout children. Resolve native container defaults from component details; named-slot roots use their slot contract. Example fragments belong to a real parent and child style, not to structural frame/flow styles.',
  values: {
    fill: 'Only the exact string "100%" in width/height denotes fill. maxWidth/maxHeight: "100%" are ordinary bounds, not fill. Other percentages retain ordinary CSS meaning.',
    content:
      'Explicit "auto" cancels fill conversion; omission inherits defaults and wider breakpoint values. Existing authored flexGrow/alignSelf and parent alignment still apply: reconcile those constraints when changing intent.',
    fixed:
      'A number or CSS length requests a size, subject to min/max bounds, flex shrink and available space. Use boxSizing: "border-box" for an outer size that includes padding/border.',
  },
  precedence: [
    'Resolve effective props, adapter defaultStyle and prop-dependent layout defaults, then style and responsive layers through the active breakpoint (styleResolution.order). Resolve the parent at that same breakpoint.',
    'Convert fill on each axis according to the parent rules below. This overrides authored flexGrow/flexShrink/flexBasis on the filled main axis and alignSelf/justifySelf on the filled cross/grid axis.',
    'Preserve min/max bounds and margins. A max bound limits size; it does not specify position. CSS auto margins absorb remaining space before alignment. Available space and intrinsic/native content determine final geometry.',
  ],
  parentRules: [
    {
      when: 'Flex row or row-reverse; child width is fill',
      result:
        'width:auto, flexGrow:1, flexShrink:1, flexBasis:0. Share main-axis free space after siblings/gaps/margins.',
    },
    {
      when: 'Flex column or column-reverse; child height is fill',
      result:
        'height:auto, flexGrow:1, flexShrink:1, flexBasis:auto. Keep intrinsic content height; fill does not create a definite parent height.',
    },
    {
      when: 'Flex cross axis: row height fill or column width fill',
      result:
        'Filled dimension:auto and alignSelf:stretch. This overrides child alignSelf and parent alignItems, including center. With an auto margin on that axis OR any auto in margin shorthand, retain dimension:100% and set boxSizing:border-box; CSS auto margins control placement.',
    },
    {
      when: 'Grid child width/height fill',
      result:
        'Filled dimension:auto; width sets justifySelf:stretch, height sets alignSelf:stretch within the cell. Bounds remain; grid is not the default for forms/cards.',
    },
    {
      when: 'Normal flow',
      result:
        'Horizontal fill uses auto width for containers/block-like elements, otherwise 100%, with border-box. A normal block/flow-root container with a vertical-fill child acquires column flex. Re-evaluate the child against that effective parent.',
    },
  ],
  examples: [
    {
      id: 'bounded-center',
      intent:
        'Center an outer 640px content region horizontally; cap it to available parent content width on narrow screens. Parent alignItems controls children because this child is not fill.',
      parentStyle: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 32 },
      style: { width: 640, maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' },
    },
    {
      id: 'bounded-fill-center',
      intent:
        'Keep width fill with a 640px cap and center this child itself using paired horizontal auto margins.',
      parentStyle: { display: 'flex', flexDirection: 'column', padding: 32 },
      style: {
        width: '100%',
        maxWidth: 640,
        minWidth: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        boxSizing: 'border-box',
      },
    },
    {
      id: 'capped-fill-is-not-centering',
      intent:
        'Counterexample: with spare horizontal space, this capped fill child stretches up to its maxWidth and stays at the start. Parent alignItems:center and child alignSelf:center do not center it. Use bounded-center or bounded-fill-center for centering.',
      parentStyle: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 32 },
      style: {
        width: '100%',
        maxWidth: 640,
        alignSelf: 'center',
        minWidth: 0,
        boxSizing: 'border-box',
      },
    },
    {
      id: 'responsive-content',
      intent:
        'Fill a row on desktop; switch this child to content width below 768px. Explicit auto cancels width fill; deleting the sm width key would inherit fill again.',
      parentStyle: { display: 'flex', flexDirection: 'row', padding: 0 },
      style: { width: '100%', minWidth: 0 },
      responsiveStyles: { sm: { width: 'auto' } },
    },
  ] satisfies SizingExample[],
}
