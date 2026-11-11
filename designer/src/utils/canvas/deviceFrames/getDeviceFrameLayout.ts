import type { CSSProperties } from 'react'
import { BREAKPOINT_MAP } from '@root/constants/breakpoints'
import { DEVICE_FRAMES } from '@root/constants/canvas/deviceFrames'

export const getDeviceFrameLayout = (width: number) => {
  const device =
    width >= BREAKPOINT_MAP.xl
      ? 'monitor'
      : width >= BREAKPOINT_MAP.lg
        ? 'laptop'
        : width >= BREAKPOINT_MAP.sm
          ? 'tablet'
          : 'phone'

  const config = DEVICE_FRAMES[device]
  const { top, right, bottom, left } = config.insets
  const insets = [top, right, bottom, left]
  const scale = width / (config.sourceWidth - left - right)
  const layout = 'layout' in config ? config.layout : config
  const layoutScale = width / (layout.sourceWidth - layout.insets.left - layout.insets.right)

  const reservedInsets = [
    layout.insets.top,
    layout.insets.right,
    layout.insets.bottom,
    layout.insets.left,
  ].map((inset) => inset * layoutScale)

  const decorationInsets = reservedInsets.map((inset, index) => inset - insets[index] * scale)

  return {
    device,
    outerWidth: layout.sourceWidth * layoutScale,
    style: {
      '--device-image': `url("${config.image}")`,
      '--device-slice': insets.join(' '),
      '--device-insets': reservedInsets.map((inset) => `${inset}px`).join(' '),
      '--device-border-width': insets.map((inset) => `${inset * scale}px`).join(' '),
      '--device-decoration-insets': decorationInsets.map((inset) => `${inset}px`).join(' '),
      '--device-screen-insets': `${reservedInsets[0] + (config.screenTop - top) * scale}px ${reservedInsets[1]}px ${reservedInsets[2] + (config.screenBottom - bottom) * scale}px ${reservedInsets[3]}px`,
      '--device-radius': `${config.radius * scale}px`,
      '--frame-width': `${width}px`,
      '--frame-outer-width': `${layout.sourceWidth * layoutScale}px`,
      '--device-left': `${reservedInsets[3]}px`,
      '--device-top': `${reservedInsets[0]}px`,
      '--device-bottom': `${reservedInsets[2]}px`,
    } as CSSProperties,
  }
}
