import type { ComponentMeta } from '@root/types/componentContract';
import type { OverlaySurfaceProps } from '@root/types/flow';

/** Body and native floating surface are separate so the editor can own selection and hit testing. */
export const getOverlayMeta = (
  body: ComponentMeta,
  type: 'modal' | 'notification',
  Surface: React.ComponentType<OverlaySurfaceProps>,
  exportConfig: ComponentMeta['exportConfig'],
): ComponentMeta => ({
  type,
  displayName: type === 'modal' ? 'Modal' : 'Toast',
  category: 'overlays',
  searchKeywords:
    type === 'modal'
      ? ['açılır pencere', 'popup', 'dialog', 'onay']
      : ['bildirim', 'notification', 'snackbar', 'mesaj'],
  isContainer: true,
  showEmptyPlaceholder: true,
  defaultProps: {},
  defaultStyle: {},
  propsSchema: [],
  renderer: body.renderer,
  overlay: { presentation: type, Surface },
  exportConfig,
});
