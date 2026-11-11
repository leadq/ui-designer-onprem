export const RESPONSIVE_PROP_CONTRACT = {
  guide: 'json-field-reference',
  order: [
    'defaultProps',
    'props',
    'responsiveProps.wide',
    'responsiveProps.lg',
    'responsiveProps.md',
    'responsiveProps.sm',
    'responsiveProps.xs',
  ],
  rule: 'Stop at active breakpoint. xl uses base props and is forbidden in responsiveProps. Only component authoring.responsivePropKeys (propsSchema.isResponsive) scalar keys are accepted. Missing inherits; false, 0 and empty string are explicit values. Null removes a key only in update_design merge patch, never in a full document. Structural nodes, identity, content, state and events cannot vary here.',
  semantics:
    'Honor authoring.responsiveSemanticElement: resolve the HTML element from base props/defaults, never a responsive visual variant. Keep component identity and state stable.',
  generation:
    'Read react-generation. CSS/SCSS module mixins and verified project viewport hook must use the same desktop-first ranges. Do not invent hook APIs. Linked canvas rows and device frames are editor preferences, not duplicate document nodes.',
}
