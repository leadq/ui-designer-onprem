import { Checkbox, Input, Select, Stack, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useEditorStore } from '@root/stores/editor'
import type { DesignNode } from '@root/types/document'
import type { DesignOverlay } from '@root/types/flow'
import { getAllNodes, getFlowOwner } from '@root/utils/flows/flowModel'

export interface WindowSettingsProps {
  node: DesignNode
}

export const WindowSettings = ({ node }: WindowSettingsProps) => {
  const { translate } = useBuilderI18n()
  const nodes = useEditorStore((state) => state.nodes)
  const setOverlay = useEditorStore((state) => state.setOverlaySettings)
  const updateLabel = useEditorStore((state) => state.updateNodeLabel)
  const previewMode = useEditorStore((state) => state.previewMode)
  const owner = getFlowOwner(nodes, node.id)

  if (
    !owner?.flow?.screens.some((screen) => screen.nodeId === node.id && screen.kind === 'overlay')
  ) {
    return null
  }

  const value: DesignOverlay = node.overlay ?? {
    ownerFrameId: owner.flow.startScreenId,
    kind: 'custom',
    initiallyOpen: false,
  }

  const handleChange = (patch: Partial<DesignOverlay>) =>
    setOverlay(node.id, { ...value, ...patch })

  return (
    <Stack gap='sm'>
      <Text weight={600}>{translate('window.settings')}</Text>
      <Input
        isDisabled={previewMode}
        label={translate('window.name')}
        value={node.label ?? ''}
        onChange={(event) => updateLabel(node.id, event.target.value)}
      />
      <Select
        isDisabled={previewMode}
        label={translate('window.frame')}
        value={value.ownerFrameId}
        data={owner.flow.screens
          .filter((screen) => screen.kind === 'screen')
          .map((screen) => ({
            value: screen.nodeId,
            label:
              getAllNodes(nodes).find((child) => child.id === screen.nodeId)?.label ??
              screen.nodeId,
          }))}
        onChange={(event) => handleChange({ ownerFrameId: event.target.value })}
      />
      {value.presentation !== 'notification' && (
        <Select
          isDisabled={previewMode}
          label={translate('window.kind')}
          value={value.kind}
          data={(['custom', 'confirmation', 'smsOtp'] as const).map((kind) => ({
            value: kind,
            label: translate(`window.kind.${kind}`),
          }))}
          onChange={(event) => handleChange({ kind: event.target.value as DesignOverlay['kind'] })}
        />
      )}
      <Checkbox
        isChecked={value.initiallyOpen}
        isDisabled={previewMode}
        label={translate('window.initiallyOpen')}
        onChange={(initiallyOpen) => handleChange({ initiallyOpen })}
      />
      {value.presentation !== 'notification' && (
        <Checkbox
          isChecked={value.withBackdrop !== false}
          isDisabled={previewMode}
          label={translate('window.backdrop')}
          onChange={(withBackdrop) => handleChange({ withBackdrop })}
        />
      )}
      <Text color='muted' size='xs'>
        {translate('window.designHint')}
      </Text>
    </Stack>
  )
}
