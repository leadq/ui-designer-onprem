export const getNodeElement = (id: string, viewId?: string): HTMLElement | null => {
  const layer = document.getElementById('render-layer')
  const selector = `[data-node-id="${CSS.escape(id)}"]`

  if (viewId) {
    return (
      layer?.querySelector<HTMLElement>(`[data-view-id="${CSS.escape(viewId)}"] ${selector}`) ??
      null
    )
  }

  return (
    layer?.querySelector<HTMLElement>(`[data-view-active="true"] ${selector}`) ??
    layer?.querySelector<HTMLElement>(selector) ??
    null
  )
}
