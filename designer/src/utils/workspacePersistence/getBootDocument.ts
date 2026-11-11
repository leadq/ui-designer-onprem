import { workspace } from './constants'

export const getBootDocument = (): unknown => workspace.current?.active.document ?? null
