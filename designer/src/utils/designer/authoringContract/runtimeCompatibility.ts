export const RUNTIME_COMPATIBILITY_CONTRACT = {
  reactVersion: '18.3.1',
  rendering: 'client',
  entryPoint: 'react-dom/client.createRoot',
  externalStore: 'React.useSyncExternalStore',
  rule: 'Verify installed native versions in package.json and package-lock.json. This branch targets React 18.3.1. Native component, prop and event mappings belong to the selected adapter and its catalog; never invent DesignNode props from a different library. Verify target application versions in its own manifest.',
}
