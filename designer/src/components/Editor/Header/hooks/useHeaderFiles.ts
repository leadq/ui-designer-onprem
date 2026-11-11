import { type ChangeEvent, useCallback, useRef } from 'react'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'
import { useWorkspaceDesigns } from '@root/hooks/useWorkspaceDesigns'
import { useEditorStore } from '@root/stores/editor'
import { createDesignDocument, parseDesignDocument } from '@root/utils/designDocument'
import { downloadFile, exportToJSON } from '@root/utils/designExport'
import { getFlatDesignDocument } from '@root/utils/flatDocument'

const INDENT_SIZE = 2

export const useHeaderFiles = () => {
  const { translate } = useBuilderI18n()
  const adapterId = useEditorStore((state) => state.adapterId)
  const nodes = useEditorStore((state) => state.nodes)
  const pageName = useEditorStore((state) => state.pageName)
  const pageNotes = useEditorStore((state) => state.pageNotes)
  const pageAnnotations = useEditorStore((state) => state.pageAnnotations)
  const savedDesigns = useEditorStore((state) => state.slotComponents)
  const { handleImport, error: importError } = useWorkspaceDesigns()
  const importFileRef = useRef<HTMLInputElement>(null)

  const handleExportJSON = useCallback(() => {
    const safeName = pageName.replace(/[^a-zA-Z0-9_-]/g, '_') || 'design'

    const json = exportToJSON(
      createDesignDocument(nodes, pageName, pageNotes, pageAnnotations, savedDesigns, adapterId),
    )

    downloadFile(json, `${safeName}.json`)
  }, [nodes, pageName, pageNotes, pageAnnotations, savedDesigns, adapterId])

  const handleExportFlat = () => {
    const document = createDesignDocument(
      nodes,
      pageName,
      pageNotes,
      pageAnnotations,
      savedDesigns,
      adapterId,
    )

    downloadFile(
      JSON.stringify(getFlatDesignDocument(document), null, INDENT_SIZE),
      `${pageName.replace(/[^a-zA-Z0-9_-]/g, '_') || 'design'}.flat.json`,
    )
  }

  const handleImportJSON = useCallback(() => {
    importFileRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]

      if (!file) {
        return
      }

      const reader = new FileReader()

      reader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string)

          await handleImport(parseDesignDocument(parsed))
        } catch (err) {
          // eslint-disable-next-line no-alert
          alert(
            translate('header.importFailed', {
              reason: err instanceof Error ? err.message : translate('header.invalidJson'),
            }),
          )
        }
      }

      reader.readAsText(file)

      event.target.value = ''
    },
    [handleImport, translate],
  )

  return {
    importError,
    importFileRef,
    handleExportJSON,
    handleExportFlat,
    handleImportJSON,
    handleFileChange,
  }
}
