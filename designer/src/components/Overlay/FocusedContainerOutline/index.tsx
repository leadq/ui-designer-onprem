export interface FocusedContainerOutlineProps {
  focusedRect: DOMRect
  focusedContainerId: string
}

export const FocusedContainerOutline = ({
  focusedRect,
  focusedContainerId,
}: FocusedContainerOutlineProps) => (
  <div
    data-focused-container-id={focusedContainerId}
    style={{
      position: 'absolute',
      top: focusedRect.top,
      left: focusedRect.left,
      width: focusedRect.width,
      height: focusedRect.height,
      border: '2px dashed var(--info)',
      backgroundColor: 'rgba(var(--info-rgb), 0.04)',
      boxSizing: 'border-box',
      pointerEvents: 'none',
      zIndex: 999,
    }}
  />
)
