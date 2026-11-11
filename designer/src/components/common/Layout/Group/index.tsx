import type { StackProps } from '../Stack'
import { getGapValue } from '../utils/getGapValue'

import styles from '../styles.module.scss'

export interface GroupProps extends StackProps {
  isWrapping?: boolean
}

export const Group = ({
  children,
  gap = 'md',
  align = 'center',
  justify = 'start',
  isWrapping: wrap = false,
  className = '',
  style,
}: GroupProps) => {
  const groupClasses = [
    styles.group,
    styles[`group--align-${align}`],
    styles[`group--justify-${justify}`],
    wrap ? styles['group--wrap'] : '',
    className,
  ].join(' ')

  return (
    <div className={groupClasses} style={{ ...style, gap: getGapValue(gap) }}>
      {children}
    </div>
  )
}
