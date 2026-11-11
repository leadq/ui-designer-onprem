import type { CSSProperties } from 'react'

import type { BreakpointKey } from '../constants/breakpoints'
import type { StyleTokens } from '../utils/colorTokens/types'

import type { DesignFlow, DesignOverlay } from './flow'
import type { ComponentStateRule, DesignInteraction } from './preview'

export type DesignAnnotationKind = 'behavior' | 'validation' | 'data' | 'dependency' | 'interaction'

export interface DesignAnnotation {
  id: string
  kind: DesignAnnotationKind
  title?: string
  text: string
}

// --- Node: recursive page tree ---
export interface DesignNode {
  styleTokens?: StyleTokens
  responsiveStyleTokens?: Partial<Record<Exclude<BreakpointKey, 'xl'>, StyleTokens>>
  id: string // uuid
  type: string // adapter key, or editor-owned designerFrame/designerFlow
  label?: string // custom display name for the tree panel
  props: Record<string, unknown> // library-specific props
  style: CSSProperties // user-modified CSS (base)
  responsiveStyles?: Partial<Record<BreakpointKey, CSSProperties>> // breakpoint overrides
  responsiveProps?: Partial<
    Record<Exclude<BreakpointKey, 'xl'>, Record<string, string | number | boolean>>
  >
  notes?: string // developer annotation for this node
  annotations?: DesignAnnotation[] // structured behaviors and implementation guidance
  interactions?: DesignInteraction[]
  prototypeHidden?: boolean
  stateRules?: { visibleWhen?: ComponentStateRule; enabledWhen?: ComponentStateRule }
  textBinding?: { sourceNodeId: string; designText?: string } // designText is canvas-only; props.children remains the preview empty fallback
  toggleBinding?: {
    visibleNodeId?: string
    visibleNodeIds?: string[]
    hiddenWhenCheckedNodeIds?: string[]
    exclusiveWith: string[]
  }
  flow?: DesignFlow
  overlay?: DesignOverlay
  children: DesignNode[] // only populated if isContainer
  slots?: Record<string, DesignNode[]> // named slot children (renderItem, header, footer)
}

export interface TemplateMetadata {
  id: string
  projectName: string
  routeName: string
  componentName: string
  routeKey: string
  createdAt: string
  nodes: DesignNode[]
}

export interface SlotComponent {
  id: string
  name: string
  nodes: DesignNode[]
}
