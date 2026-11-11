import laptop from '@root/assets/device-frames/laptop.png'
import monitor from '@root/assets/device-frames/monitor.png'
import phone from '@root/assets/device-frames/phone.png'
import tablet from '@root/assets/device-frames/tablet.png'

/** Original PNG pixel insets: top, right, bottom, left. Screen centers are omitted. */
export const DEVICE_FRAMES = {
  monitor: {
    image: monitor,
    sourceWidth: 1056,
    insets: { top: 15, right: 15, bottom: 86, left: 14 },
    // Preserve existing frame and connection positions when changing the artwork.
    layout: { sourceWidth: 1843, insets: { top: 75, right: 75, bottom: 456, left: 75 } },
    screenTop: 15,
    screenBottom: 86,
    radius: 0,
  },
  laptop: {
    image: laptop,
    sourceWidth: 1208,
    insets: { top: 47, right: 142, bottom: 76, left: 143 },
    screenTop: 47,
    screenBottom: 76,
    radius: 0,
  },
  tablet: {
    image: tablet,
    sourceWidth: 2294,
    insets: { top: 224, right: 124, bottom: 224, left: 123 },
    screenTop: 224,
    screenBottom: 224,
    radius: 0,
  },
  phone: {
    image: phone,
    sourceWidth: 726,
    insets: { top: 100, right: 50, bottom: 100, left: 50 },
    screenTop: 46,
    screenBottom: 46,
    radius: 60,
  },
} as const
