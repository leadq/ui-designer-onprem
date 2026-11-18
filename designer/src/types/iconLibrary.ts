import type { JSXElementConstructor } from 'react'
import type { ComponentExportConfig, ComponentMeta } from '@root/types/componentContract'
import type { DesignNode } from '@root/types/document'

export interface IconGlyphProps {
  size: number
}

export interface IconEntry {
  id: string
  name: string
  importName: string
  keywords?: string[]
}

export interface IconLibrary {
  id: string
  name: string
  packageName: string
  /** Adapter-owned guidance for the shared icon component, independent of individual glyphs. */
  componentMeta?: Pick<ComponentMeta, 'description' | 'visualHints' | 'recipes'>
  entries: IconEntry[]
  load: (id: string) => Promise<JSXElementConstructor<IconGlyphProps>>
  getExportConfig: (entry: IconEntry, node: DesignNode) => ComponentExportConfig
}
