import { useReferenceStore } from '@root/stores/referenceStore'
import { getAllNodes } from '@root/utils/flows/flowModel'
import { getBehaviorEntries } from '@root/utils/getBehaviorEntries'
import { findNode } from '@root/utils/nodes'
import {
  listWorkspaceDesigns,
  readOperationReceipt,
} from '@root/utils/workspacePersistence/persistence'
import { getWorkspace } from '@root/utils/workspacePersistence/state'

import { getLiveDesign, getLiveDocument, getLiveTarget } from './document'
import { getLiveContext } from './getLiveContext'
import { getSelectedFrameResult } from './getSelectedFrameResult'

const getImage = async (id: unknown) => {
  const image = useReferenceStore.getState().images.find((item) => item.id === id)

  if (!image) {
    throw new Error('REFERENCE_UNAVAILABLE')
  }

  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(String(reader.result).split(',')[1])

    reader.onerror = () => reject(new Error('REFERENCE_UNAVAILABLE'))

    reader.readAsDataURL(image.blob)
  })

  return {
    data,
    metadata: { id: image.id, name: image.name, width: image.width, height: image.height },
  }
}

export const getBridgeOperationResult = async (
  operation: string,
  args: Record<string, unknown>,
): Promise<unknown> => {
  if (getWorkspace().isSwitching) {
    throw new Error('EDITOR_BUSY')
  }

  const target = getLiveTarget()

  if (
    (args.designId && args.designId !== target.designId) ||
    (args.editorId && args.editorId !== target.editorId)
  ) {
    throw new Error('DESIGN_CONFLICT: reread current context')
  }

  if (operation === 'export_selected_frames') {
    return getSelectedFrameResult(args)
  }

  if (operation === 'get_design') {
    return getLiveDesign(args.section)
  }

  if (operation === 'get_editor_context') {
    return getLiveContext()
  }

  if (operation === 'get_design_import') {
    return (
      (await readOperationReceipt(String(args.requestId))) ?? {
        status: 'unknown',
        message: 'Inspect current design before retrying. Receipt may have expired.',
      }
    )
  }

  if (operation === 'list_designs') {
    return (await listWorkspaceDesigns()).map((record) => ({
      designId: record.id,
      version: record.revision,
      updatedAt: record.updatedAt,
      pageName: (record.document as { pageName?: string })?.pageName,
      active: record.id === getLiveTarget().designId,
    }))
  }

  if (operation === 'get_reference_image') {
    return getImage(args.referenceId)
  }

  if (operation === 'list_reference_images') {
    return { images: (await getLiveContext()).references, designVersion: getLiveTarget().version }
  }

  const document = getLiveDocument()

  if (operation === 'get_component') {
    const node = findNode(document.nodes, String(args.id))

    if (!node) {
      throw new Error('COMPONENT_NOT_FOUND')
    }

    return { ...node, adapterId: document.adapterId }
  }

  if (operation === 'get_behaviors') {
    return getBehaviorEntries(
      document.nodes,
      document.pageName,
      document.pageNotes,
      document.pageAnnotations,
    )
  }

  if (operation === 'list_components') {
    return getAllNodes(document.nodes).map((node) => ({
      id: node.id,
      type: node.type,
      name: node.label ?? node.type,
      adapterId: document.adapterId,
    }))
  }

  throw new Error('UNKNOWN_OPERATION')
}
