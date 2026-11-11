import { Button } from '@root/components/common'
import { Tooltip as EditorTooltip } from '@root/components/common/Tooltip'

import styles from './styles.module.scss'

export interface PanelCollapseButtonProps {
  isCollapsed: boolean
  side: 'left' | 'right'
  collapseLabel: string
  expandLabel: string
  onToggle: () => void
}

export const PanelCollapseButton = ({
  isCollapsed,
  side,
  collapseLabel,
  expandLabel,
  onToggle,
}: PanelCollapseButtonProps) => {
  const label = isCollapsed ? expandLabel : collapseLabel
  const collapsedIcon = side === 'left' ? '▶' : '◀'
  const expandedIcon = side === 'left' ? '◀' : '▶'

  return (
    <EditorTooltip label={label}>
      <Button
        aria-label={label}
        className={`${styles.panelCollapseButton} ${styles[`panelCollapseButton--${side}`]}`}

        variant='ghost'
        onClick={onToggle}
      >
        {isCollapsed ? collapsedIcon : expandedIcon}
      </Button>
    </EditorTooltip>
  )
}
