import { createRequire } from 'node:module';

interface DesignerRuntime {
  defaultAdapterId: string;
  getFrameExportEligibility: (input: unknown, selection: {selectedFrameIds:string[]; selectedNodeIds:string[]; selectedReferenceIds?:string[]; previewMode?:boolean}) => unknown;
  getSelectedFrameExport: (input: unknown, selection: {selectedFrameIds:string[];selectedNodeIds:string[];selectedReferenceIds?:string[];previewMode?:boolean}, expectedFrameIds?:string[], format?:'nested'|'flat') => unknown;
  getRenderSnapshot: (
    input: unknown,
    frameId: string,
  ) => { document: unknown; flowId: string; createdAt: number };
  getSelectionContext: (input: unknown, ids: string[], width: number | null) => unknown;
  applyDesignChanges: (
    input: unknown,
    changes: { nodeId: string; patch: Record<string, unknown> }[],
  ) => { document: unknown; changedNodeIds: string[] };
  getDesignCatalog: (adapterId?: string, componentTypes?: string[], purpose?: 'authoring' | 'revision') => unknown;
  getIconSearchResults: (queries: string[], limit: number) => { matches: string[]; total: number };
  validateDesign: (input: unknown, output?: 'summary' | 'nested' | 'flat') => unknown;
}

const require = createRequire(import.meta.url);
let runtime: DesignerRuntime | undefined;

export const getDesignerRuntime = (): DesignerRuntime => {
  runtime = runtime ?? (require('../designerRuntime.cjs') as DesignerRuntime);

  return runtime;
};
