interface CollectedImport {
  named: Set<string>
  defaultName?: string
}

export type UsedComponents = Map<string, CollectedImport>
