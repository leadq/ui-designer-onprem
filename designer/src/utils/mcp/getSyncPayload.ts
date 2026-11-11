import { DEFAULT_ADAPTER_ID, getAdapter } from '@root/adapters'
import { createDesignDocument } from '@root/utils/designDocument'
import { getCurrentEditorId } from '@root/utils/designer/session/getCurrentEditorId'
import { exportToTSX } from '@root/utils/designExport'
import { getBehaviorEntries } from '@root/utils/getBehaviorEntries'
import { getPascalCase } from '@root/utils/getPascalCase'

import type { DesignSyncInput, McpSyncPayload } from './types'

/**
 * Builds the sync payload from current nodes and optional metadata.
 * TSX is generated browser-side to keep MCP server dependency-free.
 */
export const getSyncPayload = ({
  nodes,
  pageName,
  pageNotes,
  pageAnnotations,
  slotComponents,
  metadata,
  adapterId = DEFAULT_ADAPTER_ID,
}: DesignSyncInput): McpSyncPayload => ({
  editorId: getCurrentEditorId(),
  document: createDesignDocument(
    nodes,
    pageName,
    pageNotes,
    pageAnnotations,
    slotComponents,
    adapterId,
  ),
  adapterId,
  tsx: exportToTSX(
    nodes,
    getPascalCase(metadata?.componentName || pageName) || 'GeneratedPage',
    pageNotes,
    pageAnnotations,
    slotComponents,
    getAdapter(adapterId).registry,
  ),
  tree: nodes,
  pageName,
  behaviors: getBehaviorEntries(nodes, pageName, pageNotes, pageAnnotations),
  metadata: metadata
    ? {
        projectName: metadata.projectName,
        routeName: metadata.routeName,
        componentName: metadata.componentName,
        routeKey: metadata.routeKey,
      }
    : null,
  timestamp: Date.now(),
})
