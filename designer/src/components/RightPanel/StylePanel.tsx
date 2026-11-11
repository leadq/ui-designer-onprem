import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'

import { Divider, Stack, Text } from '../common'

import { useStylePanel } from './hooks/useStylePanel'
import { SizingModeControls } from './SizingModeControls/SizingModeControls'
import { AdvancedStylePanel } from './AdvancedStylePanel'
import { BreakpointSelector } from './BreakpointSelector'
import { ColorStylePanel } from './ColorStylePanel'
import { FriendlyLayoutControls } from './FriendlyLayoutControls'
import { FriendlySpacingControls } from './FriendlySpacingControls'
import { VisualSpacingEditor } from './VisualSpacingEditor'

export const StylePanel = () => {
  const { translate } = useBuilderI18n()
  const panel = useStylePanel()
  const { selectedNodes, effectiveStyle, handleStyleChange, handleStylePatch } = panel

  if (selectedNodes.length === 0) {
    return (
      <Stack align='center' justify='center' style={{ padding: '16px' }}>
        <Text color='secondary' size='sm'>
          {translate('stylePanel.noSelection')}
        </Text>
      </Stack>
    )
  }

  const handleStylePatchChange = handleStylePatch

  return (
    <Stack gap='lg'>
      <BreakpointSelector />

      {selectedNodes.every(
        (node) =>
          registry[node.type]?.isContainer ||
          registry[node.type]?.defaultStyle.display !== undefined ||
          node.style.display !== undefined ||
          Object.values(node.responsiveStyles ?? {}).some((style) => style.display !== undefined),
      ) && (
        <Stack gap='sm'>
          <Divider label={translate('stylePanel.layoutSection')} variant='heading' />
          <FriendlyLayoutControls style={effectiveStyle} onChange={handleStylePatchChange} />
        </Stack>
      )}

      {selectedNodes.length === 1 && (
        <Stack gap='sm'>
          <Divider label={translate('stylePanel.sizing')} variant='heading' />
          <SizingModeControls
            node={selectedNodes[0]}
            style={effectiveStyle}
            onChange={handleStylePatchChange}
          />
        </Stack>
      )}

      <Stack gap='sm'>
        <Divider label={translate('stylePanel.spacingSection')} variant='heading' />
        <FriendlySpacingControls style={effectiveStyle} onChange={handleStylePatchChange} />
        <VisualSpacingEditor style={effectiveStyle} onChange={handleStylePatchChange} />
      </Stack>

      <ColorStylePanel nodes={selectedNodes} />

      <AdvancedStylePanel
        effectiveStyle={effectiveStyle}
        onStyleChange={handleStyleChange}
        onStylePatch={handleStylePatch}
      />
    </Stack>
  )
}
