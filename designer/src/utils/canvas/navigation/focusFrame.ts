import { useEditorStore } from '@root/stores/editor'

import { animateFrameFocus } from './animateFrameFocus'

/** Header tabs always target the uppermost responsive instance, never all copies of a node. */
export const focusFrame = (id: string) => {
  const viewport = document.getElementById('canvas-scroll-container')
  const layer = document.getElementById('render-layer')

  if (!viewport || !layer || useEditorStore.getState().previewMode) {
    return
  }

  const frames = Array.from(layer.querySelectorAll<HTMLElement>('[data-frame-surface]'))
    .filter((element) => element.dataset.frameSurface === id)
    .sort((first, second) => first.getBoundingClientRect().top - second.getBoundingClientRect().top)

  const frame = frames[0]

  if (!frame) {
    return
  }

  const width = Number(frame.closest<HTMLElement>('[data-view-width]')?.dataset.viewWidth)

  if (width) {
    useEditorStore.getState().setCanvasWidth(width)
  }

  return animateFrameFocus(viewport, frame, id)
}
