import type { BreakpointKey } from '@root/constants/breakpoints'
import type { DesignAnnotation, DesignNode } from '@root/types/document'
import type { DesignInteractionTrigger, DesignOverlay } from '@root/types/flow'
import type { DesignInteraction, PreviewValue } from '@root/types/preview'
import type { CollectionEdit } from '@root/utils/collectionAuthoring/types'
import { DesignDocument } from '@root/utils/designDocument'
import type { TableEdit } from '@root/utils/tableAuthoring/types'
import type { StateCreator } from 'zustand'

import type { LayoutActions } from './layoutActions'
import type { PageState } from './pageState'

export interface EditorActions extends LayoutActions {
  applyGeneratedUpdate: (document: DesignDocument, changedNodeIds: string[]) => string[]
  appendGeneratedDesign: (document: DesignDocument) => string[]
  setTextBinding: (nodeId: string, sourceNodeId: string) => void
  setTextDesignText: (nodeId: string, text: string) => void
  setComponentState: (
    nodeIds: string[],
    property: 'visibleWhen' | 'enabledWhen',
    rule: import('@root/types/preview').ComponentStateRule | undefined,
    fallback: boolean,
  ) => void
  setToggleBinding: (nodeId: string, binding: DesignNode['toggleBinding']) => void
  setPrototypeValue: (nodeId: string, value: PreviewValue) => void
  setPrototypeExample: (key: string, value: string) => void
  addFlow: (name: string, screenLabel: string) => void
  addFlowScreen: (
    flowId: string,
    kind: 'screen' | 'overlay',
    label: string,
    overlay?: DesignOverlay,
  ) => void
  setOverlaySettings: (nodeId: string, overlay: DesignOverlay) => void
  setFlowStart: (flowId: string, screenId: string) => void
  editFlowScreen: (screenId: string | null) => void
  setAdapter: (adapterId: string) => void
  addNode: (type: string, targetId?: string, position?: 'before' | 'after' | 'inside') => void
  removeNode: (id: string) => void
  updateProps: (id: string, key: string, value: unknown) => void
  updateResponsiveProps: (
    ids: string[],
    key: string,
    value: string | number | boolean | undefined,
  ) => void
  updateMultipleProps: (ids: string[], key: string, value: unknown) => void
  updateStyle: (id: string, style: Partial<React.CSSProperties>) => void
  updateResponsiveStyle: (
    id: string,
    breakpoint: BreakpointKey,
    style: Partial<React.CSSProperties>,
  ) => void
  updateResponsiveStyleTransient: (
    id: string,
    breakpoint: BreakpointKey,
    style: Partial<React.CSSProperties>,
  ) => void
  commitTransientStyleUpdate: () => void
  updateMultipleResponsiveStyles: (
    ids: string[],
    breakpoint: BreakpointKey,
    style: Partial<React.CSSProperties>,
  ) => void
  setSelectedNodeIds: (
    ids: string[],
    focusedContainerId?: string | null,
    tableColumnKey?: string,
    shouldPreserveFrameSelection?: boolean,
  ) => void
  selectFrameContents: (id: string, isAdditive?: boolean) => void
  toggleNodeSelection: (id: string) => void
  clearSelection: () => void
  removeSelectedNodes: () => void
  duplicateSelectedNodes: () => void
  setDropTarget: (
    target: { targetId: string; position: 'before' | 'after' | 'inside' } | null,
  ) => void
  setInteractionState: (state: PageState['interactionState']) => void
  setCanvasWidth: (width: number | null) => void
  setActiveBreakpoint: (bp: BreakpointKey) => void
  moveNode: (sourceId: string, targetId: string, position: 'before' | 'after' | 'inside') => void
  loadTemplate: (nodes: DesignNode[]) => void
  loadDesignDocument: (document: DesignDocument) => void
  clearDesign: () => void
  cycleOutlineMode: () => void
  undo: () => void
  redo: () => void
  copyNode: (id: string) => void
  pasteNode: () => void
  duplicateNode: (id: string) => void
  wrapInContainer: (id: string, containerType?: string) => void
  unwrapContainer: (id: string) => void
  moveNodeOutOfContainer: (id: string) => void
  moveNodeOrdering: (id: string, direction: 'up' | 'down') => void
  updateNodeLabel: (id: string, label: string) => void
  updateNodeNotes: (id: string, notes: string) => void
  updatePageNotes: (notes: string) => void
  upsertAnnotation: (
    targetNodeId: string | null,
    annotation: DesignAnnotation,
    shouldReplaceLegacyNote?: boolean,
  ) => void
  removeAnnotation: (targetNodeId: string | null, annotationId: string) => void
  upsertInteraction: (nodeId: string, interaction: DesignInteraction) => void
  removeInteraction: (nodeId: string, interactionId: string) => void
  setPrototypeHidden: (nodeId: string, hidden: boolean) => void
  runNodeInteractions: (
    nodeId: string,
    trigger: DesignInteractionTrigger,
    sourceInteractions?: DesignInteraction[],
  ) => void
  togglePreviewMode: () => void
  setFocusedContainer: (id: string | null) => void
  setPageName: (name: string) => void
  setCanvasZoom: (zoom: number) => void
  editCollection: (id: string, edit: CollectionEdit) => void
  editTable: (id: string, edit: TableEdit) => void
  addNodeToSlot: (parentId: string, slotKey: string, type: string) => void
  removeNodeFromSlot: (parentId: string, slotKey: string, nodeId: string) => void
  updateSlotNodes: (parentId: string, slotKey: string, nodes: DesignNode[]) => void
  createSlotComponent: (id: string, name: string, nodes: DesignNode[]) => void
  updateSlotComponent: (id: string, name: string, nodes: DesignNode[]) => void
  deleteSlotComponent: (id: string) => void
  insertSavedDesign: (
    id: string,
    targetId?: string,
    position?: 'before' | 'after' | 'inside',
  ) => void
  requestSaveDesign: (nodeIds: string[]) => void
  cancelSaveDesign: () => void
}

export type EditorState = PageState &
  EditorActions & {
    activeBreakpoint: BreakpointKey
    selectedTableColumnKey: string | null // Editor context only; never design JSON.
  }

export type EditorStoreSet = Parameters<
  StateCreator<EditorState, [['zustand/subscribeWithSelector', never], ['zustand/immer', never]]>
>[0]

export type EditorStoreGet = () => EditorState
