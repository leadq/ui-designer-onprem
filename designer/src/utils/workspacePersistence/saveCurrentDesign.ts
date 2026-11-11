import { getCurrentDesign } from './getCurrentDesign'
import { persistWorkspaceDocument } from './persistWorkspaceDocument'

export const saveCurrentDesign = () => persistWorkspaceDocument(getCurrentDesign())
