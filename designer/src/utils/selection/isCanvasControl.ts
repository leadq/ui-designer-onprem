export const isCanvasControl = (target: EventTarget) =>
  Boolean((target as Element).closest('[data-frame-name], [data-canvas-control]'))
