import type { ReactNode } from 'react'
import { useResponsiveViewStore } from '@root/components/Canvas/stores/responsiveViewStore'
import { Box } from '@root/components/common'
import { getDeviceFrameLayout } from '@root/utils/canvas/deviceFrames/getDeviceFrameLayout'

import styles from './styles.module.scss'

export interface DeviceFrameProps {
  width: number
  children: ReactNode
}

export const DeviceFrame = ({ width, children }: DeviceFrameProps) => {
  const isVisible = useResponsiveViewStore((state) => state.areDeviceFramesVisible)
  const layout = getDeviceFrameLayout(width)

  return (
    <Box
      data-device-frame
      className={styles.deviceFrame}
      data-device={layout.device}
      data-visible={isVisible}
      style={layout.style}
    >
      <Box aria-hidden className={styles.deviceFrame__screen} />
      <Box aria-hidden className={styles.deviceFrame__decoration} />
      <Box className={styles.deviceFrame__content}>{children}</Box>
    </Box>
  )
}
