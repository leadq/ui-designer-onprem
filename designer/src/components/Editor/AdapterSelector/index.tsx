import { UI_ADAPTERS } from '@root/adapters'
import { Box, Select, Text } from '@root/components/common'
import { InfoPopover } from '@root/components/common/InfoPopover'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useWorkspaceDesigns } from '@root/hooks/useWorkspaceDesigns'
import { useEditorStore } from '@root/stores/editor'

import styles from './styles.module.scss'

export const AdapterSelector = () => {
  const adapterId = useEditorStore((state) => state.adapterId)
  const { handleSelectClick, isBusy, error } = useWorkspaceDesigns()
  const previewMode = useEditorStore((state) => state.previewMode)
  const { translate } = useBuilderI18n()

  return (
    <Box className={styles.adapterSelector}>
      <Box className={styles.adapterSelector__heading}>
        <Text color='secondary' size='xs'>
          {translate('adapter.label')}
        </Text>
        <InfoPopover label={translate('adapter.help')}>
          <Text size='sm'>{translate('adapter.hint')}</Text>
        </InfoPopover>
      </Box>
      <Select
        aria-label={translate('adapter.label')}
        isDisabled={previewMode || isBusy}
        value={adapterId}
        data={Object.values(UI_ADAPTERS).map((adapter) => ({
          value: adapter.id,
          label: [adapter.name, adapter.version].filter(Boolean).join(' · '),
        }))}
        onChange={(event) => {
          if (event.target.value !== adapterId) {
            void handleSelectClick(undefined, false, event.target.value)
          }
        }}
      />
      {error ? (
        <Text role='alert' size='xs'>
          {error}
        </Text>
      ) : null}
    </Box>
  )
}
