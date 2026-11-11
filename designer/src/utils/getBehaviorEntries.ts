import { registry } from '../registry'
import type { DesignAnnotation, DesignNode } from '../types/document'

const SUMMARY_ITEM_LIMIT = 2

export interface BehaviorEntry {
  id: string
  nodeId: string | null
  kind: 'page' | 'component'
  targetName: string
  componentType: string
  path: string
  text: string
  excerpt: string
  title?: string
  annotationKind: DesignAnnotation['kind'] | 'legacy'
}

const getExcerpt = (text: string): string =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, SUMMARY_ITEM_LIMIT)
    .join(' ')

const getCollectNodeBehaviors = (nodes: DesignNode[], parentPath: string[]): BehaviorEntry[] =>
  nodes.flatMap((node) => {
    const meta = registry[node.type]
    const targetName = node.label || meta?.displayName || node.type
    const currentPath = [...parentPath, targetName]
    const entries: BehaviorEntry[] = []

    if (node.notes?.trim()) {
      entries.push({
        id: node.id,
        nodeId: node.id,
        kind: 'component',
        targetName,
        componentType: node.type,
        path: currentPath.join(' / '),
        text: node.notes.trim(),
        excerpt: getExcerpt(node.notes),
        annotationKind: 'legacy',
      })
    }

    node.annotations?.forEach((annotation) => {
      entries.push({
        id: `${node.id}:${annotation.id}`,
        nodeId: node.id,
        kind: 'component',
        targetName,
        componentType: node.type,
        path: currentPath.join(' / '),
        text: annotation.text,
        excerpt: annotation.title?.trim() || getExcerpt(annotation.text),
        title: annotation.title?.trim() || undefined,
        annotationKind: annotation.kind,
      })
    })

    entries.push(...getCollectNodeBehaviors(node.children, currentPath))

    Object.values(node.slots ?? {}).forEach((slotNodes) => {
      entries.push(...getCollectNodeBehaviors(slotNodes, currentPath))
    })

    return entries
  })

export const getBehaviorEntries = (
  nodes: DesignNode[],
  pageName: string,
  pageNotes: string,
  pageAnnotations: DesignAnnotation[] = [],
): BehaviorEntry[] => {
  const entries: BehaviorEntry[] = pageAnnotations.map((annotation) => ({
    id: `page:${annotation.id}`,
    nodeId: null,
    kind: 'page',
    targetName: pageName,
    componentType: 'page',
    path: pageName,
    text: annotation.text,
    excerpt: annotation.title?.trim() || getExcerpt(annotation.text),
    title: annotation.title?.trim() || undefined,
    annotationKind: annotation.kind,
  }))

  entries.push(...getCollectNodeBehaviors(nodes, [pageName]))

  if (!pageNotes.trim()) {
    return entries
  }

  return [
    {
      id: 'page',
      nodeId: null,
      kind: 'page',
      targetName: pageName,
      componentType: 'page',
      path: pageName,
      text: pageNotes.trim(),
      excerpt: getExcerpt(pageNotes),
      annotationKind: 'legacy',
    },
    ...entries,
  ]
}
