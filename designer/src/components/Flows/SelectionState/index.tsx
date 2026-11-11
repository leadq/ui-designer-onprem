import { Badge, Disclosure, Group, InfoPopover, Select, Stack, Text } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import type { ComponentStateRule } from '@root/types/preview'
import {
  canDisableNode,
  getComponentStateSummary,
  getLocalStateFields,
  getVisibilityRule,
} from '@root/utils/conditions/componentState'
import { getConditionNodes } from '@root/utils/conditions/conditionModel'

import { StateRuleEditor } from '../StateRuleEditor'
import { getInitialStateCondition } from '../utils/getInitialStateCondition'

export interface SelectionStateProps {
  nodeIds?: string[]
  isExpanded?: boolean
  isScrollable?: boolean
}

export const SelectionState = ({
  nodeIds,
  isExpanded: expanded = false,
  isScrollable: scrollable = false,
}: SelectionStateProps) => {
  const { translate } = useBuilderI18n()
  const nodes = useEditorStore((state) => state.nodes)
  const selection = useEditorStore((state) => state.selectedNodeIds)
  const ids = nodeIds ?? selection
  const update = useEditorStore((state) => state.setComponentState)
  const isPreview = useEditorStore((state) => state.previewMode)
  const selected = getConditionNodes(nodes).filter((node) => ids.includes(node.id))

  if (
    !selected.length ||
    selected.length !== ids.length ||
    selected.some((node) => node.flow || node.overlay || node.type === 'designerFrame')
  ) {
    return null
  }

  const summaries = selected.map((node) => getComponentStateSummary(nodes, node))
  const conditionCount = summaries.reduce((count, summary) => count + summary.conditionCount, 0)

  const indicator = summaries.some((summary) => summary.hasSettings) ? (
    <Badge color='note'>
      <EditorIcon aria-hidden name='adjustments' size={12} />{' '}
      {translate(conditionCount ? 'componentState.count' : 'componentState.configured', {
        count: conditionCount,
      })}
    </Badge>
  ) : undefined

  const fields = getLocalStateFields(nodes, selected, registry)

  const properties = [
    'visibleWhen',
    ...(selected.every((node) => canDisableNode(node, registry)) ? ['enabledWhen' as const] : []),
  ] as const

  const content = (
    <Stack gap='md'>
      <Group justify='between'>
        <Text color='muted' size='xs'>
          {translate('componentState.designHint')}
        </Text>
        <InfoPopover label={translate('componentState.helpTitle')}>
          <Text size='sm'>{translate('componentState.help')}</Text>
        </InfoPopover>
      </Group>
      {!fields.length && (
        <Text color='muted' size='xs'>
          {translate('componentState.noFields')}
        </Text>
      )}
      {properties.map((property) => {
        const rules = selected.map((node) =>
          property === 'visibleWhen'
            ? getVisibilityRule(nodes, node)
            : node.stateRules?.enabledWhen,
        )

        const fallbacks = selected.map((node) =>
          property === 'visibleWhen'
            ? !node.prototypeHidden
            : !(node.props.disabled ?? registry[node.type]?.defaultProps.disabled),
        )

        const isMixed =
          rules.some((rule) => JSON.stringify(rule) !== JSON.stringify(rules[0])) ||
          fallbacks.some((value) => value !== fallbacks[0])

        const rule = isMixed ? undefined : rules[0]
        const mode = isMixed ? 'mixed' : rule ? 'conditional' : fallbacks[0] ? 'always' : 'never'
        const handleRule = (next: ComponentStateRule) => update(ids, property, next, true)
        const handleRuleChange = handleRule

        return (
          <Stack key={property} gap='sm'>
            <Select
              isDisabled={isPreview}
              label={translate(`componentState.${property}`)}
              value={mode}
              data={[
                ...(isMixed
                  ? [{ value: 'mixed', label: translate('visibility.mixed'), disabled: true }]
                  : []),
                ...(['always', 'never', 'conditional'] as const).map((value) => ({
                  value,
                  label: translate(`componentState.${property}.${value}`),
                  disabled: value === 'conditional' && !fields.length,
                })),
              ]}
              onChange={(event) =>
                update(
                  ids,
                  property,
                  event.target.value === 'conditional'
                    ? { match: 'all', conditions: [getInitialStateCondition(fields[0])] }
                    : undefined,
                  event.target.value !== 'never',
                )
              }
            />
            {rule ? (
              <StateRuleEditor fields={fields} value={rule} onChange={handleRuleChange} />
            ) : null}
          </Stack>
        )
      })}
    </Stack>
  )

  return expanded ? (
    content
  ) : (
    <Disclosure
      indicator={indicator}
      isScrollable={scrollable}
      label={translate('componentState.title')}
    >
      {content}
    </Disclosure>
  )
}
