import { loadAutosavedDesign } from './loadAutosavedDesign'

export const hasAutosavedDesign = (): boolean => loadAutosavedDesign() !== null
