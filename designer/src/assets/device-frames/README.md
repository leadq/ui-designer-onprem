# Device frame PNG assets

Source: [pixelsign/html5-device-mockups](https://github.com/pixelsign/html5-device-mockups), downloaded 2026-10-19. Package MIT license and original design credits are included in this directory. Original PNG bytes are unchanged; no network requests are made at runtime.

| Local | Upstream device-mockups path |
| --- | --- |
| monitor.png | SamsungTV/portrait_black.png |
| laptop.png | MacbookPro/portrait_black.png |
| tablet.png | iPadPro/portrait_black.png |
| phone.png | iPhoneX/portrait_black.png |

Screen inset measurements come from upstream src/scss/devices.scss. The phone's top/bottom slices include its camera/corner safe area. CSS nine-slice rendering preserves corners, camera and base while extending side rails to fit an editable long page; this is presentation, not physical device emulation. The opaque source screen center is omitted (no border-image fill). Real React children remain inside the screen. Chrome and its reserved space are local editor preferences, never export JSON or product DOM.

- `monitor.png` SHA256 `95931245e920174c8e4fad1c5ccac06fc55530066b9bfa3f7f35e08e686f54f6`
- `tablet.png` SHA256 `83eb64bd603c21d936df6124f7cc11b6a684a41c8eebb4ae5b2601d226b6b3c9`
- `laptop.png` SHA256 `4a8c636aac560705418e5ec6788659ca380a527ba72cb531de1aa14acd5b05ba`
- `phone.png` SHA256 `9e70f493e833cfa6fb2d53603b2d5d0cec2743fced164b9cb5581035a2867c2d`

The desktop uses the thin Samsung display artwork, not an Apple model. The original iMac layout reservation remains separate from visual border insets: replacing or hiding the artwork does not move content, adjacent frames or connections. At 1440 content width, visible side insets are about 20–21px instead of 64px; the lower inset including the stand is 121px instead of 388px.
