import { Button, Group, Text } from '@root/components/common'
import { EditorIcon } from '@root/components/common/EditorIcon'
import { InputControl } from '@root/components/common/InputControl'
import { Menu } from '@root/components/common/Menu'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useWorkspaceDesigns } from '@root/hooks/useWorkspaceDesigns'

import { EditablePageName } from '../EditablePageName/EditablePageName'
import { NewFlowButton } from '../NewFlowButton'
import { OpenPreviewButton } from '../OpenPreviewButton'
import { OutlineModeButton } from '../OutlineModeButton'
import { ShortcutsButton } from '../ShortcutsButton'

import { useHeaderFiles } from './hooks/useHeaderFiles'
import { AdvancedMenu } from './AdvancedMenu'
import { AutoSaveMenuItem } from './AutoSaveMenuItem'
import { LanguageToggle } from './LanguageToggle'
import { SelectedFramesExportItem } from './SelectedFramesExportItem'
import { WorkspaceSaveStatus } from './WorkspaceSaveStatus'

import styles from './styles.module.scss'

interface HeaderProps {
  onOpenDesigns: () => void
  onExportTsx: () => void
}

const Header = ({ onOpenDesigns, onExportTsx }: HeaderProps) => {
  const { translate } = useBuilderI18n()
  const { handleSaveClick, handleDuplicateClick, error } = useWorkspaceDesigns()

  const {
    importError,
    importFileRef,
    handleExportJSON,
    handleExportFlat,
    handleImportJSON,
    handleFileChange,
  } = useHeaderFiles()

  const handleImportJSONClick = handleImportJSON
  const handleExportJSONClick = handleExportJSON

  return (
    <header className={styles.header}>
      <InputControl
        ref={importFileRef}
        accept='.json'
        style={{ display: 'none' }}
        type='file'
        onChange={handleFileChange}
      />

      <Group className={styles.header__leading} gap='md'>
        <EditablePageName />

        <NewFlowButton />
      </Group>

      <Group className={styles.header__actions} gap='sm'>
        <OpenPreviewButton />
        <ShortcutsButton />
        <OutlineModeButton />

        <Menu position='bottom-end' transition='pop' width={200}>
          <Menu.Target>
            <Button size='sm' style={{ fontWeight: 600 }} variant='secondary'>
              <EditorIcon name='folder' size={16} strokeWidth={1.5} />
              {translate('header.actions')}
              <EditorIcon name='chevronDown' size={14} strokeWidth={1.5} />
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>{translate('header.templates')}</Menu.Label>
            <Menu.Item leftSection={<EditorIcon name='folder' size={14} />} onClick={onOpenDesigns}>
              {translate('header.myTemplates')}
            </Menu.Item>
            <Menu.Item leftSection={<EditorIcon name='save' size={14} />} onClick={handleSaveClick}>
              {translate('workspace.save')}
            </Menu.Item>

            <Menu.Item onClick={handleDuplicateClick}>{translate('workspace.saveCopy')}</Menu.Item>
            <AutoSaveMenuItem />
            <Menu.Divider />

            <Menu.Label>{translate('header.json')}</Menu.Label>
            <Menu.Item
              leftSection={<EditorIcon name='upload' size={14} />}
              onClick={handleImportJSONClick}
            >
              {translate('header.importJson')}
            </Menu.Item>
            <Menu.Item
              leftSection={<EditorIcon name='download' size={14} />}
              onClick={handleExportJSONClick}
            >
              {translate('header.exportJson')}
            </Menu.Item>
            <SelectedFramesExportItem />
          </Menu.Dropdown>
        </Menu>

        <span className={styles.header__separator}>|</span>

        <LanguageToggle />

        <WorkspaceSaveStatus />
        {error || importError ? <Text role='alert'>{error || importError}</Text> : null}
        <AdvancedMenu onExportFlat={handleExportFlat} onExportTsx={onExportTsx} />
      </Group>
    </header>
  )
}

export { Header }

export type { HeaderProps }
