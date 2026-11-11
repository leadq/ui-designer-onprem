import { getWorkspace } from './state'

export const updateWorkspaceDocument = (document: unknown) => {
  const state = getWorkspace()
  const encoded = JSON.stringify(document)

  if (encoded !== state.lastDocument) {
    state.active = {
      ...state.active,
      document: JSON.parse(encoded),
      revision: state.active.revision + 1,
      updatedAt: Date.now(),
    }

    state.lastDocument = encoded
  }
}
