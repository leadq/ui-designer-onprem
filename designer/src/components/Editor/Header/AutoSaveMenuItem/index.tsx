import { Text } from '@root/components/common'
import { Menu } from '@root/components/common/Menu'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useWorkspaceSaveControls } from '@root/hooks/useWorkspaceSaveControls'

export const AutoSaveMenuItem = () => {
  const { translate } = useBuilderI18n()

  const { isAutoSaveEnabled, hasPreferenceError, isBusy, handleAutoSaveChange } =
    useWorkspaceSaveControls()

  return (
    <>
      <Menu.CheckboxItem
        isChecked={isAutoSaveEnabled}
        isDisabled={isBusy}
        onChange={handleAutoSaveChange}
      >
        {translate('workspace.autoSave')}
      </Menu.CheckboxItem>
      {hasPreferenceError ? (
        <Text role='alert' size='xs'>
          {translate('workspace.preferenceFailed')}
        </Text>
      ) : null}
    </>
  )
}
