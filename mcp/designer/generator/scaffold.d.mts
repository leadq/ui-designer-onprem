export interface ScaffoldConfig {
  version: string; componentName: string; pageName: string; primitiveName: string; primitiveImport: string; styleFile?: string;
  api?: { name: string; baseApiImport: string; baseApiName: string; endpointName: string; url: string; method: string };
}
export interface ScaffoldPlan {
  version: string; files: Record<string, string>;
  completionChecklist: { file: string; status: string; kind: string; instruction: string }[];
  nextSteps: string[];
}
export const GENERATOR_VERSION: string;
export const buildScaffold: (config: ScaffoldConfig) => ScaffoldPlan;
export const runScaffold: (config: ScaffoldConfig, targetRoot: string, shouldWrite?: boolean) => Promise<ScaffoldPlan & { root: string; mode: string; sha256: Record<string, string> }>;
