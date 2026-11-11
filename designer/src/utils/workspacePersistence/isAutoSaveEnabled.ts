import { getWorkspace } from './getWorkspace'

export const isAutoSaveEnabled = () => getWorkspace().isAutoSaveEnabled ?? false
