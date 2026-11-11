import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Inline } from '@root/components/common/Inline'
import { useCanvasView } from '@root/contexts/CanvasViewContext/hooks/useCanvasView'
import { IconEditingContext } from '@root/contexts/IconEditingContext/context'
import type { RendererProps } from '@root/types/componentContract'
import { getDefaultIconGlyph } from '@root/utils/designIcons/getDefaultIconGlyph'

import { IconGraphic } from '../IconGraphic'
import { IconSelectionPopover } from '../IconSelectionPopover'

import styles from './styles.module.scss'

export interface DesignIconProps extends RendererProps {
  glyph?: string
  size?: number
  accessibleLabel?: string
}

export const DesignIcon = ({
  glyph = getDefaultIconGlyph(),
  size = 32,
  accessibleLabel = '',
  rootClassName,
  rootRef,
  style,
  renderMode,
  iconNodeId,
  'data-node-id': nodeId,
  onClick,
  ...rest
}: DesignIconProps) => {
  const editor = useContext(IconEditingContext)
  const view = useCanvasView()
  const [anchor, setAnchor] = useState<HTMLSpanElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const hasOpened = useRef(false)
  const id = String(iconNodeId ?? nodeId ?? '')
  const isSelected = Boolean(editor?.selectedIds.includes(id))
  const canEdit = renderMode === 'design' && isSelected && (!view || view.width === editor?.width)

  const handleRootRef = useCallback(
    (element: HTMLSpanElement | null) => {
      setAnchor(element)

      rootRef?.(element)
    },
    [rootRef],
  )

  useEffect(() => {
    if (!anchor || renderMode !== 'design') {
      return
    }

    const handleEdit = () => setIsOpen(true)

    anchor.addEventListener('designer:edit-icon', handleEdit)

    return () => anchor.removeEventListener('designer:edit-icon', handleEdit)
  }, [anchor, renderMode])

  useEffect(() => {
    if (!isSelected) {
      setIsOpen(false)
    }

    if ((!glyph || glyph === getDefaultIconGlyph()) && canEdit && anchor && !hasOpened.current) {
      hasOpened.current = true

      setIsOpen(true)
    }
  }, [glyph, canEdit, anchor, isSelected])

  return (
    <>
      <Inline
        ref={handleRootRef}
        aria-hidden={accessibleLabel ? undefined : true}
        aria-label={accessibleLabel ? String(accessibleLabel) : undefined}
        className={[styles.designIcon, rootClassName].filter(Boolean).join(' ')}
        data-icon-editor={renderMode === 'design' ? id : undefined}
        data-node-id={nodeId}
        role={accessibleLabel ? 'img' : undefined}
        style={{ width: Number(size), height: Number(size), ...style }}
        tabIndex={renderMode === 'design' ? -1 : undefined}
        onClick={onClick as React.MouseEventHandler<HTMLSpanElement> | undefined}
        onDoubleClick={(event) => {
          if (editor && renderMode === 'design') {
            event.stopPropagation()

            setIsOpen(true)
          }
        }}
        {...rest}
      >
        {glyph ? <IconGraphic size={Number(size)} value={String(glyph)} /> : null}
      </Inline>
      {isOpen && canEdit && anchor && editor ? (
        <IconSelectionPopover
          anchor={anchor}
          value={String(glyph)}
          onChange={(value) => editor.onChange(id, value)}
          onClose={() => setIsOpen(false)}
        />
      ) : null}
    </>
  )
}
