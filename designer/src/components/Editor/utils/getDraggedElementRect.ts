export const getDraggedElementRect = (element: HTMLElement) => {
  const style = window.getComputedStyle(element)

  if (style.display === 'contents') {
    const inner = element.querySelector('[data-node-id]') as HTMLElement | null

    if (inner) {
      return inner.getBoundingClientRect()
    }
  }

  return element.getBoundingClientRect()
}
