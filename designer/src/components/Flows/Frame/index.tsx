import type { FormEventHandler, MouseEventHandler, ReactNode } from 'react'
import type { RendererProps } from '@root/types/componentContract'

import { Box } from '../../common/Box'

import styles from './styles.module.scss'

export type FrameProps = RendererProps

export const Frame = ({
  children,
  rootRef,
  rootClassName,
  renderMode,
  style,
  ...props
}: FrameProps) => (
  <Box
    ref={rootRef}
    className={`${styles.frame} ${rootClassName ?? ''}`}
    data-designing={renderMode === 'design'}
    data-node-id={props['data-node-id']}
    style={style}
    onChange={props.onChange as FormEventHandler<HTMLDivElement> | undefined}
    onClick={props.onClick as MouseEventHandler<HTMLDivElement> | undefined}
  >
    {children as ReactNode}
  </Box>
)
