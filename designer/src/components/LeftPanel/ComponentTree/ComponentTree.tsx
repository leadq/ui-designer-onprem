import { ComponentTreeContent } from './ComponentTreeContent'
import { TreeDndProvider } from './TreeDndProvider'

export const ComponentTree = () => (
  <TreeDndProvider>
    <ComponentTreeContent />
  </TreeDndProvider>
)
