import { ChangeEvent, useEffect, useState } from 'react'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { registry } from '@root/registry'
import { useEditorStore } from '@root/stores/editor'
import { downloadFile, exportToTSX } from '@root/utils/designExport'
import { getFlowManifest } from '@root/utils/flows/flowManifest'
import { getPascalCase } from '@root/utils/getPascalCase'

import { Button, Group, Input, Modal, Stack, Text } from '../common'

import styles from './ExportTsxModal.module.scss'

const INDENT_SIZE = 2

interface ExportTsxModalProps {
  isOpen: boolean
  onClose: () => void
}

const ExportTsxModal = ({ isOpen: opened, onClose }: ExportTsxModalProps) => {
  const { translate } = useBuilderI18n()
  const pageName = useEditorStore((state) => state.pageName)
  const nodes = useEditorStore((state) => state.nodes)
  const pageNotes = useEditorStore((state) => state.pageNotes)
  const pageAnnotations = useEditorStore((state) => state.pageAnnotations)
  const slotComponents = useEditorStore((state) => state.slotComponents)
  const defaultComponentName = getPascalCase(pageName) || 'GeneratedPage'
  const [componentName, setComponentName] = useState(defaultComponentName)
  const [fileName, setFileName] = useState(`${defaultComponentName}.tsx`)

  useEffect(() => {
    if (!opened) {
      return
    }

    setComponentName(defaultComponentName)

    setFileName(`${defaultComponentName}.tsx`)
  }, [defaultComponentName, opened])

  if (!opened) {
    return null
  }

  const handleComponentNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setComponentName(value)

    setFileName(`${value}.tsx`)
  }

  const handleExport = () => {
    const safeName = getPascalCase(componentName) || 'GeneratedPage'
    const tsxContent = exportToTSX(nodes, safeName, pageNotes, pageAnnotations, slotComponents)
    const safeFileName = fileName.endsWith('.tsx') ? fileName : `${fileName}.tsx`

    downloadFile(tsxContent, safeFileName, 'text/typescript')

    onClose()
  }

  const previewComponentName = getPascalCase(componentName) || 'GeneratedPage'
  const manifest = getFlowManifest(nodes, registry)

  const previewCode = exportToTSX(
    nodes,
    previewComponentName,
    pageNotes,
    pageAnnotations,
    slotComponents,
  )

  const handleExportClick = handleExport

  return (
    <Modal isOpen={opened} size='md' title={translate('export.title')} onClose={onClose}>
      <Stack gap='md'>
        {(manifest.flows.length > 0 || manifest.connections.length > 0) && (
          <Text color='muted'>{translate('flow.exportHint')}</Text>
        )}
        {manifest.issues.length > 0 && <Text>{translate('flow.manifestIssues')}</Text>}
        <Input
          label={translate('export.componentName')}
          placeholder={translate('export.componentPlaceholder')}
          value={componentName}
          onChange={handleComponentNameChange}
        />
        <Input
          label={translate('export.fileName')}
          placeholder={translate('export.filePlaceholder')}
          value={fileName}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setFileName(event.target.value)}
        />
        <div>
          <Text className={styles.exportTsxModal__previewLabel} size='xs'>
            {translate('export.preview')}
          </Text>
          <pre className={styles.exportTsxModal__preview}>{previewCode}</pre>
        </div>
        <Group justify='end' style={{ marginTop: '8px' }}>
          <Button variant='outline' onClick={onClose}>
            {translate('export.cancel')}
          </Button>
          <Button
            variant='outline'
            onClick={() =>
              downloadFile(
                JSON.stringify(manifest, null, INDENT_SIZE),
                `${previewComponentName}.flow.json`,
                'application/json',
              )
            }
          >
            {translate('flow.downloadManifest')}
          </Button>
          <Button onClick={handleExportClick}>{translate('export.action')}</Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export { ExportTsxModal }

export type { ExportTsxModalProps }
