import { isPreserveRejectedRecord } from '@root/utils/designer/storedContract/isPreserveRejectedRecord'
import { registerStorageRejection } from '@root/utils/designer/storedContract/registerStorageRejection'

import { componentLibraries, workspace } from './constants'
import { readWorkspaceValue, writeWorkspaceValues } from './database'
import type { WorkspaceRecord } from './types'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
let initialization: Promise<void> | undefined

const readLocal = (key: string) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const initializeWorkspace = async () => {
  const [identity, activeId, records, metadata] = await Promise.all([
    readWorkspaceValue<{ value: string } | undefined>('metadata', 'identity'),
    readWorkspaceValue<{ value: string } | undefined>('metadata', 'activeDesignId'),
    readWorkspaceValue<WorkspaceRecord[]>('designs'),
    readWorkspaceValue<{ key: string; value: unknown }[]>('metadata'),
  ])

  const active =
    records.find((record) => record.id === activeId?.value) ??
    records.sort((first, second) => second.updatedAt - first.updatedAt)[0]

  if (
    active &&
    (!UUID_PATTERN.test(active.id) || !Number.isSafeInteger(active.revision) || active.revision < 1)
  ) {
    throw new Error('WORKSPACE_INVALID_METADATA')
  }

  const candidates = [
    active?.clientId,
    identity?.value,
    readLocal('designer_client_id'),
    readLocal('designer_session_id'),
  ]

  const clientId =
    candidates.find((candidate) => candidate && UUID_PATTERN.test(candidate)) ?? crypto.randomUUID()

  const raw = readLocal('designer-active-design-v2')
  let document: unknown = active?.document ?? null

  try {
    if (!active && raw) {
      document = JSON.parse(raw)
    }
  } catch (error) {
    isPreserveRejectedRecord('designer-active-design-v2', raw ?? '', error)

    throw error
  }

  const record: WorkspaceRecord = active ?? {
    id: crypto.randomUUID(),
    clientId,
    document,
    revision: 1,
    updatedAt: Date.now(),
  }

  for (const item of metadata) {
    if (item.key.startsWith('componentLibrary:') && Array.isArray(item.value)) {
      componentLibraries.set(item.key.slice('componentLibrary:'.length), item.value)
    }
  }

  workspace.current = {
    clientId,
    active: { ...record, clientId },
    lastDocument: JSON.stringify(document),
    hasError: false,
    savedDocument: active ? JSON.stringify(document) : undefined,
    isAutoSaveEnabled: metadata.find((item) => item.key === 'autoSaveEnabled')?.value === true,
  }

  // Populate boot state before importing parsers/adapters which can import the store.
  // Validation completes before App effects or autosave are allowed to mount.
  if (document) {
    const { parseDesignDocument } = await import('@root/utils/designDocument')

    try {
      workspace.current.active.document = parseDesignDocument(document)
    } catch (error) {
      if (active) {
        registerStorageRejection(`designs:${active.id}`, JSON.stringify(document), error)
      } else if (raw) {
        isPreserveRejectedRecord('designer-active-design-v2', raw, error)
      }

      throw error
    }

    workspace.current.lastDocument = JSON.stringify(workspace.current.active.document)
  }

  await writeWorkspaceValues({
    metadata: [
      { key: 'identity', value: clientId },
      ...(active ? [{ key: 'activeDesignId', value: record.id }] : []),
    ],
    ...(active ? { designs: [workspace.current.active] } : {}),
  })

  try {
    localStorage.setItem('designer_client_id', clientId)

    localStorage.setItem('designer_session_id', clientId)
  } catch {
    // IndexedDB remains authoritative if localStorage is unavailable.
  }
}

export const bootstrapWorkspace = () => {
  initialization = initialization ?? initializeWorkspace()

  return initialization
}
