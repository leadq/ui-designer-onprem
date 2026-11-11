import { getCurrentEditorId } from '@root/utils/designer/session/getCurrentEditorId'
import { getWorkspace } from '@root/utils/workspacePersistence/state'

export const getLiveTarget = () => ({
  editorId: getCurrentEditorId(),
  designId: getWorkspace().active.id,
  version: getWorkspace().active.revision,
})
