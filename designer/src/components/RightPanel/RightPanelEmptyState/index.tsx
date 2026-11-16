import { Stack, Text } from '@root/components/common'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

export const RightPanelEmptyState = () => {
  const { translate } = useBuilderI18n()

  return (
    <Stack
      align='center'
      justify='center'
      style={{ height: '100%', backgroundColor: 'var(--designer-bg-panel)' }}
    >
      <Text color='muted' size='sm'>
        {translate('rightPanel.empty')}
      </Text>
    </Stack>
  )
}
