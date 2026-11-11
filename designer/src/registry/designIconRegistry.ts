import { DesignIcon } from '@root/components/DesignIcons/DesignIcon'
import type { Registry } from '@root/types/componentContract'
import { getDefaultIconGlyph } from '@root/utils/designIcons/getDefaultIconGlyph'
import { ICON_GLYPH_OPTIONS } from '@root/utils/designIcons/getIconEntry'
import { getIconExportConfig } from '@root/utils/designIcons/getIconExportConfig'

const DEFAULT_ICON_SIZE = 32

export const iconRegistry: Registry = {
  icon: {
    renderer: DesignIcon,
    type: 'icon',
    displayName: 'İkon',
    category: 'icons',
    isContainer: false,
    description:
      'Independent icon. Select a registered namespaced glyph; empty glyph is an unchosen placeholder.',
    searchKeywords: ['ikon', 'icon', 'symbol', 'simge'],
    defaultProps: { glyph: getDefaultIconGlyph(), size: 32, accessibleLabel: '' },
    defaultStyle: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    getDefaultLayoutStyle: (props) => ({
      width: Number(props.size ?? DEFAULT_ICON_SIZE),
      height: Number(props.size ?? DEFAULT_ICON_SIZE),
    }),
    propsSchema: [
      {
        key: 'glyph',
        label: 'İkon seçimi',
        type: 'icon',
        defaultValue: getDefaultIconGlyph(),
        options: ICON_GLYPH_OPTIONS,
      },
      {
        key: 'size',
        label: 'İkon boyutu (px)',
        type: 'number',
        defaultValue: 32,
        min: 1,
        max: 1024,
      },
    ],
    exportConfig: {
      importType: 'none',
      importName: 'span',
      importPath: '',
      resolve: getIconExportConfig,
    },
  },
}
